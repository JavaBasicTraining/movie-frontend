import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {Player} from "video-react";
import movieConfig from "../config/movie-config.json";
import {useParams} from "react-router-dom";

export default function Video() {
  const {id} = useParams();
  const [movie, setMovie] = useState({
    title: undefined,
    posterSource: undefined,
    videoSource: undefined,
    description: undefined,
  });
  const [list, setList] = useState([]);
  const [value, setValue] = useState("");

  function add(itemValue) {
    if (itemValue.comment !== "") {
      setList([...list, itemValue]);
      setValue("");
    }
  }

  const commentValue = (value) => {
    return {
      id: uuidv4(),
      avatar: "/poster/user.jpg",
      username: "Thai",
      comment: value,
      date: new Date(),
      like: false,
    };
  };

  function like(itemValue) {
    let objIndex = list.findIndex((obj) => obj.id === itemValue.id);

    let item = list[objIndex]; // lay item tu objIndex

    item.like = !item.like;

    setList([...list]);
  }

  useEffect(() => {
    const movieFinding = movieConfig.data.find(item => item.id === parseInt(id))
    setMovie(movieFinding);
  }, [id]);

  return (
    <>
      {movie && (
        <div className="video_editor">
          <Player
            playsInline
            poster={movie.posterSource}
            src={movie.videoSource}
          />
          <div className="body">
            <label>{movie.title}</label>
            <span>Từ Khóa</span>
            <p className="description">{movie.description}</p>
          </div>

          <div className="write_comment">
            <span>Viết comment...</span>
            <div className="push_comment">
              <input
                type="text"
                value={value}
                placeholder="Nhập comment của bạn"
                onChange={(e) => setValue(e.target.value)}
              />
              <button onClick={() => add(commentValue(value))}>Đăng</button>
            </div>
          </div>

          <div className="comment__list">
            {
              Array.of(list)
                .sort((a, b) => -(a.date - b.date))
                .map((item, index) => {
                  return <CommentItem key={index} itemValue={item} like={like}/>;
                })
            }
          </div>
        </div>
      )}
    </>
  );
}

const CommentItem = ({itemValue, like}) => {
  return (
    <div className="comment__item">
      <div className="comment__content">
        <img src={itemValue.avatar} alt=""/>
        <div className="content_item">
          <div className="content_user">
            <a href="/" className="username">
              {itemValue.username}
            </a>
            <label>{itemValue.comment}</label>
          </div>

          <div className="like_comment">
            <button onClick={() => like(itemValue)}>
              {itemValue.like ? "Bỏ thích" : "Thích"}
            </button>
            <span>Phản hồi</span>
            {itemValue.like ? <i className="fa-solid fa-thumbs-up"></i> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  itemValue: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
};
