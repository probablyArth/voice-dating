import { useGetPeers } from "./hooks";
import Peer from "./Peer";

const CallGrid = () => {
  const peers = useGetPeers();

  return (
    <div className="flex flex-col border-dashed border-primary border-2 rounded-lg p-4 gap-8">
      {peers.map((peer, idx) => (
        <div key={idx} className="peer">
          <Peer peer={peer} />
        </div>
      ))}
    </div>
  );
};

export default CallGrid;
