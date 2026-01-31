import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RegisterReferral from './components/RegisterReferral';
import Reports from './components/Reports';
import Profile from './components/Profile';
import PublicRegister from './pages/PublicRegister';
import { useAuth } from './hooks/useAuth';
import type { ViewState } from './types';

type AuthenticatedViewState = Exclude<ViewState, 'login'>;

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-campaign-orange"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Wrapper para la página de registro público
const PublicRegisterWrapper: React.FC = () => {
  const { referralCode } = useParams<{ referralCode: string }>();
  const navigate = useNavigate();

  return (
    <PublicRegister 
      referralCode={referralCode || ''} 
      onSuccess={() => navigate('/')}
      onBack={() => navigate('/login')}
    />
  );
};

// Componente principal de la app autenticada
const AuthenticatedApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthenticatedViewState>('dashboard');
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleChangeView = (view: ViewState) => {
    if (view !== 'login') {
      setCurrentView(view);
    }
  };

  return (
    <Layout
      currentView={currentView}
      onChangeView={handleChangeView}
      onLogout={handleLogout}
    >
      {currentView === 'dashboard' && <Dashboard onNavigate={handleChangeView} />}
      {currentView === 'register' && <RegisterReferral />}
      {currentView === 'reports' && <Reports />}
      {currentView === 'network' && <Reports />}
      {currentView === 'profile' && <Profile />}
    </Layout>
  );
};

// Login wrapper
const LoginWrapper: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return <Login />;
};

function App() {
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/ref/:referralCode" element={<PublicRegisterWrapper />} />
        <Route path="/register/:referralCode" element={<PublicRegisterWrapper />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <AuthenticatedApp />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
