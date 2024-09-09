import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../API/axiosConfig';
import qs from 'qs';
import { countries } from '../../static-data/countries';
import { DEFAULT_EPISODE, Episode } from './Episode';
import { MultiSelect } from 'react-multi-select-component';

export async function MovieDetailLoader({ params }) {
  if (params.id) {
    const res = await axiosInstance.get(`/api/v1/admin/movies/${params.id}`);
    return { movie: res.data };
  } else {
    return { movie: null };
  }
}

export const AddMovie = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showEpisode, setShowEpisode] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showFilePoster, setShowFilePoster] = useState(false);
  const [showFileVideo, setShowFileVideo] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { movie } = useLoaderData();

  const [errorsFile, setErrorsFile] = useState({});
  const [data, setData] = useState({
    nameMovie: '',
    viTitle: '',
    enTitle: '',
    description: '',
    country: '',
    poster: '',
    video: '',
    idCategory: [],
    year: '',
    prevPosterUrl: '',
    prevVideoUrl: '',
    idGenre: [],
    episodes: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    setIsEdit(!!movie);
  }, [movie]);

  useEffect(() => {
    if (isEdit) {
      fetchDataUpdate(movie);
      setShowEpisode(movie?.category?.id === 1);
      if (movie?.category?.id === 1) {
        setShowFileVideo(false);
      }
    } else {
      fetchData();
      setShowFilePoster(false);
      setShowFileVideo(false);
    }
  }, [isEdit]);

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
    setData({
      ...data,
      ...newData,
      idCategory: newData?.category?.id,
      idGenre: newData?.genres.map((item) => item?.id),
      genreSelectedData: newData?.genres.map((item) => ({
        label: item.name,
        value: item,
        key: item.id,
      })),
    });
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
    if (value && typeof value === 'string') {
      return value.trim();
    }

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
      'video/mov',
      'video/avi',
      'video/flv',
      'video/mkv',
      'video/3gp',
    ];

    if (type === 'poster') {
      return validImageTypes.includes(file.type);
    } else if (type === 'video') {
      return validVideoTypes.includes(file.type);
    }
    return false;
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
      isValid = validateFile(file, 'poster');
    } else if (name === 'video') {
      isValid = validateFile(file, 'video');
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
      name === 'poster' ? setShowFilePoster(false) : setShowFileVideo(false);
      return;
    }

    // Xóa thông báo lỗi nếu file hợp lệ
    setErrorsFile((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Xóa lỗi tương ứng
    }));

    const previewUrl = URL.createObjectURL(file);

    if (name === 'video') {
      setShowFileVideo(true);
      setData((prev) => ({
        ...prev,
        video: file,
        prevVideoUrl: previewUrl,
      }));
    } else if (name === 'poster') {
      setShowFilePoster(true);
      setData((prev) => ({ ...prev, poster: file, prevPosterUrl: previewUrl }));
    } else if (name === 'video') {
      setShowFileVideo(true);
      setData((prev) => ({ ...prev, video: file, prevVideoUrl: previewUrl }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    } else {
      try {
        const newData = {
          ...data,
          episodes: data.episodes.map((episode) => ({
            ...episode,
            tempId: '' + new Date().getTime(),
          })),
        };
        const episodesMap = new Map(
          newData.episodes.map((item) => [item.tempId, item])
        );

        if (!isEdit) {
          apiCreate(newData, episodesMap);
        } else {
          apiUpdate(newData, episodesMap);
        }
      } catch (error) {
        alert('Lỗi');
        console.error('Error submitting movie:', error);
      }
    }
  };

  const apiUpdate = async (newData, episodesMap) => {
    const response = await axiosInstance.put(
      `/api/v1/admin/movies/${movie.id}`,
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
      uploadFileMovie(response.data.id, 'poster', data.poster);
    }
    if (!isSeries(response.data.category) && data.video) {
      uploadFileMovie(response.data.id, 'video', data.video);
    }
    if (isSeries(response.data.category)) {
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
    alert('Cập nhật thành công');
  };

  const apiCreate = async (newData, episodesMap) => {
    const response = await axiosInstance.post(
      `/api/v1/admin/movies`,

      newData
    );

    if (!isSeries() && data.poster && data.video) {
      uploadFileMovie(response.data.id, 'poster', data.poster);
      uploadFileMovie(response.data.id, 'video', data.video);
    } else if (data.poster) {
      const formData = new FormData();
      formData.append('file', data.poster);
      const res = await axiosInstance.patch(
        `/api/v1/admin/movies/${response.data.id}?type=poster`,
        formData
      );
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
    alert('Thêm phim mới thành công', response.data);
    navigate('/admin');
  };

  const uploadFileMovie = async (id, type, file) => {
    const formData = new FormData();
    formData.append('file', file);
    await axiosInstance.patch(
      `/api/v1/admin/movies/${id}?type=${type}`,
      formData
    );
  };

  const handleShowEpisode = (e) => {
    const isSeries = e.target.value === '1';
    setShowEpisode(isSeries);
    // setShowUploadFileMovie(!isSeries);

    if (isSeries) {
      setData((prev) => ({
        ...prev,
        episodes: [DEFAULT_EPISODE],
      }));
    } else {
      setData((prev) => ({
        ...prev,
        episodes: [],
      }));
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

    setSelectedCategory(selectedItems);
    setData((prev) => ({
      ...prev,
      idGenre: selectedItems.map((item) => item.value.id),
    }));
  };
  return (
    <div className="container-addmovie">
      {isEdit === false ? <h1>Thêm Phim Mới</h1> : <h1>Sửa Thông Tin Phim</h1>}
      <div className="form-addmovie">
        <div className="selected-input-form">
          <label>Nhập Tên Phim</label>
          <div className="validate">
            <input
              type="text"
              name="nameMovie"
              value={data.nameMovie}
              onChange={handleChange}
              required
            />
            {errors.nameMovie || (
              <small className="error">{errors.nameMovie}</small>
            )}
          </div>
        </div>
        <div className="selected-input-form">
          <div className="file-item-container">
            <div className="file-item">
              <div className="file-system">
                <label>Tải Poster</label>
                <div className="validate">
                  <input
                    type="file"
                    name="poster"
                    onChange={handleFileUpload}
                    required
                  />
                  {errorsFile.poster || (
                    <small style={{ color: 'red' }}>{errorsFile.poster}</small>
                  )}
                </div>
              </div>
            </div>
            <div className='img-container'>
              {isEdit === false ? (
                showFilePoster === true ? (
                  <img src={data.prevPosterUrl} alt="" />
                ) : null
              ) : (
                <img src={data.prevPosterUrl || movie.posterUrl} alt="" />
              )}
            </div>
          </div>
        </div>
        {showEpisode || (
          <div className="selected-input-form">
            <div className="file-item-container">
              <div className="file-item">
                <div className="file-system">
                  <label>Tải Phim</label>
                  <div className="validate">
                    <div className="validate-video">
                      <input
                        type="file"
                        name="video"
                        onChange={handleFileUpload}
                        required
                      />
                      {errorsFile.video || <small>{errorsFile.video}</small>}
                    </div>
                  </div>
                </div>
              </div>
              {isEdit === false ? (
                showFileVideo === true ? (
                  <video src={data.prevVideoUrl} controls></video>
                ) : null
              ) : (
                <video
                  src={data.prevVideoUrl || movie.videoUrl}
                  controls
                ></video>
              )}
            </div>
          </div>
        )}
        <div className="selected-input-form">
          <label>Nhập Tên Phim Tiếng Việt</label>
          <div className="validate">
            <input
              type="text"
              name="viTitle"
              value={data.viTitle}
              onChange={handleChange}
              required
            />
            {errors.viTitle || (
              <small className="error">{errors.viTitle}</small>
            )}
          </div>
        </div>
        <div className="selected-input-form">
          <label>Nhập Tên Phim Tiếng Anh</label>
          <div className="validate">
            <input
              type="text"
              name="enTitle"
              value={data.enTitle}
              onChange={handleChange}
              required
            />
            {errors.enTitle || (
              <small className="error">{errors.enTitle}</small>
            )}
          </div>
        </div>
        <div className="selected-input-form">
          <label>Nhập Mô Tả Phim</label>
          <div className="validate">
            <input
              type="text"
              name="description"
              value={data.description}
              onChange={handleChange}
              required
            />
            {errors.description || (
              <small className="error">{errors.description}</small>
            )}
          </div>
        </div>
        <div className="selected-input-form">
          <label>Năm Phát Hành:</label>
          <div className="validate">
            <input
              type="text"
              name="year"
              value={data.year}
              onChange={handleChange}
              required
            />
            {errors.year || <small className="error">{errors.year}</small>}
          </div>
        </div>
        <div className="selected-input-form">
          <label>Nhập Quốc Gia</label>
          <div className="validate">
            <select
              className="selected-item"
              name="country"
              value={data.country}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Chọn Quốc Gia
              </option>
              {countries.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            {errors.country || (
              <small className="error">{errors.country}</small>
            )}
          </div>
        </div>
        <div className="selected-input-form">
          <label>Chọn Phân Loại Phim</label>
          <div className="validate">
            <select
              className="selected-item"
              name="idCategory"
              value={data.idCategory}
              onChange={(e) => {
                handleChange(e, (formData) => {
                  handleShowEpisode(e, formData);
                });
              }}
              required
            >
              <option value="" disabled>
                Chọn Phân Loại Phim
              </option>
              {categories.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.name}
                </option>
              ))}
            </select>
            {errors.idCategory || (
              <small className="error">{errors.idCategory}</small>
            )}
          </div>
        </div>
        <div className="selected-input-form">
          <label>Nhập Thể Loại</label>
          <div className="validate">
            <MultiSelect
              options={suggestions.map((item) => ({
                label: item.name,
                value: item,
              }))}
              value={selectedCategory}
              onChange={handleGenreChange}
              labelledBy="Select"
              className="light custom-multi-select"
              defaultIsOpen={false}
            />
            {errors.idGenre || (
              <small className="error">{errors.idGenre}</small>
            )}
          </div>
        </div>
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
