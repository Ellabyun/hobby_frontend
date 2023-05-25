import React, { useState } from 'react';
import './Carousel.css';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

export default function Carousel({ children: slides }) {
  const [curr, setCurr] = useState(0);
  const prev = () => setCurr((curr) => (curr === 0 ? curr : curr - 1));
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? curr : curr + 1));

  return (
    <div className='carousel__container'>
      <div
        className='carousel__slides'
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides}
      </div>
      <div className='carousel__btnContainer'>
        <button onClick={prev}>
          <BsChevronLeft />
        </button>
        <button onClick={next}>
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
}
