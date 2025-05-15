import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaTrophy, FaDownload, FaCalendarAlt } from "react-icons/fa";
import logo from "../../assets/SabeelBlackLogo.png";
import useHomeData from "../../hooks/fetch/useHome";
import { fetchClass } from "../../redux/classSlice";
import { useDispatch, useSelector } from "react-redux";
import { useClassLeaderboard } from "../../hooks/fetch/useClassLeaderboard";
import { useGetTopClasses } from "../../hooks/fetch/useGetTopClass";
const downloadLinks = [
  { name: "Academic Calendar", url: "/files/Calendar 25-26.pdf" },
  // { name: "DH Academic Calendar", url: "#" },
  // { name: "SQAC Application Form", url: "#" },
  { name: "Recovery Form", url: "/files/recovery.pdf" },
  // { name: "Leave Application Form", url: "#" },
  {
    name: "No-Due Certificate",
    url: "/files/No Due Certificate 2nd Sem 2025.pdf",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { classes } = useSelector((state) => state.class);
  const [selectedClass, setSelectedClass] = useState();
  const dispatch = useDispatch();
  const { data, loading, error } = useHomeData();
  const { leaderboard, loading: leaderboardLoading } =
    useClassLeaderboard(selectedClass);
  const { Classleaderboard, loading: classLeaderboardLoading } =
    useGetTopClasses();
  useEffect(() => {
    dispatch(fetchClass({ search: "", page: 1, limit: 1000 }));
  }, []);

  // const events=[]
  const events =
    data?.upcomingProgram?.map((program) => ({
      title: program.name,
      start: new Date(program.startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      end: new Date(program.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      description: `Criteria: ${program.criteria}`,
    })) || [];

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };
  useEffect(() => {
    if (classes && classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]._id);
    }
  }, [classes, selectedClass]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)] text-gray-800">
      {/* Navbar */}

      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center flex-wrap sticky top-0 left-0 right-0">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold text-black">
            <span className="hidden md:inline">
              Sabeelul Hidaya Islamic College
            </span>
            <span className="inline md:hidden">Sabeelul Hidaya</span>
          </span>
        </div>
        <button
          className="mt-2 md:mt-0 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>

      <div className="p-6 md:p-10 space-y-10">
        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center space-x-4">
            {data?.starPerformer ? (
              <>
                <img
                  src={data?.starPerformer?.profileImage}
                  alt="profile"
                  className="h-16 w-16 rounded-full border-2 border-yellow-400"
                />

                <div>
                  <h2 className="text-xl font-bold">Star Performer</h2>
                  <p className="text-lg ">{data?.starPerformer?.name}</p>
                  <p className="text-lg ">
                    {data?.starPerformer?.classId?.name}
                  </p>
                  <p className="text-lg ">
                    <strong>score: </strong>{" "}
                    {Math.round(data?.starPerformer?.performanceScore)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="h-16 w-16 rounded-full border-2 border-yellow-400"></span>
                <div>
                  <h2 className="text-xl font-semibold">Star Performer</h2>
                  <p className="text-lg font-bold">
                    "Be the next Star Performer 💪"
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center space-x-4">
            <img
              src={`${import.meta.env.VITE_API_URL}/${data?.bestPerformerClass?.classLogo}`}
              alt="profile"
              className="h-16 w-16 rounded-full border-2 border-yellow-400"
            />
            <div>
              <h2 className="text-xl font-semibold">Best Performing Class</h2>
              <p className="text-lg">
                Class{" "}
                {data?.bestPerformerClass?.className
                  ? data?.bestPerformerClass?.className
                  : "No selected"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Leaderboard */}
          <div className="bg-white rounded-3xl shadow-2xl md:p-8 p-2 border border-gray-200 md:pl-10 md:pr-10">
            <h2 className="md:text-3xl text-2xl font-bold text-gray-700 mb-6 mt-2">
              Top 10 Students Leaderboard
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm sm:text-base border-separate border-spacing-y-2">
                <thead>
                  <tr
                    style={{ backgroundColor: "rgba(53,130,140,0.4)" }}
                    className="text-white"
                  >
                    <th className="p-4 rounded-l-2xl">Rank</th>
                    <th className="p-4">Student</th>
                    <th className="p-4">Class</th>
                    <th className="p-4 rounded-r-2xl">Mark</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center p-4">
                        Loading leaderboard data...
                      </td>
                    </tr>
                  ) : data?.performerAnalysis?.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-4">
                        No students found for this class
                      </td>
                    </tr>
                  ) : (
                    [...Array(10)].map((_, index) => {
                      const student = data?.performerAnalysis?.[index];

                      return (
                        <tr
                          key={index}
                          className="bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                          <td className="p-4 font-semibold text-teal-600 text-center">
                            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm sm:text-base">
                              #{index + 1}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-lg sm:text-base text-gray-800 text-center">
                            {student ? student.name : "--"}
                          </td>
                          <td className="p-4 sm:text-xs text-gray-700 text-center">
                            {student?.classId?.name || "--"}
                          </td>
                          <td className="p-4 sm:text-xs text-gray-700 text-center">
                            {student
                              ? Math.round(student.performanceScore)
                              : "--"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* class leaderboard */}
          <div className="bg-white rounded-3xl shadow-2xl md:p-8 p-2 border border-gray-200 md:pl-10 md:pr-10">
            <h2 className="md:text-3xl text-xl font-bold text-gray-700 mb-6 mt-2">
              Top 10 Classes Leaderboard
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm sm:text-base border-separate border-spacing-y-2">
                <thead>
                  <tr
                    style={{ backgroundColor: "rgba(53,130,140,0.4)" }}
                    className="text-white"
                  >
                    <th className="p-4 rounded-l-2xl">Rank</th>
                    <th className="p-4">Class</th>
                    <th className="p-4 rounded-r-2xl">Mark</th>
                  </tr>
                </thead>
                 <tbody>
                    {classLeaderboardLoading ? (
                      <tr>
                        <td colSpan="3" className="text-center p-4">
                          Loading leaderboard data...
                        </td>
                      </tr>
                    ) : Classleaderboard && Classleaderboard.length > 0 ? (
                      [...Array(10)].map((_, index) => {
                        const classes = Classleaderboard?.[index];

                        return (
                          <tr
                            key={classes?._id || index}
                            className="bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                          >
                            <td className="p-4 font-semibold text-teal-600">
                              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                                #{index + 1}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-lg text-gray-800">
                              {classes ? classes.className : "--"}
                            </td>
                            <td className="p-4 text-gray-700">
                              {classes
                                ? Math.round(classes.totalScore)
                                : "--"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center p-4">
                          No class found 
                        </td>
                      </tr>
                    )}
                  </tbody>
              </table>
            </div>
          </div>

          {/* Class Wise Leaderboard */}
          <div className="bg-white rounded-3xl shadow-2xl md:p-8 p-2 border border-gray-200 md:pl-10 md:pr-10">
            <div className="flex justify-between items-center mb-6 mt-2">
              <h2 className="md:text-3xl text-2xl font-bold text-gray-700">
                Class-Wise Leaderboard
              </h2>
              <select
                className="p-2 px-4 border border-gray-300 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={selectedClass}
                onChange={handleClassChange}
              >
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <div>
                <table className="min-w-full text-base border-separate border-spacing-y-2">
                  <thead>
                    <tr
                      style={{ backgroundColor: "rgba(53,130,140,0.4)" }}
                      className="text-white"
                    >
                      <th className="p-4 rounded-l-2xl">Rank</th>
                      <th className="p-4">Student</th>
                      <th className="p-4 rounded-r-2xl">Mark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardLoading ? (
                      <tr>
                        <td colSpan="3" className="text-center p-4">
                          Loading leaderboard data...
                        </td>
                      </tr>
                    ) : leaderboard && leaderboard.length > 0 ? (
                      [...Array(10)].map((_, index) => {
                        const student = leaderboard?.[index];

                        return (
                          <tr
                            key={student?._id || index}
                            className="bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                          >
                            <td className="p-4 font-semibold text-teal-600">
                              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                                #{index + 1}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-lg text-gray-800">
                              {student ? student.name : "--"}
                            </td>
                            <td className="p-4 text-gray-700">
                              {student
                                ? Math.round(student.performanceScore)
                                : "--"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center p-4">
                          No students found for this class
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {events.length !== 0 ? (
                events.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-teal-50">
                    <h3 className="text-xl font-semibold flex items-center space-x-2">
                      <FaCalendarAlt className="text-teal-600" />{" "}
                      <span>{event.title}</span>
                    </h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Start: {event.start} | End: {event.end}
                    </p>
                  </div>
                ))
              ) : (
                <div className="border rounded-lg p-4 bg-teal-50">
                  <h3 className="text-xl font-semibold flex items-center space-x-2">
                    <span>No events are scheduled at the moment.</span>
                  </h3>
                </div>
              )}
            </div>
          </div>

          {/* Downloads Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Downloads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {downloadLinks.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  download
                  className="flex items-center space-x-3 bg-teal-100 hover:bg-teal-200 p-4 rounded-xl text-teal-800"
                >
                  <FaDownload />
                  <span>{file.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
