import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const changePassword = createAsyncThunk(
  "admin/changePassword",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/changePassword/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to change password"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder;
    // Fetch Items
  },
});

export default adminSlice.reducer;
