import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Dashboard from './components/Dashboard';
import DetailedReport from './components/DetailedReport';
import Auth from './components/Auth';
import ApiConfig from './components/ApiConfig';
import Settings from './components/Settings';
import Pricing from './components/Pricing';
import LandingPage from './components/LandingPage';
import About from './components/About';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  // Lift state up to share data between Dashboard and DetailedReport
  const [data, setData] = useState([]);
  const [appId, setAppId] = useState('');
  const [secret, setSecret] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: config } = await supabase
        .from('user_api_configs')
        .select('app_id, app_secret')
        .eq('user_id', user.id)
        .single();

      if (config) {
        setAppId(config.app_id);
        setSecret(config.app_secret);
      }
    };

    fetchConfig();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/setup-api" element={<ApiConfig />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard
              data={data}
              setData={setData}
              appId={appId}
              secret={secret}
              setAppId={setAppId}
              setSecret={setSecret}
              userId={userId}
            />
          </ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute>
            <DetailedReport
              data={data}
              appId={appId}
              secret={secret}
              userId={userId}
            />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
