import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchProgram = createAsyncThunk(
    "fetchProgram",
    async ({ search = "", page = 1, limit = 6 }, { rejectWithValue }) => {
      try {
        const response = await api.get(`/program?search=${search}&page=${page}&limit=${limit}`);
        return {
          programs: response.data.programs,
        };
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const addProgram = createAsyncThunk(
    "addProgram",
    async ({ newProgram }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/program`, newProgram);
        return {
          newProgram: response.data.newProgram,
        };
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  


const programSlice = createSlice({
    name: "program",
    initialState: { programs: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
      .addCase(fetchProgram.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProgram.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload.programs;
       
      })
      .addCase(fetchProgram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })     
    },
  });
  
  export default programSlice.reducer;