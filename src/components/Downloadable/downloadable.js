import React from 'react';
import './downloadable.css';
const Downloadable = ({ link, text }) => {
  return (
    <a href={link} download className='a-downlad'>
      {text}
    </a>
  );
};
export default Downloadable;
