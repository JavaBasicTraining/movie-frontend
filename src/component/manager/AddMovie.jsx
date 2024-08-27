import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../API/axiosConfig";
import qs from "qs";
import { countries } from "../../static-data/countries";
import { DEFAULT_EPISODE, Episode } from "./Episode";
import { MultiSelect } from "react-multi-select-component";

export const AddMovie = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showEpisode, setShowEpisode] = useState(false);
  const [suggestions, setSuggestion] = useState([]);
  const [showFilePoster, setShowFilePoster] = useState(false);
  const [showFileVideo, setShowFileVideo] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorsFile, setErrorsFile] = useState({});
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
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    setShowFilePoster(false);
    setShowFileVideo(false);
  }, []);

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
      setSuggestion(genreResponse.data ?? []);
    } catch (error) {
      console.error("Error fetching data:", error);
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

    let isValid = false;
    if (name === "poster") {
      isValid = validateFile(file, "poster");
    } else if (name === "video") {
      isValid = validateFile(file, "video");
    }

    if (!isValid) {
      setErrorsFile((prevErrors) => ({
        ...prevErrors,
        [name]:
          name === "poster"
            ? "Chỉ được phép tải lên các tệp hình ảnh (JPEG, PNG, GIF)."
            : "Chỉ được phép tải lên các tệp video (MP4, WebM, OGG).",
      }));
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setData((prev) => ({
      ...prev,
      [name]: file,
      [`prev${name.charAt(0).toUpperCase() + name.slice(1)}Url`]: previewUrl,
    }));

    if (name === "video") setShowFileVideo(true);
    if (name === "poster") setShowFilePoster(true);
  };

  const isSeries = () => data?.idCategory?.toString() === "1";

  const validateField = (name, value) => {
    let fieldError = "";

    switch (name) {
      case "nameMovie":
        if (!value.trim()) {
          fieldError = "Tên phim không được để trống";
        }
        break;
      case "viTitle":
        if (!value.trim()) {
          fieldError = "Tên phim tiếng Việt không được để trống";
        }
        break;
      case "enTitle":
        if (!value.trim()) {
          fieldError = "Tên phim tiếng Anh không được để trống";
        }
        break;
      case "description":
        if (!value.trim()) {
          fieldError = "Nội dung phim không được để trống";
        }
        break;
      case "year":
        if (!value.trim()) {
          fieldError = "Năm phát hành không được để trống";
        } else if (isNaN(value) || parseInt(value) <= 0 || value.length !== 4) {
          fieldError = "Năm phát hành phải là một số dương hợp lệ với 4 chữ số";
        }
        break;
      case "country":
        if (!value.trim()) {
          fieldError = "Quốc gia không được để trống";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    let isValid = true;
    const fields = ["nameMovie", "viTitle", "enTitle", "description", "year"];
    fields.forEach((field) => {
        const value = data[field];
        validateField(field, value);
        if (!field ) {
            isValid = false;
        } 
    });
    return isValid;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      return;
    } else {
      try {
        const newData = {
          ...data,
          episodes: data.episodes.map((episode) => ({
            ...episode,
            tempId: "" + new Date().getTime(),
          })),
        };
        const episodesMap = new Map(
          newData.episodes.map((item) => [item.tempId, item])
        );

        const response = await axiosInstance.post(
          `/api/v1/admin/movies/createWithEpisode`,
          newData
        );

        if (!isSeries() && data.poster && data.video) {
          uploadFileMovie(response.data.id, "poster", data.poster);
          uploadFileMovie(response.data.id, "video", data.video);
        } else if (data.poster) {
          const formData = new FormData();
          formData.append("file", data.poster);
          const res = await axiosInstance.patch(
            `/api/v1/admin/movies/${response.data.id}?type=poster`,
            formData
          );
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

        alert("Thêm phim mới thành công", response.data);
        navigate("/admin");
      } catch (error) {
        alert("Lỗi");
        console.error("Error submitting movie:", error);
      }
    }
  };

  const uploadFileMovie = async (id, type, file) => {
    const formData = new FormData();
    formData.append("file", file);
    await axiosInstance.patch(
      `/api/v1/admin/movies/${id}?type=${type}`,
      formData
    );
  };

  const handleShowEpisode = (e) => {
    const isSeries = e.target.value === "1";
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
    setSelectedCategory(selectedItems);
    setData((prev) => ({
      ...prev,
      idGenre: selectedItems.map((item) => item.value.id),
    }));
  };
  return (
    <div className="container-addmovie">
      <h1>Thêm Phim Mới</h1>
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
            {showFilePoster === true ? (
              <img className="poster-item" src={data.prevPosterUrl} alt="" />
            ) : null}
          </div>
        </div>
        {showEpisode || (
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
              {showFileVideo === true ? (
                <video
                  className="video-item"
                  src={data.prevVideoUrl}
                  controls
                ></video>
              ) : null}
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
            {errors.country || (
              <small className="error">{errors.country}</small>
            )}
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
        <div className="selectedInputForm">
          <label>Nhập Thể Loại</label>
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

      <button onClick={handleSubmit}>Thêm</button>
    </div>
  );
};
