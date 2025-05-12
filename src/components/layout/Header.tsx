// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react'; // Fragment is not needed here anymore
import { Menu, X, LogIn, UserPlus, LogOut, Search, Briefcase, Users, BarChart2, Settings } from 'lucide-react';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton'; // Path to your ThemeToggleButton
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

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
      setIsScrolled(window.scrollY > 10); 
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { 
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);

  // This useEffect was for debugging mobile menu background, can be removed if not needed
  // useEffect(() => {
  //   if (isMobileMenuOpen && isScrolled) { 
  //       // Logic handled by currentBg calculation
  //   }
  //   if (isMobileMenuOpen && !isScrolled) {
  //       // Logic handled by currentBg calculation for mobile menu
  //   }
  // }, [isMobileMenuOpen, isScrolled]);


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

  const outerHeaderWrapperClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out";
  const outerHeaderPaddingScrolled = 'pt-2.5 sm:pt-3'; 
  const outerHeaderPaddingNotScrolled = 'pt-0';

  const innerElementBaseClasses = "transition-all duration-300 ease-in-out";
  const innerElementVerticalPadding = "py-3 sm:py-3.5"; 

  let innerElementLayoutStyles = "";
  let textAndIconColorForLinks = "text-content-light dark:text-content-dark"; 
  let logoColorClass = "text-primary dark:text-primary-dark"; 
  const textShadowForTransparentBg = " [text-shadow:0_0_8px_rgba(0,0,0,0.2)] dark:[text-shadow:0_0_8px_rgba(255,255,255,0.1)]";


  if (isScrolled || isMobileMenuOpen) { 
    innerElementLayoutStyles = `
      mx-2.5 sm:mx-3 md:mx-4
      rounded-lg md:rounded-xl 
      bg-surface-light/80 dark:bg-surface-dark/75 
      backdrop-blur-lg 
      shadow-lg 
      border border-black/[0.04] dark:border-white/[0.04]
    `;
    textAndIconColorForLinks = "text-content-light dark:text-content-dark"; 
    logoColorClass = "text-primary dark:text-primary-dark";
  } else {
    innerElementLayoutStyles = `
      bg-transparent 
      px-4 sm:px-6 lg:px-8
    `;
    // Apply text shadow only when background is transparent
    textAndIconColorForLinks = `text-content-light dark:text-content-dark${textShadowForTransparentBg}`;
    logoColorClass = `text-primary dark:text-primary-dark${textShadowForTransparentBg}`;
  }
  
  const finalInnerElementClasses = `${innerElementBaseClasses} ${innerElementLayoutStyles} ${innerElementVerticalPadding}`;
  const contentWrapperClasses = isScrolled || isMobileMenuOpen ? `px-3 sm:px-4` : '';

  const linkBaseClasses = `font-medium text-sm transition-colors duration-150`;
  const linkHoverClass = "hover:text-primary dark:hover:text-primary-dark";
  const linkActiveClass = "text-primary dark:text-primary-dark font-semibold";

  const renderNavLink = (link: { href: string, label: string, icon?: React.ElementType }, isMobile = false) => {
    const IconComponent = link.icon;
    const isActive = pathname === link.href || (link.href.includes('#') && pathname === '/' && typeof window !== 'undefined' && window.location.hash === link.href.substring(link.href.indexOf('#')));
    
    const currentLinkColor = isActive ? linkActiveClass : textAndIconColorForLinks;
    
    const desktopLinkClasses = `${linkBaseClasses} ${currentLinkColor} ${!isActive ? linkHoverClass : ''} py-2`;
    const mobileLinkClasses = `flex items-center w-full px-3 py-3 text-base rounded-md ${linkBaseClasses} ${currentLinkColor} ${!isActive ? ('hover:bg-primary/5 dark:hover:bg-primary-dark/5 ' + linkHoverClass) : 'bg-primary/10 dark:bg-primary-dark/10'}`;

    return (
      <Link
        key={link.href + (isMobile ? '-mobile' : '')}
        href={link.href}
        onClick={closeMobileMenu}
        className={isMobile ? mobileLinkClasses : desktopLinkClasses}
      >
        {IconComponent && isMobile && <IconComponent size={18} className="mr-3 flex-shrink-0" />}
        <span>{link.label}</span>
      </Link>
    );
  };
  
  return (
    <header className={`${outerHeaderWrapperClasses} ${isScrolled || isMobileMenuOpen ? outerHeaderPaddingScrolled : outerHeaderPaddingNotScrolled}`}>
      <div className={finalInnerElementClasses}>
        <div className={`flex h-12 md:h-14 items-center justify-between ${contentWrapperClasses}`}>
          <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
            <span className={`font-display text-2xl md:text-3xl font-bold ${logoColorClass}`}>
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
                  <Link href="/login" className={`${linkBaseClasses} ${textAndIconColorForLinks} ${linkHoverClass} px-4 py-2 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.03]`}>Login</Link>
                  <Link href="/register" className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-opacity bg-primary text-white dark:bg-primary-dark dark:text-gray-900 hover:opacity-90`}>Sign Up</Link>
                </>
              ) : (
                <button className={`${linkBaseClasses} ${textAndIconColorForLinks} px-4 py-2 rounded-md flex items-center text-danger dark:text-danger-dark hover:bg-danger/10`}>
                  <LogOut size={16} className="mr-1.5" /> Logout
                </button>
              )}
            </div>
            <div className="ml-3">
              {/* Pass the dynamically determined textAndIconColorForLinks to ThemeToggleButton */}
              <ThemeToggleButton iconColorClass={textAndIconColorForLinks} />
            </div>
            <div className="md:hidden ml-2">
              <button
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                className={`p-2 rounded-md ${textAndIconColorForLinks} hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary`}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div 
          className={`md:hidden absolute left-0 right-0 top-full shadow-xl 
                      ${isScrolled ? 'mx-2.5 sm:mx-3 md:mx-4 rounded-b-lg md:rounded-b-xl border-x border-b border-black/[0.04] dark:border-white/[0.04]' : 'border-b border-border-light dark:border-border-dark'}
                      ${isScrolled || isMobileMenuOpen ? 'bg-surface-light/95 dark:bg-surface-dark/90 backdrop-blur-md' : 'bg-surface-light dark:bg-surface-dark'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {mainNavLinks.map(link => renderNavLink(link, true))}
            {isAuthenticated && dashboardLinkInfo && renderNavLink(dashboardLinkInfo, true)}
            {isAuthenticated && user?.role === 'employer' && renderNavLink(employerPostJobLink, true)}
            
            <div className={`pt-3 mt-2 border-t ${isScrolled ? 'border-black/[0.04] dark:border-white/[0.04]' : 'border-border-light dark:border-border-dark'} space-y-2`}>
              {!isAuthenticated ? (
                <>
                  {renderNavLink({href: '/login', label: 'Login', icon: LogIn}, true)}
                  <Link href="/register" onClick={closeMobileMenu} className={`flex items-center w-full px-3 py-3 text-base rounded-md font-semibold transition-all duration-150 bg-primary text-white dark:bg-primary-dark dark:text-gray-900 hover:opacity-90`}>
                    <UserPlus size={18} className="mr-3 flex-shrink-0" /><span>Sign Up</span>
                  </Link>
                </>
              ) : (
                 <button onClick={closeMobileMenu} className={`${linkBaseClasses} ${textAndIconColorForLinks} flex items-center w-full px-3 py-3 text-base rounded-md hover:bg-danger/10 text-danger dark:text-danger-dark`}>
                    <LogOut size={18} className="mr-3 flex-shrink-0" /><span>Logout</span>
                  </button>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}