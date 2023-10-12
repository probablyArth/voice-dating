import React from "react";
import Card from "../Card/Card";
import './Loader.css'

const Loader = ({ message }) => {
  return (
    <div className="cardWrapper">
      <Card>
      <div id="nest2"></div>
          <span className='message'>{message}</span>
      </Card>
    </div>
  );
};

export default Loader;
