import navJson from "../config/navbar-config.json";
import {Button, Dropdown, Menu} from "antd";
import "../styles/navbar.scss";

export default function Navbar() {

  const menuItem = (subItems) => {
    return (
      <Menu
        items={subItems.map((value, index) => {
          return {
            key: index,
            label: value,
          };
        })}
      />
    );
  };

  const navbar = () => {
    return navJson["data"].map((value, index) => {
      const menu = menuItem(value['subItems']);
      return (
        <Dropdown
          className="nav_dropdown"
          key={index}
          overlay={menu}
          placement="bottom"
        >
          <Button className="navbar_title">{value.title}</Button>
        </Dropdown>
      );
    });
  };

  return (
    <>
      <div className="navbar">{navbar()}</div>
      <div></div>
      {/* <div className="navbar">
                <button>PHIM CHIẾU RẠP
                </button>
                {listNav()}
            </div>
            <div className="navbar">
                <button>PHIM THUYẾT MINH
                </button>
                {listNav()}
            </div>
            <div className="navbar">
                <button>TRAILER
                </button>
                {listNav()}
            </div> */}
    </>
  );
}
