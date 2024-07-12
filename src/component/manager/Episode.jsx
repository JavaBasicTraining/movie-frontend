import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../API/axiosConfig";

export const DEFAULT_EPISODE = {
  episodeCount: "",
  posterUrl: "",
  videoUrl: "",
  descriptions: "",
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

  const create = async () => {
    // sai r,
    const createEpisodeRequest = new FormData();
    createEpisodeRequest.append("episodeCount", data.episodeCount);
    createEpisodeRequest.append("posterUrl", data.posterUrl);
    createEpisodeRequest.append("videoUrl", data.videoUrl);
    createEpisodeRequest.append("descriptions", data.descriptions);
    createEpisodeRequest.append("movieId", data.movieId);
    const res = await axiosInstance.post(
      `/api/v1/episode/create`,
      createEpisodeRequest
    );
    return res.data;
  };

  return (
    <form>
      <div>
        <div className="selectedInputForm">
          <label>Tập:</label>
          <input
            type="text"
            name="episodeCount"
            value={data.episodeCount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Tải Poster </label>
          <input
            type="file"
            name="filePoster"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Tải Phim </label>
          <input
            type="file"
            name="fileMovie"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Tập:</label>
          <input
            type="text"
            name="descriptions"
            value={data.descriptions}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Tập:</label>
          <input
            type="text"
            name="movieId"
            value={data.movieId}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </form>
  );
};
