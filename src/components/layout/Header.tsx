// src/components/layout/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut as LogOutIcon, LogIn, UserPlus } from 'lucide-react'; // Adjusted icons
import { Button } from '@/components/ui/button';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext'; // Import useUserProfile
import { getNavigationLinks, NavLinkItem } from './headerHelpers'; // Import helper

export default function Header() {
  // --- Core Hooks ---
  const { user, signOut, isLoading: authActionIsLoading, isInitialized: authIsInitialized } = useAuth();
  const { userProfile, isLoadingProfile } = useUserProfile();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // --- Derived State ---
  const isAuthenticated = !!user && authIsInitialized;
  // Combined initialization check: auth must be initialized, and if user exists, profile fetching should ideally complete
  const isFullyInitialized = authIsInitialized && (isAuthenticated ? !isLoadingProfile : true);
  const isOverallLoading = authActionIsLoading || (isAuthenticated && isLoadingProfile); // Loading for auth actions or profile fetch

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);

  // --- Event Handlers ---
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSignOut = async () => {
    closeMobileMenu();
    await signOut();
    router.push('/'); // Redirect to homepage after sign out
  };

  // --- Get Navigation Links from Helper ---
  const { mainNav, authNav, mobileAuthNav } = getNavigationLinks({
    isAuthenticated,
    userProfile,
    isLoadingProfile,
  });
  
  // --- Dynamic Styling Logic ---
  const outerHeaderWrapperClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out";
  const outerHeaderPaddingScrolled = 'pt-2.5 sm:pt-3'; 
  const outerHeaderPaddingNotScrolled = 'pt-0';
  const innerElementBaseClasses = "transition-all duration-300 ease-in-out";
  const innerElementVerticalPadding = "py-3 sm:py-3.5"; 
  let innerElementLayoutStyles = "";
  let textAndIconColorForLinks = "text-foreground"; 
  let logoColorClass = "text-primary"; 
  
  if (isScrolled || isMobileMenuOpen) { 
    innerElementLayoutStyles = `mx-2.5 sm:mx-3 md:mx-4 rounded-lg md:rounded-xl bg-card/80 dark:bg-card/75 backdrop-blur-lg shadow-lg border border-border/30`;
  } else {
    innerElementLayoutStyles = `bg-transparent px-4 sm:px-6 lg:px-8`;
  }
  const finalInnerElementClasses = `${innerElementBaseClasses} ${innerElementLayoutStyles} ${innerElementVerticalPadding}`;
  const contentWrapperClasses = isScrolled || isMobileMenuOpen ? `px-3 sm:px-4` : '';

  // --- Link Rendering ---
  const linkBaseClasses = `font-medium text-sm transition-colors duration-150`;
  const linkHoverClass = "hover:text-primary"; // Relies on primary being themeable
  const linkActiveClass = "text-primary font-semibold";

  const renderNavLink = (link: NavLinkItem, isMobile = false) => {
    const IconComponent = link.icon;
    const isActive = pathname === link.href || (link.href.includes('#') && pathname === '/' && typeof window !== 'undefined' && window.location.hash === link.href.substring(link.href.indexOf('#')));
    const currentLinkColor = isActive ? linkActiveClass : textAndIconColorForLinks;
    
    const desktopLinkClasses = `${linkBaseClasses} ${currentLinkColor} ${!isActive ? linkHoverClass : ''} py-2`;
    const mobileLinkClasses = `flex items-center w-full px-3 py-3 text-base rounded-md ${linkBaseClasses} ${currentLinkColor} ${!isActive ? ('hover:bg-primary/5 dark:hover:bg-primary/5 ' + linkHoverClass) : 'bg-primary/10 dark:bg-primary/10'}`;

    return (
      <Link key={link.href + (isMobile ? '-mobile' : '')} href={link.href} onClick={closeMobileMenu} className={isMobile ? mobileLinkClasses : desktopLinkClasses}>
        {IconComponent && isMobile && <IconComponent size={18} className="mr-3 flex-shrink-0" />}
        <span>{link.label}</span>
      </Link>
    );
  };

  // --- Conditional Return for Initial Loading State ---
  if (!isFullyInitialized && isOverallLoading) { // Show minimal header while critical auth/profile info loads
    return (
      <header className={`${outerHeaderWrapperClasses} ${outerHeaderPaddingNotScrolled}`}>
        <div className={`${finalInnerElementClasses.replace('bg-transparent', 'bg-card/80 dark:bg-card/75 backdrop-blur-lg')}`}> {/* Ensure it has a background during load */}
          <div className={`flex h-12 md:h-14 items-center justify-between ${contentWrapperClasses}`}>
            <Link href="/" className="flex items-center">
              <span className={`font-display text-2xl md:text-3xl font-bold ${logoColorClass}`}>CareerCrew</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-20 h-8 bg-muted rounded-md animate-pulse"></div> {/* Placeholder for links */}
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // --- Main Header Render ---
  return (
    <header className={`${outerHeaderWrapperClasses} ${isScrolled || isMobileMenuOpen ? outerHeaderPaddingScrolled : outerHeaderPaddingNotScrolled}`}>
      <div className={finalInnerElementClasses}>
        <div className={`flex h-12 md:h-14 items-center justify-between ${contentWrapperClasses}`}>
          <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
            <span className={`font-display text-2xl md:text-3xl font-bold ${logoColorClass}`}>CareerCrew</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-5">
            {mainNav.map(link => renderNavLink(link))}
          </nav>

          <div className="flex items-center">
            {/* Desktop Auth Links/Button */}
            <div className="hidden md:flex items-center space-x-2">
              {authNav.map(link => (
                link.isPrimaryAction 
                ? <Link key={link.href} href={link.href} className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-opacity bg-primary text-primary-foreground hover:opacity-90`}>{link.label}</Link>
                : <Link key={link.href} href={link.href} className={`${linkBaseClasses} ${textAndIconColorForLinks} ${linkHoverClass} px-4 py-2 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.03]`}>{link.label}</Link>
              ))}
              {isAuthenticated && (
                <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={isOverallLoading} className={`${linkBaseClasses} ${textAndIconColorForLinks} hover:bg-destructive/10 text-destructive px-3 py-2`}>
                  <LogOutIcon size={16} className="mr-1.5" /> Logout
                </Button>
              )}
            </div>
            
            <div className="ml-3">
              <ThemeToggleButton />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden ml-2">
              <button onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen} className={`p-2 rounded-md ${textAndIconColorForLinks} hover:bg-black/5 dark:hover:bg-white/10`}>
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <motion.div 
          className={`md:hidden absolute left-0 right-0 top-full shadow-xl ${isScrolled ? 'mx-2.5 sm:mx-3 rounded-b-lg border-x border-b border-border/30' : 'border-b border-border'} bg-card/95 backdrop-blur-md`}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {mainNav.map(link => renderNavLink(link, true))}
            <div className={`pt-3 mt-2 border-t ${isScrolled ? 'border-border/30' : 'border-border'} space-y-2`}>
              {mobileAuthNav.map(link => (
                 link.isPrimaryAction
                 ? <Link key={link.href + "-mobile"} href={link.href} onClick={closeMobileMenu} className={`flex items-center w-full px-3 py-3 text-base rounded-md font-semibold transition-all duration-150 bg-primary text-primary-foreground hover:opacity-90`}>
                     {link.icon && React.createElement(link.icon, { size: 18, className: "mr-3 flex-shrink-0" })}<span>{link.label}</span>
                   </Link>
                 : renderNavLink({...link, icon: link.icon || (link.label === 'Login' ? LogIn : undefined)}, true) // Pass correct icons
              ))}
              {isAuthenticated && (
                 <button onClick={handleSignOut} disabled={isOverallLoading} className={`${linkBaseClasses} ${textAndIconColorForLinks} flex items-center w-full px-3 py-3 text-base rounded-md hover:bg-destructive/10 text-destructive`}>
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