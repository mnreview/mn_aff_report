import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DetailedReport from './components/DetailedReport';

function App() {
  // Lift state up to share data between Dashboard and DetailedReport
  const [data, setData] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard data={data} setData={setData} />} />
        <Route path="/report" element={<DetailedReport data={data} />} />
      </Routes>
    </Router>
  );
}

export default App;
