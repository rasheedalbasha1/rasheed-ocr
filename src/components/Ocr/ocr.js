import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './ocr.css';
import Tesseract from 'tesseract.js';
import Table from '../Table/table';
import Message from '../Message/message';
import Downloadable from '../Downloadable/downloadable';
import ImagePerview from '../ImagePreview/imagePreview';
import demo1 from '../../assets/images/demo1.jpg';
import demo2 from '../../assets/images/demo2.jpg';
const Ocr = () => {
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState({});
  const [error, setError] = useState(null);
  const [waite, setWaite] = useState(null);
  const partsImageToGray = (file) => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const width = img.width;
        const height = img.height;

        canvas.width = width;
        canvas.height = height;

        var P0W_start = img.width / 3;
        var P0H_start = height / 5;
        var POH_end = height / 5;

        // Draw the image on the canvas
        ctx.drawImage(
          img,
          P0W_start,
          P0H_start,
          width,
          POH_end * 3,
          P0W_start,
          0,
          width,
          height
        );

        // Convert the image to grayscale
        const imageData = ctx.getImageData(0, 0, width, height);
        //const data = imageData.data;

        ctx.putImageData(imageData, 0, 0);
        console.log(P0W_start * 2);

        ctx.rect(P0W_start * 2.1, P0H_start, 200, height);
        ctx.fill();

        // Convert the canvas content to a Blob
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    const filteredImage = await partsImageToGray(file, 800, 600);
    setWaite(true);
    setImage(URL.createObjectURL(file));
    performOCR(filteredImage);
    // eslint-disable-next-line
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
    },
    onDrop,
  });

  // eslint-disable-next-line
  const cleanText = (rawText) => rawText.replace(/\n/g, '');
  const removeSpecialCharacters = (inputString) => {
    const regex = /[-=]/g;
    return inputString.replace(regex, '');
  };
  const performOCR = (file) => {
    Tesseract.recognize(file, 'eng', { logger: (info) => console.log(info) })
      .then(({ data: { text } }) => {
        //const cleanedText = cleanText(text);
        const extractedData = extractIDCardDataWithoutRegex(text);

        setOcrResult(extractedData);
      })
      .catch((err) => {
        setError(err.message);
      });
  };
  const extractIDCardDataWithoutRegex = (rawText) => {
    let surname = '';
    let name = '';
    let documentNo = '';
    let nationality = '';
    let sex = '';
    let dateOfBirth = '';
    let dateOfIssue = '';
    let dateOfExpiry = '';

    const lines = rawText.split(/\n/);

    if (lines[0].includes(' ')) {
      let parts = lines[0].split(' ').map((part) => part.trim());
      documentNo = parts[1];
    } else {
      documentNo = removeSpecialCharacters(lines[0]);
    }

    surname = removeSpecialCharacters(lines[1]) ?? '';
    name = removeSpecialCharacters(lines[2]) ?? '';
    if (lines[3].includes(' ')) {
      let parts = lines[3].split(' ').map((part) => part.trim());
      nationality = removeSpecialCharacters(parts[1]) ?? '';
      sex = removeSpecialCharacters(parts[0]) ?? '';
    }

    dateOfBirth = lines[4] ?? '';
    dateOfIssue = lines[5] ?? '';
    dateOfExpiry = lines[6] ?? '';
    setWaite(null);
    return {
      surname: surname,
      documentNo: documentNo,
      name: name,
      nationality: nationality,
      sex: sex,
      dateOfBirth: dateOfBirth,
      dateOfIssue: dateOfIssue,
      dateOfExpiry: dateOfExpiry,
    };
  };
  return (
    <div className='container ocr-container'>
      <div className='download-demo'>
        <Downloadable link={demo1} text={'Download ID card demo (1)'} />
        <Downloadable link={demo2} text={'Download ID card demo (2)'} />
      </div>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p>Drag & drop an ID card image here, or click to select one</p>
      </div>
      {image && <ImagePerview image={image} waite={waite} />}
      {waite && <Message color={'#fff'} message={'Please waite'} />}
      {error && <Message color={'red'} message={error} />}
      {Object.keys(ocrResult).length > 0 && waite == null && (
        <Table ocrResult={ocrResult} />
      )}
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  margin: '20px 0',
};

export default Ocr;
