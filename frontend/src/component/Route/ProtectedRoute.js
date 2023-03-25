// import React, { Fragment } from 'react'
// import { useSelector } from 'react-redux'
// import { Navigate,  Route, Routes } from 'react-router-dom'


// const ProtectedRoute = ({ element: Component, ...rest}) => {
// const { loading, isAuthenticated , user } = useSelector((state) => state.user)
//   return (
//     <Fragment>
//       {!loading && (
        
//           <Route
//             {...rest}
//             render={(props) => {
//               if (!isAuthenticated) {
//                 return <Navigate to="/login" />;
//               }
//               <Component {...props} />;
//             }}
//           />
        
//       )}
//     </Fragment>
//   );
// }

// export default ProtectedRoute



import React , { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {  Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = (isAdmin) => {
  const { isAuthenticated ,user} = useSelector((state) => state.user);

useEffect(() =>{
  if (isAuthenticated === false) {
    return Navigate("/login");
  }
  if(isAdmin === true && user.role !== "admin"){
    return Navigate("/login"); 
  }
},[isAuthenticated,isAdmin,user.role])
  return <Outlet />;
}    
 

export default ProtectedRoute

