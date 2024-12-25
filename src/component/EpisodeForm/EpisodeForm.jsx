import { MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, Space } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { UploadPoster } from '../UploadPoster/UploadPoster';
import { UploadVideo } from '../UploadVideo/UploadVideo';
import './EpisodeForm.scss';

export const EpisodeForm = ({ field, remove }) => {
  const { key, name, fieldKey, ...restField } = field;

  return (
    <Space className="episode-form" direction="vertical">
      <Form.Item
        {...restField}
        label="Episode Count"
        name={[name, 'episodeCount']}
        rules={[{ required: true, message: 'Please input episode count!' }]}
      >
        <InputNumber placeholder="Input episode count" min={1} />
      </Form.Item>

      <Form.Item
        {...restField}
        label="Description"
        name={[name, 'descriptions']}
        rules={[{ required: true, message: 'Please input description!' }]}
      >
        <Input.TextArea placeholder="Input description" />
      </Form.Item>

      <Form.Item
        {...restField}
        label="Upload Poster"
        name={[name, 'posterFile']}
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
        valuePropName="fileList"
        rules={[{ required: true, message: 'Please input poster!' }]}
      >
        <UploadPoster />
      </Form.Item>

      <Form.Item
        {...restField}
        label="Upload Video"
        name={[name, 'videoFile']}
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
        valuePropName="fileList"
        rules={[{ required: true, message: 'Please input poster!' }]}
      >
        <UploadVideo />
      </Form.Item>

      <MinusCircleOutlined onClick={() => remove(name)} />
    </Space>
  );
};

EpisodeForm.propTypes = {
  field: PropTypes.object,
  remove: PropTypes.func,
};
