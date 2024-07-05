import { useLoaderData } from "react-router-dom";
import { axiosInstance } from "../../API/axiosConfig";
import { useEffect } from "react";
export async function DeleteMovieLoader({ params }) {
  const res = await axiosInstance.delete(`/api/v1/admin/movies/${params.id}`);
  
  return {
    
    movie: res.data,
    
  };
}    

export const RemoveMovie = () => {
  const { movie } = useLoaderData();

  useEffect(() => {
    
    const fetchMovies = async () => {
      try {
        await axiosInstance.delete(`/api/v1/admin/movies/${movie.id}`);
        alert("Xóa thành công");
  
      } catch (error) {
        alert(`Lỗi khi xóa phim: ${error.message}`);
      }
    };

    fetchMovies(); 
  }, [movie.id]); 

  return (
    <div>
      {/* Các phần tử khác trong giao diện */}
    </div>
  );
};
