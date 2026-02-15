import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Users, Box, Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "bg-primary-50 text-primary-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-primary-50 text-primary-700 shadow-sm"
        : "text-slate-600 hover:bg-slate-50 active:bg-slate-100"
    }`;

  return (
    <header
      className="bg-white border-b border-border sticky top-0 z-40"
      ref={menuRef}
    >
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center"
            aria-hidden="true"
          >
            <Box size={16} className="text-white sm:hidden" />
            <Box size={18} className="text-white hidden sm:block" />
          </div>
          <span
            className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
            aria-label="Dashboard 3D"
          >
            Dashboard<span className="text-primary-600">3D</span>
          </span>
        </div>

        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          <NavLink to="/designers" className={desktopLinkClass}>
            <Users size={16} />
            Designers
          </NavLink>
          <NavLink to="/editor" className={desktopLinkClass}>
            <Box size={16} />
            Editor
          </NavLink>
        </nav>

        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span
            className={`absolute transition-all duration-200 ${mobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`}
          >
            <Menu size={20} />
          </span>
          <span
            className={`absolute transition-all duration-200 ${mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
          >
            <X size={20} />
          </span>
        </button>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-13 bg-black/20 backdrop-blur-[2px] md:hidden animate-fade-in"
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav
            className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg md:hidden animate-menu-slide-down"
            aria-label="Mobile navigation"
          >
            <div className="px-3 py-3 flex flex-col gap-1">
              <NavLink to="/designers" className={mobileLinkClass}>
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Users size={16} className="text-primary-600" />
                </div>
                <div>
                  <span className="block">Designers</span>
                  <span className="text-xs text-slate-400 font-normal">
                    Manage your team
                  </span>
                </div>
              </NavLink>
              <NavLink to="/editor" className={mobileLinkClass}>
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Box size={16} className="text-primary-600" />
                </div>
                <div>
                  <span className="block">Editor</span>
                  <span className="text-xs text-slate-400 font-normal">
                    3D scene editor
                  </span>
                </div>
              </NavLink>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};
