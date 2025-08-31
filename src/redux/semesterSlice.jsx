import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchUnlockedSemester = createAsyncThunk(
  "semester/fetchUnlocked",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/semester/unlocked`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch unlocked semester"
      );
    }
  }
);
export const fetchAllSemester = createAsyncThunk(
  "semester/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/semester/all`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all semesters"
      );
    }
  }
);
export const toggleSemesterLock = createAsyncThunk(
  "semester/toggleLock",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/semester/toggle-lock/${id}`);
      return {
        id: id,
        result: response.data.result,
        };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to toggle semester lock"
      );
    }
  }
);

const semesterSlice = createSlice({
  name: "semester",
  initialState: {
    semesters: [],
    allSemesters: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnlockedSemester.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnlockedSemester.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters = action.payload;
      })
      .addCase(fetchUnlockedSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllSemester.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSemester.fulfilled, (state, action) => {
        state.loading = false;
        state.allSemesters = action.payload;
      })
      .addCase(fetchAllSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleSemesterLock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.allSemesters.findIndex(
          (semester) => semester._id === action.payload.id
        );
        if (index !== -1) {
          state.allSemesters[index] = action.payload.result;
        }
      })
      .addCase(toggleSemesterLock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default semesterSlice.reducer;
