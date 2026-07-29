import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
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
import LandingPage from './pages/LandingPage';
import useNotifications from './hooks/useNotifications';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import { LanguageProvider } from './context/LanguageContext';

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
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<ScanPill />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/adherence" element={<Adherence />} />
          <Route path="/caregiver" element={<Caregiver />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
