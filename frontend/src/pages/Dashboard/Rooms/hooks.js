import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchRooms } from "../../../http";
import { setRooms } from "../../../store/roomSlice";

export const useFetchRooms = (isOpen) => {
  const dispatch = useDispatch();
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  useEffect(() => {
    if (isOpen === false) {
      (async () => {
        setTimeout(async () => {
          const { data } = await fetchRooms();
          dispatch(setRooms({ rooms: data.rooms }));
        }, 400);
      })();
    }
  }, []);
};
