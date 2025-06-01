import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

// Fetch theme items
export const fetchTheme = createAsyncThunk(
  "theme/fetchTheme",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/theme`);
      return { themes: response.data.data || [] };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch items",
      });
    }
  }
);

// Add or update theme items
export const updateTheme = createAsyncThunk(
  "theme/updateTheme",
  async ({ id,minMark,maxMark }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/theme/${id}`, {minMark,maxMark});
      return { item: response.data.item };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to update item",
      });
    }
  }
);

// Theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState: {
    themes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearItems: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Theme
      .addCase(fetchTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.themes = action.payload.themes;
        state.error = null;
      })
      .addCase(fetchTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

// Export actions and reducer
export const { clearError, clearItems } = themeSlice.actions;
export default themeSlice.reducer;
