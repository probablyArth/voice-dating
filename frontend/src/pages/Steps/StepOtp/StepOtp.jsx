import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import { verifyOtp } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import { useResend } from "./hooks";

const StepOtp = ({ onNext }) => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { phone, hash } = useSelector((state) => state.auth.otp);
  const [resendTimer, setResendTimer] = useState(0);

  const resend = useResend(setResendTimer);

  useEffect(() => {
    if (resendTimer !== 0) {
      setTimeout(() => {
        setResendTimer((resendTimer) => resendTimer - 1);
      }, 1000);
    }
  });

  const submit = async () => {
    try {
      const { data } = await verifyOtp({ otp, phone, hash });
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  };
  console.log({ resendTimer });
  return (
    <>
      <div className="cardWrapper">
        <Card title="Enter the code we just texted you" icon="lock.png">
          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} />
          <div className="flex gap-4 justify-center items-center">
            <Button onClick={submit}>Next</Button>
            {resendTimer === 0 ? (
              <Button onClick={resend}>Resend</Button>
            ) : (
              <Button>Wait {resendTimer}s</Button>
            )}
          </div>
          <p>Terms and Conditions</p>
        </Card>
      </div>
    </>
  );
};

export default StepOtp;
