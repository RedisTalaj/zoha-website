import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// --- STYLED COMPONENTS ---

// The main container. It's fixed to the top and changes based on the `scrolled` prop.
const NavContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: background-color 0.4s ease-out, box-shadow 0.4s ease-out;

  // Apply styles when the user has scrolled
  &.scrolled {
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    @supports (backdrop-filter: blur(10px)) {
      backdrop-filter: blur(10px);
    }
  }
`;

const NavContent = styled.div`
  width: 100%;
  max-width: 1600px;
  padding: 0 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(NavLink)`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    display: none; // Hide on mobile for a future menu button
  }
`;

const NavItem = styled.li`
  position: relative; // Needed for the underline animation
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: var(--secondary-text-color);
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.3s ease;

  &:hover {
    color: var(--text-color);
  }
  
  // This class is automatically added by NavLink for the active route
  &.active {
    color: var(--text-color);
  }
`;

const Underline = styled(motion.div)`
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-color);
`;

// --- NAVBAR COMPONENT ---

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Effect to listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Set state to true if scrolled more than 50px, otherwise false
      setScrolled(window.scrollY > 50);
    };

    // Add event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    // We can add a contact link here later
    // { to: '/contact', label: 'Contact' }
  ];

  return (
    <NavContainer className={scrolled ? 'scrolled' : ''}>
      <NavContent>
        <Logo to="/">Zoha Architects</Logo>
        <NavLinks>
          {navItems.map((item) => (
            <NavItem key={item.to}>
              <StyledNavLink to={item.to}>
                {item.label}
              </StyledNavLink>
              {/* The underline appears on hover, linked to the active NavLink */}
              <StyledNavLink to={item.to}>
                {({ isActive }) => (
                  isActive && <Underline layoutId="underline" />
                )}
              </StyledNavLink>
            </NavItem>
          ))}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
}

export default Navbar;