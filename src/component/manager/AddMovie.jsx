
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
  // const [showUploadFileMovie, setShowUploadFileMovie] = useState(true);

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

  const [uploadMovie, setUploadMovie] = useState({
    poster: "",
    video: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    setShowFilePoster(false);
    setShowFileVideo(false);

 
  }, []);
  
  // useEffect(() => {
  //   if (data.video !== null || data.prevVideoUrl !== null) {
  //     setShowFileVideo(true);
  //   }
  // },[showFileVideo]);

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
      alert("Không có tệp nào được chọn.");
      return; 
    }
  
    if (name === "poster" && !validateFile(file, "poster")) {
      alert("Chỉ được phép tải lên các tệp hình ảnh (JPEG, PNG, GIF).");
      e.target.value = ""; 
      return; 
    } 
  
    
    if (name === "video" && !validateFile(file, "video")) {
      alert("Chỉ được phép tải lên các tệp video (MP4, WebM, OGG).");
      e.target.value = ""; 
      return; 
    }
    const previewUrl = URL.createObjectURL(file);
  
    if (name === "video") {
      setShowFileVideo(true)
      setData((prev) => ({
        ...prev,
        video: file,
        prevVideoUrl: previewUrl,
      }));
    } else if (name === "poster") {
      setShowFilePoster(true)
      setData((prev) => ({
        ...prev,
        poster: file,
        prevPosterUrl: previewUrl,
      }));
    }
  };
  
  const isSeries = () => data?.idCategory?.toString() === "1";


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requiredFields = [
        "nameMovie",
        "viTitle",
        "enTitle",
        "description",
        "idGenre",
      ];
      const hasEmptyField = requiredFields.some((field) => !data[field]);

      if (hasEmptyField) {
        alert("Vui lòng nhập đầy đủ thông tin phim");
        return;
      }


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
          <input
            type="text"
            name="nameMovie"
            value={data.nameMovie}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <div className="file-item">
            <div className="selectedInputForm">
              <label>Tải Poster</label>
              <input
                type="file"
                name="poster"
                onChange={handleFileUpload}
                required
              />
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
                <input
                  type="file"
                  name="video"
                  onChange={handleFileUpload}
                  required
                />
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
          <input
            type="text"
            name="viTitle"
            value={data.viTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Nhập Tên Phim Tiếng Anh</label>
          <input
            type="text"
            name="enTitle"
            value={data.enTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Nhập Mô Tả Phim</label>
          <input
            type="text"
            name="description"
            value={data.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Năm Phát Hành:</label>
          <input
            type="text"
            name="year"
            value={data.year}
            onChange={handleChange}
            required
          />
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
            name="idCategory"
            value={data.idCategory}
            onChange={(e) => {
              handleChange(e, (formData) => {
                handleShowEpisode(e, formData);
              });
            }}
            required
          >
            <option value="" disabled >
              Chọn Phân Loại Phim
            </option>
            {categories.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))}
          </select>
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
