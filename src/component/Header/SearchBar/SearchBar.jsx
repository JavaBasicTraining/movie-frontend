import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './SearchBar.scss';

export const SearchBar = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const filterMovie = (event, params) => {
    if (event && event.key === 'Enter') {
      event.preventDefault();
    }
    if (params === '') {
      navigate('/');
    } else if (event.target) {
      navigate(`/filter/${params}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      filterMovie(event, keyword);
    }
  };

  const handleIconClick = () => {
    setExpanded((prevState) => {
      prevState = !prevState;
      if (prevState) {
        inputRef.current?.focus();
      } else {
        inputRef.current?.blur();
      }
      return prevState;
    });
  };

  return (
    <div className="SearchBar">
      <div className={`search-input ${expanded && 'search-input--expanded'}`}>
        {expanded && (
          <button
            className="SearchBar__icon"
            onClick={() => setExpanded(!expanded)}
          >
            <SearchOutlined style={{ fontSize: 20 }} />
          </button>
        )}

        <input
          ref={inputRef}
          placeholder="Phim, diễn viên, thể loại..."
          type="text"
          name="name"
          value={keyword}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          required
        ></input>
      </div>

      {!expanded && (
        <button className="SearchBar__icon" onClick={handleIconClick}>
          <SearchOutlined style={{ fontSize: 20 }} />
        </button>
      )}
    </div>
  );
};
