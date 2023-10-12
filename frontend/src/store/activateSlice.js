import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  avatar: "",
  gender: "",
};

export const activateSlice = createSlice({
  name: "activate",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setName, setAvatar, setGender } = activateSlice.actions;

export default activateSlice.reducer;
