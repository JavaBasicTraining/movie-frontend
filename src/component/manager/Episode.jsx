import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../API/axiosConfig";

export const DEFAULT_EPISODE = {
  episodeCount: "",
  video: "",
  poster: "",
  descriptions: "",
  movieId: "",
  prevPosterUrl: "",
  prevVideoUrl: "",
};

export const Episode = ({ formChanged, episode, index }) => {
  const [data, setData] = useState(DEFAULT_EPISODE);
  const [showFileVideo, setShowFileVideo] = useState(false);
  const [showFilePoster, setShowFilePoster] = useState(false);
  const [errorsFile, setErrorsFile] = useState({});
  const [errors, setErrors] = useState({});


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
    validateField(name, value);
    if(validateForm )
    {
      return;
    }else
   {
    formChanged(newValue, index);
   }
  };


  const validateField = (name, value) => {
    let fieldError = '';
  
    switch (name) {
     
      case 'episodeCount':
        if (!value.trim()) {
          fieldError = 'Tập phim không được để trống';
        }
        break;
      case 'description':
        if (!value.trim()) {
          fieldError = 'Nội dung phim không được để trống';
        }
        break;
    
      default:
        break;
    }
  
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };
  
  const validateForm = () => {
    let isValid = true;
    const fields = ['episodeCount','descriptions'];
    fields.forEach((field) => {
      const value = data[field];
      validateField(field, value);
      if (errors[field]) isValid = false;
    });
    return isValid;
  };

  const validateFile = (file, type) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

    if (type === "poster") {
      return validImageTypes.includes(file.type);
    } else if (type === "video") {
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
        [name]: "Không có tệp nào được chọn.",
      }));
      return;
    }

    if (name === "poster" && !validateFile(file, "poster")) {
      setErrorsFile((prevErrors) => ({
        ...prevErrors,
        [name]: "Chỉ được phép tải lên các tệp hình ảnh (JPEG, PNG, GIF).",
      }));
      e.target.value = "";
      setShowFilePoster(false);
      return;
    }
    if (name === "video" && !validateFile(file, "video")) {
      setErrorsFile((prevErrors) => ({
        ...prevErrors,
        [name]: "Chỉ được phép tải lên các tệp video (MP4, WebM, OGG).",
      }));
      e.target.value = "";
      setShowFileVideo(false);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    let newData = { ...data };
    if (name === "video") {
      setShowFileVideo(true);
      newData = {
        ...newData,
        video: file,
        prevVideoUrl: previewUrl,
      };
      setData(newData);
    } else if (name === "poster") {
      setShowFilePoster(true);
      newData = {
        ...newData,
        poster: file,
        prevPosterUrl: previewUrl,
      };
      setData(newData);
    }
    formChanged(newData);
  };
  return (
    <form className="episode-container">
      <div className="body-episode">
        <div className="selected-input-form-episode">
          <label>Tập:</label>
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
        <div className="selected-input-form-episode-file">
          <div className="selected-input-form-episode">
            <label>Tải Poster</label>
            <div className="validate-episode">
              <input
                type="file"
                name="poster"
                onChange={handleFileChange}
                required
                style={{ color: "black" }}
              />
              {errorsFile.poster || (
                <small style={{ color: "red" }}>{errorsFile.poster}</small>
              )}
            </div>
            {showFilePoster === true ? (
              <img className="poster-item" src={data.prevPosterUrl} alt="" />
            ) : null}
          </div>
        </div>
        <div className="selected-input-form-episode-file">
          <div className="selected-input-form-episode">
            <label>Tải Phim </label>
            <div className="validate-episode">
              <input
                type="file"
                name="video"
                onChange={handleFileChange}
                required
                style={{ color: "black" }}
              />
              {errorsFile.video || (
                <small style={{ color: "red" }}>{errorsFile.video}</small>
              )}
            </div>

            {showFileVideo && (
              <video
                className="video-episode-item"
                src={episode.videoUrl || data.prevVideoUrl}
                controls
              ></video>
            )}
          </div>
        </div>
        <div className="selected-input-form-episode">
          <label>Nội dung:</label>
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
    </form>
  );
};
