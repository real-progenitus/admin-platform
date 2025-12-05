'use client';

import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { LoginForm } from '../components/LoginForm';
import { Dashboard } from '../components/Dashboard';

export default function Home() {
  const auth = useAuth();
  const firestore = useFirestore(auth.accessToken, auth.isAuthenticated);

  const handleLogout = async () => {
    await auth.handleLogout();
    firestore.resetData();
  };

  if (auth.isAuthenticated && auth.user) {
    return (
      <Dashboard
        user={auth.user}
        onLogout={handleLogout}
        postsStats={firestore.postsStats}
        isLoadingData={firestore.isLoadingData}
        dataError={firestore.dataError}
        fetchPostsStats={firestore.fetchPostsStats}
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
