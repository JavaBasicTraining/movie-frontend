import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './MovieCard.scss';

const defaultMovie = {
  id: undefined,
  nameMovie: undefined,
  enTitle: undefined,
  path: undefined,
  posterPresignedUrl: undefined,
};

export const MovieCard = (props) => {
  const { movie = defaultMovie } = props;
  return (
    <Link className="MovieCard" to={`/${movie.path ?? ''}`}>
      <div className="MovieCard__image-container">
        <img src={movie.posterPresignedUrl} alt="" />
      </div>

      <div className="MovieCard__title">
        <span>{movie.nameMovie}</span>
        <span>{movie.enTitle}</span>
      </div>

      <button className="btn-primary" style={{ width: '100%' }}>
        Watch Now
      </button>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.object,
};
