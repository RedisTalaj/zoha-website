import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
// --- THIS IS THE FIX: We add BACKEND_URL to the import list ---
import { getProjectById, getProjectImages, createSubmission, BACKEND_URL } from '../api/apiService'; 
import AnimatedPage from '../components/animations/AnimatedPage';
import { Parallax } from 'react-parallax';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// --- The hardcoded BACKEND_URL constant is now DELETED from here ---

// --- STYLED COMPONENTS ---
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
`;
const HeroSection = styled.div`
  height: 70vh;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
`;
const HeroTitle = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  position: relative;
  z-index: 2;
`;
const DetailContainer = styled.div`
  max-width: 1200px;
  margin: -100px auto 0;
  position: relative;
  z-index: 5;
  background-color: var(--surface-color);
  padding: 4rem;
  border-radius: 12px;
  box-shadow: 0 -5px 30px rgba(0,0,0,0.1);
  margin-bottom: 5rem;
`;
const DetailsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-bottom: 4rem;
  align-items: start;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const InfoBlock = styled.div`
  background-color: var(--background-color);
  padding: 2rem;
  border-radius: 8px;
  position: sticky;
  top: 120px;
`;
const InfoItem = styled.div`
  margin-bottom: 1.5rem;
  &:last-child { margin-bottom: 0; }
  h3 { color: var(--accent-color); margin-bottom: 0.5rem; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; }
  p { font-size: 1.1rem; color: var(--text-color); }
`;
const Description = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--secondary-text-color);
`;
const GalleryGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 4rem;
`;
const GalleryImage = styled(motion.img)`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover { transform: scale(1.03); }
`;
const ContactSection = styled.div`
  border-top: 1px solid var(--border-color);
  padding-top: 4rem;
  margin-top: 4rem;
`;
const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const ContactInfo = styled.div`
  h2 { font-size: 2rem; margin-bottom: 1rem; }
  p { color: var(--secondary-text-color); line-height: 1.7; }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  font-size: 1rem;
  font-family: var(--font-family);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(0, 198, 179, 0.2);
  }
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  font-size: 1rem;
  font-family: var(--font-family);
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(0, 198, 179, 0.2);
  }
`;
const SubmitButton = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 6px;
  background-color: var(--accent-color);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover:not(:disabled) {
    background-color: var(--accent-color-hover);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const FormStatus = styled.p`
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  background-color: ${props => props.type === 'success' ? 'rgba(0, 198, 179, 0.1)' : 'rgba(255, 100, 100, 0.1)'};
  color: ${props => props.type === 'success' ? 'var(--accent-color)' : '#d32f2f'};
`;

function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState({ message: '', type: '' });

    useEffect(() => {
        const fetchProjectData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [projectData, imagesData] = await Promise.all([
                    getProjectById(id), getProjectImages(id)
                ]);
                setProject(projectData);
                setAdditionalImages(imagesData);
            } catch (err) {
                console.error("Failed to fetch project data:", err);
                setError("Could not load project details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjectData();
    }, [id]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormStatus({ message: '', type: '' });
        try {
            const submissionData = { ...formData, projectId: id };
            await createSubmission(submissionData);
            setFormStatus({ message: 'Thank you! Your message has been sent.', type: 'success' });
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            console.error("Submission failed:", err);
            setFormStatus({ message: 'Something went wrong. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <LoadingContainer>Loading Project...</LoadingContainer>;
    if (error) return <LoadingContainer>{error}</LoadingContainer>;
    if (!project) return <LoadingContainer>Project not found.</LoadingContainer>;
    
    const coverImageUrl = project.imageUrl ? `${BACKEND_URL}${project.imageUrl}` : '';
    const allImages = [{ src: coverImageUrl }, ...additionalImages.map(img => ({ src: `${BACKEND_URL}${img.imageUrl}` }))];

    return (
        <AnimatedPage>
            <Parallax bgImage={coverImageUrl} strength={300}>
                <HeroSection>
                    <HeroTitle initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        {project.title}
                    </HeroTitle>
                </HeroSection>
            </Parallax>

            <DetailContainer>
                <DetailsGrid initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <InfoBlock>
                        <InfoItem><h3>Category</h3><p>{project.category}</p></InfoItem>
                    </InfoBlock>
                    <Description>{project.description}</Description>
                </DetailsGrid>

                {additionalImages.length > 0 && (
                    <motion.div initial={{opacity: 0}} whileInView={{opacity: 1}} viewport={{once: true}}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Gallery</h2>
                        <GalleryGrid>
                            {additionalImages.map((image, index) => (
                                <GalleryImage key={image.id} src={`${BACKEND_URL}${image.imageUrl}`} alt={`Project gallery image ${index + 1}`}
                                    onClick={() => { setLightboxIndex(index + 1); setLightboxOpen(true); }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                />
                            ))}
                        </GalleryGrid>
                    </motion.div>
                )}

                <ContactSection>
                    <ContactGrid>
                        <ContactInfo>
                            <h2>Interested in this Project?</h2>
                            <p>Use the form to get in touch with us for more details, collaboration opportunities, or to discuss how we can bring a similar vision to life for you.</p>
                        </ContactInfo>
                        <Form onSubmit={handleFormSubmit}>
                            {formStatus.message && <FormStatus type={formStatus.type}>{formStatus.message}</FormStatus>}
                            <Input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleFormChange} required disabled={isSubmitting} />
                            <Input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleFormChange} required disabled={isSubmitting} />
                            <Textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleFormChange} required disabled={isSubmitting} />
                            <SubmitButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                            </SubmitButton>
                        </Form>
                    </ContactGrid>
                </ContactSection>
            </DetailContainer>

            <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={allImages} index={lightboxIndex} />
        </AnimatedPage>
    );
}

export default ProjectDetail;