import React from "react";
import { Link } from "react-router-dom";
import { useLeaveRoom } from "../../../pages/Dashboard/Call/hooks";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const brandStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
    width: "40px",
  };
  const logoText = {
    marginLeft: "10px",
    color: "black",
  };
  const leaveRoom = useLeaveRoom();

  return (
    <nav className={`${styles.navBar} container`}>
      <Link to="/" style={brandStyle} onClick={leaveRoom}>
        <img src="images/logo.png" alt="logo" />
        <span style={logoText}>Voice-Dating</span>
      </Link>
    </nav>
  );
};

export default Navigation;
