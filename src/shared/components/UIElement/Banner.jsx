import React from 'react';
import './Banner.css';

export default function Banner() {
  return (
    <section className='banner__container'>
      <div className='banner__img'></div>
      <div className='banner__title'>
        <h1 className='banner__main'>Share your hobbies</h1>
        <p className='banner__sub'>
          show off what you have done! the world is ready to see!
        </p>
      </div>
    </section>
  );
}
