import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../API/axiosConfig";
import axios from "axios";
import qs from "qs";
export async function AddMovieLoader() {
  const res = await axiosInstance.get(`/api/v1/admin/movies/new`);

  return {
    movie: res.data,
  };
}

export const AddMovie = () => {
  const [selectedNavbar, setSelectedNavbar] = useState([]);
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
    navbar: "",
    ids: "",
    nameCategory: [],
  });



  const handleRemoveItem = (itemToRemove) => {
    const filtered = selectedNavbar.filter(
      (item) => item.id !== itemToRemove.id
    );
    setSelectedNavbar(filtered);

    const request = {
      excludeIds: [...filtered.map((item) => item.id)],
    };
    fetchCategories(request); // khi xóa thi add vào lại suggestions
  };

  const handleSelectItem = (item) => {
    setids(item.id)
    setData((item) => ({
      ...item,
      idCategory: parseInt(data.idCategory),
    }));

    if (selectedNavbar.some((selectedItem) => selectedItem.id === item.id)) {
      alert("Item đã có trong danh sách selected");
    } else {
      setSelectedNavbar([...selectedNavbar, item]);
      const request = {
        excludeIds: [...selectedNavbar.map((item) => item.id), item.id],
      };
      fetchCategories(request);
    }
  };



  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchCategories = (params) => {
    axiosInstance
      .get(`/api/v1/categories`, {
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
        data.idCategory === ""
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
        createMovieRequest.append("navbar",data.navbar);
        createMovieRequest.append("ids", parseInt(ids));
        const response = await axiosInstance.post(
          `/api/v1/admin/movies`,
          createMovieRequest,
        
        );

        alert("Thêm phim mới thành Công", response.data);
        navigate("/admin");
      }
    } catch (error) {
      alert("Lỗi");
    }
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
          <label>Nhập Thể Loại</label>
          <div>
            {/* selected items */}
            {selectedNavbar && (
              <div>
                {selectedNavbar.map((item) => (
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
                  onClick={() => handleSelectItem(category)}
                >
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
      <div className="selectedInputForm">
          <label>Nhập Thể Loại</label>
          <div>
            {/* selected items */}
            {selectedNavbar && (
              <div>
                {selectedNavbar.map((item) => (
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
                  onClick={() => handleSelectItem(category)}
                >
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <button onClick={handleSubmit}>Thêm</button>
    </div>
  );
};
