import React, { useRef, useState, useEffect } from 'react';
import Button from './Button';
import './ImageUpload.css';

export default function ImagesUploadEdit(props) {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();
  setFiles(props.initialvalue);

  useEffect(() => {
    if (files.length === 0) {
      return;
    }

    const fileReaders = [];
    const updatedPreviewUrls = [];

    files.forEach((file) => {
      const fileReader = new FileReader();
      fileReaders.push(fileReader);

      fileReader.onload = () => {
        updatedPreviewUrls.push(fileReader.result);

        if (updatedPreviewUrls.length === files.length) {
          setPreviewUrls(updatedPreviewUrls);
        }
      };

      fileReader.readAsDataURL(file);
    });

    // console.log(previewUrls);

    return () => {
      fileReaders.forEach((fileReader) => fileReader.abort());
    };
  }, [files]);

  const pickedHandler = (event) => {
    let pickedFiles;
    const updatedFiles = [];
    const updatedPreviewUrls = [];
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length !== 0) {
      pickedFiles = Array.from(event.target.files);
      // setFiles(pickedFiles);
      // setIsValid(true);
      // fileIsValid = true;
      // }
      // else {
      //   setIsValid(false);
      //   fileIsValid = false;
      // }
      pickedFiles.forEach((pickedFile) => {
        updatedFiles.push(pickedFile);
        const fileReader = new FileReader();
        fileReader.onload = () => {
          updatedPreviewUrls.push(fileReader.result);

          if (updatedPreviewUrls.length === pickedFiles.length) {
            setPreviewUrls(updatedPreviewUrls);
          }
        };

        fileReader.readAsDataURL(pickedFile);
      });

      setFiles(updatedFiles);
      // console.log(previewUrls);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, updatedFiles, fileIsValid);
  };

  const removeImageHandler = (index) => {
    const updatedFiles = [...files];
    console.log(index, updatedFiles);
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    console.log(updatedFiles);
    const updatedPreviewUrls = [...previewUrls];
    updatedPreviewUrls.splice(index, 1);
    setPreviewUrls(updatedPreviewUrls);

    if (updatedFiles.length === 0) {
      setIsValid(false);
      props.onInput(props.id, null, false);
    } else {
      props.onInput(props.id, updatedFiles, true);
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className='form-control'>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type='file'
        accept='.jpg,.jpeg,.png'
        multiple
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload__preview'>
          {previewUrls.map((url, index) => (
            <div key={index} className='image-upload__preview-item'>
              <img src={url} alt='Preview' />
              <button
                type='button'
                className='image-upload__preview-remove'
                onClick={() => removeImageHandler(index)}
              >
                Remove
              </button>
            </div>
          ))}
          {previewUrls.length === 0 && <p>Please pick an image.</p>}
        </div>
        <Button type='button' onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
        {!isValid && <p>{props.errorText}</p>}
      </div>
    </div>
  );
}
