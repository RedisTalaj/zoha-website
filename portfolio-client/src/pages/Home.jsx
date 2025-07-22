import styled from 'styled-components';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import AnimatedPage from '../components/animations/AnimatedPage';
import ProjectCard from '../components/common/ProjectCard';

// --- CHANGE 1: We no longer need BACKEND_URL for displaying images in this file ---
import { getProjects } from '../api/apiService';

// --- Import icons for the process section ---
import { FiPenTool, FiLayers, FiCompass } from 'react-icons/fi';


// --- Styled Components (No changes here) ---
const Section = styled.section`
  padding: 6rem 5%;
  max-width: 1600px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 4rem;
`;

const HeroSection = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 5%;
  color: white;
`;

const HeroBgImage = styled(motion.div)`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2000');
  background-size: cover;
  background-position: center;
  z-index: 1;
`;

const HeroContent = styled(motion.div)`
  max-width: 600px;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 15px rgba(0,0,0,0.3);
  line-height: 1.1;
  margin-bottom: 1.5rem;
`;

const PortfolioGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
  @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const AboutSection = styled(Section)`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  align-items: center;
  @media(max-width: 768px) { grid-template-columns: 1fr; }
`;

const ArchitectImage = styled(motion.img)`
  width: 100%;
  border-radius: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
`;

const ProcessGrid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    
    @media (max-width: 992px) {
        grid-template-columns: 1fr;
    }
`;

const ProcessStepCard = styled(motion.div)`
    background-color: var(--surface-color);
    padding: 2.5rem 2rem;
    border-radius: 12px;
    text-align: center;
    border: 1px solid var(--border-color);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.07);
    }
`;

const StepIcon = styled.div`
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 1.5rem;
    display: inline-block;
`;

const StepTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
`;

const StepDescription = styled.p`
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--secondary-text-color);
`;

const StickyContainer = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; position: relative;
  @media (max-width: 992px) { grid-template-columns: 1fr; }
`;
const StickyImageContainer = styled.div`
  position: sticky; top: 15vh; height: 70vh; border-radius: 20px; overflow: hidden;
  @media (max-width: 992px) { position: relative; top: 0; height: 50vh; margin-bottom: 2rem; }
`;
const StickyImage = styled(motion.img)`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;
`;
const ScrollableContent = styled.div`
  display: flex; flex-direction: column; position: relative; padding-left: 2rem;
`;
const ProgressLine = styled.div`
  position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background-color: var(--border-color);
`;
const ProgressBar = styled(motion.div)`
  position: absolute; left: 0; top: 0; width: 2px; background-color: var(--accent-color); transform-origin: top;
`;
const ProjectStep = styled.div`
  min-height: 70vh; display: flex; flex-direction: column; justify-content: center;
`;
const ProjectTextContainer = styled(motion.div)``;
const ProjectCategory = styled.div`
  background-color: var(--accent-color); color: white; font-size: 0.8rem; font-weight: 500;
  padding: 0.25rem 0.75rem; border-radius: 999px; display: inline-block; margin-bottom: 1.5rem;
`;
const ProjectTitle = styled.h2`
  font-size: 2.2rem; font-weight: 600; margin: 0 0 1rem 0;
`;
const ProjectDescription = styled.p`
  font-size: 1rem; line-height: 1.7; color: var(--secondary-text-color); max-width: 500px;
`;

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
            {/* 
              --- CHANGE 2: THE FIX IS HERE ---
              The src attribute now uses the full Cloudinary URL directly from activeStickyProject.imageUrl.
              The `${BACKEND_URL}` prefix has been removed. This is the only change to this line.
            */}
            <StickyImage key={activeStickyProject.id} src={activeStickyProject.imageUrl}
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


const processSteps = [
    {
        icon: <FiCompass />,
        title: "01. Discovery & Vision",
        description: "We begin with a deep-dive session to understand your vision, functional needs, and the unique character of the site. This collaborative discovery phase forms the bedrock of the entire project."
    },
    {
        icon: <FiPenTool />,
        title: "02. Concept & Design",
        description: "Translating ideas into form, we develop initial concepts through sketches, 3D models, and material palettes. We refine the design with your feedback to create a blueprint that is both beautiful and buildable."
    },
    {
        icon: <FiLayers />,
        title: "03. Execution & Delivery",
        description: "Our studio oversees the construction process, managing timelines, and ensuring the highest quality of craftsmanship. We bridge the gap between blueprint and reality to deliver a space that exceeds expectations."
    }
];

function Home() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects(); 
                if (Array.isArray(data) && data.length > 0) {
                    setProjects(data);
                } else {
                    setProjects([]); 
                }
            } catch (err) {
                 console.error("Failed to fetch projects:", err);
                 setProjects([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);
    
    if (isLoading) {
        return <LoadingContainer>Loading Zoha Architecture...</LoadingContainer>;
    }

    const stickyProjects = projects.slice(0, 4);
    const recentWorksProjects = projects.slice(0, 8); 

    const gridVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

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
                <ProcessGrid
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
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
                <ArchitectImage 
                    src="https://images.unsplash.com/photo-15810gnd3450021-4a7360e9a6b5?auto=format&fit=crop&w=800"
                    alt="Zoha, the lead architect"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                />
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