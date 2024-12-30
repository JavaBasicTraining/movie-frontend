import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './MovieCard.scss';

export const MovieCard = (props) => {
  const { movie } = props;
  return (
    <Link to={`/${movie.path}`}>
      <div className="MovieCard" key={movie.id}>
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
      </div>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.object,
};
