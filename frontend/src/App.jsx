import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/AdminDashboard'
import UserDashboard from './pages/user/UserDashboard';
import Home from './pages/Home';
import { login, logout } from './toolkit/features/auth/authSlice';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/Profile';
import Contact from './pages/user/Contact';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import LearningPaths from './pages/user/LearningPaths';
import Blog from './pages/user/Blog';
import Subcategory from './pages/user/Subcategory';
import Technology from './pages/user/Technology';
import Ressources from './pages/user/Resources';
import CreatePost from './pages/user/CreatePost';
import Communities from './pages/user/Communities';
import SubcategoryList from './pages/user/SubcategoryList';
import ManagePosts from './pages/admin/ManagePosts';
import CreatePaths from './pages/admin/CreatePaths';
import AllPaths from './pages/admin/AllPaths';
import Users from './pages/admin/Users';
import ModifyPath from './pages/admin/ModifyPath';
import AllPosts from './pages/admin/AllPosts';
import CreateCommunity from './pages/admin/CreateCommunity';
import ManageParticipants from './pages/admin/ManageParticipants';
import AllCommunities from './pages/admin/AllCommunities';
import About from './pages/user/About';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false); // Add this state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/check', {
          withCredentials: true, 
        });
        console.log("app",res.data)
        
        dispatch(login({ 
          isAuthenticated: true, 
          isAdmin: res.data.isAdmin,
          user: res.data, 
        }));
      } catch (err) {
        console.error('User not authenticated', err.response?.data || err.message);
        dispatch(logout()); 
      } finally {
        setAuthChecked(true); 
      }
    };
  
    checkAuth();
  }, [dispatch]);
  
  if (!authChecked) {
    // Optional: return a loading spinner while checking auth
    return <div>Loading...</div>;
  }

  return (
    <>
<BrowserRouter>
<ToastContainer position="top-right" autoClose={3000} />
  <Navbar />

  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
    <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
    <Route path='/forgot-password' element={<ForgotPassword />}/>
    <Route path='/reset-password/:token' element={<ResetPassword />} />

    
    {/* Protected routes */}
    <Route path="/dashboard" element={
      isAuthenticated 
        ? (isAdmin ? <Navigate to="/admin" /> : <UserDashboard />)
        : <Navigate to="/login" />
    } />
     <Route path="/learning-paths" element={
      isAuthenticated ? <LearningPaths /> : <Navigate to="/login" />
    } />
    <Route  path="/communities" element={isAuthenticated ?  <SubcategoryList /> : <Navigate to="/login" />} />
    <Route path="/communities/:subcategory" element={isAuthenticated ? <Communities /> : <Navigate to="/login" />} />
    <Route path="/blog" element={
      isAuthenticated ? <Blog /> : <Navigate to="/login" />
    } />
    <Route path="blog/create-post" element={
      isAuthenticated ? <CreatePost /> : <Navigate to="/login" />
    } />
    <Route path="/resources" element={
      isAuthenticated && !isAdmin ? <Ressources /> : <Navigate to="/login" />
    } />
     <Route path="/subcategory/:id" element={isAuthenticated ? <Subcategory /> : <Navigate to="/login" />} />
     <Route path="/technology/:pathId/:techId" element={isAuthenticated ? <Technology /> : <Navigate to="/login" />} />

    <Route path="/admin" element={
      isAuthenticated && isAdmin 
        ? <AdminDashboard /> 
        : (isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />)
    } />
    <Route path="/profile" element={
      isAuthenticated 
        ? <Profile /> 
        : <Navigate to="/login" />
    } />
    <Route path="/contact" element={
      isAuthenticated && !isAdmin 
        ? <Contact /> 
        : <Navigate to="/login" />
    } />
    <Route path="/about" element={<About /> } />

    <Route path="/manage-posts" element={
      isAuthenticated && isAdmin ? <ManagePosts /> : <Navigate to="/login" />
    } />
    <Route path="/admin/learning-paths/create" element={
      isAuthenticated && isAdmin ? <CreatePaths /> : <Navigate to="/login" />
    } />
    <Route path="/admin/learning-paths/all" element={
      isAuthenticated && isAdmin ? <AllPaths /> : <Navigate to="/login" />
    } />
    <Route path="/admin/users" element={
      isAuthenticated && isAdmin ? <Users /> : <Navigate to="/login" />
    } />
    <Route path="/modify-path/:id" element={
      isAuthenticated && isAdmin ? <ModifyPath /> : <Navigate to="/login" />
  } />
  <Route path="/admin/posts" element={
      isAuthenticated && isAdmin ? <AllPosts /> : <Navigate to="/login" />
  } />
  <Route path="/admin/communities/create" element={
      isAuthenticated && isAdmin ? <CreateCommunity /> : <Navigate to="/login" />
  } />
  <Route path="/admin/communities/manage" element={
      isAuthenticated && isAdmin ? <ManageParticipants /> : <Navigate to="/login" />
  } />
   <Route path="/admin/communities/all" element={
      isAuthenticated && isAdmin ? <AllCommunities /> : <Navigate to="/login" />
  } />
 
  </Routes>
  

</BrowserRouter>
    </>

  );
};

export default App;
