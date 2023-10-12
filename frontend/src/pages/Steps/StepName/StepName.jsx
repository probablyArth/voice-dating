import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import { setGender, setName } from "../../../store/activateSlice";
import { FaMars, FaVenus } from "react-icons/fa";

const StepName = ({ onNext }) => {
  const { name, gender } = useSelector((state) => state.activate);
  const [fullname, setFullName] = useState(name);
  const [currentGender, setCurrentGender] = useState(gender);
  const dispatch = useDispatch();
  function nextStep() {
    if (!(fullname && currentGender)) {
      return;
    }
    dispatch(setGender(currentGender));
    dispatch(setName(fullname));
    onNext();
  }
  return (
    <>
      <Card title="Enter your full name" icon="lock.png">
        <TextInput
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
        />
        <div>
          <h1>Select Gender</h1>
          <div className="flex">
            <FaMars
              className={
                currentGender == "male" ? "pointer maleActivated" : "pointer"
              }
              onClick={() => {
                setCurrentGender("male");
              }}
              size={50}
            />
            <FaVenus
              className={
                currentGender == "female"
                  ? "pointer femaleActivated"
                  : "pointer"
              }
              onClick={() => {
                setCurrentGender("female");
              }}
              size={46}
            />
          </div>
        </div>
        <p>Namm Dedo re baba</p>
        <div>
          <Button onClick={nextStep}>Next</Button>
        </div>
      </Card>
    </>
  );
};

export default StepName;
