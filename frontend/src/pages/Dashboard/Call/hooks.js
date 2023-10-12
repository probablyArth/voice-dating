import {
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
  selectPeers,
  selectRoom,
} from "@100mslive/react-sdk";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserIdFromRoomId } from "../../../http";

export const useGetPeers = () => {
  const peers = useHMSStore(selectPeers);
  console.log({ peers });
  return peers;
};

export const useMutePeer = (audioTrack) => {
  const hmsActions = useHMSActions();
  return () => {
    hmsActions.setRemoteTrackEnabled(audioTrack, false);
  };
};

export const useLeaveRoom = () => {
  const hmsActions = useHMSActions();
  const { id } = useHMSStore(selectRoom);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const { user } = useSelector((state) => state.auth);
  const _id = user?._id;
  const endRoom = useEndRoom();
  if (isConnected) {
    return async () => {
      const {
        data: { userId },
      } = await getUserIdFromRoomId(id);
      if (userId === _id) {
        await endRoom();
      }
      hmsActions.leave();
    };
  }
  return () => {};
};

export const useEndRoom = () => {
  const hmsActions = useHMSActions();
  return async () => {
    hmsActions.endRoom();
  };
};

export const useKickPeer = (peerId) => {
  const hmsActions = useHMSActions();
  if (peerId !== undefined)
    return () => {
      hmsActions.removePeer(peerId);
    };

  return () => {};
};

export const useHandleCreatorLeave = (notif) => {
  const hmsActions = useHMSActions();
  const { id } = useHMSStore(selectRoom);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const endRoom = useEndRoom();
  useEffect(() => {
    if (!notif) {
      return;
    }

    if (notif.type === "PEER_LEFT" && isConnected) {
      (async () => {
        const {
          data: { userId },
        } = await getUserIdFromRoomId(id);
        if (userId === notif.data.customerUserId) {
          await endRoom();
          hmsActions.leave();
        }
      })();
    }
    return () => {};
  }, [notif]);
};
