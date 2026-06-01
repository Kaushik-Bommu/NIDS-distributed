import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import LiveRadar from './pages/LiveRadar';
import Settings from './pages/Settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState('LiveRadar');

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {currentPage === 'LiveRadar' && <LiveRadar />}
      {currentPage === 'Settings' && <Settings />}
    </Layout>
  );
}
