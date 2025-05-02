import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchTeacher = createAsyncThunk(
    "fetchTeacher",
    async ({ search = "", page = 1, limit = 6  }, { rejectWithValue }) => {
      try {
        const response = await api.get(`/teacher?search=${search}&page=${page}&limit=${limit}`);
        return { teachers: response.data.teachers,totalPages: response.data.totalPages,  };
      } catch (error) {
        return rejectWithValue(error.response.data); 
      }
    }
  );
  export const addTeacher = createAsyncThunk(
    "addTeacher",
    async (teacherData, { rejectWithValue }) => {
      try {
        const response = await api.post("/teacher", teacherData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const updateTeacher = createAsyncThunk(
    "updateTeacher",
    async ({ id, updatedData }, { rejectWithValue }) => {
      try {
        const response = await api.put(`/teacher/${id}`, updatedData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const deleteTeacher = createAsyncThunk(
    "deleteTeacher",
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.delete(`/teacher/${id}`);
        return { _id: id }; // Return ID so we can remove it from state
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
      

const teacherSlice = createSlice({
    name: "class",
    initialState: { teachers: [], loading: false, error: null,totalPages: 0 },
    reducers: {},
    extraReducers: (builder) => {
      builder
      .addCase(fetchTeacher.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload.teachers;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    //   .addCase(deleteTeacher.fulfilled, (state, action) => {
    //     state.teachers = state.teachers.filter((cls) => cls._id !== action.payload._id);
    //   })
    //   .addCase(updateTeacher.rejected, (state, action) => {
    //     state.error = action.payload;
    //   })       
    },
  });
  
  export default teacherSlice.reducer;