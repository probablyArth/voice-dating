import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rooms: [],
};

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      const { rooms } = action.payload;
      state.rooms = rooms;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRooms } = roomsSlice.actions;

export default roomsSlice.reducer;
