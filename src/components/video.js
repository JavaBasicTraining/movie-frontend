import React, { useState } from "react";
import { Player } from "video-react";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

export default function Video({ movie }) {
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

  return (
    <div className="video_editor">
      <Player playsInline poster={movie.posterSource} src={movie.videoSource} />
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

      <div className="comment_list">
        {Array.of(list)
          .sort((a, b) => -(a.date - b.date))
          .map((item, index) => {
            return (
              <CommentItem
                key={index}
                itemValue={item}
                like={like}
              />
            );
          })}
      </div>
      {/* <Player id="Player/2" width="1000" height="600" controls >
                <source src="doibongthieulam.webm" type="Player/mp4">
                </source>
            </Player> */}
    </div>
  );
}

Video.propTypes = {
  movie: PropTypes.object.isRequired,
};

const CommentItem = ({ itemValue, like }) => {
  return (
    <div className="comment_item">
      <div className="content">
        <img src={itemValue.avatar} alt="" />
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
