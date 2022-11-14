import React, { useState } from "react";
import { Player } from 'video-react';
import { v4 as uuidv4 } from 'uuid';

<link rel="stylesheet" href="/css/video-react.css" />

export default function Video({ movie }) {
    const [list, setList] = useState([]);
    const [value, setValue] = useState('');

    const CommentItem = ({ itemValue }) => {
        return <div className="comment_item">
            <div className="content">
                <img src={itemValue.avatar} />
                <div className="content_item">
                    <div className="content_user">
                        <a href="#" className="username">{itemValue.username}</a>
                        <label>{itemValue.comment}</label>
                    </div>
                    <div className="like_comment">
                        <label onClick={() => like(itemValue)}>{itemValue.like ? "Bỏ thích" : "Thích"}</label>
                        <label>Phản hồi</label>
                        {itemValue.like ? <i class="fa-solid fa-thumbs-up"></i> : <></>}
                    </div>
                </div>
            </div>
        </div>
    }

    function add(itemValue) {
        if (itemValue.comment !== '') {
            setList([...list, itemValue])
            setValue('');
        }
    }

    function like(itemValue) {
        var objIndex = list.findIndex((obj => obj.id == itemValue.id));

        var item = list[objIndex];// lay item tu objIndex

        item.like = !item.like;

        setList([...list]);
    }

    const commentValue = (value) =>{
        return { id: uuidv4(), avatar: "/poster/user.jpg", username: "Thai", comment: value, date: new Date(), like: false };
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



            <div className="write_comment">
                <label>Viết comment...</label>
                <div className="push_comment">
                    <input type="text" value={value} placeholder="Nhập comment của bạn" onChange={(e) => setValue(e.target.value)} />
                    <button onClick={() => add(commentValue(value))}>Đăng</button>

                </div>
            </div>

            <div className="comment_list">
                {list.sort((a, b) => -(a.date - b.date)).map((item, index) => {
                    return <CommentItem key={index} itemValue={item} />

                })}
            </div>
            {/* <Player id="Player/2" width="1000" height="600" controls >
                <source src="doibongthieulam.webm" type="Player/mp4">
                </source>
            </Player> */}
        </div>
    )
}