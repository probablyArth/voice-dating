import { getAuthToken, getCount } from "../../../../http";
import { useSelector } from "react-redux";
import { useHMSActions } from "@100mslive/react-sdk";

export const useJoinRoom = (hmsRoomId, setError) => {
  const {
    user: { name },
  } = useSelector((state) => state.auth);
  const hmsActions = useHMSActions();
  return async () => {
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
};
