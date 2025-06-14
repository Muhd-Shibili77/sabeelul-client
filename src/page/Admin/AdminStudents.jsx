import React, { useState, useEffect } from "react";
import SideBar from "../../components/sideBar/SideBar";
import AddStudentModal from "../../components/modals/AddStudentModal";
import StudentDetailsModal from "../../components/modals/StudentDetailsModal";
import EditStudentModal from "../../components/modals/EditStudentModal";
import Pagination from "../../components/pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { fetchClass } from "../../redux/classSlice";
import {
  fetchStudent,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../../redux/studentSlice";
import Loader from "../../components/loader/Loader";

const AdminStudents = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.class);
  const { students, totalPages, loading } = useSelector(
    (state) => state.student
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedClassFilter, setDebouncedClassFilter] = useState(""); // Debounced class filter

  const [classFilter, setClassFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchClass({ search: "", page: 1, limit: 1000 }));
  }, [dispatch]);

  const refreshList = () =>
    dispatch(fetchStudent({ search: debouncedSearch, page , classFilter: debouncedClassFilter }));

  useEffect(() => {
    refreshList();
  }, [dispatch, debouncedSearch,debouncedClassFilter, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Debounce class filter (optional - can be immediate)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedClassFilter(classFilter);
    }, 300); // Shorter delay for class filter

    return () => clearTimeout(timer);
  }, [classFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [debouncedSearch, debouncedClassFilter]);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };
  const handleDeleteStudent = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Delete Confirmation
              </h2>
              <p className="text-gray-600 mt-2">
                Are you sure you want to delete this student?
              </p>
              <div className="flex justify-center mt-5 gap-4">
                <button
                  onClick={async () => {
                    try {
                      await dispatch(deleteStudent(id)).unwrap();
                      toast.success("student deleted successfully");
                      setTimeout(() => {
                        refreshList();
                        onClose();
                      }, 1000);
                    } catch (error) {
                      toast.error("Failed to delete student");
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
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };
  const updateStudentData = async (id, updatedData) => {
    try {
      const response = await dispatch(
        updateStudent({ id, updatedData })
      ).unwrap();
      toast.success("Student updated successfully!");
      refreshList();
      setTimeout(() => {
        setSelectedStudent(null);
        setShowEditModal(false);
      }, 100);
    } catch (error) {
      toast.error(error.message);
      console.error("Failed to update student:", error.message || error);
    }
  };
  const handleAdd = async (studentData) => {
    try {
      const response = await dispatch(addStudent(studentData)).unwrap();
      toast.success(response.message || "Added successfully");
      refreshList();
      setTimeout(() => {
        setShowAddModal(false);
      }, 100);
    } catch (error) {
      // Properly extract the error message based on the structure returned by rejectWithValue
      const errorMessage =
        error.message ||
        (error.data && error.data.message) ||
        "Failed to add student";

      toast.error(errorMessage);
      console.error("Failed to add student:", error);
    }
  };

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Students" />

      <div className="flex-1 p-8 md:ml-64 md:mt-4 mt-10 transition-all duration-300 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-[rgba(53,130,140,0.9)]">
            Students
          </h2>

          <div className="flex gap-2 flex-wrap">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="border rounded px-4 py-2  text-gray-700 focus:outline-none focus:ring-2 focus:ring-[rgba(53,130,140,0.5)]"
            >
              <option value="">All Classes</option>
              {classes?.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by Name/Ad.No"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-4 py-2"
            />

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[rgba(53,130,140,0.9)] hover:bg-[rgba(53,130,140,1)] text-white px-4 py-2 rounded"
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Student List Table */}
        <div className="overflow-x-auto rounded-xl shadow-xl bg-white p-4">
          <table className="min-w-full table-auto text-sm text-gray-800">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Admission No</th>
                <th className="px-6 py-3 text-left">Rank</th>
                <th className="px-6 py-3 text-left">Class</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    <Loader />
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={student.profileImage}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover shadow"
                      />
                      <span className="font-semibold">{student?.name}</span>
                    </td>
                    <td className="px-6 py-4">{student?.admissionNo}</td>
                    <td className="px-6 py-4">{student?.rank}</td>
                    <td className="px-6 py-4">{student?.classId?.name}</td>
                    <td className="px-6 py-4">{student?.phone}</td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button
                        onClick={() => handleViewDetails(student)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="View Details"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="Edit Student"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete Student"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          totalPages={totalPages}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          classes={classes}
          onAdd={(data) => handleAdd(data)}
        />
      )}
      {showDetailModal && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => {
            setSelectedStudent(null);
            setShowDetailModal(false);
          }}
        />
      )}
      {showEditModal && (
        <EditStudentModal
          studentData={selectedStudent}
          onClose={() => {
            setSelectedStudent(null);
            setShowEditModal(false);
          }}
          classes={classes}
          onUpdate={(id, updatedData) => {
            updateStudentData(id, updatedData);
          }}
        />
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default AdminStudents;
