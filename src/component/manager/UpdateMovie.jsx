import qs from "qs";
import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useLoaderData } from "react-router-dom";
import { axiosInstance } from "../../API/axiosConfig";
import { countries } from "../../static-data/countries";
import "../../style/update-movie.scss";
import { DEFAULT_EPISODE, Episode } from "./Episode";
import Select from "react-select";
import { colors } from "@material-ui/core";

// export async function UpdateMovieLoader({ params }) {
//   const res = await axiosInstance.get(`/api/v1/admin/movies/${params.id}`);
//   return { movie: res.data };
// }

export const UpdateMovie = () => {
  const [categories, setCategories] = useState([]);
  const [showEpisode, setShowEpisode] = useState(false);
  const [suggestions, setSuggestion] = useState([]);
  const { movie } = useLoaderData();
  const [showUploadFileMovie, setShowUploadFileMovie] = useState(true);
  const [errorsFile, setErrorsFile] = useState({});
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    nameMovie: "",
    viTitle: "",
    enTitle: "",
    description: "",
    country: "",
    poster: "",
    video: "",
    idCategory: [],
    year: "",
    prevPosterUrl: "",
    prevVideoUrl: "",
    idGenre: [],
    episodes: [],
    genreSelectedData: [],
  });

  useEffect(() => {
    fetchData(movie);
    setShowEpisode(movie?.category?.id === 1);
    if (movie?.category?.id === 1) {
      setShowUploadFileMovie(false);
    }

    

  }, [movie]);

  useEffect(() => {
    fetchGenre();
    fetchCategories();
  }, []);



  const fetchData = (newData) => {
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

  const fetchCategories = async () => {
    const response = await axiosInstance.get(`/api/v1/category`);
    setCategories(response.data);
  };

  const fetchGenre = async (params) => {
    try {
      const response = await axiosInstance.get(`/api/v1/genre`, {
        params,
        paramsSerializer: (params) => qs.stringify(params),
      });
      setSuggestion(response.data ?? []);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const handleChange = (e, onSuccess) => {
    const { name, value } = e.target;
    setData((prev) => {
      const updatedData = { ...prev, [name]: value };
      onSuccess?.(updatedData);
      validateField(name, value);
      return updatedData;
    });
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
  const handleFileUpload = (e) => {
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
      return;
    }

    if (name === "video" && !validateFile(file, "video")) {
      setErrorsFile((prevErrors) => ({
        ...prevErrors,
        [name]: "Chỉ được phép tải lên các tệp video (MP4, WebM, OGG).",
      }));
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (name === "video") {
      setData((prev) => ({
        ...prev,
        video: file,
        prevVideoUrl: previewUrl,
      }));
    } else if (name === "poster") {
      setData((prev) => ({
        ...prev,
        poster: file,
        prevPosterUrl: previewUrl,
      }));
    }
  };

  const isSeries = (category) => {
    if (category) {
      return category.name === "Phim bộ";
    }

    return data?.idCategory?.toString() === "1";
  };

  const uploadFileMovie = async (id, type, file) => {
    const formData = new FormData();
    formData.append("file", file);
    await axiosInstance.patch(
      `/api/v1/admin/movies/${id}?type=${type}`,
      formData
    );
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) {
      error = `(*) This field is required`;
    } else if (name === "year" && (isNaN(value) || parseInt(value) <= 0 || value.length !== 4)) {
      error = "Year must be a valid 4-digit number";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    const fields = ["nameMovie", "viTitle", "enTitle", "description", "year"];
    fields.forEach((field) => {
      const value = data[field];
      if (!value) {
        isValid = false;
      }
      validateField(field, value);
    });

    document.dispatchEvent(new CustomEvent("checkFormError"));

    return isValid;
  };
  const handleSubmit = async (e) => {
    if (!validateForm()) {
      return;
    } else {
      e.preventDefault();
      try {
        if (
          !data.nameMovie ||
          !data.viTitle ||
          !data.enTitle ||
          !data.description ||
          !data.idGenre.length
        ) {
          alert("Vui lòng nhập đầy đủ thông tin phim");
          return;
        }

        const newData = {
          ...data,
          episodes: data.episodes.map((episode, index) => ({
            ...episode,
            tempId: "" + new Date().getTime() + index,
          })),
        };

        const episodesMap = new Map(
          newData.episodes.map((item) => [item.tempId, item])
        );
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
          uploadFileMovie(response.data.id, "poster", data.poster);
        }
        if (!isSeries(response.data.category) && data.video) {
          uploadFileMovie(response.data.id, "video", data.video);
        }
        if (isSeries(response.data.category)) {
          for (const item of response.data.episodes) {
            const episodeMap = episodesMap.get(item.tempId);
            if (episodeMap.poster && episodeMap.video) {
              const formDataEpisode = new FormData();
              formDataEpisode.append("poster", episodeMap.poster);
              formDataEpisode.append("video", episodeMap.video);
              await axiosInstance.patch(
                `/api/v1/admin/movies/${response.data.id}/episodes/${item.id}`,
                formDataEpisode
              );
            }
          }
        }

        alert("Cập nhật thành công");
        // navigate("/admin");
      } catch (error) {
        alert("Lỗi");
        console.error("Error updating movie:", error);
      }
    }
  };

  const handleShowEpisode = (e) => {
    if (e.target.value === "1") {
      setShowEpisode(true);
      setShowUploadFileMovie(false);
      setData((prev) => ({
        ...prev,
        episodes: [DEFAULT_EPISODE],
      }));
    } else {
      setShowUploadFileMovie(true);
      setShowEpisode(false);
    }
  };

  const handleEpisodeChanged = (episode, index) => {
    setData((prev) => {
      const episodes = [...prev.episodes];
      episodes[index] = { ...episodes[index], ...episode };
      return { ...prev, episodes };
    });
  };

  const handleAddEpisode = (e) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      episodes: [...prev.episodes, DEFAULT_EPISODE],
    }));
  };

  const handleGenreChange = (selectedItems) => {
    setData((prev) => ({
      ...prev,
      idGenre: selectedItems.map((item) => item.value.id),
      genreSelectedData: selectedItems,
    }));
  };

  return (
    <div className="container-addmovie">
      <h1>Sửa Thông Tin Phim</h1>
      <div className="form-addmovie">
        <div className="selectedInputForm">
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
        <div className="selectedInputForm">
          <div className="file-item">
            <div className="selectedInputForm">
              <label>Tải Poster</label>
              <div className="validate">
                <input
                  type="file"
                  name="poster"
                  onChange={handleFileUpload}
                  required
                  style={{ color: "white" }}
                />
                {errorsFile.poster || (
                  <small style={{ color: "red" }}>{errorsFile.poster}</small>
                )}
              </div>
            </div>
            <img
              className="poster-item"
              src={data.prevPosterUrl || movie.posterUrl}
              alt=""
            />
          </div>
        </div>
        {showUploadFileMovie && (
          <div className="selectedInputForm">
            <div className="file-item">
              <div className="selectedInputForm">
                <label>Tải Phim</label>
                <div className="validate">
                  <input
                    type="file"
                    name="video"
                    onChange={handleFileUpload}
                    required
                    style={{ color: "white" }}
                  />
                  {errorsFile.video || (
                    <small style={{ color: "red" }}>{errorsFile.video}</small>
                  )}
                </div>
              </div>
                <video
                  className="video-item"
                src={data.prevVideoUrl || movie.videoUrl}
                  controls
                ></video>
            </div>
          </div>
        )}
        <div className="selectedInputForm">
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
        <div className="selectedInputForm">
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
        <div className="selectedInputForm">
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
        <div className="selectedInputForm">
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
        <div className="selectedInputForm">
          <label>Nhập Quốc Gia</label>
          <select
            name="country"
            value={data.country}
            onChange={handleChange}
            required
          >

            <option value="" disabled>
              Chọn Quốc Gia
            </option>
            ,
            {countries.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="selectedInputForm">
          <label>Chọn Phân Loại Phim</label>
          <select
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
        <div className="selectedInputForm">
          <label>Nhập Thể Loại</label>
          {/* <MultiSelect
          options={suggestions
                .filter((suggestion) => !data.genreSelectedData.some((selected) => selected.value.id === suggestion.id))
                .map((item) => ({
                  label: item.name,
                  value: item, 
                }))}
            value={data.genreSelectedData}
            onChange={handleGenreChange}
            labelledBy="Select"
            className="light custom-multi-select"
          /> */}

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
              .map((item) => ({
                label: item.name,
                value: item,
              }))}
            styles={{
              option: (provided) => ({ ...provided, color: "black" }),
              singleValue: (base) => ({ ...base, color: "black" }),
            }}
          />
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
          <button onClick={handleAddEpisode}>Thêm Tập </button>
        </div>
      )}

      <button onClick={handleSubmit}>Sửa</button>
    </div>
  );
};
