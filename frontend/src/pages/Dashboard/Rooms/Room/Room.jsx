import React, { useState } from "react";
import { useEffect } from "react";
import Error from "../../../../components/shared/Error/Error";
import { getUserById } from "../../../../http";
import { useJoinRoom } from "./hooks";

const Room = ({ name, hmsRoomId, userId, userCount }) => {
  const [error, setError] = useState("");
  const joinRoom = useJoinRoom(hmsRoomId, setError);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    try {
      (async () => {
        const {
          data: { user },
        } = await getUserById(userId);
        setAvatar(user.avatar);
        setUsername(user.name);
      })();
    } catch (e) {
      setError(e.message);
    }
  }, []);
  return (
    <div className="card min-w-36 bg-neutral shadow-xl">
      <Error message={error} />
      <div className="card-body items-center">
        <div
          className="tooltip tooltip-accent tooltip-bottom"
          data-tip={`${username}`}
        >
          <div className="avatar bg-secondary p-4 rounded-full w-16">
            <img src={avatar} alt="" />
          </div>
        </div>
        <h1 className="card-title text-white mb-2">{name}</h1>
        <button
          className={`btn btn-primary shadow-xl ${
            userCount === 2 ? "btn-disabled text-white" : ""
          }`}
          onClick={joinRoom}
        >
          {userCount === 2 ? "Full" : "Join"}
        </button>
      </div>
    </div>
  );
};

export default Room;
