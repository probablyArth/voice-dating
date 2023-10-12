import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../../../http";
import { setOtp } from "../../../store/authSlice";

export const useResend = (setResendTimer) => {
  const dispatch = useDispatch();
  const { phone } = useSelector((state) => state.auth.otp);
  return async () => {
    const { data } = await sendOtp({ phone });
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    setResendTimer(30);
  };
};
