import React from 'react';

const ImageViewer = ({ url }) => {
  return (
    <div className="image-container">
      <img src={url} alt="Personal Pic from AWS S3" />
      <div className="image-caption">Extracted from AWS S3</div>
    </div>
  );
};

export default ImageViewer;
