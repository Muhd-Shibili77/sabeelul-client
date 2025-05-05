import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import SideBar from "../../components/sideBar/SideBar";
import AddTeacherModal from "../../components/modals/AddTeacherModal";
import TeacherDetailsModal from "../../components/modals/TeacherDetailsModal";
import EditTeacherModal from "../../components/modals/EditTeacherModal";
import { MdOutlineDelete } from "react-icons/md";
import Pagination from "../../components/pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacher,updateTeacher,addTeacher,deleteTeacher } from "../../redux/teacherSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminTeachers = () => {
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { teachers, totalPages } = useSelector((state) => state.teacher);

  const refreshList = () =>
    dispatch(fetchTeacher({ search: debouncedSearch, page }));

  useEffect(() => {
    refreshList();
  }, [dispatch, debouncedSearch, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleAdd = async (teacherData)=>{
    try {
      const response = await dispatch(addTeacher(teacherData)).unwrap();
      toast.success(response.message || 'Added successfully');
      refreshList();
      setShowAddModal(false)
    } catch (error) {
      toast.error(error.message);
      console.error("Failed to add teacher:", error.message || error);
    }
  }
  const handleUpdate = async (id,updatedData)=>{
    try {
      const response = await dispatch(updateTeacher({ id, updatedData })).unwrap()
      toast.success(response.message || 'updated successfully');
      refreshList()
      setEditingTeacher(null)
    } catch (error) {
      toast.error(error.message);
      console.error("Failed to add teacher:", error.message || error);
    }
  }

  const handleDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Delete Confirmation
              </h2>
              <p className="text-gray-600 mt-2">
                Are you sure you want to delete this teacher?
              </p>
              <div className="flex justify-center mt-5 gap-4">
                <button
                  onClick={async () => {
                    try {
                      await dispatch(deleteTeacher(id)).unwrap();
                      toast.success("Teacher deleted successfully");
                      setTimeout(()=>{
                        refreshList();
                        onClose();
                      },1000)
                    } catch (error) {
                      toast.error("Failed to delete teacher");
                      console.error("Delete error:", error);
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      },
    });
  };
  

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Teachers" />
      <div className="flex-1 p-8 md:ml-64 md:mt-4 mt-10 transition-all duration-300 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[rgba(53,130,140,1)]">
            Teachers
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-3 sm:mt-0">
            <input
              type="text"
              placeholder="Search Teachers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border rounded w-full sm:w-auto"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[rgba(53,130,140,1)] text-white px-4 py-2 rounded hover:bg-[rgba(53,130,140,0.9)]"
            >
              Add Teacher
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teachers.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No teachers available.
            </div>
          ) : (
            teachers.map((teacher, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md relative hover:shadow-lg transition cursor-pointer"
              >
                {/* Top Right Buttons Container */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {/* Edit Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTeacher(teacher);
                    }}
                    className="text-[rgba(53,130,140,1)] hover:text-[rgba(53,130,140,0.8)]"
                  >
                    <FiEdit size={18} />
                  </button>

                  {/* Delete Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(teacher._id)
                    }}
                    className="text-[rgba(53,130,140,1)] hover:text-[rgba(53,130,140,0.8)]"
                  >
                    <MdOutlineDelete size={22} />
                  </button>
                </div>

                {/* Teacher Info */}
                <div
                  onClick={() => setSelectedTeacher(teacher)}
                  className="flex items-center gap-4"
                >
                  <img
                    src={teacher.profileImage}
                    alt={teacher.name}
                    className="w-16 h-16 rounded-full object-cover shadow"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-[rgba(53,130,140,1)]">
                      {teacher.name}
                    </h3>
                    <p className="text-gray-500">Phone: {teacher.phone}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          totalPages={totalPages}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddTeacherModal onClose={() => setShowAddModal(false)} onAdd={(data)=> handleAdd(data)} />
      )}
      {selectedTeacher && (
        <TeacherDetailsModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
      {editingTeacher && (
        <EditTeacherModal
          teacher={editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onUpdate={(id,updatedTeacher) => {
            handleUpdate(id,updatedTeacher)
          }}
        />
      )}
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default AdminTeachers;
