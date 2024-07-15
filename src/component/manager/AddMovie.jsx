import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../API/axiosConfig";
import qs from "qs";
import { countries } from "../../static-data/countries";
import { DEFAULT_EPISODE, Episode } from "./Episode";

export const AddMovie = () => {
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showEpisode, setShowEpisode] = useState(false);
  const [suggestions, setSuggestion] = useState([]);
  const [ids, setids] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState({
    nameMovie: "",
    filePoster: "",
    fileMovie: "",
    viTitle: "",
    enTitle: "",
    description: "",
    country: "",
    category: [],
    year: "",
    idGenre: [],
    nameCategory: [],
    episodes: [],
  });

  const handleRemoveItem = (itemToRemove) => {
    const filtered = selectedCategory.filter(
      (item) => item.id !== itemToRemove.id
    );
    setSelectedCategory(filtered);

    const request = {
      excludeIds: [...filtered.map((item) => item.id)],
    };
    fetchGenre(request); // khi xóa thi add vào lại suggestions
  };

  const getIdCategory = () => {
    const filtered = categories.filter((item) => item.id);
    setSelectedCategory(filtered);

    const request = {
      excludeIds: [...filtered.map((item) => item.id)],
    };
    fetchGenre(request);
  };

  const handleSelectCategory = (item) => {
    setids((idCategoryids) => [...idCategoryids, item.id]);
    setData((item) => ({
      ...item,
      idGenre: parseInt(data.idGenre),
    }));

    if (selectedCategory.some((selectedItem) => selectedItem.id === item.id)) {
      alert("Item đã có trong danh sách selected");
    } else {
      setSelectedCategory([...selectedCategory, item]);
      const request = {
        excludeIds: [...selectedCategory.map((item) => item.id), item.id],
      };
      fetchGenre(request);
    }
  };

  useEffect(() => {
    fetchGenre();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await axiosInstance.get(`/api/v1/category`);
    setCategories(response.data);
  };

  const fetchGenre = (params) => {
    axiosInstance
      .get(`/api/v1/genre`, {
        params,
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      })
      .then((res) => {
        setSuggestion(res.data ?? []);
      });
  };

  const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
          ...data,
          [name]: value,
        });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setData({
      ...data,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        data.nameMovie === "" ||
        data.viTitle === "" ||
        data.enTitle === "" ||
        data.description === "" ||
        data.idGenre === ""
      ) {
        alert("Vui lòng nhập đầy đủ thông tin phim");
      } else {
        const createMovieRequest = new FormData();
        createMovieRequest.append("nameMovie", data.nameMovie);
        createMovieRequest.append("viTitle", data.viTitle);
        createMovieRequest.append("enTitle", data.enTitle);
        createMovieRequest.append("description", data.description);
        createMovieRequest.append("filePoster", data.filePoster);
        createMovieRequest.append("fileMovie", data.fileMovie);
        createMovieRequest.append("country", data.country);
        createMovieRequest.append("year", data.year);
        createMovieRequest.append(["idGenre"], [ids]);
        createMovieRequest.append("idCategory", data.category);
        const response = await axiosInstance.post(
          `/api/v1/admin/movies`,
          createMovieRequest
        );

        alert("Thêm phim mới thành Công", response.data);
        navigate("/admin");
      }
    } catch (error) {
      alert("Lỗi");
    }
  };

  const handleShowEpisode = (e) => {
    if (e.target.value === "1") {
      setShowEpisode(true);
      setData({
        ...data,
        episodes: [DEFAULT_EPISODE],
      });
    } else {
      setShowEpisode(false);
    }
  };

  const handleEpisodeChanged = (episode, index) => {
    const clone = [...data.episodes];
    clone[index] = episode;

    setData({
      ...data,
      episodes: clone,
    });
  };

    const handleAddEpisode = () => {
      setData({
        ...data,
        episodes: [...data.episodes, DEFAULT_EPISODE],
      });
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
            type="text"
            name="country"
            value={data.country}
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>
              Chọn Quốc Gia
            </option>
            {countries.map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div className="selectedInputForm">
          <label>Chọn Phân Loại Phim</label>
          <select
            type="text"
            name="category"
            value={data.category}
            onChange={(e) => {
              handleChange(e);
              handleShowEpisode(e);
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
        </div>
        <div className="selectedInputForm">
          <label>Nhập Thể Loại</label>
          <div>
            {selectedCategory && (
              <div>
                {selectedCategory.map((item) => (
                  <button onClick={() => handleRemoveItem(item)}>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {suggestions && (
            <div>
              {suggestions.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleSelectCategory(category)}
                >
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          )}
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

            <button onClick={handleAddEpisode}>Add Episode</button>
          </div>
        )}

      <button onClick={handleSubmit}>Thêm</button>
    </div>
  );
};
