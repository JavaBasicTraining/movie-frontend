import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../API/axiosConfig';
import { Link } from 'react-router-dom';

export const Page = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        
        const response = await axiosInstance.get(`/api/v1/movies`);
        setMovies(response.data);
      } catch (error) {
        console.error('Failed to fetch movies', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="page-container">
      
      <div className="nav-category">
        <h>Phim Đề Cử</h>
        <div class="article-item">
          {movies.map((item) => (
            
            <Link to={`/${item.nameMovie}`} className="list-item-page">
            <img key={item.id} src={item.posterUrl} alt={item.title} />
              <span>{item.nameMovie}</span>
              <span>{item.enTitle}</span>

            </Link>
          ))}
        </div>
      </div>

      <div className="nav-category">
        <h>Phim Lẻ Mới Cập Nhật</h>
        <div class="article-item">
          {movies.map((item) => (
            <Link to={`/${item.nameMovie}`} className="list-item-page">
             <img key={item.id} src={item.posterUrl} alt={item.title} />
            <span>{item.nameMovie}</span>
            <span>{item.enTitle}</span>


            </Link>
          ))}
        </div>
      </div>
      <div className="nav-category">
        <h>Phim Bộ Mới Cập Nhật</h>
        <div class="article-item">
          {movies.map((item) => (
            <Link to={`/${item.nameMovie}`} className="list-item-page">
          <img key={item.id} src={item.posterUrl} alt={item.title} />
            <span>{item.nameMovie}</span>
            <span>{item.enTitle}</span>

            </Link>
          ))}
        </div>
      </div>

      <div className="nav-category">
        <h>Phim Hoạt Hình</h>
        <div class="article-item">
          {movies.map((item) => (
            <Link to={`/${item.nameMovie}`} className="list-item-page">
               <img key={item.id} src={item.posterUrl} alt={item.title} />
               <span>{item.nameMovie}</span>
               <span>{item.enTitle}</span>

            </Link>
          ))}
        </div>
      </div>
      <span>
        Contact Info: Liên hệ ngay All content of this website is collected from
        official video websites on the Internet, and does not provide genuine
        streaming. If your rights are violated, please notify us, we will remove
        the infringing content in time, thank you for your cooperation! All
        advertising on the web is the personal opinion of the customer, not
        related to our website. Please consider and take responsibility for your
        own choices. Happy moviegoers!
      </span>
    </div>
  );
};
