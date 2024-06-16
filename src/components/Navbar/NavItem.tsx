import React from 'react';
import { NavItemType } from "./Navbar";
import { Link } from "react-router-dom";

const NavItem = ({ item }: { item: NavItemType }) => {
  return <div className="nav-item">
    <div>
      {item.slug && (
        <Link to={item.slug} className="nav-link">
        </Link>
      )}
      <label>{item.label}</label>
    </div>
    {item.children && item.children.length > 0 && (
      <div className="nav-item-sub">
        {item.children.map(sub => <NavItem item={sub}/>)}
      </div>
    )}
  </div>;
};

export default NavItem;
