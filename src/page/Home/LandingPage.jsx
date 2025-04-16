import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaTrophy, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import logo from '../../assets/SabeelBlackLogo.png';

const demoStudents = [
  { name: 'Alice', score: 98, class: '10A' },
  { name: 'Bob', score: 96, class: '10B' },
  { name: 'Charlie', score: 94, class: '10A' },
  { name: 'David', score: 93, class: '10C' },
  { name: 'Eve', score: 92, class: '10B' },
  { name: 'Frank', score: 91, class: '10A' },
  { name: 'Grace', score: 90, class: '10B' },
  { name: 'Hank', score: 89, class: '10C' },
  { name: 'Ivy', score: 88, class: '10A' },
  { name: 'Jack', score: 87, class: '10C' },
];

const classes = ['10A', '10B', '10C'];

const demoEvents = [
  { title: 'Science Fair', start: 'April 25, 2025', end: 'April 26, 2025', description: 'Annual inter-school science exhibition.' },
  { title: 'Sports Day', start: 'May 10, 2025', end: 'May 10, 2025', description: 'A day full of fun sports competitions.' },
];

const downloadLinks = [
  { name: 'Academic Calendar', url: '#' },
  { name: 'DH Academic Calendar', url: '#' },
  { name: 'SQAC Application Form', url: '#' },
  { name: 'Recovery Form', url: '#' },
  { name: 'Leave Application Form', url: '#' },
  { name: 'No-Due Certificate', url: '#' },
];

const LandingPage = () => {
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState('10A');

  const topStudents = [...demoStudents].sort((a, b) => b.score - a.score).slice(0, 10);
  const classWiseStudents = demoStudents.filter(s => s.class === selectedClass);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-[rgba(53,130,140,0.4)] text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center flex-wrap">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold text-black">Sabeelul Hidaya</span>
        </div>
        <button className="mt-2 md:mt-0 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition" onClick={()=>navigate('/login')}>Login</button>
      </nav>

      <div className="p-6 md:p-10 space-y-10">
        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center space-x-4">
            <img src="https://i.pravatar.cc/150?img=32" alt="Alice" className="h-16 w-16 rounded-full border-2 border-yellow-400" />
            <div>
              <h2 className="text-xl font-semibold">Star Performer of the Month</h2>
              <p className="text-lg">Alice (Class 10A) - 98 Points</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center space-x-4">
            <FaTrophy className="text-orange-400 text-4xl" />
            <div>
              <h2 className="text-xl font-semibold">Best Performing Class</h2>
              <p className="text-lg">Class 10A</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-3xl shadow-2xl md:p-8 p-2 border border-gray-200 md:pl-20 md:pr-20">
  <h2 className="md:text-3xl text-2xl font-bold text-gray-700 mb-6 mt-2">Top 10 Students Leaderboard</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm sm:text-base border-separate border-spacing-y-2">
      <thead>
        <tr style={{ backgroundColor: 'rgba(53,130,140,0.4)' }} className="text-white">
          <th className="p-4 rounded-l-2xl">Rank</th>
          <th className="p-4">Student</th>
          <th className="p-4">Class</th>
          <th className="p-4 rounded-r-2xl">Average Mark</th>
        </tr>
      </thead>
      <tbody>
        {topStudents.map((student, index) => (
          <tr
            key={index}
            className="bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <td className="p-4 font-semibold text-teal-600 text-center">
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm sm:text-base">
                #{index + 1}
              </span>
            </td>
            <td className="p-4 font-bold text-lg sm:text-base text-gray-800 text-center">{student.name}</td>
            <td className="p-4 sm:text-xs text-gray-700 text-center">{student.class}</td>
            <td className="p-4 sm:text-xs text-gray-700 text-center">{student.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        {/* Class Wise Leaderboard */}
        <div className="bg-white rounded-3xl shadow-2xl md:p-8 p-2 border border-gray-200 md:pl-20 md:pr-20">
          <div className="flex justify-between items-center mb-6 mt-2">
            <h2 className="md:text-3xl text-2xl font-bold text-gray-700">Class-Wise Leaderboard</h2>
            <select
              className="p-2 px-4 border border-gray-300 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <div>
            <table className="min-w-full text-base border-separate border-spacing-y-2">
              <thead>
                <tr style={{ backgroundColor: 'rgba(53,130,140,0.4)' }} className="text-white">
                  <th className="p-4 rounded-l-2xl">Rank</th>
                  <th className="p-4">Student</th>
                  <th className="p-4 rounded-r-2xl">Average Mark</th>
                </tr>
              </thead>
              <tbody>
                {classWiseStudents.map((student, index) => (
                  <tr
                    key={index}
                    className="bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <td className="p-4 font-semibold text-teal-600">
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-lg text-gray-800">{student.name}</td>
                    <td className="p-4 text-gray-700">{student.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {demoEvents.map((event, index) => (
              <div key={index} className="border rounded-lg p-4 bg-teal-50">
                <h3 className="text-xl font-semibold flex items-center space-x-2">
                  <FaCalendarAlt className="text-teal-600" /> <span>{event.title}</span>
                </h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-700 mt-1">Start: {event.start} | End: {event.end}</p>
              </div>
            ))}
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
  );
};

export default LandingPage;
