import React from "react";

const Error = ({ message }) => {
  return (
    <>
      {message ? (
        <div className="p-6 text-xl text-error text-center">{message}</div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Error;
