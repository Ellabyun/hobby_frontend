import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ImagesUpload from '../../shared/components/FormElements/ImagesUpload';
import { VALIDATOR_MINLENGTH } from '../../shared/Util/validators';
import './NewPost.css';
import './PostForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/contexts/auth-context';

export default function NewPost() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      comment: { value: '', isValid: false },
      images: [{ value: null, isValid: false }],
    },
    false
  );

  const navigate = useNavigate();

  const postSubmithandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      // console.log(formState.inputs.images.value[2]);
      for (let i = 0; i < formState.inputs.images.value.length; i++) {
        formData.append('images', formState.inputs.images.value[i]);
      }
      // formData.append('images', formState.inputs.images.value);
      formData.append('comment', formState.inputs.comment.value);
      formData.append('creator', auth.userId);
      await sendRequest('http://localhost:5000/api/posts', 'POST', formData, {
        Authorization: 'Bearer ' + auth.token,
      });
      //Redirect the user to a different page
      navigate('/');
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form
        className='post-form'
        onSubmit={postSubmithandler}
        // enctype='multipart/form-data'
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <ImagesUpload id='images' onInput={inputHandler} center />
        <Input
          id='comment'
          element='textarea'
          type='text'
          label='comment'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter valid comment(at least 5 characters).'
          onInput={inputHandler}
        />
        <Button type='submit' disabled={!formState.isValid}>
          자랑하기
        </Button>
      </form>
    </>
  );
}
