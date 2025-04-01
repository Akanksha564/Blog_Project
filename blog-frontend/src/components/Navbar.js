import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  
  const [showSidebar, setShowSidebar] = useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState ? JSON.parse(savedState) : false;
  });
  
  const sidebarRef = useRef(null);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  
  const handleMouseLeave = () => {
    setShowSidebar(false);
    localStorage.setItem('sidebarOpen', JSON.stringify(false));
  };

  const toggleSidebar = () => {
    const newState = !showSidebar;
    setShowSidebar(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const handleSidebarLinkClick = (e) => {
    e.stopPropagation();
    
    if (window.innerWidth < 992) {
      setTimeout(() => {
        setShowSidebar(false);
        localStorage.setItem('sidebarOpen', JSON.stringify(false));
      }, 100);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.classList.contains('sidebar-toggle')) {
        setShowSidebar(false);
        localStorage.setItem('sidebarOpen', JSON.stringify(false));
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  return (
    <>
      <div 
        ref={sidebarRef}
        className={`sidebar bg-dark text-white position-fixed h-100 end-0 top-0 pt-5 px-3 ${showSidebar ? 'show' : ''}`} 
        style={{
          width: "250px",
          zIndex: 1030,
          transform: showSidebar ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
        onMouseLeave={handleMouseLeave}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Blog Menu</h5>
          <button className="btn btn-outline-light btn-sm" onClick={() => setShowSidebar(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="sidebar-content">
          <ul className="nav flex-column">
            <li className="nav-item mb-2" onClick={handleSidebarLinkClick}>
              <Link className="nav-link text-white" to="/">
                <i className="bi bi-house-door me-2"></i>Home
              </Link>
            </li>
            
            <li className="nav-item mb-2" onClick={handleSidebarLinkClick}>
              <Link className="nav-link text-white" to="/blogs">
                <i className="bi bi-stickies me-2"></i>All Blogs
              </Link>
            </li>
            
            {!isAuthenticated ? (
              <>
                <li className="nav-item mb-2" onClick={handleSidebarLinkClick}>
                  <Link className="nav-link text-white" to="/login">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Login
                  </Link>
                </li>
                <li className="nav-item mb-2" onClick={handleSidebarLinkClick}>
                  <Link className="nav-link text-white" to="/register">
                    <i className="bi bi-person-plus me-2"></i>Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mb-2" onClick={handleSidebarLinkClick}>
                  <Link className="nav-link text-white" to="/create-blog">
                    <i className="bi bi-plus-circle me-2"></i>Create Blog
                  </Link>
                </li>
                <li className="nav-item mb-2" onClick={handleSidebarLinkClick}>
                  <Link className="nav-link text-white" to="/my-blogs">
                    <i className="bi bi-journal-text me-2"></i>My Blogs
                  </Link>
                </li>
                <li className="nav-item mb-2" onClick={handleSidebarLinkClick}>
                  <button className="nav-link text-white btn btn-link p-0" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <i className="bi bi-journal-richtext me-2"></i>
            Blog App
          </Link>
    
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-outline-light sidebar-toggle d-lg-none" 
              onClick={toggleSidebar}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
    
          <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {location.pathname !== "/" && (
                <li className="nav-item mx-1">
                  <Link className="nav-link" to="/">
                    <i className="bi bi-house-door me-1"></i>Home
                  </Link>
                </li>
              )}
    
              {!isAuthenticated && (
                <>
                  {location.pathname !== "/blogs" && (
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/blogs">
                        <i className="bi bi-stickies me-1"></i>Blogs
                      </Link>
                    </li>
                  )}
    
                  {location.pathname !== "/create-blog" && location.pathname !== "/login" &&( 
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/create-blog">
                        <i className="bi bi-plus-circle me-1"></i>Create Blog
                      </Link>
                    </li>
                  )}
  
                  {location.pathname !== "/login" && (
                    <li className="nav-item mx-1">
                      <Link className="nav-link  my-2 my-lg-0" to="/login">
                        <i className="bi bi-box-arrow-in-right me-1"></i>Login
                      </Link>
                    </li>
                  )}
    
                  {location.pathname !== "/register" && (
                    <li className="nav-item mx-1">
                      <Link className="nav-link  my-2 my-lg-0" to="/register">
                        <i className="bi bi-person-plus me-1"></i>Register
                      </Link>
                    </li>
                  )}
                </>
              )}
    
              {isAuthenticated && (
                <>
                  {location.pathname !== "/blogs" && (
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/blogs">
                        <i className="bi bi-stickies me-1"></i>Latest Blogs
                      </Link>
                    </li>
                  )}
  
                  {location.pathname !== "/create-blog" && (
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/create-blog">
                        <i className="bi bi-plus-circle me-1"></i>Create Blog
                      </Link>
                    </li>
                  )}
  
                  {location.pathname !== "/my-blogs" && (
                    <li className="nav-item mx-1">
                      <Link className="nav-link" to="/my-blogs">
                        <i className="bi bi-journal-text me-1"></i>My Blogs
                      </Link>
                    </li>
                  )}
    
                  <li className="nav-item mx-1">
                    <button className="nav-link btn btn-outline-light" onClick={onLogout}>
                      <i className="bi bi-box-arrow-right me-1"></i>Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <style>{`
        .sidebar {
          box-shadow: 0 0 15px rgba(0,0,0,0.2);
        }
        
        .sidebar .nav-link:hover {
          background-color: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        
        @media (max-width: 991px) {
          .sidebar {
            width: 250px !important;
          }
        }
        
        @media (min-width: 992px) {
          .sidebar-toggle {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;