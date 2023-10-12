import React from "react";
import CallGrid from "./CallGrid";
import { useHandleCreatorLeave, useKickPeer, useLeaveRoom } from "./hooks";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { GiHighKick } from "react-icons/gi";
import { IoExitOutline } from "react-icons/io5";
import {
  useHMSActions,
  useHMSStore,
  selectIsLocalAudioEnabled,
  selectLocalPeerRoleName,
  selectPeersByRole,
  useHMSNotifications,
} from "@100mslive/react-sdk";

const Call = () => {
  const leaveRoom = useLeaveRoom();
  const hmsActions = useHMSActions();
  const notif = useHMSNotifications();
  useHandleCreatorLeave(notif);

  const isAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const toggleMute = () => {
    hmsActions.setLocalAudioEnabled(!isAudioEnabled);
  };
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const peer = useHMSStore(selectPeersByRole("user"))[0];
  const kickPeer = useKickPeer(peer?.id);

  return (
    <div className="flex flex-col gap-2">
      <CallGrid />
      <div className="flex gap-2">
        <button onClick={leaveRoom} className="btn">
          <IoExitOutline />
        </button>
        <button onClick={toggleMute} className="btn">
          {isAudioEnabled ? <BsFillMicFill /> : <BsFillMicMuteFill />}
        </button>
        {localPeerRole === "creator" && (
          <>
            {peer !== undefined && (
              <button className="btn" onClick={kickPeer}>
                <GiHighKick />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Call;
