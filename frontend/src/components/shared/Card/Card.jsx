import React from "react";
const Card = ({ title, children, className }) => {
  return (
    <div className={`card shadow-xl bg-base-100 ${className}`}>
      <div className="card-body items-center">
        <div className="card-title">{title}</div>
        {children}
      </div>
    </div>
  );
};

export default Card;
