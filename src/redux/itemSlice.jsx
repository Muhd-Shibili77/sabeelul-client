import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchItems = createAsyncThunk(
  "item/fetchItems", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/extra-mark-item`);
      return { items: response.data.items || response.data || [] };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to fetch items"
      });
    }
  }
);

export const addItem = createAsyncThunk(
  "item/addItem", 
  async ({ newItem }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/extra-mark-item`, newItem);
      // Handle different possible response structures
      const addedItem = response.data.item || response.data.data || response.data;
      
      // Ensure the item has an ID
      if (!addedItem._id && !addedItem.id) {
        // Generate a temporary ID if the server doesn't provide one
        addedItem._id = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
      return { item: addedItem };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to add item"
      });
    }
  }
);

export const updateItem = createAsyncThunk(
  "item/updateItem", 
  async ({ id, updatedItem }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/extra-mark-item/${id}`, updatedItem);
      // Handle different possible response structures
      const item = response.data.item || response.data.data || response.data;
      
      // Ensure the item has the correct ID
      if (!item._id && !item.id) {
        item._id = id;
      }
      
      return { item };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to update item"
      });
    }
  }
);

export const deleteItem = createAsyncThunk(
  "item/deleteItem", 
  async ({ id }, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/extra-mark-item/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to delete item"
      });
    }
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState: { 
    items: [], 
    loading: false, 
    error: null 
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearItems: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Item
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.item);
        state.error = null;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload.item;
        const itemId = updatedItem._id || updatedItem.id;
        
        const index = state.items.findIndex(item => 
          (item._id && item._id === itemId) || 
          (item.id && item.id === itemId)
        );
        
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        state.error = null;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.items = state.items.filter(item => 
          item._id !== deletedId && item.id !== deletedId
        );
        state.error = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearItems } = itemSlice.actions;
export default itemSlice.reducer;