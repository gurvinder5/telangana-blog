import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom" to="/">
          <i className="bi bi-compass-fill me-2 text-warning"></i>Telangana Tourism
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/blogs">
                Blogs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/about">
                About Telangana
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="text-light d-none d-md-inline-block">
                  <i className="bi bi-person-circle text-warning me-1"></i> Hi, <strong className="text-white">{user.name}</strong>
                </span>
                <Link className="btn btn-outline-warning btn-sm rounded-pill px-3" to="/add-blog">
                  <i className="bi bi-plus-lg me-1"></i> Add Blog
                </Link>
                <button className="btn btn-danger btn-sm rounded-pill px-3" onClick={handleLogoutClick}>
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm rounded-pill px-3" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary-custom btn-sm px-3" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
