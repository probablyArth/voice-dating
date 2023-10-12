import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import activate from "./activateSlice";
import rooms from "./roomSlice";

export const store = configureStore({
  reducer: {
    auth,
    activate,
    rooms,
  },
});
