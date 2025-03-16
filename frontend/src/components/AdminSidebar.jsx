import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart2, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Shield, 
  Flag,
  MessageSquare,
  Bell,
  HelpCircle,
  Layout,
  Database,
  Plus,
  List,
  UserCog,
  Globe
} from 'lucide-react';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (collapsed) {
      // Reset expanded section when expanding the sidebar
      setExpandedSection(null);
      setExpandedSubMenu(null);
    }
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const toggleSubMenu = (subMenu) => {
    if (expandedSubMenu === subMenu) {
      setExpandedSubMenu(null);
    } else {
      setExpandedSubMenu(subMenu);
    }
  };

  // Organized menu items by category
  const menuCategories = [
    // {
    //   id: 'analytics',
    //   title: 'Analytics',
    //   icon: <BarChart2 size={20} />,
    //   items: [
    //     { path: '/admin/dashboard', title: 'Overview', icon: <Layout size={16} /> },
    //     { path: '/admin/metrics', title: 'Key Metrics', icon: <BarChart2 size={16} /> },
    //     { path: '/admin/reports', title: 'Reports', icon: <FileText size={16} /> },
    //   ]
    // },
    {
      id: 'content',
      title: 'Content',
      icon: <BookOpen size={20} />,
      items: [
        { path: '/admin/posts', title: 'Manage Posts', icon: <FileText size={16} /> },
        { 
          id: 'learning-paths',
          title: 'Learning Paths', 
          icon: <BookOpen size={16} />,
          isSubMenu: true,
          subItems: [
            { path: '/admin/learning-paths/create', title: 'Create Learning Path', icon: <Plus size={16} /> },
            { path: '/admin/learning-paths/all', title: 'View All Learning Paths', icon: <List size={16} /> },
          ]
        },
        { 
          path: '/admin/communities', 
          title: 'Communities', 
          icon: <Users size={16} />,
          isSubMenu: true,
          subItems: [
            { path: '/admin/communities/create', title: 'Create Community', icon: <Plus size={16} /> },
            { path: '/admin/communities/manage', title: 'Manage Participants', icon: <UserCog size={16} /> },
            { path: '/admin/communities/all', title: 'View All Communities', icon: <Globe size={16} /> },

          ]
        },
      ]
    },
    {
      id: 'users',
      title: 'Users',
      icon: <Users size={20} />,
      items: [
        { path: '/admin/users', title: 'User Management', icon: <Users size={16} /> },
        // { path: '/admin/roles', title: 'Roles & Permissions', icon: <Shield size={16} /> },
      ]
    },
    // {
    //   id: 'moderation',
    //   title: 'Moderation',
    //   icon: <Flag size={20} />,
    //   items: [
    //     { path: '/admin/reports', title: 'Reported Content', icon: <Flag size={16} /> },
    //     { path: '/admin/comments', title: 'Comment Moderation', icon: <MessageSquare size={16} /> },
    //     { path: '/admin/notifications', title: 'Notifications', icon: <Bell size={16} /> },
    //   ]
    // },
    // {
    //   id: 'system',
    //   title: 'System',
    //   icon: <Settings size={20} />,
    //   items: [
    //     { path: '/admin/settings', title: 'Site Settings', icon: <Settings size={16} /> },
    //     { path: '/admin/backups', title: 'Backups & Data', icon: <Database size={16} /> },
    //     { path: '/admin/help', title: 'Help & Support', icon: <HelpCircle size={16} /> },
    //   ]
    // },
  ];

  return (
    <div 
    className={`${collapsed ? 'w-16' : 'w-64'} min-h-screen bg-gradient-to-b from-purple-800 to-indigo-900 text-white transition-all duration-300 relative shadow-xl flex flex-col`}    >
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-1 text-white hover:from-purple-600 hover:to-indigo-600 shadow-md transition-all duration-200"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Sidebar Header */}
      <div className="p-4 border-b border-indigo-700">
        <div className={`font-bold transition-all duration-300 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? (
            <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto">
              <Shield size={18} />
            </div>
          ) : (
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Shield size={18} />
              </div>
              <span className="ml-3 text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200">
                Admin Portal
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className="py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuCategories.map((category) => {
            const isCategoryActive = !collapsed && category.items.some(item => {
              if (item.isSubMenu && item.subItems) {
                return item.subItems.some(subItem => location.pathname === subItem.path);
              }
              return location.pathname === item.path;
            });
            const isExpanded = expandedSection === category.id;
            
            return (
              <li key={category.id}>
                {/* Category Header */}
                <button
                  onClick={() => !collapsed && toggleSection(category.id)}
                  className={`w-full flex items-center p-2 rounded-lg transition-all duration-200
                    ${isCategoryActive ? 'bg-indigo-700/50' : 'hover:bg-indigo-800/30'}
                    ${collapsed ? 'justify-center' : 'justify-between'}`}
                >
                  <div className="flex items-center">
                    <span className={`${collapsed ? '' : 'mr-3'} text-indigo-300`}>
                      {category.icon}
                    </span>
                    {!collapsed && (
                      <span className="text-sm font-medium text-indigo-100">
                        {category.title}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <ChevronRight 
                      size={16} 
                      className={`text-indigo-300 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
                    />
                  )}
                </button>
                
                {/* Category Items (only show when not collapsed and section is expanded) */}
                {!collapsed && isExpanded && (
                  <ul className="pl-4 mt-1 space-y-1">
                    {category.items.map((item) => {
                      const isItemActive = item.isSubMenu 
                        ? item.subItems.some(subItem => location.pathname === subItem.path)
                        : location.pathname === item.path;
                      const isSubMenuExpanded = expandedSubMenu === item.id;
                      
                      if (item.isSubMenu && item.subItems) {
                        return (
                          <li key={item.id}>
                            {/* Submenu Header */}
                            <button
                              onClick={() => toggleSubMenu(item.id)}
                              className={`w-full flex items-center justify-between p-2 pl-4 text-sm rounded-md transition-all duration-200 ${
                                isItemActive
                                  ? 'bg-indigo-700/50 text-white'
                                  : 'text-indigo-200 hover:bg-indigo-700/30 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="mr-3 text-indigo-300">{item.icon}</span>
                                <span>{item.title}</span>
                              </div>
                              <ChevronRight 
                                size={14} 
                                className={`text-indigo-300 transform transition-transform duration-200 ${isSubMenuExpanded ? 'rotate-90' : ''}`}
                              />
                            </button>
                            
                            {/* Submenu Items */}
                            {isSubMenuExpanded && (
                              <ul className="pl-6 mt-1 space-y-1">
                                {item.subItems.map((subItem) => {
                                  const isSubItemActive = location.pathname === subItem.path;
                                  
                                  return (
                                    <li key={subItem.path}>
                                      <Link
                                        to={subItem.path}
                                        className={`flex items-center p-2 pl-4 text-sm rounded-md transition-all duration-200 ${
                                          isSubItemActive 
                                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm' 
                                            : 'text-indigo-200 hover:bg-indigo-700/30 hover:text-white'
                                        }`}
                                      >
                                        <span className="mr-3 text-indigo-300">{subItem.icon}</span>
                                        <span>{subItem.title}</span>
                                        {isSubItemActive && (
                                          <div className="ml-auto w-1 h-4 bg-white rounded-full"></div>
                                        )}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      } else {
                        return (
                          <li key={item.path}>
                            <Link
                              to={item.path}
                              className={`flex items-center p-2 pl-4 text-sm rounded-md transition-all duration-200 ${
                                isItemActive 
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm' 
                                  : 'text-indigo-200 hover:bg-indigo-700/30 hover:text-white'
                              }`}
                            >
                              <span className="mr-3 text-indigo-300">{item.icon}</span>
                              <span>{item.title}</span>
                              {isItemActive && (
                                <div className="ml-auto w-1 h-4 bg-white rounded-full"></div>
                              )}
                            </Link>
                          </li>
                        );
                      }
                    })}
                  </ul>
                )}
                
                {/* When collapsed, show individual items without category structure */}
                {collapsed && (
                  <ul className="mt-1 space-y-1">
                    {category.items.map((item) => {
                      if (item.isSubMenu && item.subItems) {
                        return (
                          <React.Fragment key={item.id}>
                            {item.subItems.map((subItem) => {
                              const isActive = location.pathname === subItem.path;
                              
                              return (
                                <li key={subItem.path}>
                                  <Link
                                    to={subItem.path}
                                    className={`flex items-center justify-center p-2 rounded-md transition-all duration-200 ${
                                      isActive 
                                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                                        : 'text-indigo-300 hover:bg-indigo-700/30 hover:text-white'
                                    }`}
                                    title={`${item.title} - ${subItem.title}`}
                                  >
                                    {subItem.icon}
                                  </Link>
                                </li>
                              );
                            })}
                          </React.Fragment>
                        );
                      } else {
                        const isActive = location.pathname === item.path;
                        
                        return (
                          <li key={item.path}>
                            <Link
                              to={item.path}
                              className={`flex items-center justify-center p-2 rounded-md transition-all duration-200 ${
                                isActive 
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                                  : 'text-indigo-300 hover:bg-indigo-700/30 hover:text-white'
                              }`}
                              title={item.title}
                            >
                              {item.icon}
                            </Link>
                          </li>
                        );
                      }
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Admin Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
        <Link 
          to="/profile"
          className="flex items-center"
        >
          {collapsed ? (
            <div className="h-8 w-8 rounded-full bg-indigo-600 mx-auto flex items-center justify-center">
              A
            </div>
          ) : (
            <>
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                A
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-indigo-100">Admin User</p>
                <p className="text-xs text-indigo-300">View Profile</p>
              </div>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;