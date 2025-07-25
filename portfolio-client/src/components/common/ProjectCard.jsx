import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- CHANGE 1: We no longer need BACKEND_URL for displaying images in this component ---
// import { BACKEND_URL } from '../../api/apiService';

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

function ProjectCard({ project, variants }) { 
  if (!project) {
    return null;
  }

  return (
    <motion.div variants={variants}>
      <CardLink to={`/projects/${project.id}`}>
        {/* 
          --- CHANGE 2: THE FIX IS HERE ---
          The src attribute now uses the full Cloudinary URL directly from project.imageUrl.
          The `${BACKEND_URL}` prefix has been removed.
        */}
        <CardImage src={project.imageUrl} alt={project.title} />
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardLink>
    </motion.div>
  );
}

export default ProjectCard;