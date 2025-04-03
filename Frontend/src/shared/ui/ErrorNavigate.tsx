import { Navigate } from 'react-router-dom';

interface ErrorNavigateProps {
    path: string;
}

export const ErrorNavigate = ({ path }: ErrorNavigateProps) => {
    return <Navigate to={path} replace />;
};
