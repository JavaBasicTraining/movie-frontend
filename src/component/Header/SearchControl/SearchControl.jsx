import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './SearchControl.scss';

export const SearchControl = () => {
  return (
    <div className="SearchControl">
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      <input className='SearchControl__input' placeholder="Search"/>
    </div>
  );
};
