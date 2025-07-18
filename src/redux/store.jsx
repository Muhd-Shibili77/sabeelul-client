import { configureStore } from "@reduxjs/toolkit";
import classReducer from './classSlice.jsx'
import teacherReducer from './teacherSlice.jsx'
import studentReducer from './studentSlice.jsx'
import programReducer from './programSlice.jsx'
import itemReducer from './itemSlice.jsx'
import themeReducer from './themeSlice.jsx'
import leaderBoardReducer from './leaderBoardSlice.jsx'
const store = configureStore({
    reducer:{
      class:classReducer,
      teacher:teacherReducer,
      student:studentReducer,
      program:programReducer,
      item:itemReducer,
      theme:themeReducer,
      leaderboard:leaderBoardReducer
    }
})

export default store;