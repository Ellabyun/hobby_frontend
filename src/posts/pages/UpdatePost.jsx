import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { BsFillTrashFill } from 'react-icons/bs';
import { VALIDATOR_MINLENGTH } from '../../shared/Util/validators';
import './PostForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import { AuthContext } from '../../shared/contexts/auth-context';
import ImagesUpload from '../../shared/components/FormElements/ImagesUpload';

export default function UpdatePost() {
  const auth = useContext(AuthContext);
  const [loadedPost, setLoadedPost] = useState();
  const [deleteImagesArray, setDeleteImagesArray] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const postId = useParams().postId;
  const navigate = useNavigate();

  const [formState, inputHandler, setFormData] = useForm(
    {
      comment: { value: '', isValid: false },
      images: [{ value: null, isValid: false }],
      deleteImages: { value: [], isValid: true },
    },
    false
  );

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/posts/${postId}`
        );
        setLoadedPost(responseData.post);
        setFormData(
          { comment: { value: responseData.post.comment, isValid: true } },
          {
            images: [
              responseData.post.images.map((i) => ({
                url: { value: i.url, isValid: true },
                filename: { value: i.filename, isValid: true },
              })),
            ],
          },
          true
        );
      } catch (err) {}
    };
    fetchPost();
  }, [sendRequest, postId, setFormData]);

  const handleDeleteImage = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    console.log(value, isChecked);

    if (isChecked) {
      setDeleteImagesArray((prevDeleteImagesArray) => [
        ...prevDeleteImagesArray,
        value,
      ]);
    } else {
      setDeleteImagesArray((prevDeleteImagesArray) =>
        prevDeleteImagesArray.filter((deletedImage) => deletedImage !== value)
      );
    }
  };
  const postUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(deleteImagesArray);

    const formData = new FormData();
    if (formState.inputs.images) {
      for (let i = 0; i < formState.inputs.images.value.length; i++) {
        formData.append('images', formState.inputs.images.value[i]);
      }
    }
    formData.append('comment', formState.inputs.comment.value);
    if (deleteImagesArray.length > 0) {
      for (let i = 0; i < deleteImagesArray.length; i++) {
        formData.append('deleteImages', deleteImagesArray[i]);
      }
    }
    try {
      await sendRequest(
        `http://localhost:5000/api/posts/${postId}`,
        'PATCH',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      navigate(`/${auth.userId}/posts`);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }
  if (!loadedPost && !error) {
    return (
      <div className='center'>
        <h2>Could not find the post!</h2>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPost && (
        <form className='post-form' onSubmit={postUpdateSubmitHandler}>
          <div className='prev-image'>
            {loadedPost.images.map((img, index) => (
              <div className='prev-image__item' key={img.filename}>
                <img src={img.url} alt={img.filename} />
                <div className='prev-image__checkbox'>
                  <label htmlFor={index}>
                    <input
                      type='checkbox'
                      id={index}
                      name='deleteImages'
                      value={img.filename}
                      onChange={handleDeleteImage}
                    />
                    <BsFillTrashFill />
                  </label>
                </div>
              </div>
            ))}
          </div>
          <ImagesUpload id='images' onInput={inputHandler} center edit />
          <Input
            id='comment'
            element='textarea'
            type='text'
            label='comment'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter valid comment(at least 5 characters).'
            onInput={inputHandler}
            initialValue={loadedPost.comment}
            initialValid={true}
          />
          <Button
            type='submit'
            disabled={
              !formState.isValid ||
              deleteImagesArray.length === loadedPost.images.length
            }
          >
            UPDATE POST
          </Button>
        </form>
      )}
    </>
  );
}
