import React, { useState } from 'react';
import './SearchMovie.scss';
import { movieService } from '../../services';
import PropTypes from 'prop-types';

export default function SearchMovie({ onMovieSelected }) {
  const [keyword, setKeyword] = useState('');
  const [movies, setMovies] = useState([]);

  const handleFindMovie = () => {
    movieService.query({ keyword }).then((response) => {
      setMovies(response.data);
    });
  };

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleFindMovie();
    }
  };

  const handleMovieSelected = (movie) => {
    setMovies([]);
    onMovieSelected?.(movie);
  };

  return (
    <div className="search-movie">
      <div className="search-movie__input-group">
        <input
          type="text"
          placeholder="Nhập tên phim"
          value={keyword}
          onChange={handleChangeKeyword}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleFindMovie}>Tìm</button>
      </div>

      <div className="search-movie__result">
        {movies.map((movie) => (
          <button
            className="search-movie__result-item btn-non-style"
            key={movie.id}
            onClick={() => handleMovieSelected(movie)}
          >
            <div className="search-movie__result-item-wrapper">
              <div className="search-movie__result-item-image">
                <img src={movie.posterUrl} alt={movie.nameMovie} />
              </div>
              <div className="search-movie__result-item-info">
                <span>Name: {movie.nameMovie}</span>
                <span>Country: {movie.country}</span>
                <span>Description: {movie.description}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

SearchMovie.propTypes = {
  onMovieSelected: PropTypes.func,
};
