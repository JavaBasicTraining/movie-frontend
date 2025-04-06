import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Space, Upload } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import ReactPlayer from 'react-player';
import './UploadVideo.scss';
import { fileUtil } from '../../utils';

export const UploadVideo = (props) => {
  const { label = 'Upload Video', fileList, onChange } = props;

  const handleChange = (info) => {
    onChange?.(info.fileList);
  };

  const itemRender = (originNode, file, fileList, actions) => {
    return (
      <Space direction="vertical" className="upload-item">
        <ReactPlayer url={fileUtil.getUrl(file)} controls={true} width="100%" />
        <Button
          className="upload-item__remove-btn"
          onClick={actions.remove}
          danger
          size="small"
        >
          <DeleteOutlined />
        </Button>
      </Space>
    );
  };

  return (
    <Upload
      className="UploadVideo"
      fileList={fileList}
      onChange={handleChange}
      beforeUpload={() => false}
      itemRender={itemRender}
      listType="picture"
      maxCount={1}
      accept="video/*"
    >
      <Button icon={<UploadOutlined />}>{label}</Button>
    </Upload>
  );
};

UploadVideo.propTypes = {
  label: PropTypes.string,
  fileList: PropTypes.array,
  onChange: PropTypes.func,
};
