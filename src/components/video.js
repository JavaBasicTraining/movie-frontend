import React, { useState } from "react";
import { Player } from 'video-react';
<link rel="stylesheet" href="/css/video-react.css" />

export default function Video({ movie }) {
    const [list, setList] = useState([]);
    const [value, setValue] = useState('');

    const Item = ({ itemValue }) => {
        return <div className="comment_item">
            <img src={itemValue.avatar} />
            <a href="#">{itemValue.username}</a>
            <label>{itemValue.comment}</label>
        </div>
    }

    function add(itemValue) {
        setList([...list, itemValue])
    }

    return (
        <div className="video_editor">
            <Player
                playsInline
                poster={movie.posterSource}
                src={movie.videoSource}
            />
            <div className="body">
                <label >{movie.title}</label>
                <span>Từ Khóa</span>
                <p className="description">{movie.description}</p>
            </div>


            <div className="comment">
                <img src="/poster/user.jpg" />
                <a href="#"> Trần Quốc Thái</a>
                <label> Hay Tuyệt!!! Cho m 5 sao</label>
            </div>
            <div className="write_comment">
                <input type="text" placeholder="Nhập comment của bạn" onChange={(e) => setValue(e.target.value)} />
                <button onClick={() => add({ avatar: "/poster/user.jpg", username: "thai", comment: value })}>Đăng</button>

            </div>
            {list.map((item, index) => {
                return <Item key={index} itemValue={item} />
            })}
            {/* <Player id="Player/2" width="1000" height="600" controls >
                <source src="doibongthieulam.webm" type="Player/mp4">
                </source>
            </Player> */}
        </div>
    )
}