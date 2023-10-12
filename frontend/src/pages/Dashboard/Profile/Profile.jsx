import { useDispatch, useSelector } from "react-redux";
import { FaMars, FaVenus } from "react-icons/fa";
import { useState } from "react";
import AddBio from "./AddBio";
import { setAuth } from "../../../store/authSlice";
import { deleteUser, updateAvatar } from "../../../http";

const Profile = () => {
  const { name, avatar, gender, phone, bio } = useSelector(
    (state) => state.auth
  ).user;

  const [error, setError] = useState("");
  const [step, setStep] = useState(undefined);

  const dispatch = useDispatch();

  const updateImage = (e) => {
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        updateAvatar({ avatar: reader.result }).then((data) =>
          dispatch(setAuth(data.data))
        );
        setStep(undefined);
      };
      setError("");
    } catch (e) {
      setError("An error occured while changing image");
    }
  };

  const submitDelete = async () => {
    try {
      const { data } = await deleteUser();
      dispatch(setAuth(data));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl p-4 items-center w-96">
      {step === undefined && (
        <>
          {error}
          <div className="flex flex-col items-center gap-4">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={avatar} alt={name} />
              </div>
            </div>
            <label htmlFor="updateAvatar" className="btn btn-primary">
              Change avatar
            </label>
            <input
              id="updateAvatar"
              type={"file"}
              onChange={updateImage}
              className="hidden"
            />
          </div>
          <div className="card-body">
            <div className="flex items-center gap-2 self-center">
              <h1 className="card-title text-3xl">{name}</h1>
              {gender === "male" ? (
                <FaMars color="blue" />
              ) : (
                <FaVenus color="pink" />
              )}
            </div>
            <div className="flex gap-4 items-end">
              <h2 className="text-xl ">Phone</h2>
              <p className="text-primary">{phone}</p>
            </div>
          </div>
          {bio ? (
            <div className="flex flex-col gap-5">
              <p className="border rounded-lg border-dotted p-6 outline-dashed outline-primary outline-2">
                {bio}
              </p>
              <button
                className="btn btn-info normal-case p-2"
                onClick={() => {
                  setStep("bio");
                }}
              >
                Edit Bio
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setStep("bio");
              }}
              className="btn btn-info normal-case w-28"
            >
              Add bio
            </button>
          )}
          <button className="btn btn-error mt-4" onClick={submitDelete}>
            Delete Account Permanently
          </button>
        </>
      )}
      {step === "bio" && <AddBio setStep={setStep} setError={setError} />}
    </div>
  );
};

export default Profile;
