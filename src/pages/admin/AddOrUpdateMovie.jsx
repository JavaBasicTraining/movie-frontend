import React, { useCallback, useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../API/axiosConfig';
import qs from 'qs';
import { countries } from '../../static-data/countries';
import { DEFAULT_EPISODE, Episode } from '../../component/Episode';
import FileUploadInput from '../../component/FileUploadInput/FileUploadInput';
import TextField from '../../component/TextField';
import SelectField from '../../component/SelectField';
import { allowImageType, allowVideoType } from '../../utils/validateFile';
import './AddOrUpdateMovie.scss';
import { movieAPI } from '../../API/movieAPI';

export async function AddOrUpdateMovieLoader({ params }) {
  if (params.id) {
    const res = await axiosInstance.get(`/api/v1/admin/movies/${params.id}`);
    return { movie: res.data };
  } else {
    return { movie: null };
  }
}

export const AddOrUpdateMovie = () => {
  const navigate = useNavigate();
  const { movie } = useLoaderData();

  const [categories, setCategories] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showEpisode, setShowEpisode] = useState(false);
  const [genres, setGenres] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [errorsFile, setErrorsFile] = useState({});
  const [data, setData] = useState({
    nameMovie: '',
    viTitle: '',
    enTitle: '',
    description: '',
    country: '',
    poster: '',
    video: '',
    idCategory: '',
    year: '',
    prevPosterUrl: '',
    prevVideoUrl: '',
    idGenre: [],
    episodes: [],
  });

  const handleChange = (e, callback) => {
    const { name, value } = e.target;
    const updatedData = { ...data, [name]: formatValue(value) };
    validateField(name, value);
    setData(updatedData);

    callback?.(updatedData);
  };

  const formatValue = (value) => {
    if (value && typeof value === 'string') {
      return value.trim();
    }

    return value;
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
      return;
    }

    let isValid = false;
    if (name === 'poster') {
      isValid = allowImageType(file.type);
    } else if (name === 'video') {
      isValid = allowVideoType(file.type);
    }

    if (!isValid) {
      setErrorsFile((prevErrors) => ({
        ...prevErrors,
        [name]:
          name === 'poster'
            ? 'Chỉ được phép tải lên các tệp hình ảnh (JPEG, PNG, GIF, SVG, WEBP).'
            : 'Chỉ được phép tải lên các tệp video (MP4, WebM, OGG, MOV, AVI,FLV, MKV,3GP).',
      }));
      e.target.value = '';
      return;
    }

    setErrorsFile((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    const previewUrl = URL.createObjectURL(file);

    if (name === 'poster') {
      setData({ ...data, poster: file, prevPosterUrl: previewUrl });
    } else if (name === 'video') {
      setData({ ...data, video: file, prevVideoUrl: previewUrl });
    }
  };

  const isSeries = () => data?.idCategory?.toString() === '1';

  const validateField = (name, value) => {
    let error = '';
    if (!value || value.length === 0) {
      error = `(*) This field is required`;
    } else if (
      name === 'year' &&
      (isNaN(value) || parseInt(value) <= 0 || value.length !== 4)
    ) {
      error = 'Year must be a valid 4-digit number';
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

    document.dispatchEvent(new CustomEvent('checkFormError'));

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return Promise.reject();
    } else {
      try {
        const newData = {
          ...data,
          episodes: data.episodes.map((episode) => ({
            ...episode,
            tempId: new Date().getTime().toString(),
          })),
        };

        const episodesMap = new Map(
          newData.episodes.map((item) => [item.tempId, item])
        );

        await saveMovie(newData, episodesMap);
      } catch (error) {
        alert('Lỗi: ' + error);
      }
    }
  };

  const saveMovie = async (newData, episodesMap) => {
    const response = isEdit
      ? await movieAPI.update(newData.id, newData)
      : await movieAPI.create(newData);

    if (data.poster) {
      await movieAPI.uploadFile(response.data.id, 'poster', data.poster);
    }

    if (data.video) {
      await movieAPI.uploadFile(response.data.id, 'video', data.video);
    }

    if (isSeries()) {
      for (const item of response.data.episodes) {
        const episodeMap = episodesMap.get(item.tempId);
        if (episodeMap.poster && episodeMap.video) {
          const formDataEpisode = new FormData();
          formDataEpisode.append('poster', episodeMap.poster);
          formDataEpisode.append('video', episodeMap.video);
          await axiosInstance.patch(
            `/api/v1/admin/movies/${response.data.id}/episodes/${item.id}`,
            formDataEpisode
          );
        }
      }
    }

    alert(`${isEdit ? 'Sửa' : 'Thêm'} phim mới thành công`);
    navigate('/admin/movie');
  };

  const handleShowEpisode = (e, formData) => {
    const isSeries = e.target.value === '1';
    setShowEpisode(isSeries);

    if (isSeries) {
      setData({
        ...formData,
        episodes: [DEFAULT_EPISODE],
      });
    } else {
      setData({
        ...formData,
        episodes: [],
      });
    }
  };

  const handleEpisodeChanged = (episode, index) => {
    setData((prev) => {
      const episodes = [...prev.episodes];
      episodes[index] = { ...episodes[index], ...episode };
      return { ...prev, episodes };
    });
  };

  const handleAddEpisode = () => {
    setData((prev) => ({
      ...prev,
      episodes: [...prev.episodes, DEFAULT_EPISODE],
    }));
  };

  const handleGenreChange = (selectedItems) => {
    if (!selectedItems || selectedItems.length === 0) {
      setErrors({
        ...errors,
        idGenre: 'Error',
      });
    } else {
      setErrors({
        ...errors,
        idGenre: null,
      });
    }

    setSelectedGenres(selectedItems);
    setData((prev) => ({
      ...prev,
      idGenre: selectedItems.map((item) => item.value.id),
    }));
  };

  const initData = useCallback((movie) => {
    setData({
      ...data,
      ...movie,
      idCategory: movie?.category?.id,
      idGenre: movie?.genres.map((item) => item?.id),
    });

    setShowEpisode(movie?.category?.id?.toString() === '1');

    setSelectedGenres(
      movie?.genres.map((item) => ({
        label: item.name,
        value: item,
        key: item.id,
      }))
    );
  }, []);

  const initDefaultData = useCallback(async () => {
    try {
      const [categoriesResponse, genreResponse] = await Promise.all([
        axiosInstance.get(`/api/v1/category`),
        axiosInstance.get(`/api/v1/genre`, {
          params: {},
          paramsSerializer: (params) => qs.stringify(params),
        }),
      ]);
      setCategories(categoriesResponse.data);
      setGenres(genreResponse.data ?? []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    setIsEdit(!!movie);
    initDefaultData().then();

    if (movie) {
      initData(movie);
    }
  }, [initDefaultData, initData, isEdit, movie]);

  return (
    <div className="container-addmovie">
      {isEdit === false ? <h1>Thêm Phim Mới</h1> : <h1>Sửa Thông Tin Phim</h1>}
      <div className="form-addmovie">
        <TextField
          label="Nhập Tên Phim"
          fullWidth={true}
          helperText={errors.nameMovie}
          type="text"
          name="nameMovie"
          value={data.nameMovie}
          onChange={handleChange}
          required
        />

        <TextField
          label="Nhập Tên Phim Tiếng Việt"
          fullWidth={true}
          helperText={errors.viTitle}
          type="text"
          name="viTitle"
          value={data.viTitle}
          onChange={handleChange}
          required
        />

        <TextField
          label="Nhập Tên Phim Tiếng Anh"
          fullWidth={true}
          helperText={errors.enTitle}
          type="text"
          name="enTitle"
          value={data.enTitle}
          onChange={handleChange}
          required
        />

        <TextField
          label="Nhập Mô Tả Phim"
          fullWidth={true}
          helperText={errors.description}
          type="text"
          name="description"
          value={data.description}
          onChange={handleChange}
          required
        />

        <TextField
          label="Năm Phát Hành"
          fullWidth={true}
          helperText={errors.year}
          type="text"
          name="year"
          value={data.year}
          onChange={handleChange}
          required
        />

        <SelectField
          label="Nhập Quốc Gia"
          fullWidth={true}
          helperText={errors.country}
          name="country"
          value={data.country}
          onChange={handleChange}
          items={countries.map((country) => ({
            value: country,
            label: country,
          }))}
          required
        />

        <SelectField
          label="Chọn Phân Loại Phim"
          fullWidth={true}
          helperText={errors.idCategory}
          name="idCategory"
          value={data.idCategory}
          onChange={(e) => {
            handleChange(e, (formData) => {
              handleShowEpisode(e, formData);
            });
          }}
          required
          items={categories.map((category) => ({
            value: parseInt(category.id),
            label: category.name,
          }))}
        />

        <SelectField
          label="Nhập Thể Loại"
          fullWidth={true}
          helperText={errors.idGenre}
          value={selectedGenres}
          onChange={handleGenreChange}
          labelledBy="Select"
          items={genres.map((item) => ({
            label: item.name,
            value: item,
          }))}
          multiple={true}
        />

        <FileUploadInput
          id="poster"
          name="poster"
          label="Tải Poster"
          onChange={handleFileUpload}
          source={
            data?.prevPosterUrl || movie?.posterUrl
              ? {
                  value: data?.prevPosterUrl || movie?.posterUrl,
                  type: 'image',
                }
              : null
          }
          helperText={errorsFile.poster}
          required
        />

        {showEpisode || (
          <FileUploadInput
            id="video"
            name="video"
            label="Tải Video"
            onChange={handleFileUpload}
            source={
              data?.prevVideoUrl || movie?.videoUrl
                ? {
                    value: data?.prevVideoUrl || movie?.videoUrl,
                    type: 'video',
                  }
                : null
            }
            helperText={errorsFile.video}
            required
          />
        )}
      </div>

      {showEpisode && (
        <div className="episodes">
          {data.episodes && (
            <>
              {data.episodes.map((item, index) => (
                <Episode
                  key={index}
                  episode={item}
                  index={index}
                  formChanged={handleEpisodeChanged}
                />
              ))}
            </>
          )}
          <button onClick={handleAddEpisode}>Thêm Tập Phim</button>
        </div>
      )}

      <button onClick={handleSubmit}>
        {isEdit === false ? 'Thêm' : 'Sửa Thông Tin Phim '}
      </button>
    </div>
  );
};
