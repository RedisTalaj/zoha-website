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

// --- Styled Components (No changes from here on) ---
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
`;
// ... (all the other styled components remain exactly the same)
const HeroSection = styled.div`...`;
const HeroTitle = styled(motion.h1)`...`;
const DetailContainer = styled.div`...`;
const DetailsGrid = styled(motion.div)`...`;
const InfoBlock = styled.div`...`;
const InfoItem = styled.div`...`;
const Description = styled(motion.p)`...`;
const GalleryGrid = styled(motion.div)`...`;
const GalleryImage = styled(motion.img)`...`;
const ContactSection = styled.div`...`;
const ContactGrid = styled.div`...`;
const ContactInfo = styled.div`...`;
const Form = styled.form`...`;
const Input = styled.input`...`;
const Textarea = styled.textarea`...`;
const SubmitButton = styled.button`...`;
const FormStatus = styled.p`...`;


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
    
    // --- THIS IS THE FIX: All these lines now use the dynamic BACKEND_URL ---
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
                                // --- THIS IS THE FIX: Using dynamic BACKEND_URL here too ---
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