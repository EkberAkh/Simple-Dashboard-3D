import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-primary-400"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 overflow-hidden" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
};
