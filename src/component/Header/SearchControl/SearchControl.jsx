import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './SearchControl.scss';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';

export const SearchControl = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValueDebounced = useDebouncedCallback((value) => {
    updateSearchParams(value);
  }, 500);
  const [value, setValue] = useState(searchParams.get('keyword') || '');

  const updateSearchParams = (value) => {
    const params = new URLSearchParams(searchParams);
    if (!value || value === '') {
      params.delete('keyword');
    } else {
      params.set('keyword', value);
    }
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    searchValueDebounced(e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className="SearchControl">
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      <input
        className="SearchControl__input"
        placeholder="Search"
        value={value}
        onInput={handleSearch}
      />
    </div>
  );
};
