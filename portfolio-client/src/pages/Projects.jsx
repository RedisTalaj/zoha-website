import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { getProjects } from '../api/apiService';
import ProjectCard from '../components/common/ProjectCard';
import AnimatedPage from '../components/animations/AnimatedPage';

// --- STYLED COMPONENTS ---

const ProjectsContainer = styled.div`
  padding: 120px 5% 6rem; /* Add top padding to not be hidden by the navbar */
  max-width: 1600px;
  margin: 0 auto;
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--secondary-text-color);
  max-width: 600px;
  margin: 0 auto;
`;

// We can reuse the same grid style from the Home page for consistency
const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
  font-size: 1.5rem;
`;

const EmptyStateContainer = styled(LoadingContainer)`
  flex-direction: column;
`;

// --- PROJECTS PAGE COMPONENT ---

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs once when the component mounts
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const data = await getProjects();
        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        // Keep projects as an empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProjects();
  }, []); // Empty dependency array ensures this runs only once

  // Animation variants for the grid and cards
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Render a loading state while fetching data
  if (isLoading) {
    return (
      <AnimatedPage>
        <LoadingContainer>Loading Projects...</LoadingContainer>
      </AnimatedPage>
    );
  }
  
  // Render a message if no projects are found
  if (projects.length === 0) {
      return (
          <AnimatedPage>
              <EmptyStateContainer>
                  <PageTitle>No Projects Found</PageTitle>
                  <PageSubtitle>There are currently no projects to display. Please check back later.</PageSubtitle>
              </EmptyStateContainer>
          </AnimatedPage>
      )
  }

  return (
    <AnimatedPage>
      <ProjectsContainer>
        <PageHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageTitle>All Projects</PageTitle>
          <PageSubtitle>
            A curated collection of our architectural endeavors, showcasing a commitment to innovative design and functional elegance.
          </PageSubtitle>
        </PageHeader>
        
        <ProjectsGrid
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} variants={cardVariants} />
          ))}
        </ProjectsGrid>

      </ProjectsContainer>
    </AnimatedPage>
  );
}

export default ProjectsPage;