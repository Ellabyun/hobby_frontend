import React from 'react';
import './PostList.css';
import PostItem from './PostItem';
import Card from '../../shared/components/UIElement/Card';
import Button from '../../shared/components/FormElements/Button';

export default function PostList(props) {
  if (!props.items && props.items.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          <h2>No post found. Maybe create one?</h2>
          <Button to='/posts/new'>Share you Post</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className='post-list__container'>
      {props.items.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          images={post.images}
          comment={post.comment}
          username={post.creator.name}
          userid={post.creator.id}
          avatar={post.creator.avatar}
          post={post}
        />
      ))}
    </ul>
  );
}
