import React from 'react';
import Carousel from '../../shared/components/UIElement/Carousel';
import './AppCarousel.css';

export default function AppCarousel({ slides }) {
  return (
    <main>
      <div className='carousel-app__container'>
        <Carousel>
          {slides.map((slide, index) => (
            <img key={index} src={slide.url} alt='' />
          ))}
        </Carousel>
      </div>
    </main>
  );
}
