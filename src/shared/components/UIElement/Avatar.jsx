import React from 'react';
import { Link } from 'react-router-dom';
import './Avatar.css';
export default function Avatar(props) {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <Link to={`/${props.userId}/posts`}>
        <img
          src={props.image}
          alt={props.alt}
          style={{ width: props.width, height: props.width }}
        />
        <p>{props.username.toUpperCase()}</p>
      </Link>
    </div>
  );
}
