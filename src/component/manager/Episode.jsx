import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../API/axiosConfig";

export const DEFAULT_EPISODE = {
  episodeCount: "",
  video: "",
  poster: "",
  descriptions: "",
  movie: "",
};
export const Episode = ({ formChanged, episode, index }) => {
  const [data, setData] = useState(DEFAULT_EPISODE);

  useEffect(() => {
    setData(episode);
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
    setData({
      ...data,
      [name]: files[0],
    });
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
        </div>
        <div className="selectedInputFormEpisodeFile">
          <label>Tải Phim </label>
          <input
            type="file"
            name="video"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="selectedInputFormEpisode">
          <label>Nội dung:</label>
          <input
            type="text"
            name="descriptions"
            value={data.descriptions}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputFormEpisode">
          <label>MovieId:</label>
          <input
            type="text"
            name="movie"
            value={data.movie}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </form>
  );
};
