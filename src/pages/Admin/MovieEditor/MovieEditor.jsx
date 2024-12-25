import { Button, Form, Input, notification, Select, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { EpisodeForm, UploadPoster, UploadVideo } from '../../../component';
import { categoryService, genreService, movieService } from '../../../services';
import { countries } from '../../../static-data/countries';
import './MovieEditor.scss';

export async function MovieEditorLoader({ params }) {
  const id = parseInt(params.id);
  if (!isNaN(id) && id !== 0) {
    const res = await movieService.find(id);
    return { movie: res.data, isEdit: true };
  } else {
    return { movie: null, isEdit: false };
  }
}

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1800 + 1 },
  (_, index) => currentYear - index
);

const defaultFormValue = {
  nameMovie: null,
  viTitle: null,
  enTitle: null,
  description: null,
  country: null,
  categoryId: null,
  year: currentYear,
  genreIds: [],
  episodes: [],
  trailerFile: [],
  posterFile: [],
  videoFile: [],
};

const SERIES_MOVIE = 'phim bộ';

export const MovieEditor = () => {
  const { isEdit, movie } = useLoaderData();
  const [form] = Form.useForm();
  const categoryIdWatch = Form.useWatch('categoryId', form);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [originalFormValue, setOriginalFormValue] = useState(null);
  const [formChanged, setFormChanged] = useState(false);

  const hasChanges = useCallback(
    (dataChange) => {
      console.log('dataChange:', dataChange);
      console.log(`originalFormValue: ${JSON.stringify(originalFormValue)}`);
      return JSON.stringify(dataChange) !== JSON.stringify(originalFormValue);
    },
    [originalFormValue]
  );

  const fetchGenres = useCallback(() => {
    genreService.getAll().then((res) => {
      setGenres(res.data);
    });
  }, []);

  const fetchCategories = useCallback(() => {
    categoryService.getAll().then((res) => {
      setCategories(res.data);
    });
  }, []);

  const initFormData = useCallback(() => {
    const getFileList = (url, name) => {
      if (!url) {
        return null;
      }
      return [
        {
          uid: '-1',
          name,
          status: 'done',
          url,
        },
      ];
    };

    const formValue = {
      ...movie,
      categoryId: movie?.category?.id,
      genreIds: movie?.genres?.map((genre) => genre.id) ?? [],
      posterFile: getFileList(movie?.posterUrl, 'poster.png'),
      videoFile: getFileList(movie?.videoUrl, 'video.mp4'),
      trailerFile: getFileList(movie?.trailerUrl, 'trailer.mp4'),
      episodes: movie?.episodes?.map((episode) => ({
        ...episode,
        posterFile: getFileList(episode.posterUrl, 'poster.png'),
        videoFile: getFileList(episode.videoUrl, 'video.mp4'),
      })),
    };

    form.setFieldsValue(formValue);
    setOriginalFormValue(formValue);
  }, [form, movie]);

  const initData = useCallback(() => {
    fetchGenres();
    fetchCategories();
    initFormData();
  }, [fetchCategories, fetchGenres, initFormData]);

  useEffect(() => {
    initData();
  }, [initData]);

  const isSeries = useCallback(() => {
    const categoryId = categoryIdWatch;
    return categories.some(
      (category) =>
        category.id === categoryId &&
        category.name.toLowerCase() === SERIES_MOVIE
    );
  }, [categories, categoryIdWatch]);

  const updateEpisodeFiles = async (episodesMap, response) => {
    for (const item of response.data.episodes) {
      const episodeMap = episodesMap.get(item.tempId);
      if (episodeMap?.posterFile?.[0]?.originFileObj) {
        await movieService.updateEpisodeFile(
          response.data.id,
          item.id,
          episodeMap.posterFile[0]?.originFileObj,
          'poster'
        );
      }

      if (episodeMap.videoFile?.[0]?.originFileObj) {
        await movieService.updateEpisodeFile(
          response.data.id,
          item.id,
          episodeMap.videoFile?.[0]?.originFileObj,
          'video'
        );
      }
    }
  };

  const updateMovieFiles = async (newData, response) => {
    if (newData?.trailerFile?.[0]?.originFileObj) {
      await uploadMovieFile(
        response.data.id,
        'trailer',
        newData.trailerFile[0].originFileObj
      );
    }

    if (newData?.posterFile?.[0]?.originFileObj) {
      await uploadMovieFile(
        response.data.id,
        'poster',
        newData.posterFile[0].originFileObj
      );
    }

    if (!isSeries() && newData?.videoFile?.[0]?.originFileObj) {
      await uploadMovieFile(
        response.data.id,
        'video',
        newData.videoFile[0].originFileObj
      );
    }
  };

  const updateMovie = async (newData, episodesMap) => {
    try {
      const response = await movieService.update(movie.id, newData);

      await updateMovieFiles(newData, response);

      if (isSeries()) {
        await updateEpisodeFiles(episodesMap, response);
      }
      notification.success({ message: 'Updated movie' });
    } catch (error) {
      notification.error({ message: 'Failed to update movie' });
      console.log(error);
    }
  };

  const createMovie = async (newData, episodesMap) => {
    try {
      const response = await movieService.create(newData);

      await updateMovieFiles(newData, response);

      if (isSeries()) {
        await updateEpisodeFiles(episodesMap, response);
      }

      notification.success({ message: 'Added movie' });
    } catch (error) {
      notification.success({ message: 'Failed to add movie' });
    }
  };

  const uploadMovieFile = async (id, type, file) => {
    return movieService.updateMovieFile(id, file, type);
  };

  const onFinish = async (value) => {
    try {
      const newData = {
        ...value,
        episodes: value?.episodes?.map((episode) => ({
          ...episode,
          tempId: uuidv4(),
        })),
      };

      const episodesMap = new Map(
        newData?.episodes?.map((item) => [item.tempId, item])
      );

      if (!isEdit) {
        await createMovie(newData, episodesMap);
      } else {
        await updateMovie(newData, episodesMap);
      }
    } catch (error) {
      notification.error({ message: `Error submitting movie: ${error}` });
    }
  };

  const onFinishFailed = () => {
    notification.error({ message: `Form validation failed` });
  };

  const renderLabel = (label) => (
    <span className="movie-editor__form-label">{label}</span>
  );

  const handleGetFileValue = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFormChange = (changedValues) => {
    const changed = hasChanges(changedValues);
    setFormChanged(changed);
  };

  return (
    <div className="movie-editor">
      <h1 className="movie-editor__title">
        {isEdit ? 'Edit Movie' : 'New Movie'}
      </h1>
      <Form
        form={form}
        className="movie-editor__form"
        name="basic"
        layout="vertical"
        initialValues={defaultFormValue}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={handleFormChange}
        autoComplete="off"
      >
        <Form.Item
          label={renderLabel('Movie name')}
          name="nameMovie"
          layout="vertical"
          rules={[
            {
              required: true,
              message: 'Please input movie name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={renderLabel('Vi title')}
          name="viTitle"
          layout="vertical"
          rules={[
            {
              required: true,
              message: 'Please input vi title!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={renderLabel('En title')}
          name="enTitle"
          layout="vertical"
          rules={[
            {
              required: true,
              message: 'Please input en title!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={renderLabel('Description')}
          name="description"
          layout="vertical"
          rules={[
            {
              required: true,
              message: 'Please input description!',
            },
          ]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label={renderLabel('Publication Year')}
          name="year"
          layout="vertical"
          rules={[
            {
              required: true,
              message: 'Please input publication year!',
            },
          ]}
        >
          <Select
            placeholder="Select Publication Year"
            allowClear
            showSearch={true}
            options={years.map((year) => ({
              label: year.toString(),
              value: year,
            }))}
          />
        </Form.Item>

        <Form.Item
          label={renderLabel('Country')}
          name="country"
          layout="vertical"
          rules={[
            {
              required: true,
              message: 'Please input country!',
            },
          ]}
        >
          <Select
            placeholder="Select Country"
            allowClear
            showSearch={true}
            options={countries.map((country) => ({
              label: country,
              value: country,
            }))}
          />
        </Form.Item>

        <Form.Item
          label={renderLabel('Category')}
          name="categoryId"
          layout="vertical"
          rules={[
            {
              required: true,
              message: 'Please input category!',
            },
          ]}
        >
          <Select
            placeholder="Select category"
            allowClear
            showSearch={true}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label={renderLabel('Genres')}
          name="genreIds"
          layout="vertical"
          rules={[
            {
              required: true,
              message: 'Please select genres!',
            },
          ]}
        >
          <Select
            placeholder="Select genres"
            mode="multiple"
            allowClear
            showSearch={true}
            options={genres.map((genre) => ({
              label: genre.name,
              value: genre.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label={null}
          name="posterFile"
          layout="vertical"
          getValueFromEvent={handleGetFileValue}
          valuePropName="fileList"
          rules={[
            {
              required: true,
              message: 'Please upload poster!',
            },
          ]}
        >
          <UploadPoster />
        </Form.Item>

        {!isSeries() && (
          <Form.Item
            label={null}
            name="videoFile"
            layout="vertical"
            getValueFromEvent={handleGetFileValue}
            valuePropName="fileList"
            rules={[
              {
                required: true,
                message: 'Please upload video!',
              },
            ]}
          >
            <UploadVideo label="Upload Video" />
          </Form.Item>
        )}

        <Form.Item
          label={null}
          name="trailerFile"
          layout="vertical"
          getValueFromEvent={handleGetFileValue}
          valuePropName="fileList"
          rules={[
            {
              required: true,
              message: 'Please upload trailer!',
            },
          ]}
        >
          <UploadVideo label="Upload Trailer" />
        </Form.Item>

        {isSeries() && (
          <Form.Item>
            <Form.List name="episodes">
              {(fields, { add, remove }) => (
                <Space
                  className="movie-editor__episode-form"
                  direction="vertical"
                >
                  {fields?.map((field) => (
                    <EpisodeForm
                      key={field.key}
                      field={field}
                      remove={remove}
                    />
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => {
                      // Define default values for a new episode
                      const defaultEpisode = {
                        episodeCount: null,
                        descriptions: null,
                        posterFile: null,
                        videoFile: null,
                      };
                      add(defaultEpisode);
                    }}
                  >
                    Add Episode
                  </Button>
                </Space>
              )}
            </Form.List>
          </Form.Item>
        )}

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" disabled={!formChanged}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
