import React from 'react';
import navData from '../../assets/navbarData.json';
import NavItem from "./NavItem";
import "../../styles/navbar.css";

export type NavItemType = {
  label: string;
  slug?: string;
  children: NavItemType[];
}

const Navbar = () => {
  const data = navData as NavItemType[];
  return (
    <nav className="d-flex gap-2 align-items-center Navbar">
      {data.map(item => <NavItem item={item}/>)}
    </nav>
  );
};

export default Navbar;
