import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch } from "react-redux";
import Button from "../../../../components/shared/Button/Button";
import Card from "../../../../components/shared/Card/Card";
import { sendOtp } from "../../../../http";
import { setOtp } from "../../../../store/authSlice";

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  async function submit() {
    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Invalid Phone number");
      return;
    }
    const { data } = await sendOtp({ phone: phoneNumber });
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    onNext();
  }

  return (
    <Card title="Enter Your Phone Number">
      {error}
      <PhoneInput
        placeholder="Enter Phone Number"
        onChange={(phone) => setPhoneNumber(phone)}
      />
      <div>
        <Button onClick={submit} style="btn-primary">
          Next
        </Button>
        <p>
          By Entering your number, you are agreeing to our Terms of Service and
          Privacy Policy. Thanks
        </p>
      </div>
    </Card>
  );
};

export default Phone;
