import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
  name: "alert",
  initialState: {
    show: false,
    message: "",
    alertType: null, 
  },
  reducers: {
    showAlert: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.alertType = action.payload.alertType;
    },
    hideAlert: (state) => {
      state.show = false;
      state.message = "";
      state.alertType = null;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;

export default alertSlice.reducer;
