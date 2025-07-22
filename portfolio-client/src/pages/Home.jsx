import styled from 'styled-components';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import AnimatedPage from '../components/animations/AnimatedPage';
import ProjectCard from '../components/common/ProjectCard';

// --- THIS IS THE FIX: We add BACKEND_URL to the import list ---
import { getProjects, BACKEND_URL } from '../api/apiService';

import { FiPenTool, FiLayers, FiCompass } from 'react-icons/fi';

// --- The hardcoded BACKEND_URL constant is now DELETED from here ---

// --- Styled Components (No changes from here on) ---
const Section = styled.section`...`;
// ... (all the other styled components remain exactly the same) ...
const SectionTitle = styled(motion.h2)`...`;
const HeroSection = styled.div`...`;
const HeroBgImage = styled(motion.div)`...`;
const HeroContent = styled(motion.div)`...`;
const HeroTitle = styled.h1`...`;
const PortfolioGrid = styled(motion.div)`...`;
const AboutSection = styled(Section)`...`;
const ArchitectImage = styled(motion.img)`...`;
const LoadingContainer = styled.div`...`;
const ProcessGrid = styled(motion.div)`...`;
const ProcessStepCard = styled(motion.div)`...`;
const StepIcon = styled.div`...`;
const StepTitle = styled.h3`...`;
const StepDescription = styled.p`...`;
const StickyContainer = styled.div`...`;
const StickyImageContainer = styled.div`...`;
const StickyImage = styled(motion.img)`...`;
const ScrollableContent = styled.div`...`;
const ProgressLine = styled.div`...`;
const ProgressBar = styled(motion.div)`...`;
const ProjectStep = styled.div`...`;
const ProjectTextContainer = styled(motion.div)`...`;
const ProjectCategory = styled.div`...`;
const ProjectTitle = styled.h2`...`;
const ProjectDescription = styled.p`...`;

function FeaturedProjects({ projects }) {
  const [activeStickyProject, setActiveStickyProject] = useState(projects[0]);
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  const stepVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <Section>
      <SectionTitle initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Featured Projects</SectionTitle>
      <StickyContainer>
        <StickyImageContainer>
          <AnimatePresence mode="wait">
            {/* --- THIS IS THE FIX: Using the dynamic BACKEND_URL --- */}
            <StickyImage key={activeStickyProject.id} src={`${BACKEND_URL}${activeStickyProject.imageUrl}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </AnimatePresence>
        </StickyImageContainer>
        <div ref={scrollRef}>
          <ScrollableContent>
            <ProgressLine />
            <ProgressBar style={{ scaleY: scrollYProgress }} />
            {projects.map(project => (
              <ProjectStep key={project.id}>
                <motion.div onViewportEnter={() => setActiveStickyProject(project)}>
                  <ProjectTextContainer variants={stepVariants}
                    initial="hidden" animate={activeStickyProject.id === project.id ? "visible" : "hidden"}>
                    <ProjectCategory>{project.category}</ProjectCategory>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectDescription>{project.description}</ProjectDescription>
                  </ProjectTextContainer>
                </motion.div>
              </ProjectStep>
            ))}
          </ScrollableContent>
        </div>
      </StickyContainer>
    </Section>
  );
}

const processSteps = [ /* ... process steps data ... */ ];

function Home() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects(); 
                if (Array.isArray(data) && data.length > 0) {
                    setProjects(data);
                }
            } catch (err) {
                 console.error("Failed to fetch projects:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);
    
    if (isLoading) { return <LoadingContainer>Loading Zoha Architecture...</LoadingContainer>; }

    const stickyProjects = projects.slice(0, 4);
    const recentWorksProjects = projects.slice(0, 8); 
    const gridVariants = { /* ... */ };
    const cardVariants = { /* ... */ };

    return (
        <AnimatedPage>
            <HeroSection>
                <HeroBgImage initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }} />
                <HeroContent initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: 'easeOut' }}>
                    <HeroTitle>Zoha Studio</HeroTitle>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>Pioneering the future of form and function through bold design.</motion.p>
                </HeroContent>
            </HeroSection>
            
            {stickyProjects.length > 0 && <FeaturedProjects projects={stickyProjects} />}
            
            {recentWorksProjects.length > 0 && (
                <Section>
                    <SectionTitle initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Recent Works</SectionTitle>
                    <PortfolioGrid variants={gridVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {recentWorksProjects.map(project => (
                            <ProjectCard key={project.id} project={project} variants={cardVariants} />
                        ))}
                    </PortfolioGrid>
                </Section>
            )}

            <Section style={{ backgroundColor: 'var(--background-color)'}}>
                <SectionTitle initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    Our Collaborative Process
                </SectionTitle>
                <ProcessGrid variants={gridVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} >
                    {processSteps.map((step, index) => (
                        <ProcessStepCard key={index} variants={cardVariants}>
                            <StepIcon>{step.icon}</StepIcon>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                        </ProcessStepCard>
                    ))}
                </ProcessGrid>
            </Section>

            <AboutSection>
                <ArchitectImage src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=800" alt="Zoha, the lead architect"
                    initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                    <h2 style={{fontSize: '2.5rem', marginBottom: '1.5rem'}}>Meet The Visionary</h2>
                    <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>
                        Zoha, the principal architect and creative force behind the studio, brings over two decades of international experience. With a philosophy rooted in the seamless integration of technology, sustainability, and human-centric design, Zoha's work has garnered global acclaim.
                    </p>
                    <p style={{fontSize: '1.1rem'}}>
                        Each project is a testament to a relentless pursuit of innovation and a deep respect for the context in which it exists.
                    </p>
                </motion.div>
            </AboutSection>
        </AnimatedPage>
    );
}

export default Home;