import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/*=======================================*/
/*=======================================*/
/*=======================================*/

const ProtectedRoute = ({ children, requireAuth, adminOnly = false }) => {

    const { currentUser } = useSelector(state => state.auth);

    /*=======================================*/

    // Block logged-out users from auth-only routes
    if (requireAuth && !currentUser) return <Navigate to="/login" replace />;

    // Block logged-in users from auth pages (login/register)
    if (!requireAuth && currentUser) return <Navigate to="/" replace />;

    // New admin check
    if (adminOnly && !currentUser?.isAdmin) {
        return <Navigate to="/" replace />; // Or show "Not Authorized"
    }

    return children;

};

export default ProtectedRoute;