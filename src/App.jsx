import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/auth';
import { ThemeProvider } from './utils/theme';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScanPill from './pages/ScanPill';
import Medications from './pages/Medications';
import Adherence from './pages/Adherence';
import Caregiver from './pages/Caregiver';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import useNotifications from './hooks/useNotifications';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/* Notification runner — lives inside providers so it has access to context */
function NotificationRunner() {
  useNotifications();
  return null;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <NotificationRunner />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="scan" element={<ScanPill />} />
          <Route path="medications" element={<Medications />} />
          <Route path="adherence" element={<Adherence />} />
          <Route path="caregiver" element={<Caregiver />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
