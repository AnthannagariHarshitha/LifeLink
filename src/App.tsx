import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useNavigate } from './hooks/useNavigate';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { EducationPage } from './pages/EducationPage';
import { HealthPage } from './pages/HealthPage';
import { FinancePage } from './pages/FinancePage';

function AppContent() {
  const { currentPage, navigateTo } = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && (currentPage === 'home' || currentPage === 'login' || currentPage === 'signup')) {
    navigateTo('dashboard');
    return null;
  }

  if (!user && (currentPage === 'dashboard' || currentPage === 'education' || currentPage === 'health' || currentPage === 'finance')) {
    navigateTo('login');
    return null;
  }

  switch (currentPage) {
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignupPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'education':
      return <EducationPage />;
    case 'health':
      return <HealthPage />;
    case 'finance':
      return <FinancePage />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
