import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import qs from 'qs';
import { countries } from '../../../static-data/countries';
import {
  DEFAULT_EPISODE,
  EpisodeForm,
} from '../../../component/EpisodeForm/EpisodeForm';
import { MultiSelect } from 'react-multi-select-component';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import './AddMovie.scss';
import { axiosInstance } from '../../../configs/axiosConfig';

export async function AddMovieLoader({ params }) {
  const id = parseInt(params.id);
  if (!isNaN(id) && id !== 0) {
    const res = await axiosInstance.get(`/api/v1/admin/movies/${id}`);
    return { movie: res.data };
  } else {
    return { movie: null };
  }
}

export const AddMovie = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showEpisode, setShowEpisode] = useState(false);
  const [showButtonUploadMovie, setShowButtonUploadMovie] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showFilePoster, setShowFilePoster] = useState(false);
  const [showFileVideo, setShowFileVideo] = useState(true);
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const loader  = useLoaderData();
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
    year: [],
    prevPosterUrl: '',
    prevVideoUrl: '',
    idGenre: [],
    episodes: [],
  });

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
    setIsEdit(!!loader?.movie);
  }, [loader?.movie  ]);

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
    setData({
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
      setShowFileVideo(false);
      return;
    }

    let isValid = false;
    if (name === 'poster') {
      isValid = validateFile(file, 'poster');
      // setShowFilePoster(false);
    } else if (name === 'video') {
      isValid = validateFile(file, 'video');
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
      name === 'poster' ? setShowFilePoster(false) : setShowFileVideo(false);
      return;
    }

    setErrorsFile((prevErrors) => ({
      ...prevErrors,
      [name]: '',
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
    }
  };

  const isSeries = () => data?.idCategory?.toString() === '1';

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
      return;
    } else {
      try {
        const newData = {
          ...data,
          episodes: data.episodes.map((episode, index) => ({
            ...episode,
            tempId: uuidv4(),
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
    try {
      // Gửi yêu cầu cập nhật thông tin phim
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

      // Xử lý việc tải lên poster và video
      if (data.poster) {
        await uploadFileMovie(response.data.id, 'poster', data.poster);
      }
      if (data.video && !isSeries()) {
        await uploadFileMovie(response.data.id, 'video', data.video);
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
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Lỗi cập nhật phim');
    }
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
        if (episodeMap && episodeMap.poster && episodeMap.video) {
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
    const updatedIdGenre = selectedItems.map((item) => item.value.id);
    if (!isEdit) {
      setSelectedCategory(selectedItems);
    }
    setData((prev) => ({
      ...prev,
      idGenre: updatedIdGenre,
      ...(isEdit && { genreSelectedData: selectedItems }),
    }));
  };
  return (
    <div className="container-addmovie">
      <h1>{isEdit ? 'Sửa Thông Tin Phim' : 'Thêm Phim Mới'}</h1>
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
            {errors.nameMovie && (
              <small className="error">{errors.nameMovie}</small>
            )}
          </div>
        </div>

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
            {errors.viTitle && (
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
            {errors.enTitle && (
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
            {errors.description && (
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
            {errors.year && <small className="error">{errors.year}</small>}
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
            {errors.country && (
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
              onChange={(e) =>
                handleChange(e, (formData) => handleShowEpisode(e, formData))
              }
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
            {errors.idCategory && (
              <small className="error">{errors.idCategory}</small>
            )}
          </div>
        </div>

        <div className="selected-input-form">
          <label>Nhập Thể Loại</label>
          <div className="validate">
            {isEdit ? (
              <Select
                isMulti
                value={data.genreSelectedData}
                onChange={handleGenreChange}
                options={suggestions
                  .filter(
                    (suggestion) =>
                      !data.genreSelectedData.some(
                        (selected) => selected.value.id === suggestion.id
                      )
                  )
                  .map((item) => ({ label: item.name, value: item }))}
                styles={{
                  option: (provided) => ({ ...provided, color: 'black' }),
                  singleValue: (base) => ({ ...base, color: 'black' }),
                }}
              />
            ) : (
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
            )}
          </div>
        </div>

        <div className="selected-input-form">
          <label id="title-file-poster">Tải Poster</label>
          <div className="validate">
            <input
              id="file-poster"
              type="file"
              name="poster"
              onChange={handleFileUpload}
              required
            />
            { errorsFile.poster && (
              <small className="error">{errorsFile.poster}</small>
            )}
          </div>
        </div>

        {isEdit ? (
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
            {data.episodes &&
              data.episodes.map((item, index) => (
                <EpisodeForm
                  key={index}
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
            <label id="title-file-video">Tải Phim</label>
            <div className="validate">
              <input
                id="file-video"
                type="file"
                name="video"
                onChange={handleFileUpload}
                required
              />
              {errorsFile.video && (
                <small className="error">{errorsFile.video}</small>
              )}
            </div>
          </div>
        )}

        {isEdit && showButtonUploadMovie ? (
          <video src={data.prevVideoUrl || loader?.movie.videoUrl} controls></video>
        ) : (
          showFileVideo && <video src={data.prevVideoUrl} controls></video>
        )}

        <button onClick={handleSubmit}>
          {isEdit ? 'Sửa Thông Tin Phim' : 'Thêm'}
        </button>
      </div>
    </div>
  );
};
