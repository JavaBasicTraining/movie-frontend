import Search from "antd/lib/input/Search";
import "./App.scss";
import Filter from "./components/filter";
import Navbar from "./components/navbar";
import { PosterCarousel } from "./components/poster-carousel ";
import Group from "./components/poster-group";
import { PosterList } from "./components/poster-list";
import movieConfig from "./config/movie-config.json";
import { Routes, Route } from "react-router-dom";
import Video from "./components/video";

function App() {
  return (
    <div className="app">
      <div className="header">
        <div className="title">
          <span>PhimHay.Net</span>
          <Search
            className="search"
            placeholder="Tìm:tên phim, đạo diễn, diễn viên"
            enterButton
          />
        </div>
        <Navbar />
        <Filter />

        {/* <PosterScroll /> */}
        {/* <MovieTheater/> */}

        <div className="body">
          <Routes>
            <Route
              path="/"
              element={
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Group title={"Phim Đề Cử"} content={<PosterCarousel />} />
                  <Group
                    title={"Phim Chiếu Rạp"}
                    content={<PosterList posters={movieConfig.data} />}
                  />
                </div>
              }
            />
            <Route path="/video/:id" element={<Video />} />
          </Routes>
        </div>
      </div>

      <div className="footer"></div>
    </div>
  );
}

export default App;
