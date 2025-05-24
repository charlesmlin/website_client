import React from 'react';

const ImageViewer = ({ url }) => {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='bg-white rounded-lg shadow-2xl p-6 md:p-8'>
        <div className='relative'>
          <div className='image-container'>
            <img
              src={url}
              alt='Personal Pic from AWS S3'
              className='w-full h-auto rounded-lg shadow-md transition-opacity duration-300'
            />
            <div className='image-caption'>Extracted from AWS S3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
