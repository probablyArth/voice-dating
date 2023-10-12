import { useEffect, useState } from "react";
import { getUserById } from "../../../http";
import {
  selectIsPeerAudioEnabled,
  selectLocalPeerRole,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useSelector } from "react-redux";
import { BsFillMicMuteFill, BsMicMute } from "react-icons/bs";
import { useMutePeer } from "./hooks";

const Peer = ({ peer }) => {
  const [userData, setUserData] = useState({});
  const {
    user: { _id },
  } = useSelector((state) => state.auth);
  const isMicOn = useHMSStore(selectIsPeerAudioEnabled(peer.id));
  const isLocalPeerCreator =
    useHMSStore(selectLocalPeerRole).name === "creator";
  const mutePeer = useMutePeer(peer.audioTrack);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await getUserById(peer.customerUserId);
      setUserData(user);
    })();
  }, [peer.customerUserId]);

  if (userData === {}) {
    return <div>{peer.name}</div>;
  }

  let tooltip = userData.name;
  if (userData._id === _id) {
    tooltip = `${userData.name} (You)`;
  }

  return (
    <div className="tooltip" data-tip={tooltip}>
      <div
        className={`avatar py-5 px-24 rounded-md ${
          userData._id === _id ? "bg-neutral" : "bg-secondary"
        }`}
      >
        {!isMicOn && (
          <div className="absolute right-4 bottom-4">
            <div className="avatar bg-black p-2 rounded-full">
              <BsFillMicMuteFill color="white" />
            </div>
          </div>
        )}
        {isMicOn && userData._id !== _id && isLocalPeerCreator && (
          <button className="absolute right-4 bottom-4 btn" onClick={mutePeer}>
            <BsMicMute />
          </button>
        )}
        <div className="w-24 rounded-full ring bg-gray-900 ring-blue-800">
          <img src={userData.avatar} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Peer;
