import { configureStore } from "@reduxjs/toolkit";
import classReducer from './classSlice.jsx'
import teacherReducer from './teacherSlice.jsx'
import studentReducer from './studentSlice.jsx'
import programReducer from './programSlice.jsx'
const store = configureStore({
    reducer:{
      class:classReducer,
      teacher:teacherReducer,
      student:studentReducer,
      program:programReducer,
    }
})

export default store;