import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchPhaseWisePKVByClass = createAsyncThunk(
  "fetchPhaseWisePKVByClass",
  async ({ classId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pkv/fetchByClass/${classId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchPKV = createAsyncThunk(
  "fetchPKV",
  async ({ id, semester }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pkv/fetch/${id}?semester=${semester}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addPKV = createAsyncThunk(
  "addPKV",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/pkv/add/${id}`, data);
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const editPKV = createAsyncThunk(
  "editPKV",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pkv/update/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const PKVSlice = createSlice({
  name: "PKV",
  initialState: {
    PKVScores: [],
    phaseWisePKVScores: [],
    loading: false,
    addLoading: false,
    editLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPKV.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPKV.fulfilled, (state, action) => {
        state.loading = false;
        state.PKVScores = action.payload;
      })
      .addCase(fetchPKV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPhaseWisePKVByClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPhaseWisePKVByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.phaseWisePKVScores = action.payload;
      })
      .addCase(fetchPhaseWisePKVByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPKV.pending, (state) => {
        state.addLoading = true;
      })
      .addCase(addPKV.fulfilled, (state, action) => {
        state.addLoading = false;
        state.PKVScores.push(action.payload);
      })
      .addCase(addPKV.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.error.message;
      })
      .addCase(editPKV.pending, (state) => {
        state.editLoading = true;
      })
      .addCase(editPKV.fulfilled, (state, action) => {
        const index = state.PKVScores.findIndex(
          (item) => item.phase === action.payload.phase
        );
        if (index !== -1) {
          state.PKVScores[index] = action.payload;
        }
        state.editLoading = false;
      })
      .addCase(editPKV.rejected, (state, action) => {
        state.editLoading = false;
        state.error = action.error.message;
      });
  },
});

export default PKVSlice.reducer;
