import React, { useState } from 'react';
import { Button } from 'antd';
import './Test.scss';

const Test = () => {
  const [showReply, setShowReply] = useState(false);
  const userName = 'admin';

  return (
    <div className="container-test">
      <div className="list">
        <div className="tree"></div>

        <div className="comment">
          <div className="item">
            <h1>{userName}</h1>
            <span>Oke oke</span>
          </div>
        </div>
      </div>
      <div className="reply">
        {showReply && (
          <div className="reply-container">
            <div className="reply-item">
              <div className="replies">
                <div className="tree-reply"></div>
                <div className="line"></div>

                <div className="item-reply">
                  <h1>{userName}</h1>
                  <span>Oke oke</span>
                </div>
              </div>
              <div className="replies">
                <div className="tree-reply"></div>  
                <div className="line"></div>

                <div className="item-reply">
                  <h1>{userName}</h1>
                  <span>Oke oke</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
      <Button onClick={() => setShowReply(!showReply)}>
        {showReply ? 'Ẩn phản hồi' : 'Hiển thị 5 phản hồi'}
      </Button>
    </div>
  );
};

export default Test;
