import './App.css';
import React, { useState, useCallback } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Home from './posts/pages/Home';
import Posts from './posts/pages/Posts';
import NewPost from './posts/pages/NewPost';
import UpdatePost from './posts/pages/UpdatePost';
import UserPosts from './posts/pages/UserPosts';
import PostDetail from './posts/pages/PostDetail';
import Auth from './users/pages/Auth';
import { AuthContext } from './shared/contexts/auth-context';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();
  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:userId/posts' element={<UserPosts />} />
          <Route path='/allposts' element={<Posts />} />
          <Route path='/posts/new' element={<NewPost />} />
          <Route path='/posts/edit/:postId' element={<UpdatePost />} />
          <Route path='/posts/:postId' element={<PostDetail />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </>
    );
  } else {
    routes = (
      <>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:userId/posts' element={<UserPosts />} />
          <Route path='/allposts' element={<Posts />} />
          <Route path='/posts/:postId' element={<PostDetail />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='*' element={<Navigate to='/auth' />} />
        </Routes>
      </>
    );
  }

  return (
    <div className='App'>
      <AuthContext.Provider
        value={{
          isLoggedIn: isLoggedIn,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <BrowserRouter>
          <MainNavigation />
          <main>{routes}</main>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
