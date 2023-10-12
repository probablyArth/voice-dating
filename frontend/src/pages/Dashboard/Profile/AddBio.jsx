import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBio } from "../../../http";
import { setAuth } from "../../../store/authSlice";

const AddBio = ({ setStep }) => {
  const dispatch = useDispatch();
  const [newBio, setNewBio] = useState("");
  const [error, setError] = useState("");
  const submitBio = async () => {
    try {
      if (!newBio) {
        return setError("Bio can't be empty.");
      }

      const { data } = await updateBio({ bio: newBio });
      dispatch(setAuth(data));
      setStep(undefined);
      setError("");
    } catch (e) {
      setError("Unable to Update Bio");
      console.log(e);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      {error && <div className="my-6 text-error text-xl">{error}</div>}
      <button
        onClick={() => {
          setStep(undefined);
        }}
        className="btn btn-circle"
      >
        X
      </button>
      <h1 className="text-xl text-primary font-bold">Update Bio</h1>
      <textarea
        name="Bio"
        id=""
        cols="30"
        rows="10"
        onChange={(e) => setNewBio(e.target.value)}
        className="textarea textarea-primary textarea-bordered textarea-ghost resize-none"
      ></textarea>
      <button
        onClick={() => {
          submitBio();
        }}
        className="btn btn-success"
      >
        Submit
      </button>
    </div>
  );
};

export default AddBio;
