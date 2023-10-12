import React, { useState } from "react";
import { useSelector } from "react-redux";
import CreateRoom from "./CreateRoom";
import { useFetchRooms } from "./hooks";
import Room from "./Room/Room";

const Rooms = () => {
  const [isOpen, setIsOpen] = useState(false);
  useFetchRooms(isOpen);
  const { rooms } = useSelector((state) => state.rooms);

  console.log(rooms);
  const populateRooms = () => {
    return rooms.map((room, idx) => (
      <Room
        name={room.name}
        hmsRoomId={room.hmsRoomId}
        key={idx}
        userId={room.userId}
        userCount={room.userCount}
      />
    ));
  };
  return (
    <div>
      <CreateRoom isOpen={isOpen} setIsOpen={setIsOpen} />
      {rooms.length === 0 ? (
        <h1 className="text-center text-xl my-4">No Rooms</h1>
      ) : (
        <div className="grid border-dashed border-primary border-2 rounded-lg p-4 grid-cols-4 gap-8">
          {populateRooms()}
        </div>
      )}
    </div>
  );
};

export default Rooms;
