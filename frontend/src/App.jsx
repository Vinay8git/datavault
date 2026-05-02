import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";

import HomePage from './pages/Home';
import Dashboard from './pages/Dashboard';
import FileSharePro from './pages/UploadFile';

import { checkAuth } from "./services/authCheck";

const App = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function init() {

      const res = await checkAuth();

      if (res.authenticated) {
        setUser(res.user);
      }

      setLoading(false);
    }

    init();

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>

      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              user={user}
              setUser={setUser}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              user={user}
              setUser={setUser}
            />
          }
        />

        <Route
          path="/upload"
          element={
            <FileSharePro
              user={user}
              setUser={setUser}
            />
          }
        />

      </Routes>

    </Router>
  );
};

export default App;