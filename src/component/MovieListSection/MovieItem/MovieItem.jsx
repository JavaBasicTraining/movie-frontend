import React from 'react';
import PropTypes from 'prop-types';
import './MovieItem.scss';
import { Flex } from 'antd';
import { Link } from 'react-router-dom';

export const MovieItem = ({ movie }) => {
  return (
    <Link to={`/${movie?.path ?? ''}`}>
      <Flex className="MovieItem" gap={5} vertical>
        <img
          className="MovieItem__image"
          src={movie?.posterPresignedUrl}
          alt={movie.name}
        />
        <span className="MovieItem__title f-normal">{movie?.enTitle}</span>
      </Flex>
    </Link>
  );
};

MovieItem.propTypes = {
  movie: PropTypes.object,
};
