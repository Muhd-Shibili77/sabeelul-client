import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchClass = createAsyncThunk(
    "fetchClass",
    async ({ search = "", page = 1, limit = 6  }, { rejectWithValue }) => {
      try {
        const response = await api.get(`/class?search=${search}&page=${page}&limit=${limit}`);
        return { classes: response.data.classes,totalPages: response.data.totalPages,  };
      } catch (error) {
        return rejectWithValue(error.response.data); 
      }
    }
  );
export const addClass = createAsyncThunk(
    "addClass",
    async ({ newClass }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/class`, newClass,);
        return { newClass: response.data.newClass };
      } catch (error) {
        return rejectWithValue(error.response.data); 
      }
    }
  );
  export const updateClass = createAsyncThunk(
    "updateClass",
    async ({ id, updatedData }, { rejectWithValue }) => {
      try {
        const response = await api.put(`/class/${id}`, {name : updatedData});
        return { updatedClass: response.data.updatedClass };
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const deleteClass = createAsyncThunk(
    "deleteClass",
    async (id, { rejectWithValue }) => {
      try {
        await api.delete(`/class/${id}`);
        return { id };
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
    
  export const addSubject = createAsyncThunk(
    "subject/add",
    async ({id,name}, { rejectWithValue }) => {
      try {
        const response = await api.post(`/class/subject/${id}`, {name}); // subjectData is an object
        return response.data.newSubject; // adjust based on your API response
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  export const deleteSubject = createAsyncThunk(
    "subject/delete",
    async ({id,name}, { rejectWithValue }) => {
      try {
        await api.delete(`/class/subject/${id}`, {
            data: { name }, 
          });
        return { id };
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  
  


const classSlice = createSlice({
    name: "class",
    initialState: { classes: [], loading: false, error: null,totalPages: 0 },
    reducers: {},
    extraReducers: (builder) => {
      builder
      .addCase(fetchClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.classes;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter((cls) => cls._id !== action.payload._id);
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.error = action.payload;
      });

        
    },
  });
  
  export default classSlice.reducer;