import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAdminProjects, createProject, deleteProject,
    getSubmissions, deleteSubmission, clearAdminAuth,
    uploadImages
} from '../../api/apiService';
import AnimatedPage from '../../components/animations/AnimatedPage';

// MUI Imports
import {
    Container, Box, Typography, Button, Modal, TextField,
    Paper, IconButton, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Style for the Modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

function AdminDashboard() {
    // State variables
    const [projects, setProjects] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newProject, setNewProject] = useState({ title: '', description: '', category: '' });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    // --- REWRITTEN DATA FETCHING ---
    const fetchAdminData = async () => {
        setIsLoading(true);
        try {
            // Because our apiService now returns clean data, we don't need .then(res => res.data)
            const projectsData = await getAdminProjects();
            const submissionsData = await getSubmissions();
            setProjects(projectsData);
            setSubmissions(submissionsData);
        } catch (error) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAdminData(); }, []);

    const handleAuthError = (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            setSnackbar({ open: true, message: 'Session expired. Please log in again.', severity: 'error' });
            clearAdminAuth();
            navigate('/admin/login');
        } else {
             console.error("An error occurred:", error);
        }
    };

    const handleProjectChange = (e) => setNewProject({ ...newProject, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setSelectedFiles(Array.from(e.target.files));

    // --- REWRITTEN UPLOAD LOGIC ---
    const handleAddProject = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            setSnackbar({ open: true, message: 'Please select at least one image file!', severity: 'error' });
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            selectedFiles.forEach(file => formData.append('files', file));
            
            // uploadImages now returns the data object directly { urls: [...] }
            const uploadData = await uploadImages(formData);
            const imageUrls = uploadData.urls;

            const projectData = {
                ...newProject,
                imageUrl: imageUrls[0], // First image is the cover
                additionalImageUrls: imageUrls.slice(1), // The rest are gallery images
            };

            await createProject(projectData);
            
            fetchAdminData();
            handleCloseModal();
            setSnackbar({ open: true, message: 'Project added successfully!', severity: 'success' });
        } catch (error) {
            console.error('Failed to add project:', error);
            setSnackbar({ open: true, message: 'Failed to add project.', severity: 'error' });
            handleAuthError(error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                fetchAdminData(); // Refetch all data to stay in sync
                setSnackbar({ open: true, message: 'Project deleted.', severity: 'info' });
            } catch (error) {
                handleAuthError(error);
            }
        }
    };

    const handleDeleteSubmission = async (id) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                await deleteSubmission(id);
                fetchAdminData(); // Refetch all data
                setSnackbar({ open: true, message: 'Submission deleted.', severity: 'info' });
            } catch (error) {
                handleAuthError(error);
            }
        }
    };

    const handleLogout = () => { clearAdminAuth(); navigate('/admin/login'); };
    const handleOpenModal = () => {
        setNewProject({ title: '', description: '', category: '' });
        setSelectedFiles([]);
        setOpenModal(true);
    };
    const handleCloseModal = () => setOpenModal(false);
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    // DataGrid columns
    const projectColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'category', headerName: 'Category', flex: 1 },
        {
            field: 'actions', headerName: 'Actions', width: 150, sortable: false,
            renderCell: (params) => (<IconButton onClick={() => handleDeleteProject(params.row.id)} color="error"><DeleteIcon /></IconButton>),
        },
    ];

    const submissionColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'message', headerName: 'Message', flex: 2 },
        {
            field: 'actions', headerName: 'Actions', width: 150, sortable: false,
            renderCell: (params) => (<IconButton onClick={() => handleDeleteSubmission(params.row.id)} color="error"><DeleteIcon /></IconButton>),
        },
    ];

    return (
        <AnimatedPage>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">Admin Dashboard</Typography>
                    <Button variant="outlined" onClick={handleLogout}>Logout</Button>
                </Box>

                {isLoading ? <Box sx={{display: 'flex', justifyContent: 'center', my: 10}}><CircularProgress /></Box> :
                <>
                    <Paper sx={{ p: 2, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" component="h2">Manage Projects ({projects.length})</Typography>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>Add New Project</Button>
                        </Box>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid rows={projects} columns={projectColumns} pageSizeOptions={[5, 10]} autoHeight />
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Contact Submissions ({submissions.length})</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid rows={submissions} columns={submissionColumns} pageSizeOptions={[5, 10]} autoHeight />
                        </Box>
                    </Paper>
                </>
                }

                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box component="form" sx={modalStyle} onSubmit={handleAddProject}>
                        <Typography variant="h6" component="h2">Add a New Project</Typography>
                        <TextField name="title" label="Title" variant="outlined" onChange={handleProjectChange} required disabled={isUploading} />
                        <TextField name="category" label="Category" variant="outlined" onChange={handleProjectChange} required disabled={isUploading} />
                        <TextField name="description" label="Description" multiline rows={4} variant="outlined" onChange={handleProjectChange} required disabled={isUploading} />
                        <Button variant="contained" component="label" disabled={isUploading}>
                            Upload Images (first is cover)
                            <input type="file" hidden onChange={handleFileChange} required multiple />
                        </Button>
                        {selectedFiles.length > 0 && <Typography variant="caption">{selectedFiles.length} file(s) selected</Typography>}
                        <Button type="submit" variant="contained" color="primary" disabled={isUploading}>
                            {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Save Project'}
                        </Button>
                    </Box>
                </Modal>

                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
                </Snackbar>
            </Container>
        </AnimatedPage>
    );
}

export default AdminDashboard;