import React, { useEffect, useState } from "react";
import SideBar from "../../components/sideBar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems, addItem, updateItem, deleteItem } from "../../redux/itemSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminSettings = () => {
  const [levels, setLevels] = useState([
    { label: "Green", min: 600, max: 1000 },
    { label: "Blue", min: 500, max: 599 },
    { label: "Purple", min: 400, max: 499 },
    { label: "Orange", min: 300, max: 399 },
    { label: "Red", min: 200, max: 299 },
    { label: "Below Level", min: 0, max: 199 },
  ]);

  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.item);

  const [editingLevels, setEditingLevels] = useState(false);
  const [editingItems, setEditingItems] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItem, setNewItem] = useState({ item: "", description: "" });
  const [editItem, setEditItem] = useState({ item: "", description: "" });

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const handleLevelChange = (index, field, value) => {
    const newLevels = [...levels];
    newLevels[index][field] = parseInt(value) || 0;
    setLevels(newLevels);
  };

  const validateItem = (itemData) => {
    if (!itemData.item.trim()) {
      toast.error("Item name is required");
      return false;
    }
    if (!itemData.description.trim()) {
      toast.error("Item description is required");
      return false;
    }
    if (itemData.item.trim().length < 2) {
      toast.error("Item name must be at least 2 characters long");
      return false;
    }
    if (itemData.description.trim().length < 5) {
      toast.error("Item description must be at least 5 characters long");
      return false;
    }
    return true;
  };

  const handleAddItem = async () => {
    if (!validateItem(newItem)) return;

    try {
      const resultAction = await dispatch(addItem({ newItem: { 
        item: newItem.item.trim(), 
        description: newItem.description.trim() 
      }}));
      
      if (addItem.fulfilled.match(resultAction)) {
        setNewItem({ item: "", description: "" });
        toast.success("Item added successfully!");
      } else {
        throw new Error(resultAction.payload?.message || "Failed to add item");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add item");
    }
  };

  const handleEditItem = (item) => {
    const itemId = item._id || item.id;
    if (!itemId) {
      toast.error("Cannot edit item: Missing ID");
      return;
    }
    setEditingItemId(itemId);
    setEditItem({ item: item.item, description: item.description });
  };

  const handleUpdateItem = async () => {
    if (!validateItem(editItem)) return;

    try {
      await dispatch(updateItem({ 
        id: editingItemId, 
        updatedItem: { 
          item: editItem.item.trim(), 
          description: editItem.description.trim() 
        }
      })).unwrap();
      
      setEditingItemId(null);
      setEditItem({ item: "", description: "" });
      toast.success("Item updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update item");
    }
  };

  const handleDeleteItem = (item) => {
    const itemId = item._id || item.id;
    if (!itemId) {
      toast.error("Cannot delete item: Missing ID");
      return;
    }

    confirmAlert({
      title: "Confirm Delete",
      message: `Are you sure you want to delete "${item.item}"? This action cannot be undone.`,
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await dispatch(deleteItem({ id: itemId })).unwrap();
              toast.success("Item deleted successfully!");
            } catch (error) {
              toast.error(error.message || "Failed to delete item");
            }
          },
          className: "react-confirm-alert-button-yes"
        },
        {
          label: "Cancel",
          onClick: () => {},
          className: "react-confirm-alert-button-no"
        }
      ],
      overlayClassName: "react-confirm-alert-overlay",
      customUI: ({ onClose, title, message, buttons }) => (
        <div className="react-confirm-alert">
          <div className="react-confirm-alert-body">
            <h2 className="text-lg font-semibold text-red-600 mb-2">{title}</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  buttons[1].onClick();
                  onClose();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  buttons[0].onClick();
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )
    });
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditItem({ item: "", description: "" });
  };

  const getDotColor = (label) => {
    switch (label) {
      case "Green":
        return "bg-emerald-500";
      case "Blue":
        return "bg-blue-700";
      case "Purple":
        return "bg-purple-500";
      case "Orange":
        return "bg-orange-400";
      case "Red":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const saveLevels = () => {
    // Validate levels
    const hasOverlap = levels.some((level, index) => {
      return levels.some((otherLevel, otherIndex) => {
        if (index === otherIndex) return false;
        return (level.min <= otherLevel.max && level.max >= otherLevel.min);
      });
    });

    if (hasOverlap) {
      toast.error("Level ranges cannot overlap!");
      return;
    }

    setEditingLevels(false);
    toast.success("Levels saved successfully!");
    console.log("Saved Levels", levels);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Settings" />
      <div className="flex-1 p-8 md:ml-64 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 🎯 Mark Level Management */}
          <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                🎯 Mark Level Management
              </h2>
              {!editingLevels && (
                <button
                  onClick={() => setEditingLevels(true)}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-4">
              {levels.map((level, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border flex flex-col md:flex-row items-center justify-between shadow-sm transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${getDotColor(
                        level.label
                      )}`}
                    />
                    <span className="font-medium text-gray-700">
                      {level.label}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-2 md:mt-0">
                    <input
                      type="number"
                      disabled={!editingLevels}
                      value={level.min}
                      onChange={(e) =>
                        handleLevelChange(index, "min", e.target.value)
                      }
                      className="px-3 py-1 rounded border text-sm w-24"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      disabled={!editingLevels}
                      value={level.max}
                      onChange={(e) =>
                        handleLevelChange(index, "max", e.target.value)
                      }
                      className="px-3 py-1 rounded border text-sm w-24"
                      placeholder="Max"
                    />
                  </div>
                </div>
              ))}
            </div>

            {editingLevels && (
              <div className="text-right mt-5">
                <button
                  onClick={() => setEditingLevels(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={saveLevels}
                  className="px-5 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                >
                  Save Levels
                </button>
              </div>
            )}
          </div>

          {/* 📦 Extra Mark Item Management */}
          <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200 relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Extra Mark Item Management
              </h2>
              {!editingItems && (
                <button
                  onClick={() => setEditingItems(true)}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                  Manage Items
                </button>
              )}
            </div>

            {/* Add New Item Form */}
            {editingItems && (
              <div className="mb-6 p-4 rounded-xl border-2 border-dashed border-[rgba(53,130,140,0.9)] bg-[rgba(53,130,140,0.1)]">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Item</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={newItem.item}
                      onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter item name"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter description"
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddItem}
                      disabled={loading}
                      className="px-4 py-2 bg-[rgba(53,130,140,0.9)] text-white text-sm rounded hover:bg-[rgba(53,130,140,1)] transition disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "Add Item"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-4 overflow-y-auto pr-1 max-h-[400px] flex-1">
              {loading && items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading items...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-8">
                  
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Items Available</h3>
                  <p className="text-gray-500 text-sm">
                    {editingItems 
                      ? "Add your first item using the form above" 
                      : "Click 'Manage Items' to start adding items"}
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item._id || item.id || Math.random().toString(36)}
                    className="p-4 rounded-xl border border-gray-200 shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                  >
                    {editingItemId === (item._id || item.id) ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Item Name *
                          </label>
                          <input
                            type="text"
                            value={editItem.item}
                            onChange={(e) => setEditItem({ ...editItem, item: e.target.value })}
                            className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter item name"
                            maxLength={100}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            value={editItem.description}
                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                            className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter description"
                            rows={3}
                            maxLength={500}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateItem}
                            disabled={loading}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition disabled:opacity-50"
                          >
                            {loading ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800 text-lg">{item.item}</h4>
                          {editingItems && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {editingItems && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setEditingItems(false);
                    setEditingItemId(null);
                    setNewItem({ item: "", description: "" });
                    setEditItem({ item: "", description: "" });
                  }}
                  className="px-5 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AdminSettings;