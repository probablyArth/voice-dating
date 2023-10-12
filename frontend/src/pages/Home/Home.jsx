import React from "react";
import { useHistory } from "react-router-dom";

const Home = () => {
  const history = useHistory();
  const handleRegister = () => {
    history.push("/authenticate");
  };

  return (
    <div className="hero justify-center items-center h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to dating</h1>
          <p className="py-6">
            Get in a call with strangers in search of a potential partner
          </p>
          <button className="btn btn-primary" onClick={handleRegister}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
