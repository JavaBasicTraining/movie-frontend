// import React, { useEffect, useState } from "react";
// import { useLoaderData, useNavigate } from "react-router-dom";
// import { axiosInstance } from "../../API/axiosConfig";
// import qs from "qs";

// export async function UpdateMovieLoader({ params }) {
//   const res = await axiosInstance.get(`/api/v1/admin/movies/${params.id}`);

//   return {
//     movie: res.data,
//   };
// }

// const getListCate = async () => {
//   const nameCategory = await axiosInstance.get(`/api/v1/category/getList`);
//   return nameCategory.data;
// };

// export const UpdateMovie = () => {
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [idCategory, setIdCategory] = useState(""); // State để lưu trữ idCategory được chọn

//   const { movie } = useLoaderData();
//   const navigate = useNavigate();
//   const [data, setData] = useState({
//     name: "",
//     posterUrl: "",
//     videoUrl: "",
//     viTitle: "",
//     enTitle: "",
//     description: "",
//     idCategory: "", // Khởi tạo idCategory trong state data
//     nameCategory: [],
//   });

//   const handleSelectItem = (category) => {
//     setIdCategory(category.id); // Cập nhật idCategory khi chọn thể loại
//     setSelectedItems([...selectedItems, category]);
//     const request = {
//       excludeIds: [...selectedItems.map((item) => item.id), category.id],
//     };
//     fetchCategories(request);
//   };

//   const handleRemoveItem = (itemToRemove) => {
//     const filtered = selectedItems.filter((item) => item.id !== itemToRemove.id);
//     setSelectedItems(filtered);

//     const request = {
//       excludeIds: [...filtered.map((item) => item.id)],
//     };
//     fetchCategories(request);
//   };

//   useEffect(() => {
//     setData(movie);
//     fetchCategories();
//   }, [movie]);

//   const fetchCategories = (params) => {
//     axiosInstance
//       .get(`/api/v1/categories`, {
//         params,
//         paramsSerializer: (params) => {
//           return qs.stringify(params);
//         },
//       })
//       .then((res) => {
//         setSuggestions(res.data ?? []);
//       })
//       .catch((error) => {
//         console.error("Lỗi khi lấy danh sách thể loại:", error);
//       });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData({
//       ...data,
//       [name]: value,
//     });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setData({
//       ...data,
//       [name]: files[0],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("viTitle", data.viTitle);
//       formData.append("enTitle", data.enTitle);
//       formData.append("description", data.description);
//       formData.append("posterUrl", data.posterUrl);
//       formData.append("videoUrl", data.videoUrl);
//       formData.append("idCategory", parseInt(idCategory)); // Sử dụng idCategory từ state

//       const response = await axiosInstance.put(
//         `/api/v1/admin/movies/${movie.id}`,
//         formData
//       );
//       alert("Sửa thông tin phim thành công");
//       navigate("/admin");
//     } catch (error) {
//       alert("Lỗi khi sửa thông tin phim");
//       console.error("Lỗi:", error);
//     }
//   };

//   return (
//     <div className="container-addmovie">
//       <h1>Sửa Thông Tin Phim</h1>
//       <div className="form-addmovie">
//         <div className="selectedInputForm">
//           <label>Nhập Tên Phim</label>
//           <input
//             type="text"
//             name="name"
//             value={data.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="selectedInputForm">
//           <label>Tải Poster</label>
//           <input
//             type="file"
//             name="posterUrl"
//             onChange={handleFileChange}
//             required
//           />
//         </div>
//         <div className="selectedInputForm">
//           <label>Tải Video</label>
//           <input
//             type="file"
//             name="videoUrl"
//             onChange={handleFileChange}
//             required
//           />
//         </div>
//         <div className="selectedInputForm">
//           <label>Nhập Tên Phim Tiếng Việt</label>
//           <input
//             type="text"
//             name="viTitle"
//             value={data.viTitle}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="selectedInputForm">
//           <label>Nhập Tên Phim Tiếng Anh</label>
//           <input
//             type="text"
//             name="enTitle"
//             value={data.enTitle}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="selectedInputForm">
//           <label>Nhập Mô Tả Phim</label>
//           <input
//             type="text"
//             name="description"
//             value={data.description}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="selectedInputForm">
//           <label>Nhập Thể Loại</label>
//           <div>
//             {/* Các mục đã chọn */}
//             {selectedItems && (
//               <div>
//                 {selectedItems.map((item) => (
//                   <button key={item.id} onClick={() => handleRemoveItem(item)}>
//                     <span>{item.name}</span>
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Đề xuất thể loại */}
//             {suggestions && (
//               <div>
//                 {suggestions.map((category) => (
//                   <button
//                     key={category.id}
//                     onClick={() => handleSelectItem(category)}
//                   >
//                     <span>{category.name}</span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <button onClick={handleSubmit}>Sửa</button>
//     </div>
//   );
// };
