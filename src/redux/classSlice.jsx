import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchClass = createAsyncThunk(
  "fetchClass",
  async ({ search = "", page = 1, limit = 6 }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/class?search=${search}&page=${page}&limit=${limit}`
      );
      return {
        classes: response.data.classes,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addClass = createAsyncThunk(
  "addClass",
  async ({ newClass }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/class`, newClass, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
      const response = await api.put(`/class/${id}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/class/subject/${id}`, { name }); // subjectData is an object
      return response.data.newSubject; // adjust based on your API response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteSubject = createAsyncThunk(
  "subject/delete",
  async ({ id, name }, { rejectWithValue }) => {
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

export const addScore = createAsyncThunk(
  "addScore",
  async ({ id, newScore }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/class/score/${id}`, newScore);
      return { newScore: response.data.newScore }; // adjust key if API returns differently
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An unexpected error occurred"
      );
    }
  }
);
// For updating a mark
export const updateScore = createAsyncThunk(
  "class/updateScore",
  async ({ classId, markId, updatedMark }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/class/score/${classId}`, {
        updatedMark,
        markId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update mark");
    }
  }
);

// For deleting a mark
export const deleteScore = createAsyncThunk(
  "class/deleteScore",
  async ({ classId, markId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`class/score/${classId}`, {
        data: { markId },
      });
      return { classId, markId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete mark");
    }
  }
);
export const addPenaltyScore = createAsyncThunk(
  "class/addPenaltyScore",
  async ({ id, newMark }, { rejectWithValue }) => {
    try {
      const response = await api.post(`class/penalty/${id}`, newMark);
      return response.data; // adjust based on actual response
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add penalty score"
      );
    }
  }
);

export const updatePenaltyScore = createAsyncThunk(
  "class/updatePenaltyScore",
  async (
    { id, markId, reason, penaltyScore, description },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`class/penalty/${id}`, {
        markId,
        reason,
        penaltyScore,
        description,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update penalty mark"
      );
    }
  }
);
export const deletePenaltyScore = createAsyncThunk(
  "class/deletePenaltyScore",
  async ({ classId, markId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`class/penalty/${classId}`, {
        data: { markId },
      });
      return { classId, markId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete penalty mark"
      );
    }
  }
);

export const fetchSubInClass = createAsyncThunk(
  "class/fetchSubInClass",
  async ({ classId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`class/subject/${classId}`);
      return {
        subjects: response.data.subjects,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete penalty mark"
      );
    }
  }
);
export const publishScore = createAsyncThunk(
  "class/publishScore",
  async ({ classId, semester, scoreType }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/class/publish-score/${classId}`, {
        semester,
        scoreType,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to publish score");
    }
  }
);
export const fetchFullScore = createAsyncThunk(
  "class/fetchFullScore",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/class/full-score`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch full score"
      );
    }
  }
);

const classSlice = createSlice({
  name: "class",
  initialState: {
    classes: [],
    subjects: [],
    fullScore: [],
    loading: false,
    error: null,
    totalPages: 0,
  },
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
      .addCase(fetchFullScore.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFullScore.fulfilled, (state, action) => {
        state.loading = false;
        state.fullScore = action.payload;
      })
      .addCase(fetchFullScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubInClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubInClass.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.subjects;
      })
      .addCase(fetchSubInClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter(
          (cls) => cls._id !== action.payload._id
        );
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateScore.fulfilled, (state, action) => {
        const classIndex = state.classes.findIndex(
          (cls) => cls._id === action.payload.classId
        );
        if (classIndex !== -1) {
          // Replace the updated class with the one from the response
          state.classes[classIndex] = action.payload.class;
        }
      })
      .addCase(deleteScore.fulfilled, (state, action) => {
        const classIndex = state.classes.findIndex(
          (cls) => cls._id === action.payload.classId
        );
        if (classIndex !== -1) {
          const markIndex = state.classes[classIndex].marks.findIndex(
            (mark) => mark._id === action.payload.markId
          );
          if (markIndex !== -1) {
            state.classes[classIndex].marks.splice(markIndex, 1);
          }
        }
      });
  },
});

export default classSlice.reducer;
