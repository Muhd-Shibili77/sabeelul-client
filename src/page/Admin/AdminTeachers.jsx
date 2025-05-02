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

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)]">
      <SideBar page="Teachers" />
      <div className="flex-1 p-8 md:ml-64 transition-all duration-300 overflow-y-auto">
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
                      setEditingTeacher(teacher); // Use a separate state if it's for deletion
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
                    src={teacher.profile}
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
        <AddTeacherModal onClose={() => setShowAddModal(false)} />
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
          onUpdate={(updatedTeacher) => {
            console.log("Teacher updated:", updatedTeacher);
            setEditingTeacher(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminTeachers;
