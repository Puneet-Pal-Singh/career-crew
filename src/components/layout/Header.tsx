// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, UserPlus, LogOut, Search, Briefcase, Users, BarChart2, Settings } from 'lucide-react'; // Added more potential icons
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import { usePathname } from 'next/navigation';

// --- Mock Auth (Replace with your actual auth context/logic) ---
// Ensure this mock reflects the structure your actual auth context will provide.
interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'seeker' | 'employer' | 'admin';
}

const MOCK_IS_AUTHENTICATED = true; // Set to true or false to test states
const MOCK_USER_DATA: MockUser | null = MOCK_IS_AUTHENTICATED 
  ? { id: '123', name: 'Alex Doe', email: 'alex@example.com', role: 'employer' } 
  : null;
// --- End Mock Auth ---

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isAuthenticated = MOCK_IS_AUTHENTICATED;
  const user = MOCK_USER_DATA;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5); // Trigger "scrolled" state earlier for a more responsive feel
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Optional: Close mobile menu on route change
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const mainNavLinks = [
    { href: '/jobs', label: 'Browse Jobs', icon: Search },
    { href: '/#features', label: 'Features', icon: Briefcase }, // Link to a section in homepage
    { href: '/#how-it-works', label: 'How It Works', icon: Users }, // Example new link
    // { href: '/blog', label: 'Blog', icon: Rss }, // If you add a blog
  ];

  const getDashboardLink = () => {
    if (user?.role === 'admin') return { href: '/admin/dashboard', label: 'Admin Panel', icon: Settings };
    if (user?.role === 'employer') return { href: '/employer/dashboard', label: 'Employer Hub', icon: BarChart2 };
    if (user?.role === 'seeker') return { href: '/seeker/dashboard', label: 'My Dashboard', icon: BarChart2 };
    return { href: '/dashboard', label: 'Dashboard', icon: BarChart2 }; // Fallback
  };
  
  const dashboardLinkInfo = isAuthenticated ? getDashboardLink() : null;

  const employerPostJobLink = { href: '/employer/post-job', label: 'Post a Job', icon: Briefcase };

  const headerBaseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out";
  const islandInitialBg = "bg-transparent py-3"; // Fully transparent initially, relies on content padding below it
  const islandScrolledBg = "bg-surface-light/85 dark:bg-surface-dark/80 backdrop-blur-lg shadow-md py-2";
  // When mobile menu is open, force the scrolled background for clarity
  const currentBg = (isScrolled || isMobileMenuOpen) ? islandScrolledBg : islandInitialBg;

  const linkBaseClasses = "font-medium text-sm transition-colors duration-150";
  const linkDefaultColor = "text-content-light dark:text-content-dark";
  const linkHoverColor = "hover:text-primary dark:hover:text-primary-dark";
  const linkActiveColor = "text-primary dark:text-primary-dark font-semibold";


  const renderNavLink = (link: { href: string, label: string, icon?: React.ElementType }, isMobile = false) => {
    const IconComponent = link.icon;
    const isActive = pathname === link.href || (link.href.includes('#') && pathname === '/' && typeof window !== 'undefined' && window.location.hash === link.href.substring(link.href.indexOf('#')));

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={closeMobileMenu}
        className={`${linkBaseClasses} ${isActive ? linkActiveColor : linkDefaultColor} ${linkHoverColor} ${isMobile ? 'flex items-center px-3 py-3 text-base rounded-md hover:bg-primary/5 dark:hover:bg-primary-dark/5' : 'py-2'}`}
      >
        {IconComponent && isMobile && <IconComponent size={18} className="mr-3" />}
        {link.label}
      </Link>
    );
  };

  return (
    <header className={`${headerBaseClasses} ${currentBg}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
            {/* You can use an SVG logo here if you have one */}
            <span className="font-display text-2xl md:text-3xl font-bold text-primary dark:text-primary-dark">
              CareerCrew
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-5 lg:space-x-6">
            {mainNavLinks.map(link => renderNavLink(link))}
            {isAuthenticated && dashboardLinkInfo && renderNavLink(dashboardLinkInfo)}
            {isAuthenticated && user?.role === 'employer' && renderNavLink(employerPostJobLink)}
          </nav>

          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className={`${linkBaseClasses} ${linkDefaultColor} ${linkHoverColor} px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md bg-primary dark:bg-primary-dark px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-opacity"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  // onClick={logoutFunction} // Implement your logout logic
                  className={`${linkBaseClasses} text-danger dark:text-danger-dark hover:bg-danger/10 px-4 py-2 rounded-md flex items-center`}
                >
                  <LogOut size={16} className="mr-1.5" /> Logout
                </button>
              )}
            </div>
            <div className="ml-3">
              <ThemeToggleButton />
            </div>
            <div className="md:hidden ml-2">
              <button
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                className="p-2 rounded-md text-content-light dark:text-content-dark hover:bg-surface-light/50 dark:hover:bg-surface-dark/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 w-full bg-surface-light dark:bg-surface-dark shadow-xl border-t border-border-light dark:border-border-dark">
          <nav className="px-4 pt-3 pb-4 space-y-1">
            {mainNavLinks.map(link => renderNavLink(link, true))}
            {isAuthenticated && dashboardLinkInfo && renderNavLink(dashboardLinkInfo, true)}
            {isAuthenticated && user?.role === 'employer' && renderNavLink(employerPostJobLink, true)}
            
            <div className="pt-3 mt-2 border-t border-border-light dark:border-border-dark space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className={`${linkBaseClasses} ${linkDefaultColor} ${linkHoverColor} flex items-center w-full px-3 py-3 text-base rounded-md hover:bg-primary/5 dark:hover:bg-primary-dark/5`}
                  >
                    <LogIn size={18} className="mr-3" /> Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="flex items-center w-full bg-primary dark:bg-primary-dark px-3 py-3 rounded-md text-base font-semibold text-white dark:text-gray-900 hover:opacity-90 transition-all duration-150"
                  >
                    <UserPlus size={18} className="mr-3" /> Sign Up
                  </Link>
                </>
              ) : (
                <button
                  // onClick={() => { logoutFunction(); closeMobileMenu(); }}
                  onClick={closeMobileMenu}
                  className={`${linkBaseClasses} text-danger dark:text-danger-dark hover:bg-danger/10 flex items-center w-full px-3 py-3 text-base rounded-md`}
                >
                  <LogOut size={18} className="mr-3" /> Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}