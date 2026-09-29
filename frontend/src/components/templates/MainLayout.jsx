import React, { useState } from 'react';
import { Navbar } from '../organisms/Navbar';
import { UploadModal } from '../organisms/UploadModal';

export const MainLayout = ({ children, onVideoPublished }) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleVideoPublished = (newVideo) => {
    if (onVideoPublished) {
      onVideoPublished(newVideo);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onOpenUpload={() => setIsUploadOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <footer className="w-full border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CloudTube. Single Page Application con React, FastAPI, S3 y RDS.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI en EC2</span>
            <span>•</span>
            <span>Amazon S3</span>
            <span>•</span>
            <span>Amazon RDS</span>
          </div>
        </div>
      </footer>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onVideoPublished={handleVideoPublished}
      />
    </div>
  );
};
