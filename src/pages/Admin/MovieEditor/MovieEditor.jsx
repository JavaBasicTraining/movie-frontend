import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification, Select, Typography, Upload } from 'antd';
import qs from 'qs';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_EPISODE, EpisodeForm } from '../../../component/EpisodeForm/EpisodeForm';
import { axiosInstance } from '../../../configs/axiosConfig';
import { countries } from '../../../static-data/countries';
import './MovieEditor.scss';

const { Dragger } = Upload;

export async function MovieEditorLoader({ params }) {
  const id = parseInt(params.id);
  if (!isNaN(id) && id !== 0) {
    const res = await axiosInstance.get(`/api/v1/admin/movies/${id}`);
    return { movie: res.data };
  } else {
    return { movie: null };
  }
}

const normFile = (e) => {
  if (Array.isArray(e) && e.length > 0) {
    return [e?.[e.length - 1]];
  }
  if (e?.fileList?.length <= 0) {
    return [];
  }
  return [e?.fileList?.[e?.fileList?.length - 1]];
};

export const MovieEditor = () => {
  const loader = useLoaderData();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showEpisode, setShowEpisode] = useState(false);
  const [showButtonUploadMovie, setShowButtonUploadMovie] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showFilePoster, setShowFilePoster] = useState(false);
  const [showFileVideo, setShowFileVideo] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [errorsFile, setErrorsFile] = useState({});
  const [originalData, setOriginalData] = useState(null);

  const [data, setData] = useState({
    nameMovie: '',
    viTitle: '',
    enTitle: '',
    description: '',
    country: '',
    trailer: '',
    poster: '',
    video: '',
    categoryId: 0,
    year: 0,
    prevPosterUrl: '',
    prevVideoUrl: '',
    prevTrailerUrl: '',
    genreIds: [],
    episodes: [],
  });
  const [form] = Form.useForm();

  const posterRef = useRef();

  useEffect(() => {
    window.addEventListener('resize', () => {
      updatePosterHeight();
    });

    return () => {
      window.removeEventListener('resize', () => {
        updatePosterHeight();
      });
    };
  }, []);

  useLayoutEffect(() => {
    updatePosterHeight();
  }, [data.poster]);

  useEffect(() => {
    setIsEdit(!!loader?.movie || hasChanges(data));
  }, [loader?.movie, data]);

  useEffect(() => {
    if (isEdit) {
      fetchDataUpdate(loader?.movie);
      setShowEpisode(loader?.movie?.category?.id === 1);
      if (loader?.movie?.category?.id === 1) {
        setShowButtonUploadMovie(false);
        setShowFileVideo(false);
      }
    } else {
      fetchData().then();
      setShowFilePoster(false);
      setShowFileVideo(false);
    }
  }, [isEdit]);

  const updatePosterHeight = () => {
    if (posterRef?.current) {
      const height = (posterRef.current.clientWidth * 4) / 3;
      posterRef.current.style.height = height !== 0 ? `${height}px` : 'auto';
    }
  };

  const fetchData = async () => {
    try {
      const [categoriesResponse, genreResponse] = await Promise.all([
        axiosInstance.get(`/api/v1/category`),
        axiosInstance.get(`/api/v1/genre`, {
          params: {},
          paramsSerializer: (params) => qs.stringify(params),
        }),
      ]);
      setCategories(categoriesResponse.data);
      setSuggestions(genreResponse.data ?? []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataUpdate = (newData) => {
    const updatedData = {
      ...data,
      ...newData,
      idCategory: newData?.category?.id,
      idGenre: newData?.genres?.map((item) => item?.id) || [],
      genreSelectedData:
        newData?.genres?.map((item) => ({
          label: item.name,
          value: item,
          key: item.id,
        })) || [],
    };
    setData(updatedData);
    setOriginalData(updatedData);
  };
  const hasChanges = (dataChange) => {
    console.log(originalData);

    return JSON.stringify(dataChange) !== JSON.stringify(originalData);
  };
  const handleChange = (e, onSuccess) => {
    const { name, value } = e.target;
    setData((prev) => {
      const updatedData = { ...prev, [name]: formatValue(value) };
      onSuccess?.(updatedData);
      validateField(name, value);
      return updatedData;
    });
  };

  const formatValue = (value) => {
    return value;
  };

  const validateFile = (file, type) => {
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/webp',
    ];
    const validVideoTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/avi',
      'video/flv',
      'video/mkv',
      'video/3gp',
      'video/vnd.dlna.mpeg-tts',
    ];

    switch (type) {
      case 'poster':
        return validImageTypes.includes(file.type);
      case 'video':
      case 'trailer':
        return validVideoTypes.includes(file.type);
      default:
        return false;
    }
  };
  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) {
      setErrorsFile((prevErrors) => ({
        ...prevErrors,
        [name]: 'Không có tệp nào được chọn.',
      }));
      setData((prev) => ({ ...prev, [name]: '' }));
      setShowFileVideo(false);
      return;
    }

    let isValid = false;
    switch (name) {
      case 'poster':
      case 'video':
      case 'trailer':
        isValid = validateFile(file, name);
        break;
      default:
        isValid = false;
    }

    if (!isValid) {
      setErrorsFile((prevErrors) => ({
        ...prevErrors,
        [name]:
          name === 'poster'
            ? 'Chỉ được phép tải lên các tệp hình ảnh (JPEG, PNG, GIF, SVG, WEBP).'
            : 'Chỉ được phép tải lên các tệp video (MP4, WebM, OGG, MOV, AVI, FLV, MKV, 3GP).',
      }));
      e.target.value = '';
      switch (name) {
        case 'poster':
          setShowFilePoster(false);
          break;
        case 'trailer':
          setShowTrailer(false);
          break;
        default:
          setShowFileVideo(false);
          break;
      }
      return;
    }

    setErrorsFile((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    const previewUrl = URL.createObjectURL(file);

    switch (name) {
      case 'video':
        setShowFileVideo(true);
        setData((prev) => ({
          ...prev,
          video: file,
          prevVideoUrl: previewUrl,
        }));
        break;
      case 'poster':
        setShowFilePoster(true);
        setData((prev) => ({
          ...prev,
          poster: file,
          prevPosterUrl: previewUrl,
        }));
        break;
      case 'trailer':
        setShowTrailer(true);
        setData((prev) => ({
          ...prev,
          trailer: file,
          prevTrailerUrl: previewUrl,
        }));
        break;
      default:
        break;
    }
  };

  const isSeries = () => data?.categoryId?.toString() === '1';

  const validateField = (name, value) => {
    let error = '';
    if (!value || value.length === 0) {
      error = `(*) This field is required`;
    } else if (name === 'year') {
      const valueStr = String(value);

      if (isNaN(valueStr) || parseInt(valueStr) <= 0 || valueStr.length !== 4) {
        error = 'Year must be a valid 4-digit number';
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));

    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    const fields = [
      'nameMovie',
      'viTitle',
      'enTitle',
      'description',
      'year',
      'country',
      'idCategory',
      'idGenre',
    ];

    fields.forEach((field) => {
      const value = data[field];
      validateField(field, value);
      if (!value) {
        isValid = false;
      }
    });

    if (isEdit) {
      document.dispatchEvent(new CustomEvent('checkFieldError'));
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return Promise.resolve();
    } else {
      try {
        const newData = {
          ...data,
          episodes: data.episodes.map((episode, index) => ({
            ...episode,
            tempId: uuidv4(),
          })),
        };

        const episodesMap = new Map(newData.episodes.map((item) => [item.tempId, item]));

        if (!isEdit) {
          await createMovie(newData, episodesMap);
        } else {
          await updateMovie(newData, episodesMap);
        }
      } catch (error) {
        notification.error({ message: `Error when submitting ${error}` });
      }
    }
  };

  const updateMovie = async (newData, episodesMap) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/admin/movies/${loader?.movie.id}`,
        {
          ...newData,
          poster: undefined,
          video: undefined,
          episodes: isSeries()
            ? newData.episodes.map((episode) => ({
                ...episode,
                posterUrl: undefined,
                videoUrl: undefined,
              }))
            : [],
        }
      );

      if (data.poster) {
        await uploadFileMovie(response.data.id, 'poster', data.poster);
      }

      if (data.trailer) {
        await uploadFileMovie(response.data.id, 'trailer', data.trailer);
      }

      if (data.video && !isSeries()) {
        await uploadFileMovie(response.data.id, 'video', data.video);
      }

      if (isSeries()) {
        await updateEpisodes(response.data.episodes, response.data.id, episodesMap);
      }

      notification.success('Cập nhật thành công');
    } catch (error) {
      notification.error('Lỗi cập nhật phim');
    }
  };

  const createMovie = async (newData, episodesMap) => {
    const response = await axiosInstance.post(`/api/v1/admin/movies`, newData);

    if (data.poster) {
      await uploadFileMovie(response.data.id, 'poster', data.poster);
    }

    if (data.trailer) {
      await uploadFileMovie(response.data.id, 'trailer', data.trailer);
    }

    if (!isSeries() && data.video) {
      await uploadFileMovie(response.data.id, 'video', data.video);
    }

    if (isSeries()) {
      await updateEpisodes(response.data.episodes, response.data.id, episodesMap);
    }

    notification.success({
      message: 'Thêm phim mới thành công',
    });
  };

  const updateEpisodes = async (episodes, movieId, episodesMap) => {
    for (const episode of episodes) {
      const episodeMap = episodesMap.get(episode.tempId);
      if (episodeMap?.poster) {
        await uploadFileEpisode(episode.id, 'poster', episodeMap.poster, movieId);
      }
      if (episodeMap?.video) {
        await uploadFileEpisode(episode.id, 'video', episodeMap.video, movieId);
      }
    }
  };

  const uploadFileEpisode = async (episodeId, type, file, movieId) => {
    const formData = new FormData();
    formData.append('file', file);
    await axiosInstance.patch(
      `/api/v1/admin/movies/${movieId}/episodes/${episodeId}?type=${type}`,
      formData
    );
  };

  const uploadFileMovie = async (id, type, file) => {
    const formData = new FormData();
    formData.append('file', file);
    await axiosInstance.patch(`/api/v1/admin/movies/${id}?type=${type}`, formData);
  };

  const handleShowEpisode = (e) => {
    const isSeries = e.target.value === '1';
    setShowEpisode(isSeries);

    if (isSeries) {
      setShowButtonUploadMovie(false);
      setData((prev) => ({
        ...prev,
        episodes: [DEFAULT_EPISODE],
      }));
    } else {
      setShowButtonUploadMovie(true);

      setData((prev) => ({
        ...prev,
        episodes: [],
      }));
    }
  };

  const handleEpisodeChanged = (episode, index) => {
    setData((prevData) => ({
      ...prevData,
      episodes: prevData.episodes.map((ep, i) =>
        i === index ? { ...ep, ...episode } : ep
      ),
    }));
  };

  const handleAddEpisode = () => {
    setData((prev) => ({
      ...prev,
      episodes: [...prev.episodes, DEFAULT_EPISODE],
    }));
  };

  const handleGenreChange = (selectedItems) => {
    const updatedIdGenre = selectedItems.map((item) => item.value.id);
    if (!isEdit) {
      setSelectedCategory(selectedItems);
    }
    setData((prev) => ({
      ...prev,
      genreIds: updatedIdGenre,
      ...(isEdit && { genreSelectedData: selectedItems }),
    }));
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const itemRender = (originNode, file, _, actions) => {
    if (file) {
      const url = URL.createObjectURL(file.originFileObj);
      return (
        <div className="poster-container">
          <img
            className="poster-container__image"
            ref={posterRef}
            src={url}
            alt={file.name}
          />
          <Button
            className="poster-container__remove"
            icon={<DeleteOutlined />}
            onClick={actions.remove}
          ></Button>
        </div>
      );
    }

    return originNode;
  };

  return (
    <div className="movie-editor">
      <Typography.Title style={{ color: 'white' }}>
        {isEdit ? 'Sửa Thông Tin Phim' : 'Thêm Phim Mới'}
      </Typography.Title>

      <Form
        form={form}
        className="form-container"
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label={<span className="form-label">Nhập Tên Phim</span>}
          layout="vertical"
          name="nameMovie"
          rules={[
            {
              required: true,
              message: 'Please input your movie name!',
            },
          ]}
        >
          <Input type="text" placeholder="Tên phim" />
        </Form.Item>

        <Form.Item
          label={<span className="form-label">Nhập Tên Phim Tiếng Việt</span>}
          layout="vertical"
          name="viTitle"
          rules={[
            {
              required: true,
              message: 'Please input your movie name!',
            },
          ]}
        >
          <Input type="text" placeholder="Tên phim tiếnh việt" />
        </Form.Item>

        <Form.Item
          label={<span className="form-label">Nhập Tên Phim Tiếng Anh</span>}
          layout="vertical"
          name="enTitle"
          rules={[
            {
              required: true,
              message: 'Please input your movie name!',
            },
          ]}
        >
          <Input type="text" placeholder="Tên phim tiếnh anh" />
        </Form.Item>

        <Form.Item
          label={<span className="form-label">Nhập Mô Tả Phim</span>}
          layout="vertical"
          name="description"
          rules={[
            {
              required: true,
              message: 'Please input your movie name!',
            },
          ]}
        >
          <Input.TextArea type="text" rows={3} required placeholder="Mô tả chi tiết" />
        </Form.Item>

        <Form.Item
          label={<span className="form-label">Năm Phát Hành</span>}
          layout="vertical"
          name="year"
          rules={[
            {
              required: true,
              message: 'Please input movie year!',
            },
            {
              pattern: /^\d+$/,
              message: 'Please input a valid number!',
            },
          ]}
        >
          <Input type="text" name="year" placeholder="Năm phát hành" required />
        </Form.Item>

        <Form.Item
          label={<span className="form-label">Nhập Quốc Gia</span>}
          layout="vertical"
          name="country"
          rules={[
            {
              required: true,
              message: 'Please input movie country!',
            },
          ]}
        >
          <Select
            name="country"
            placeholder="Chọn Quốc Gia"
            options={countries.map((item) => ({
              lable: item,
              value: item,
            }))}
            required
          />
        </Form.Item>

        <Form.Item
          label={<span className="form-label">Chọn Phân Loại Phim</span>}
          layout="vertical"
          name="category"
          rules={[
            {
              required: true,
              message: 'Please input movie category!',
            },
          ]}
        >
          <Select
            value={data.categoryId}
            placeholder="Chọn Phân Loại Phim"
            options={categories.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            required
          />
        </Form.Item>

        <Form.Item
          label={<span className="form-label">Nhập Thể Loại</span>}
          layout="vertical"
          name="genres"
          rules={[
            {
              required: true,
              message: 'Please input movie genres!',
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Thể loại"
            allowClear
            options={suggestions.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            required
          />
        </Form.Item>

        <Form.Item
          label={<span className="form-label">Poster</span>}
          name="poster"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          layout="vertical"
          rules={[
            {
              required: true,
              message: 'Please input movie poster!',
            },
          ]}
        >
          <Dragger
            beforeUpload={() => false}
            accept="image/*"
            multiple={false}
            itemRender={itemRender}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </Dragger>
        </Form.Item>

        <div className="movie-editor__form">
          <div className="selected-input-form">
            <label htmlFor="poster" id="title-file-poster">
              Tải Poster
            </label>
            <div className="validate">
              <input
                id="file-poster"
                type="file"
                name="poster"
                onChange={handleFileUpload}
                required
              />
              {errorsFile.poster && <small className="error">{errorsFile.poster}</small>}
            </div>
          </div>

          {isEdit && !errorsFile.poster ? (
            <img
              ref={posterRef}
              src={data.prevPosterUrl || loader?.movie.posterUrl}
              alt="Poster"
            />
          ) : (
            showFilePoster && (
              <img
                className="poster"
                ref={posterRef}
                src={data.prevPosterUrl}
                alt="Poster"
              />
            )
          )}

          {showEpisode && (
            <div className="episodes">
              {data?.episodes?.map((item, index) => (
                <EpisodeForm
                  key={`index_${index.toString()}`}
                  episode={item}
                  index={index}
                  formChanged={handleEpisodeChanged}
                />
              ))}
              <button onClick={handleAddEpisode}>Thêm Tập</button>
            </div>
          )}

          {showButtonUploadMovie && (
            <div className="selected-input-form">
              <label htmlFor="video" id="title-file-video">
                Tải Phim
              </label>
              <div className="validate">
                <input
                  id="file-video"
                  type="file"
                  name="video"
                  onChange={handleFileUpload}
                  required
                />
                {errorsFile.video && <small className="error">{errorsFile.video}</small>}
              </div>
            </div>
          )}

          {isEdit && !errorsFile.video && showButtonUploadMovie ? (
            <video src={data.prevVideoUrl || loader?.movie.videoUrl} controls>
              <track kind="captions" srcLang="en" src="" default />
            </video>
          ) : (
            showFileVideo && (
              <video src={data.prevVideoUrl} controls>
                <track kind="captions" srcLang="en" src="" default />
              </video>
            )
          )}

          <div className="selected-input-form">
            <label htmlFor="trailer" id="title-file-trailer">
              Tải Trailer
            </label>
            <div className="validate">
              <input
                id="file-trailer"
                type="file"
                name="trailer"
                onChange={handleFileUpload}
                required
              />
              {errorsFile.trailer && (
                <small className="error">{errorsFile.trailer}</small>
              )}
            </div>
          </div>

          {isEdit && !errorsFile.trailer && showButtonUploadMovie ? (
            <video src={data.prevTrailerUrl || loader?.movie.trailerUrl} controls>
              <track kind="captions" srcLang="en" src="" default />
            </video>
          ) : (
            showTrailer && (
              <video src={data.prevTrailerUrl} controls>
                <track kind="captions" srcLang="en" src="" default />
              </video>
            )
          )}
        </div>

        <Button htmlType="submit" type="default">
          {isEdit ? 'Sửa Thông Tin Phim' : 'Thêm'}
        </Button>
      </Form>
    </div>
  );
};
