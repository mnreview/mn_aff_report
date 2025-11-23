import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Dashboard from './components/Dashboard';
import DetailedReport from './components/DetailedReport';
import Auth from './components/Auth';
import ApiConfig from './components/ApiConfig';
import Settings from './components/Settings';

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

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/setup-api" element={<ApiConfig />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard data={data} setData={setData} />
          </ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute>
            <DetailedReport data={data} />
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
