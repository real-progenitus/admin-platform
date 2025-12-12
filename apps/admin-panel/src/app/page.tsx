'use client';

import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { useEnvironment } from '../contexts/EnvironmentContext';
import { LoginForm } from '../components/LoginForm';
import { Dashboard } from '../components/Dashboard';
import { LoadingScreen } from "../components/LoadingScreen";

export default function Home() {
  const auth = useAuth();
  const { environment } = useEnvironment();
  const firestore = useFirestore(auth.accessToken, auth.isAuthenticated, environment);

  const handleLogout = async () => {
    await auth.handleLogout();
    firestore.resetData();
  };

  // Show loading screen while checking for existing session
  if (auth.isCheckingAuth) {
    return <LoadingScreen />;
  }

  if (auth.isAuthenticated && auth.user) {
    return (
      <Dashboard
        user={auth.user}
        onLogout={handleLogout}
        landingStats={firestore.landingStats}
        userMetrics={firestore.userMetrics}
        latestSearches={firestore.latestSearches}
        accessCodes={firestore.accessCodes}
        isLoadingData={firestore.isLoadingData}
        dataError={firestore.dataError}
        fetchLandingStats={firestore.fetchLandingStats}
        fetchUserMetrics={firestore.fetchUserMetrics}
        fetchLatestSearches={firestore.fetchLatestSearches}
        fetchAccessCodes={firestore.fetchAccessCodes}
        fetchAvailableMonths={firestore.fetchAvailableMonths}
        accessToken={auth.accessToken}
      />
    );
  }

  return (
    <LoginForm
      email={auth.email}
      setEmail={auth.setEmail}
      password={auth.password}
      setPassword={auth.setPassword}
      error={auth.error}
      isLoading={auth.isLoading}
      onSubmit={auth.handleLogin}
    />
  );
}
