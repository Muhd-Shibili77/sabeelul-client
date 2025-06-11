import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchStudent = createAsyncThunk(
    "fetchStudent",
    async ({ search = "", page = 1, limit = 10 }, { rejectWithValue }) => {
      try {
        const response = await api.get(`/student?search=${search}&page=${page}&limit=${limit}`);
        return {
          students: response.data.students,
          totalPages: response.data.totalPages,
        };
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const addStudent = createAsyncThunk(
    "addStudent",
    async (studentData, { rejectWithValue }) => {
      try {
        const response = await api.post("/student", studentData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const updateStudent = createAsyncThunk(
    "updateStudent",
    async ({ id, updatedData }, { rejectWithValue }) => {
    
      try {
        const response = await api.put(`/student/${id}`, updatedData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const deleteStudent = createAsyncThunk(
    "deleteStudent",
    async (id, { rejectWithValue }) => {
      try {
        await api.delete(`/student/${id}`);
        return { _id: id };
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
   
  export const addExtraMark = createAsyncThunk(
    "addExtraMark",
    async ({ id, data }, { rejectWithValue }) => {
    
      try {
        const response = await api.post(`/student/score/${id}`, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
   
  export const editExtraMark = createAsyncThunk(
    "editExtraMark",
    async ({ id, mark,description,userId }, { rejectWithValue }) => {  
      console.log(userId)
      try {
        const response = await api.put(`/student/score/${id}`, {mark:mark,description:description,userId:userId});
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
   
  export const deleteExtraMark = createAsyncThunk(
    "deleteExtraMark",
    async ({ id,userId }, { rejectWithValue }) => {
    
      try {
        const response = await api.delete(`/student/score/${id}`,{data:{userId}});
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const addMentorMark = createAsyncThunk(
    "addMentorMark",
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/student/mentor/${id}`, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const addCceMark = createAsyncThunk(
    "addCceMark",
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/student/cce/${id}`, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const addStudentPenalty = createAsyncThunk(
    "addStudentPenalty",
    async ({ id, newMark }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/student/penalty/${id}`, newMark);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const updateStudentPenalty = createAsyncThunk(
    "updateStudentPenalty",
    async ({ id, markId, reason, penaltyScore, description  }, { rejectWithValue }) => {
      try {
        const response = await api.put(`/student/penalty/${id}`, {
        markId,
        reason,
        penaltyScore,
        description,
      });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const deleteStudentPenalty = createAsyncThunk(
    "deleteStudentPenalty",
    async ({ id, markId }, { rejectWithValue }) => {
  
      try {
        const response = await api.delete(`/student/penalty/${id}`, {data:{markId}});
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );


  
  const studentSlice = createSlice({
      name: "student",
      initialState: { students: [], loading: false, error: null,totalPages: 0 },
      reducers: {},
      extraReducers: (builder) => {
        builder
        .addCase(fetchStudent.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchStudent.fulfilled, (state, action) => {
          state.loading = false;
          state.students = action.payload.students;
          state.totalPages = action.payload.totalPages;
        })
        .addCase(fetchStudent.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })     
      },
    });
    
    export default studentSlice.reducer;