// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, UserPlus, LogOut as LogOutIcon, Search, Briefcase, Users, BarChart2, Settings, LayoutDashboard } from 'lucide-react'; // Renamed LogOut to LogOutIcon to avoid conflict
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

// No longer need Mock Auth

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // For programmatic navigation

  // Use real authentication context
  const { user, signOut, isLoading: authIsLoading, isInitialized } = useAuth();
  const isAuthenticated = !!user && isInitialized; // User exists and auth context is initialized

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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSignOut = async () => {
    closeMobileMenu(); // Close mobile menu if open
    const { error } = await signOut();
    if (!error) {
      router.push('/'); // Redirect to homepage after sign out
    } else {
      console.error('Error signing out:', error.message);
      // Optionally show an error message to the user
    }
  };

  const mainNavLinks = [
    { href: '/jobs', label: 'Browse Jobs', icon: Search },
    { href: '/#how-it-works', label: 'How It Works', icon: Users }, // Keep if these are public sections
    { href: '/#features', label: 'Features', icon: Briefcase }, // Keep if these are public sections
  ];

  // Dynamic dashboard link based on actual user data (once we store role in Supabase 'profiles' table)
  // For now, a generic dashboard link if authenticated.
  const dashboardLinkInfo = isAuthenticated ? { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard } : null;
  // We'll add role-specific links later when user profiles with roles are set up.
  // const employerPostJobLink = isAuthenticated && user?.role === 'employer' 
  //   ? { href: '/dashboard/post-job', label: 'Post a Job', icon: Briefcase }
  //   : null;
  // For now, let's simplify the Post a Job link. We can refine role-based access later.
  const employerPostJobLink = isAuthenticated ? { href: '/dashboard/post-job', label: 'Post a Job', icon: Briefcase } : null;


  // --- Styling logic (mostly unchanged, ensure colors are from your theme) ---
  const outerHeaderWrapperClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out";
  const outerHeaderPaddingScrolled = 'pt-2.5 sm:pt-3'; 
  const outerHeaderPaddingNotScrolled = 'pt-0';

  const innerElementBaseClasses = "transition-all duration-300 ease-in-out";
  const innerElementVerticalPadding = "py-3 sm:py-3.5"; 

  let innerElementLayoutStyles = "";
  let textAndIconColorForLinks = "text-foreground"; // Use theme's foreground color
  let logoColorClass = "text-primary"; // Use theme's primary color
  
  // Text shadow for transparent background can be applied conditionally to specific elements
  // if foreground doesn't have enough contrast on transparent background.
  // For simplicity, removing text-shadow from general link color.
  // const textShadowForTransparentBg = " [text-shadow:0_0_8px_rgba(0,0,0,0.2)] dark:[text-shadow:0_0_8px_rgba(255,255,255,0.1)]";


  if (isScrolled || isMobileMenuOpen) { 
    innerElementLayoutStyles = `
      mx-2.5 sm:mx-3 md:mx-4
      rounded-lg md:rounded-xl 
      bg-card/80 
      dark:bg-card/75 
      backdrop-blur-lg 
      shadow-lg 
      border border-border/30
    `;
    // textAndIconColorForLinks = "text-foreground"; (already default)
    // logoColorClass = "text-primary"; (already default)
  } else {
    innerElementLayoutStyles = `
      bg-transparent 
      px-4 sm:px-6 lg:px-8
    `;
    // If needed for transparent state:
    // textAndIconColorForLinks = `text-foreground ${textShadowForTransparentBg}`;
    // logoColorClass = `text-primary ${textShadowForTransparentBg}`;
  }
  
  const finalInnerElementClasses = `${innerElementBaseClasses} ${innerElementLayoutStyles} ${innerElementVerticalPadding}`;
  const contentWrapperClasses = isScrolled || isMobileMenuOpen ? `px-3 sm:px-4` : '';

  const linkBaseClasses = `font-medium text-sm transition-colors duration-150`;
  const linkHoverClass = "hover:text-primary dark:hover:text-primary"; // primary should adapt
  const linkActiveClass = "text-primary dark:text-primary font-semibold"; // primary should adapt


  const renderNavLink = (link: { href: string, label: string, icon?: React.ElementType }, isMobile = false) => {
    const IconComponent = link.icon;
    const isActive = pathname === link.href || (link.href.includes('#') && pathname === '/' && typeof window !== 'undefined' && window.location.hash === link.href.substring(link.href.indexOf('#')));
    
    // Use text-foreground for default, linkActiveClass for active
    const currentLinkColor = isActive ? linkActiveClass : textAndIconColorForLinks;
    
    const desktopLinkClasses = `${linkBaseClasses} ${currentLinkColor} ${!isActive ? linkHoverClass : ''} py-2`;
    const mobileLinkClasses = `flex items-center w-full px-3 py-3 text-base rounded-md ${linkBaseClasses} ${currentLinkColor} ${!isActive ? ('hover:bg-primary/5 dark:hover:bg-primary/5 ' + linkHoverClass) : 'bg-primary/10 dark:bg-primary/10'}`;

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
  
  // Render placeholder or nothing until auth is initialized to prevent flash of incorrect state
  if (!isInitialized && !authIsLoading) { // if not initialized and not actively loading initial session
    // You can return a minimal header or null to avoid layout shift or flash of auth links
    // For simplicity, returning a basic structure.
    return (
        <header className={`${outerHeaderWrapperClasses} ${outerHeaderPaddingNotScrolled}`}>
            <div className={`${innerElementBaseClasses} ${innerElementLayoutStyles} ${innerElementVerticalPadding}`}>
                <div className={`flex h-12 md:h-14 items-center justify-between ${contentWrapperClasses}`}>
                    <Link href="/" className="flex items-center">
                        <span className={`font-display text-2xl md:text-3xl font-bold ${logoColorClass}`}>
                        CareerCrew
                        </span>
                    </Link>
                    <div className="flex items-center">
                        <div className="ml-3">
                            <ThemeToggleButton />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
  }


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
            {dashboardLinkInfo && renderNavLink(dashboardLinkInfo)}
            {/* {employerPostJobLink && renderNavLink(employerPostJobLink)} */}
            {/* Simplified: Show Post a Job if authenticated. Role check can be on the page itself. */}
            {isAuthenticated && renderNavLink({ href: '/dashboard/post-job', label: 'Post a Job', icon: Briefcase })}
          </nav>

          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-2">
              {!isAuthenticated ? (
                <>
                  <Link href="/login" className={`${linkBaseClasses} ${textAndIconColorForLinks} ${linkHoverClass} px-4 py-2 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.03]`}>Login</Link>
                  <Link href="/register" className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-opacity bg-primary text-primary-foreground hover:opacity-90`}>Sign Up</Link>
                </>
              ) : (
                <button 
                  onClick={handleSignOut} 
                  disabled={authIsLoading} // Disable button if auth operation is in progress
                  className={`${linkBaseClasses} ${textAndIconColorForLinks} px-4 py-2 rounded-md flex items-center hover:bg-destructive/10 text-destructive`}
                >
                  <LogOutIcon size={16} className="mr-1.5" /> Logout
                </button>
              )}
            </div>
            <div className="ml-3">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          className={`md:hidden absolute left-0 right-0 top-full shadow-xl 
                      ${isScrolled ? 'mx-2.5 sm:mx-3 md:mx-4 rounded-b-lg md:rounded-b-xl border-x border-b border-border/30' : 'border-b border-border'}
                      bg-card/95 backdrop-blur-md`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {mainNavLinks.map(link => renderNavLink(link, true))}
            {dashboardLinkInfo && renderNavLink(dashboardLinkInfo, true)}
            {/* {employerPostJobLink && renderNavLink(employerPostJobLink, true)} */}
            {isAuthenticated && renderNavLink({ href: '/dashboard/post-job', label: 'Post a Job', icon: Briefcase }, true)}
            
            <div className={`pt-3 mt-2 border-t ${isScrolled ? 'border-border/30' : 'border-border'} space-y-2`}>
              {!isAuthenticated ? (
                <>
                  {renderNavLink({href: '/login', label: 'Login', icon: LogIn}, true)}
                  <Link href="/register" onClick={closeMobileMenu} className={`flex items-center w-full px-3 py-3 text-base rounded-md font-semibold transition-all duration-150 bg-primary text-primary-foreground hover:opacity-90`}>
                    <UserPlus size={18} className="mr-3 flex-shrink-0" /><span>Sign Up</span>
                  </Link>
                </>
              ) : (
                 <button 
                    onClick={handleSignOut} 
                    disabled={authIsLoading}
                    className={`${linkBaseClasses} ${textAndIconColorForLinks} flex items-center w-full px-3 py-3 text-base rounded-md hover:bg-destructive/10 text-destructive`}
                  >
                    <LogOutIcon size={18} className="mr-3 flex-shrink-0" /><span>Logout</span>
                  </button>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}