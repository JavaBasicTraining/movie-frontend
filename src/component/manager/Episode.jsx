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
    if(episode.poster !== null)
    {
      setShowFilePoster(true)
    }else if (episode.video !== true)
    {
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    const previewUrl = URL.createObjectURL(file);

    if (name === "video") {
      setShowFileVideo(true)
      setData((prev) => ({
        ...prev,
        video: file,
        [name === "video" ? "prevVideoUrl" : "prevVideoUrl"]: previewUrl,
      }));
    } else if (name === "poster") {
      setShowFilePoster(true)
      setData((prev) => ({
        ...prev,
        poster: file,
        [name === "poster" ? "prevPosterUrl" : "prevPosterUrl"]: previewUrl,
      }));
    }
    
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
          {showFilePoster === true ? (
            <img
              className="poster-item"
              src={episode.posterUrl || data.prevPosterUrl}
              alt=""
            />
          ) : null}{" "}
        </div>
        <div className="selectedInputFormEpisodeFile">
          <label>Tải Phim </label>
          <input
            type="file"
            name="video"
            onChange={handleFileChange}
            required
          />

          {episode.video || showFileVideo && (
            <video
              className="video-episode-item"
              src={episode.videoUrl|| data.prevVideoUrl}
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
