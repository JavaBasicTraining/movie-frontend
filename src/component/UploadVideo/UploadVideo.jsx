import React from 'react';
import { Button, Space, Upload } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import './UploadVideo.scss';

export const UploadVideo = (props) => {
  const { label = 'Upload Video', value, onChange } = props;

  const handleChange = (info) => {
    onChange?.(info.fileList);
  };

  const getUrl = (file) => {
    if (file.url) {
      return file.url;
    }
    if (file.originFileObj) {
      return URL.createObjectURL(file.originFileObj);
    }
    return '';
  };

  const itemRender = (originNode, file, fileList, actions) => {
    return (
      <Space direction="vertical" className="upload-item">
        <ReactPlayer url={getUrl(file)} controls={true} width='100%'/>
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
      fileList={value}
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
  value: PropTypes.object,
  onChange: PropTypes.func,
};
