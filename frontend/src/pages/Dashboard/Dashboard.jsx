import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../http";
import { setAuth } from "../../store/authSlice";
import Profile from "./Profile/Profile";
import Rooms from "./Rooms/Rooms";
import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";
import Call from "./Call/Call";
import Error from "../../components/shared/Error/Error";
import Button from "../../components/shared/Button/Button";

const Dashboard = () => {
  const [key, setKey] = useState("rooms");
  const dispatch = useDispatch();
  const Component = { profile: Profile, rooms: Rooms, call: Call }[key];
  const [error, setError] = useState("");
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const logoutUser = async () => {
    try {
      const data = await logout();
      dispatch(setAuth({ user: data.data.user }));
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <Error message={error} />
      {isConnected ? (
        <Call />
      ) : (
        <>
          <div className="tabs tabs-boxed gap-8 bg-indigo-100">
            <Button onClick={logoutUser} style="btn-error">
              Logout
            </Button>
            <Button
              onClick={() => {
                setKey("profile");
              }}
              style={`${key === "profile" ? "btn-primary" : "btn-neutral"}`}
            >
              Profile
            </Button>
            <Button
              onClick={() => {
                setKey("rooms");
              }}
              style={`${key === "rooms" ? "btn-primary" : "btn-neutral"}`}
            >
              Rooms
            </Button>
          </div>
          <Component />
        </>
      )}
    </div>
  );
};

export default Dashboard;
