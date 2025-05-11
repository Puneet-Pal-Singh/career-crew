// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, UserPlus, LogOut, Search, Briefcase, Users, BarChart2, Settings } from 'lucide-react';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import { usePathname } from 'next/navigation';

// --- Mock Auth (Replace with your actual auth context/logic) ---
interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'seeker' | 'employer' | 'admin';
}
const MOCK_IS_AUTHENTICATED = true; 
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
      setIsScrolled(window.scrollY > 30); 
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { 
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const mainNavLinks = [
    { href: '/jobs', label: 'Browse Jobs', icon: Search },
    { href: '/#features', label: 'Features', icon: Briefcase },
    { href: '/#how-it-works', label: 'How It Works', icon: Users },
  ];
  const getDashboardLink = () => {
    if (user?.role === 'admin') return { href: '/admin/dashboard', label: 'Admin Panel', icon: Settings };
    if (user?.role === 'employer') return { href: '/employer/dashboard', label: 'Employer Hub', icon: BarChart2 };
    if (user?.role === 'seeker') return { href: '/seeker/dashboard', label: 'My Dashboard', icon: BarChart2 };
    return { href: '/dashboard', label: 'Dashboard', icon: BarChart2 };
  };
  const dashboardLinkInfo = isAuthenticated ? getDashboardLink() : null;
  const employerPostJobLink = { href: '/employer/post-job', label: 'Post a Job', icon: Briefcase };

  // --- Style Definitions for Consistency ---
  const outerHeaderWrapperClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out";
  // The top padding on the outer wrapper gives the "float" space for the island.
  // This padding is ONLY applied when scrolled.
  const outerHeaderPadding = isScrolled ? 'pt-3 sm:pt-4' : 'pt-0';

  const innerElementBaseClasses = "transition-all duration-300 ease-in-out";
  // Consistent vertical padding for the inner visual element in both states.
  // This helps maintain consistent height for the content area.
  const innerElementVerticalPadding = "py-2 sm:py-3"; // Consistent padding top/bottom for the bar

  let innerElementLayoutStyles = ""; // For margins, rounding, bg, shadow, border
  // Content wrapper for items inside the header bar.
  // Horizontal padding for this should be consistent.
  const contentWrapperHorizontalPadding = "px-4 sm:px-6 lg:px-8";

  const linkDefaultColor = "text-content-light dark:text-content-dark";
  const linkHoverColor = "hover:text-primary dark:hover:text-primary-dark";
  const linkActiveColor = "text-primary dark:text-primary-dark font-semibold";
  const logoColor = "text-primary dark:text-primary-dark";

  if (isScrolled) {
    innerElementLayoutStyles = `
      mx-3 sm:mx-4 md:mx-5       الخلق {/* Island margins */}
      rounded-xl md:rounded-2xl  الخلق {/* Island rounding */}
      bg-surface-light/70 dark:bg-surface-dark/60 الخلق {/* "Okayish" transparency - MODERATE OPACITY */}
      backdrop-blur-lg         الخلق {/* Blur effect */}
      shadow-xl                الخلق {/* Shadow for depth */}
      border border-black/[0.05] dark:border-white/[0.05] الخلق {/* Subtle border */}
    `;
  } else {
    // Not scrolled: Full width, transparent background
    innerElementLayoutStyles = `
      bg-transparent 
      ${contentWrapperHorizontalPadding} الخلق {/* Apply container-like padding directly when full-width */}
    `;
    // When not scrolled, the inner element itself acts like the container for horizontal padding.
  }
  
  // Combine base classes with state-specific layout and consistent vertical padding
  const finalInnerElementClasses = `${innerElementBaseClasses} ${innerElementLayoutStyles} ${innerElementVerticalPadding}`;
  // The content wrapper will mainly handle max-width if needed when the header is an island.
  // When full-width, horizontal padding is on innerElementLayoutStyles.
  const finalContentWrapperClasses = isScrolled ? `w-full ${contentWrapperHorizontalPadding}` : 'w-full';


  // --- Mobile Menu Styling ---
  let mobileMenuBgClasses = "";
  let mobileMenuContainerClasses = "absolute left-0 right-0"; 
  let mobileMenuInnerWrapperClasses = "overflow-hidden z-40";

  if (isMobileMenuOpen) {
    if (isScrolled) {
      mobileMenuBgClasses = `bg-surface-light/85 dark:bg-surface-dark/80 backdrop-blur-lg shadow-xl border-x border-b border-black/[0.06] dark:border-white/[0.06]`;
      mobileMenuContainerClasses += ` top-full mx-3 sm:mx-4 md:mx-5 rounded-b-xl md:rounded-b-2xl`;
      mobileMenuInnerWrapperClasses += ` pt-1`; 
    } else {
      mobileMenuBgClasses = `bg-surface-light dark:bg-surface-dark shadow-xl border-b border-border-light dark:border-border-dark`;
      mobileMenuContainerClasses += ` top-full`;
    }
  }

  const renderNavLink = (link: { href: string, label: string, icon?: React.ElementType }, isMobile = false) => {
    const IconComponent = link.icon;
    const isActive = pathname === link.href || (link.href.includes('#') && pathname === '/' && typeof window !== 'undefined' && window.location.hash === link.href.substring(link.href.indexOf('#')));
    const baseItemClasses = "font-medium text-sm";
    const mobileItemClasses = isMobile ? `flex items-center w-full px-3 py-2.5 text-base rounded-md ${isActive ? 'bg-primary/10 dark:bg-primary-dark/10' : ''} hover:bg-primary/10 dark:hover:bg-primary-dark/10` : 'py-2';

    return (
      <Link
        key={link.href + (isMobile ? '-mobile' : '')}
        href={link.href}
        onClick={closeMobileMenu}
        className={`${baseItemClasses} ${isActive ? linkActiveColor : linkDefaultColor} ${linkHoverColor} ${mobileItemClasses}`}
      >
        {IconComponent && isMobile && <IconComponent size={18} className="mr-3 flex-shrink-0" />}
        <span>{link.label}</span>
      </Link>
    );
  };

  return (
    <header className={`${outerHeaderWrapperClasses} ${outerHeaderPadding}`}>
      {/* This div is the actual visual header bar/island */}
      <div className={finalInnerElementClasses}>
        {/* Content wrapper ensures items stay within bounds and helps with alignment */}
        <div className={finalContentWrapperClasses}>
          <div className="flex h-12 md:h-14 items-center justify-between"> {/* FIXED HEIGHT for internal content */}
            <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
              <span className={`font-display text-2xl md:text-3xl font-bold ${logoColor}`}>
                CareerCrew
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-4 lg:space-x-5">
              {mainNavLinks.map(link => renderNavLink(link))}
              {isAuthenticated && dashboardLinkInfo && renderNavLink(dashboardLinkInfo)}
              {isAuthenticated && user?.role === 'employer' && renderNavLink(employerPostJobLink)}
            </nav>

            <div className="flex items-center">
              <div className="hidden md:flex items-center space-x-2">
                {!isAuthenticated ? (
                  <>
                    <Link href="/login" className={`font-medium text-sm px-4 py-2 rounded-md ${linkDefaultColor} ${linkHoverColor} hover:bg-black/[0.03] dark:hover:bg-white/[0.03]`}>Login</Link>
                    <Link href="/register" className="rounded-md bg-primary dark:bg-primary-dark px-4 py-2 text-sm font-semibold text-white dark:text-gray-900 shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Sign Up</Link>
                  </>
                ) : (
                  <button className={`font-medium text-sm px-4 py-2 rounded-md flex items-center text-danger dark:text-danger-dark hover:bg-danger/10`}>
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
                  className={`p-2 rounded-md ${linkDefaultColor} hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary`}
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`${mobileMenuContainerClasses} ${mobileMenuInnerWrapperClasses}`}>
          <div className={mobileMenuBgClasses}>
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {mainNavLinks.map(link => renderNavLink(link, true))}
              {isAuthenticated && dashboardLinkInfo && renderNavLink(dashboardLinkInfo, true)}
              {isAuthenticated && user?.role === 'employer' && renderNavLink(employerPostJobLink, true)}
              
              <div className={`pt-3 mt-2 border-t ${isScrolled ? 'border-black/[0.06] dark:border-white/[0.06]' : 'border-border-light dark:border-border-dark'} space-y-2`}>
                {!isAuthenticated ? (
                  <>
                    {renderNavLink({ href: '/login', label: 'Login', icon: LogIn }, true)}
                    <Link href="/register" onClick={closeMobileMenu} className={`flex items-center w-full bg-primary dark:bg-primary-dark px-3 py-2.5 rounded-md text-base font-semibold text-white dark:text-gray-900 hover:opacity-90 transition-all duration-150`}>
                      <UserPlus size={18} className="mr-3 flex-shrink-0" /><span>Sign Up</span>
                    </Link>
                  </>
                ) : (
                  <button onClick={closeMobileMenu} className={`font-medium flex items-center w-full px-3 py-2.5 text-base rounded-md text-danger dark:text-danger-dark hover:bg-danger/10`}>
                      <LogOut size={18} className="mr-3 flex-shrink-0" /><span>Logout</span>
                    </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}