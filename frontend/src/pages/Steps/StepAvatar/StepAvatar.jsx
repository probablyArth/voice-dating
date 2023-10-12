import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import Loader from "../../../components/shared/Loader/Loader";
import { activate } from "../../../http";
import { setAvatar } from "../../../store/activateSlice";
import { setAuth } from "../../../store/authSlice";

const StepAvatar = ({ onNext }) => {
  const { name, avatar, gender } = useSelector((state) => state.activate);
  const [image, setImage] = useState("/images/fun.jpeg");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const setDefaultAvatar = async () => {
    const defaultAvatar = await defaultImage();
    const reader = new FileReader();
    reader.readAsDataURL(defaultAvatar);
    reader.onloadend = () => {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  };

  useEffect(() => {
    (async () => {
      if (!avatar) {
        setDefaultAvatar();
      }
    })();
  });

  const submit = async () => {
    setLoading(true);
    try {
      const { data } = await activate({ name, avatar, gender });
      if (data.auth) {
        dispatch(setAuth(data));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const captureImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  };

  async function defaultImage() {
    const response = await fetch(
      `https://avatars.dicebear.com/4.6/api/${gender}/${name}.svg`
    );
    const data = await response.blob();
    const metadata = {
      type: "image/svg+xml",
    };
    const file = new File([data], `${gender}${name}.svg`, metadata);
    return file;
  }

  if (loading) return <Loader message="We're testing your patience..." />;
  return (
    <>
      <Card title={`Holla, ${name}`} icon="lock.png">
        <div className="avatar ">
          <div className="w-56 rounded-full">
            <img src={image} alt="" />
          </div>
        </div>
        <div>
          <input
            type="file"
            className="hidden"
            id="avatarInput"
            onChange={captureImage}
          />
          <label className="btn btn-secondary" htmlFor="avatarInput">
            Choose a different Photo
          </label>
        </div>
        <div>
          <Button onClick={submit}>Next</Button>
        </div>
      </Card>
    </>
  );
};

export default StepAvatar;
