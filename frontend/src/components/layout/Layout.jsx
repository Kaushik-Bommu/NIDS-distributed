import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md overflow-hidden">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Header currentPage={currentPage} />
      <main className="ml-[260px] pt-16 h-screen overflow-y-auto bg-background p-margin-desktop">
        {children}
      </main>
    </div>
  );
}
