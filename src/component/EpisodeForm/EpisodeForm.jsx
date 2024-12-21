import React, { useEffect, useState } from 'react';
import './EpisodeForm.scss';

export const DEFAULT_EPISODE = {
  episodeCount: '',
  video: '',
  poster: '',
  descriptions: '',
  movieId: '',
  prevPosterUrl: '',
  prevVideoUrl: '',
};

export const EpisodeForm = ({ formChanged, episode, index }) => {
  const [data, setData] = useState(DEFAULT_EPISODE);
  const [showFileVideo, setShowFileVideo] = useState(false);
  const [showFilePoster, setShowFilePoster] = useState(false);
  const [errorsFile, setErrorsFile] = useState({});
  const [errors, setErrors] = useState({});
  const fields = ['episodeCount', 'descriptions'];

  useEffect(() => {
    document.addEventListener('checkFormError', () => {
      validateForm();
    });
    return () => {
      document.removeEventListener('checkFormError', () => {
        validateForm();
      });
    };
  }, []);

  useEffect(() => {
    setData(episode);
    if (episode.posterUrl) {
      setShowFilePoster(true);
      setErrorsFile(false);
    }
    if (episode.videoUrl) {
      setShowFileVideo(true);
      setErrorsFile(false);
    }
  }, [episode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = {
      ...data,
      [name]: value,
    };
    setData(newValue);
    formChanged(newValue, index);
    checkFieldError(name, value);
  };

  const checkFieldError = (name, value) => {
    let error = '';
    if (!value.trim()) {
      error = 'This field is required';
    } else if (name === 'episodeCount') {
      const num = parseInt(value);
      if (isNaN(num)) {
        error = 'Episode must be a valid number';
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    fields.forEach((field) => {
      const value = data[field];
      if (!value) {
        isValid = false;
      }
      checkFieldError(field, value);
    });
    return isValid;
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
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
        case 'video':
          setShowFileVideo(false);
          break;
      }
      return;
    }

    if (name === 'poster' && !validateFile(file, 'poster')) {
      setErrorsFile((prevErrors) => ({
        ...prevErrors,
        [name]:
          'Chỉ được phép tải lên các tệp hình ảnh (JPEG, PNG, GIF, SVG, WEBP).',
      }));
      e.target.value = '';
      setShowFilePoster(false);
      return;
    }
    if (name === 'video' && !validateFile(file, 'video')) {
      setErrorsFile((prevErrors) => ({
        ...prevErrors,
        [name]:
          'Chỉ được phép tải lên các tệp video (MP4, WebM, OGG, MOV, AVI,FLV, MKV,3GP).',
      }));
      e.target.value = '';
      setShowFileVideo(false);
    }
    const previewUrl = URL.createObjectURL(file);
    let newData = { ...data };
    if (name === 'video') {
      setShowFileVideo(true);
      newData = {
        ...newData,
        video: file,
        prevVideoUrl: previewUrl,
      };
      setData(newData);
    } else if (name === 'poster') {
      setShowFilePoster(true);
      newData = {
        ...newData,
        poster: file,
        prevPosterUrl: previewUrl,
      };
      setData(newData);
    }
    formChanged(newData, index);
  };

  return (
    <form className="episode-container">
      <div className="body-episode">
        <div className="selected-input-form-episode">
          <label>Tập:</label>
          <div
            className="validate-episode"
            style={{
              color: 'red',
              display: 'flex',
              flexDirection: 'column',
              fontSize: '12px',
            }}
          >
            <input
              type="text"
              name="episodeCount"
              value={data.episodeCount}
              onChange={handleChange}
              required
            />
            {errors.episodeCount || (
              <small className="error">{errors.episode}</small>
            )}
          </div>
        </div>
        <div className="selected-input-form-episode-file">
          <div className="validate-episode">
            <div className="item-file">
              <label>Tải Poster </label>
              <input
                type="file"
                name="poster"
                onChange={handleFileChange}
                required
              />
            </div>
            {errorsFile.poster && (
              <small className="error">{errorsFile.poster}</small>
            )}
          </div>
          {showFilePoster && (
            <img
              className="poster-item-episode"
              src={data.prevPosterUrl || episode.posterUrl}
              alt=""
            />
          )}
        </div>
        <div className="selected-input-form-episode-file">
          <div className="validate-episode">
            <div className="item-file">
              <label>Tải Phim </label>
              <input
                type="file"
                name="video"
                onChange={handleFileChange}
                required
              />
            </div>
            {errorsFile.video && (
              <small className="error">{errorsFile.video}</small>
            )}
          </div>
          {showFileVideo && (
            <video
              className="video-episode-item"
              src={data.prevVideoUrl || episode.videoUrl}
              controls
            ></video>
          )}
        </div>
        <div className="selected-input-form-episode">
          <label>Nội dung:</label>
          <div
            className="validate-episode"
            style={{
              color: 'red',
              display: 'flex',
              flexDirection: 'column',
              fontSize: '12px',
            }}
          >
            <input
              type="text"
              name="descriptions"
              value={data.descriptions}
              onChange={handleChange}
              required
            />
            {errors.descriptions || (
              <small className="error">{errors.descriptions}</small>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
