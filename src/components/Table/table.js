import React from 'react';
import './table.css';
const Table = ({ ocrResult }) => {
  return (
    <div className='c-table'>
      <h2>Extracted Data:</h2>
      <table className='table-dark table-striped-columns table-hover'>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(ocrResult).map((item, i) => (
            <tr className='travelcompany-input' key={i}>
              <td>{item}</td>
              <td>{ocrResult[item]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
