import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { checkAuth } from "./services/authCheck";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthGatePage from "./components/auth/AuthGatePage";

const HomePage = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UploadPage = lazy(() => import("./pages/UploadFile"));

const RouteSkeleton = () => (
  <div className="min-h-screen px-4 py-6 md:px-8">
    <div className="mx-auto w-full max-w-7xl space-y-3">
      <div className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      <div className="h-[68vh] animate-pulse rounded-2xl border border-white/10 bg-white/5" />
    </div>
  </div>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    async function init() {
      const res = await checkAuth();
      if (res.authenticated) setUser(res.user);
      setLoadingAuth(false);
    }
    init();
  }, []);

  useEffect(() => {
  if (!window.ethereum) return;

  const handleAccountsChanged = async (accounts) => {
    const next = accounts?.[0]?.toLowerCase?.() || null;
    const current = user?.address?.toLowerCase?.() || null;

    // strict mode: if authenticated session exists but wallet account changes, force logout state
    if (current && next && current !== next) {
      setUser(null);
    }

    // if wallet disconnected, clear local state
    if (!next && current) {
      setUser(null);
    }
  };

  const handleChainChanged = async () => {
    // lightweight re-check to keep UI truthful after chain switch
    const res = await checkAuth();
    if (res.authenticated) setUser(res.user);
    else setUser(null);
  };

  window.ethereum.on("accountsChanged", handleAccountsChanged);
  window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [user]);

  if (loadingAuth) return <RouteSkeleton />;

  return (
    <Router>
      <Suspense fallback={<RouteSkeleton />}>
        <Routes>
          <Route path="/" element={<HomePage user={user} setUser={setUser} />} />

          <Route
            path="/auth-gateway"
            element={<AuthGatePage setUser={setUser} />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute user={user}>
                <UploadPage user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;