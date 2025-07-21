import { Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from '../../api/apiService';

function ProtectedRoute({ children }) {
    if (!isAdminLoggedIn()) {
        // If not logged in, redirect to the login page
        return <Navigate to="/admin/login" />;
    }
    return children;
}

export default ProtectedRoute;