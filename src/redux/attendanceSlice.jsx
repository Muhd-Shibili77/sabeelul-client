import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

// -----------------------------------------------
// 1. MARK ATTENDANCE
// -----------------------------------------------
export const markAttendance = createAsyncThunk(
  "attendance/mark",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/attendance/mark", payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark attendance");
    }
  }
);

// -----------------------------------------------
// 2. FETCH ALL ABSENT LIST
// -----------------------------------------------
export const fetchAbsentList = createAsyncThunk(
  "attendance/fetchAbsentList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/attendance/absent/all");
      return response.data.data;
    } catch (err) {
      return rejectWithValue("Failed to load absent list");
    }
  }
);

// -----------------------------------------------
// 3. CLEAR ATTENDANCE
// -----------------------------------------------
export const clearAttendance = createAsyncThunk(
  "attendance/clear",
  async ({ id, adminId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/attendance/clear/${id}`, { adminId, reason });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear attendance");
    }
  }
);

// -----------------------------------------------
// 4. MONTHLY REPORT
// -----------------------------------------------
export const fetchMonthlyReport = createAsyncThunk(
  "attendance/monthlyReport",
  async ({ classId, month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/attendance/monthly/${classId}?month=${month}&year=${year}`
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue("Failed to load monthly report");
    }
  }
);

// -----------------------------------------------
// 5. SEMESTER REPORT
// -----------------------------------------------
export const fetchSemesterReport = createAsyncThunk(
  "attendance/semesterReport",
  async ({ classId, start, end }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/attendance/semester/${classId}?start=${start}&end=${end}`
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue("Failed to load semester report");
    }
  }
);

// -----------------------------------------------
// 6. STUDENT DATE-RANGE REPORT
// -----------------------------------------------
export const fetchStudentRange = createAsyncThunk(
  "attendance/studentRange",
  async ({ studentId, start, end }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/attendance/student?studentId=${studentId}&start=${start}&end=${end}`
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue("Failed to load student report");
    }
  }
);

// -----------------------------------------------
// SLICE
// -----------------------------------------------
const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    loading: false,
    error: null,
    success: null,

    absentList: [],
    monthlyReport: [],
    semesterReport: [],
    studentReport: [],
  },

  reducers: {
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // MARK ATTENDANCE
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Attendance saved successfully";
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ABSENT LIST
      .addCase(fetchAbsentList.fulfilled, (state, action) => {
        state.absentList = action.payload;
      })

      // CLEAR ATTENDANCE
      .addCase(clearAttendance.fulfilled, (state) => {
        state.success = "Attendance cleared successfully";
      })

      // MONTHLY REPORT
      .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
        state.monthlyReport = action.payload;
      })

      // SEMESTER REPORT
      .addCase(fetchSemesterReport.fulfilled, (state, action) => {
        state.semesterReport = action.payload;
      })

      // STUDENT REPORT
      .addCase(fetchStudentRange.fulfilled, (state, action) => {
        state.studentReport = action.payload;
      });
  },
});

export const { clearState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
