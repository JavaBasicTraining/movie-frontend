import React from 'react';
import { SearchControl } from './SearchControl/SearchControl';
import { UserControl } from './UserControl/UserControl';
import './Header.scss';

export const Header = () => {
  return (
    <header className="Header">
      <div className='Header__search-container'>
        <SearchControl />
      </div>
      <UserControl />
    </header>
  );
};
