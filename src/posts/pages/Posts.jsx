import React, { useState, useEffect } from 'react';
import PostList from '../components/PostList';
import './Posts.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';

export default function Posts() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPosts, setLoadedPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/posts'
        );
        setLoadedPosts(responseData.posts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <div className='posts__container'>
          <PostList items={loadedPosts} />
        </div>
      )}
    </>
  );
}
