import React from 'react';
import './message.css';
const Message = ({ color, message }) => {
  return (
    <div className='message' style={{ color: color }}>
      {message}
    </div>
  );
};
export default Message;
