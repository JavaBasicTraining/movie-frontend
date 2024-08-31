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
  };

  const validateFile = (file, type) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/mov"];

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
      alert("Không có tệp nào được chọn.");
      return;
    }
    if (name === "poster" && !validateFile(file, "poster")) {
      alert("Chỉ được phép tải lên các tệp hình ảnh (JPEG, PNG, GIF).");
      e.target.value = "";
      setShowFilePoster(false);
    }

    if (name === "video" && !validateFile(file, "video")) {
      alert("Chỉ được phép tải lên các tệp video (MP4, WebM, OGG, Mov).");
      e.target.value = "";
      setShowFileVideo(false);

    }
    const previewUrl = URL.createObjectURL(file);

    // copy data cũ
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

    // sao bỏ hàm formChanged() đi z, thì nó sẽ k gọi ra bên ngoài để set data
    formChanged(newData); // này nó sẽ gọi hàm bên thằng cha đê set lại data
  };

  return (
    <form className="episode-container">
      <div className="body-episode">
        <div className="selectedInputFormEpisode">
          <label>Tập:</label>
          <input
            type="text"
            name="episodeCount"
            value={data.episodeCount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputFormEpisodeFile">
          <label>Tải Poster </label>
          <input
            type="file"
            name="poster"
            onChange={handleFileChange}
            required
          />
          {showFilePoster && (
            <img
              className="poster-item"
              src={episode.posterUrl || data.prevPosterUrl}
              alt=""
            />
          )}
        </div>
        <div className="selectedInputFormEpisodeFile">
          <label>Tải Phim </label>
          <input
            type="file"
            name="video"
            onChange={handleFileChange}
            required
          />
          {(showFileVideo || episode.video) && (
            <video
              className="video-episode-item"
              src={episode.videoUrl || data.prevVideoUrl}
              controls
            ></video>
          )}
        </div>
        <div className="selectedInputFormEpisodeFile">
          <label>Nội dung:</label>
          <input
            type="text"
            name="descriptions"
            value={data.descriptions}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </form>
  );
};
