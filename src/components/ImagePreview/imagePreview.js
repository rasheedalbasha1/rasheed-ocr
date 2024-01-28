import React from 'react';
import './imagePreview.css';
const ImagePerview = ({ image, waite }) => {
  return (
    <div className={`box ${waite && 'scaning'}`}>
      <img className='img-preview' src={image} alt='Selected' />
    </div>
  );
};
export default ImagePerview;
