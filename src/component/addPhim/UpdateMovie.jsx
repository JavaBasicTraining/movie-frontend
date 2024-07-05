import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../API/axiosConfig";
import qs from "qs";

export async function UpdateMovieLoader({ params }) {
  const res = await axiosInstance.get(`/api/v1/admin/movies/${params.id}`);

  return {
    movie: res.data,
  };
}

export const UpdateMovie = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [suggestions, setSuggestion] = useState([]);
  const [ids, setids] = useState("");
  const { movie } = useLoaderData();
  const navigate = useNavigate();
  const [data, setData] = useState({
    nameMovie: "",
    filePoster: "",
    fileMovie: "",
    viTitle: "",
    enTitle: "",
    description: "",
    ids: "",
    nameCategory: [],
  });

  const handleSelectItem = (item) => {
    setids(item.id);
    setData((item) => ({
      ...item,
      ids: data.ids,
    }));

    if (selectedItems.some((selectedItem) => selectedItem.id === item.id)) {
      alert("Item đã có trong danh sách selected");
    } else {
      setSelectedItems([...selectedItems, item]);
      const request = {
        excludeIds: [...selectedItems.map((item) => item.id), item.id],
      };
      fetchCategories(request);
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    const filtered = selectedItems.filter(
      (item) => item.id !== itemToRemove.id
    );
    setSelectedItems(filtered);
    const request = {
      excludeIds: [...filtered.map((item) => item.id)],
    };
    fetchCategories(request); // khi xóa thi add vào lại suggestions
  };

  useEffect(() => {
    setData(movie);
    fetchCategories();
  }, [movie]);

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

  const createMovieRequest = new FormData();
  createMovieRequest.append("nameMovie", data.nameMovie);
  createMovieRequest.append("viTitle", data.viTitle);
  createMovieRequest.append("enTitle", data.enTitle);
  createMovieRequest.append("description", data.description);
  createMovieRequest.append("filePoster", data.filePoster);
  createMovieRequest.append("fileMovie", data.fileMovie);
  createMovieRequest.append("ids", parseInt(ids));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        data.nameMovie === "" ||
        data.viTitle === "" ||
        data.enTitle === "" ||
        data.description === "" ||
        data.ids === "" ||
        data.filePoster === "" ||
        data.fileMovie === ""
      ) {
        alert("Vui lòng nhập đầy đủ thông tin phim");
      } else {
        const response = await axiosInstance.put(
          `/api/v1/admin/movies/${movie.id}`,
          createMovieRequest
        );
        alert("Sửa thông tin phim thành công", response.data);
        console.log(response.data);
        navigate("/admin");
      }
    } catch (error) {
      alert("Lỗi");
    }
  };

  return (
    <div className="container-addmovie">
      <h1>Sửa Thông Tin Phim </h1>
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
          <label>Tải Poster</label>
          <input
            type="file"
            name="filePoster"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Tải Video</label>
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
            {selectedItems && (
              <div>
                {selectedItems.map((item) => (
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

      <button onClick={handleSubmit}>Sửa</button>
    </div>
  );
};
