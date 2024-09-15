import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const DEFAULT_EPISODE = {
  episodeCount: '',
  video: '',
  poster: '',
  descriptions: '',
  movieId: '',
  prevPosterUrl: '',
  prevVideoUrl: '',
};

export const Episode = ({ formChanged, episode, index }) => {
  const [data, setData] = useState(DEFAULT_EPISODE);
  const [showFileVideo, setShowFileVideo] = useState(false);
  const [showFilePoster, setShowFilePoster] = useState(false);
  const [errorsFile, setErrorsFile] = useState({});
  const [errors, setErrors] = useState({});
  const fields = ['episodeCount', 'descriptions'];  
  const posterRef = useRef();




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


  // const upda 

  useEffect(() => {
    setData(episode);
    if (episode.poster) {
      setShowFilePoster(true);
    }
    if (episode.video) {
      setShowFileVideo(true);
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


  
  useEffect(() => {
    window.addEventListener('resize', () => {
      updatePosterEpisodeHeight();
    });

    return () => {
      window.removeEventListener('resize', () => {
        updatePosterEpisodeHeight();
      });
    };
  }, []);

  
  useLayoutEffect(() => {
    updatePosterEpisodeHeight();
  }, [data.poster]);

  const updatePosterEpisodeHeight = () => {
    if (posterRef?.current) {
      const height = (posterRef.current.clientWidth * 4) / 3;
      posterRef.current.style.height = height !== 0 ? `${height}px` : 'auto';
    }
  };
  const checkFieldError = (name, value) => {
    let error = '';
    if (!value.trim()) {
      error = `(*) This field is required`;
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
          <div className="item-file">
            <label > Tải Poster</label>
          <div className="validate-episode">
            <input
              type="file"
              name="poster"
             
              onChange={handleFileChange}
              required
            />
            {errorsFile.poster || (
              <small style={{ color: 'red' }}>{errorsFile.poster}</small>
            )}
          </div>
          </div>
          {showFilePoster && (
            <img
              className="poster-item-episode"
              ref={posterRef}
              src={episode.posterUrl || data.prevPosterUrl}
              alt=""
            />
          )}
        </div>
        <div className="selected-input-form-episode-file">
          <div className="item-file">
            <label>Tải Phim </label>
            <div className="validate-episode">
            <input
       
              type="file"
              name="poster"
              onChange={handleFileChange}
              required
             
            />
            {errorsFile.poster || (
              <small style={{ color: 'red' }}>{errorsFile.poster}</small>
            )}
          </div>
          </div>
          {(showFileVideo || episode.video) && (
            <video
              className="video-episode-item"
              src={episode.videoUrl || data.prevVideoUrl}
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
