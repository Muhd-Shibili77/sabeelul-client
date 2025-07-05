import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchClassUnionLeaderboard = createAsyncThunk(
  "leaderboard/fetchClassUnion",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("class/leaderboard");
      return {
        classUnionData: response.data.data,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOverallLeaderboard = createAsyncThunk(
  "leaderboard/fetchOverall",
  async ({topCount}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/student/by-class?top=${topCount}`);
      const sortedStudents = response.data.students.sort((a, b) => b.score - a.score);
      return {
        overallData: sortedStudents,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchClassWiseLeaderboard = createAsyncThunk(
  "leaderboard/fetchClassWise",
  async ({classId}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/student/by-class?classId=${classId}`);
      const sortedStudents = response.data.students.sort((a, b) => b.score - a.score);
      return {
        classWiseData: sortedStudents,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    overallData: [],
    classUnionData: [],
    classWiseData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassUnionLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassUnionLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.classUnionData = action.payload.classUnionData;
      })
      .addCase(fetchClassUnionLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOverallLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverallLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.overallData = action.payload.overallData;
      })
      .addCase(fetchOverallLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchClassWiseLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassWiseLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.classWiseData = action.payload.classWiseData;
      })
      .addCase(fetchClassWiseLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default leaderboardSlice.reducer;
