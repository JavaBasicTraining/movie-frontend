import { Link, Outlet } from "react-router-dom";
import btnAdminjson from "../config/btn-admin-config.json";
import { ListMovie } from "./addPhim/ListMovie";

export const Admin = () => {
  const renderListBtn = () => {
    return btnAdminjson["data"].map((value, index) => {
      if (value.link === "Danh Sách Phim") {
        <Link to={`/list`}>
          <ul>{<ListMovie />}</ul>
        </Link>;
      }
      return (
        <Link key={index} to={value.link}>
          <button>{value.title}</button>
        </Link>
      );
    });
  };

  return (
    <div className="admin-container">
      <div className="header">
        <div className="title">
          <h1>Welcom to Admin TrumPhim.Net</h1>
        </div>
        <div className="list-btn">{renderListBtn()}</div>
        <Outlet/>
      </div>
      <div>
      </div>
    </div>
  );
};
