import React from "react";

const ImageViewer = ({ url }) => {
  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
        <img
          src={url}
          alt="Personal Pic from AWS S3"
          className="w-full h-auto rounded-lg shadow-md transition-opacity duration-300"
        />
      </div>
    </div>
  );
};

export default ImageViewer;
