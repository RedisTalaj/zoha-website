import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // This is now used by <motion.div>

const BACKEND_URL = 'http://localhost:8085';

const CardLink = styled(Link)`
  text-decoration: none;
  color: var(--text-color);
  display: block;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-8px);
  }
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: var(--secondary-text-color);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;

// ** THE FIX IS HERE **
// We now accept the 'variants' prop from Home.jsx
function ProjectCard({ project, variants }) { 
  if (!project) {
    return null;
  }

  return (
    // We wrap the entire card in a <motion.div>
    // and apply the variants to it. This fixes the error.
    <motion.div variants={variants}>
      <CardLink to={`/projects/${project.id}`}>
        <CardImage src={`${BACKEND_URL}${project.imageUrl}`} alt={project.title} />
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardLink>
    </motion.div>
  );
}

export default ProjectCard;