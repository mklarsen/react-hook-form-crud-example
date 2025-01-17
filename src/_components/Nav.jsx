import React from 'react';
import { NavLink } from 'react-router-dom';

function Nav() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                <NavLink to="/domains" className="nav-item nav-link">DNS overview</NavLink>

                <NavLink to="/domainentries" className="nav-item nav-link">DNS records overview</NavLink>

                <NavLink to="/lookup" className="nav-item nav-link disabled">DNS Lookup</NavLink>
                <NavLink to="/whois" className="nav-item nav-link disabled">Whois</NavLink>
                <NavLink to="/users" className="nav-item nav-link">Users</NavLink>
            </div>
        </nav>
    );
}

export { Nav };
