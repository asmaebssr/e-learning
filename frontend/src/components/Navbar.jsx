import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../toolkit/features/auth/authSlice';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Check if user is admin
  const isAdmin = user?.isAdmin || (user?.user?.isAdmin) || false;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/logout', {}, {
        withCredentials: true,
      });
      dispatch(logout());
      setIsMenuOpen(false);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const isActive = (path) => location.pathname === path;

  // Get active link classes
  const getNavLinkClasses = (path) => {
    return isActive(path)
      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg"
      : "text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300";
  };

  // Get active mobile link classes
  const getMobileNavLinkClasses = (path) => {
    return isActive(path)
      ? "block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-md text-base font-medium shadow-lg"
      : "block text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-700 px-3 py-2 rounded-md text-base font-medium transition-all duration-300";
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';

    if (user.user && user.user.username) {
      return user.user.username;
    }

    if (user.username) {
      return user.username;
    }

    if (user.email) {
      return user.email.split('@')[0];
    }

    if (user.user && user.user.email) {
      return user.user.email.split('@')[0];
    }

    return 'User';
  };

  const getUserEmail = () => {
    if (!user) return '';

    if (user.email) {
      return user.email;
    }

    if (user.user && user.user.email) {
      return user.user.email;
    }

    return '';
  };

  // Gets the first letter for the avatar display
  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <motion.nav
      className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-700 font-bold text-xl">NeoLearn</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={getNavLinkClasses("/")}>Home</Link>
            
            {/* Conditional rendering based on admin status */}
            {!isAdmin && (
              <>
                <Link to="/about" className={getNavLinkClasses("/about")}>About</Link>
                <Link to="/blog" className={getNavLinkClasses("/blog")}>Blog</Link>
                <Link to="/contact" className={getNavLinkClasses("/contact")}>Contact</Link>
              </>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium focus:outline-none transition-all duration-300"
                  aria-expanded={isDropdownOpen}
                >
                  <span>{getUserDisplayName()}</span>
                  <svg
                    className={`ml-1 h-5 w-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-700"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={getNavLinkClasses("/login")}>Sign In</Link>
                <Link to="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-700 focus:outline-none transition-all duration-300"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className={getMobileNavLinkClasses("/")} onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            
            {/* Conditional rendering based on admin status for mobile */}
            {!isAdmin && (
              <>
                <Link to="/about" className={getMobileNavLinkClasses("/about")} onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
                <Link to="/blog" className={getMobileNavLinkClasses("/blog")} onClick={() => setIsMenuOpen(false)}>
                  Blog
                </Link>
                <Link to="/contact" className={getMobileNavLinkClasses("/contact")} onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
              </>
            )}

            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-medium">{getUserInitial()}</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-900">{getUserDisplayName()}</div>
                    <div className="text-sm font-medium text-gray-500">{getUserEmail()}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Link to="/dashboard" className="block text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-700 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-700 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50 hover:text-indigo-700 px-3 py-2 rounded-md text-base font-medium">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className={getMobileNavLinkClasses("/login")} onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-md text-base font-medium shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;