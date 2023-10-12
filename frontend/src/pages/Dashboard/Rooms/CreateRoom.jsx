import { useHMSActions } from "@100mslive/react-sdk";
import { useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import Button from "../../../components/shared/Button/Button";
import { getAuthToken, getCount, postCreateRoom } from "../../../http";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const CreateRoom = ({ isOpen, setIsOpen }) => {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const roomNameRegex = new RegExp(/^[A-Za-z0-9\-:_.]+$/);
  const {
    user: { name },
  } = useSelector((state) => state.auth);
  const hmsActions = useHMSActions();
  const joinRoom = async (hmsRoomId, setError) => {
    try {
      const {
        data: { count },
      } = await getCount(hmsRoomId);
      if (count === 2) {
        return setError("The Room is full.");
      }
      const authToken = (await getAuthToken(hmsRoomId)).data.authToken;
      const config = {
        userName: name,
        authToken: authToken,
        settings: {
          isAudioMuted: false,
        },
        rememberDeviceSelection: true,
      };
      hmsActions.join(config);
      setError("");
    } catch (e) {
      setError("something went wrong");
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function createRoom() {
    if (error !== "") {
      return;
    }
    if (roomName === "") {
      return setError("Room name cannot be empty!");
    }
    try {
      const {
        data: {
          room: { hmsRoomId },
        },
      } = await postCreateRoom(roomName);
      await joinRoom(hmsRoomId, setError);
      setError("");
      setIsOpen(false);
    } catch (e) {
      setError(e.message);
    }
  }

  const handleNameChange = (e) => {
    const name = e.target.value;
    if (roomNameRegex.test(name)) {
      setError("");
      return setRoomName(name);
    }
    setError(
      "Allowed characters for room name: Allowed characters: a-z, A-Z, 0-9, and . - : _"
    );
  };

  return (
    <div>
      <div className="text-error m-6 font-bold">{error}</div>
      <Button onClick={openModal} style="btn-warning my-4">
        Create Room
      </Button>
      <Modal
        isOpen={isOpen}
        style={customStyles}
        contentLabel="Create Room Modal"
        appElement={document.getElementById("root")}
      >
        <div className="flex flex-col items-center">
          <Button onClick={closeModal} style="btn-error btn-circle">
            X
          </Button>
          <div className="card">
            <div className="card-body">
              <label className="input-group">
                <span className="bg-primary text-white">Room Name</span>
                <input
                  type="text"
                  placeholder="Crazy room"
                  className="input input-bordered input-primary"
                  onChange={handleNameChange}
                />
              </label>
              <Button style="btn-success" onClick={createRoom}>
                Create Room
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateRoom;
