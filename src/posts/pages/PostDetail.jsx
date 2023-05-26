import React, { useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/UIElement/Card';
import Avatar from '../../shared/components/UIElement/Avatar';
import AppCarousel from '../components/AppCarousel';
import './PostDetail.css';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElement/Modal';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import { AuthContext } from '../../shared/contexts/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

export default function PostDetail() {
  const {
    state: {
      post: { id, images, comment, creator },
    },
  } = useLocation();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const postId = useParams().postId;
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const navigate = useNavigate();
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        'http://localhost:5000/api/posts/' + postId,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      navigate('/');
    } catch (err) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Delete Confirmation'
        footerClass='place-item__modal-actions'
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              취소
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              삭제
            </Button>
          </>
        }
      >
        <p>포스트를 지우시면 복구할 수 없습니다. 지우시겠습니까?</p>
      </Modal>

      <Card className='post-detail__container'>
        {isLoading && <LoadingSpinner asOverlay />}

        <Avatar
          className='post-detail__nametag'
          image={creator.avatar.url}
          username={creator.name}
          userId={id}
          width='65px'
          height='65px'
        />

        <AppCarousel slides={images} />
        <p>{comment}</p>

        {auth.userId === creator.id && (
          <div className='post-detail__actions'>
            <Button to={`/posts/edit/${id}`}>EDIT</Button>
            <Button danger onClick={showDeleteWarningHandler}>
              DELETE
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}
