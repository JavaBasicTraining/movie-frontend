import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { MovieItem } from './MovieItem/MovieItem';
import './MovieListSection.scss';

export const MovieListSection = (props) => {
  const { title, movies, autoScroll = false } = props;
  const movieListRef = useRef();
  const [stopAuto, setStopAuto] = useState(false);
  const scrollIntervalRef = useRef(null);

  const handleAutoScroll = useCallback(() => {
    if (!autoScroll) {
      return;
    }
    scrollIntervalRef.current = setInterval(() => {
      if (movieListRef.current && !stopAuto) {
        const maxScrollLeft =
          movieListRef.current.scrollWidth - movieListRef.current.clientWidth;
        if (movieListRef.current.scrollLeft >= maxScrollLeft) {
          scrollTo(0, true);
        } else {
          scrollTo(120);
        }
      }
    }, 2000);
  }, [autoScroll, stopAuto]);

  useLayoutEffect(() => {
    handleAutoScroll();
    return () => {
      clearInterval(scrollIntervalRef.current);
    };
  }, [handleAutoScroll]);

  const handleChevronLeftClick = () => {
    scrollTo(-120);
    stopAutomation();
  };

  const handleChevronRightClick = () => {
    scrollTo(120);
    stopAutomation();
  };

  const stopAutomation = () => {
    setStopAuto(true);
    setTimeout(() => {
      setStopAuto(false);
    }, 3000);
  };

  const scrollTo = (pixels, force = false) => {
    movieListRef.current?.scrollTo({
      left: force ? pixels : movieListRef.current.scrollLeft + pixels,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {movies && movies.length > 0 && (
        <Flex className="MovieListSection" vertical gap={10}>
          <Flex justify="space-between" align="center">
            <span className="MovieListSection__title f-title">{title}</span>
            <Flex gap={20}>
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faChevronLeft}
                onClick={handleChevronLeftClick}
              />
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faChevronRight}
                onClick={handleChevronRightClick}
              />
            </Flex>
          </Flex>

          <Flex style={{ minWidth: '100%' }}>
            <Flex
              ref={movieListRef}
              justify="flex-start"
              className="MovieListSection__movies"
            >
              <>
                {movies.map((movie) => (
                  <MovieItem key={movie.id} movie={movie} />
                ))}
              </>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};

MovieListSection.propTypes = {
  title: PropTypes.string,
  movies: PropTypes.array,
  autoScroll: PropTypes.bool,
};
