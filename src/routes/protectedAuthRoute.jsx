import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; 


const ProtectedAuthRoutes =({element}) =>{
    const token = localStorage.getItem('token')
    
    if(token){
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken?.role;
      
        if(userRole === 'Admin'){
            return <Navigate to={"/admin/dashboard"}/>
        }
        if(userRole === 'Teacher'){
            return <Navigate to={"/teacher/score"}/>
        }
        if(userRole === 'Student'){
            return <Navigate to={"/student/dashboard"}/>
        }
    }
    return element;
}

export default ProtectedAuthRoutes;