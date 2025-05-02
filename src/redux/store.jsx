import { configureStore } from "@reduxjs/toolkit";
import classReducer from './classSlice.jsx'
import teacherReducer from './teacherSlice.jsx'
const store = configureStore({
    reducer:{
      class:classReducer,
      teacher:teacherReducer,
      

    }
})

export default store;