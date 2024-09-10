import React, { useEffect } from 'react';
import './ImagePreview.scss';

function ImagePreview(props) {
  const { preview } = props;
  const imageRef = React.useRef();

  useEffect(() => {
    updateImageHeight();
    window.addEventListener('resize', updateImageHeight);
    return () => {
      window.removeEventListener('resize', updateImageHeight);
    };
  }, []);

  useEffect(() => {
    updateImageHeight();
  }, [preview]);

  const updateImageHeight = () => {
    if (imageRef.current) {
      const imageWidth = imageRef.current['clientWidth'];
      imageRef.current['style'].height =
        imageWidth !== 0 ? `${Math.round((imageWidth * 4) / 3)}px` : 'auto';
    }
  };

  return (
    <div className="ImagePreview">
      <img
        ref={imageRef}
        className="ImagePreview__img"
        src={preview.value}
        alt={'view-source'}
      />
    </div>
  );
}

export default ImagePreview;
