import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Award, Users, Zap, FileText, BarChart2, ChevronLeft, ChevronRight, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    // { path: '/blog', title: 'Blog', icon: <BookMarked size={20} /> },
    { path: '/learning-progress', title: 'Learning Progress', icon: <BarChart2 size={20} /> },
    { path: '/learning-paths', title: 'Learning Paths', icon: <BookOpen size={20} /> },
    { path: '/resources', title: 'Resources', icon: <FileText size={20} /> },
    { path: '/challenges', title: 'Challenges', icon: <Zap size={20} /> },
    { path: '/communities', title: 'Communities', icon: <Users size={20} /> },
    // { path: '/achievements', title: 'Achievements', icon: <Award size={20} /> },
  ];

  return (
    <motion.div 
      className={`${collapsed ? 'w-20' : 'w-64'} min-h-screen h-full bg-gradient-to-b from-purple-700 to-indigo-700 text-white p-4 transition-all duration-300 relative sticky top-0 shadow-lg`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-1 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all duration-200"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Sidebar Header */}
      <div className={`font-bold mb-8 transition-all duration-300 ${collapsed ? 'text-xl text-center' : 'text-2xl'}`}>
        {collapsed ? (
          <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto">
            UD
          </div>
        ) : (
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200">
            User Dashboard
          </div>
        )}
      </div>

      {/* Sidebar Links */}
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md' 
                    : 'hover:bg-indigo-800/50 text-indigo-100 hover:text-white'
                }`}
              >
                <div className={`${collapsed ? 'mx-auto' : ''} ${isActive ? 'text-white' : 'text-indigo-300'}`}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>
                    {item.title}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-6 bg-white rounded-full"></div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom Section - Only visible when not collapsed */}
      {!collapsed && (
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <div className="bg-indigo-600/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-indigo-200 mb-2">Need Help?</h4>
            <p className="text-xs text-indigo-300 mb-3">
              Visit our support center or contact us for assistance
            </p>
            <Link
            to="/contact"
            >
            <button className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium hover:bg-white transition-colors">
              Contact Support
            </button>
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;