import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostItem.css';
import Card from '../../shared/components/UIElement/Card';
import Avatar from '../../shared/components/UIElement/Avatar';

export default function PostItem(props) {
  const navigate = useNavigate();
  return (
    <li
      className='post-item'
      key={props.id}
      onClick={() => {
        navigate(`/posts/${props.id}`, { state: { post: props.post } });
      }}
    >
      <Card className='post-item__card'>
        <img src={props.images[0].url} alt={props.id} />
        <Avatar
          className='post-item__nametag'
          image={props.avatar.url}
          username={props.username}
          userId={props.userid.avatar}
          width='65px'
          height='65px'
        />
      </Card>
    </li>
  );
}
