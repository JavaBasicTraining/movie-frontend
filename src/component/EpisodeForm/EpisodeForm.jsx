import { DeleteOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, Space } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { UploadPoster } from '../UploadPoster/UploadPoster';
import { UploadVideo } from '../UploadVideo/UploadVideo';
import { fileUtil, validatorUtil } from '../../utils';
import './EpisodeForm.scss';

export const EpisodeForm = ({ field, remove }) => {
  const { key, name, fieldKey, ...restField } = field;

  return (
    <Space className="EpisodeForm" direction="vertical">
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
        getValueFromEvent={fileUtil.getFileFromEvent}
        valuePropName="fileList"
        rules={[
          { required: true, message: 'Please input poster!' },
          {
            validator: (_, value) =>
              validatorUtil.validateFileType(value, 'image/'),
            message: 'Please input an image',
          },
        ]}
      >
        <UploadPoster />
      </Form.Item>

      <Form.Item
        {...restField}
        label="Upload Video"
        name={[name, 'videoFile']}
        getValueFromEvent={fileUtil.getFileFromEvent}
        valuePropName="fileList"
        rules={[{ required: true, message: 'Please input poster!' }]}
      >
        <UploadVideo />
      </Form.Item>

      <DeleteOutlined
        className="EpisodeForm__remove-btn"
        onClick={() => remove(name)}
      />
    </Space>
  );
};

EpisodeForm.propTypes = {
  field: PropTypes.object,
  remove: PropTypes.func,
};
