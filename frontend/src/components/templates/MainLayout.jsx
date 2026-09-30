import React, { useState } from 'react';
import { Navbar } from '../organisms/Navbar';
import { UploadModal } from '../organisms/UploadModal';
import { SideNavigation } from '../organisms/SideNavigation';
import { MobileDock } from '../organisms/MobileDock';

export const MainLayout = ({ children, onVideoPublished }) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSidebarCompact, setIsSidebarCompact] = useState(false);

  const handleVideoPublished = (newVideo) => {
    if (onVideoPublished) {
      onVideoPublished(newVideo);
    }
  };

  return (
    <div className="app-shell-bg min-h-screen text-slate-100">
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onToggleSidebar={() => setIsSidebarCompact((value) => !value)}
      />

      <div className="flex">
        <SideNavigation compact={isSidebarCompact} />

        <main className="min-w-0 flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-[1680px]">
            {children}
          </div>
        </main>
      </div>

      <MobileDock onOpenUpload={() => setIsUploadOpen(true)} />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onVideoPublished={handleVideoPublished}
      />
    </div>
  );
};
