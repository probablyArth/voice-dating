import React, { useState } from "react";
import Phone from "./Phone/Phone";

const StepPhoneEmail = ({ onNext }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-end gap-4">
        <Phone onNext={onNext} />
      </div>
    </>
  );
};

export default StepPhoneEmail;
