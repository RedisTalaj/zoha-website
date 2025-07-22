import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom'; // <-- IMPORT Outlet

// Import Layouts
import Layout from './components/layout/Layout';

// Import Pages
import Home from './pages/Home';
import ProjectsPage from './pages/Projects'; // Use the same name as in your previous working version
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './pages/admin/ProtectedRoute';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* === YOUR CORRECT PUBLIC ROUTING STRUCTURE === */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
        </Route>

        {/* === THE NEW ADMIN ROUTES (they do not use the main Layout) === */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

// Wrap App in Router
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;