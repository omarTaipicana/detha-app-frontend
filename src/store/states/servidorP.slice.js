import { createSlice } from "@reduxjs/toolkit";

export const servidorPSlice = createSlice({
  name: "servidorP",
  initialState: [],
  reducers: {
    addProduct: (state, action) => [...state, action.payload],
    deleteProduct: (state, action) =>
      state.filter((serv) => serv.id !== action.payload),
  },
});

export const { addProduct, deleteProduct } = servidorPSlice.actions;

export default servidorPSlice.reducer;
