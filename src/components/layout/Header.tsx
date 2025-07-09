// // src/components/layout/Header.tsx
// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { Menu, X, LogOut as LogOutIcon, LogIn } from 'lucide-react'; // Adjusted icons
// import { Button } from '@/components/ui/button';
// import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
// import { usePathname, useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/contexts/AuthContext';
// import { useUserProfile } from '@/contexts/UserProfileContext'; // Import useUserProfile
// import { getNavigationLinks, NavLinkItem } from './headerHelpers'; // Import helper

// export default function Header() {
//   // --- Core Hooks ---
//   const { user, signOut, isLoading: authActionIsLoading, isInitialized: authIsInitialized } = useAuth();
//   const { userProfile, isLoadingProfile } = useUserProfile();
  
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   // --- Derived State ---
//   const isAuthenticated = !!user && authIsInitialized;
//   // Combined initialization check: auth must be initialized, and if user exists, profile fetching should ideally complete
//   const isFullyInitialized = authIsInitialized && (isAuthenticated ? !isLoadingProfile : true);
//   const isOverallLoading = authActionIsLoading || (isAuthenticated && isLoadingProfile); // Loading for auth actions or profile fetch

//   // --- Effects ---
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', handleScroll);
//     handleScroll();
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
//     return () => { document.body.style.overflow = 'auto'; };
//   }, [isMobileMenuOpen]);

//   // --- Event Handlers ---
//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
//   const closeMobileMenu = () => setIsMobileMenuOpen(false);

//   const handleSignOut = async () => {
//     closeMobileMenu();
//     await signOut();
//     router.push('/'); // Redirect to homepage after sign out
//   };

//   // --- Get Navigation Links from Helper ---
//   const { mainNav, authNav, mobileAuthNav } = getNavigationLinks({
//     isAuthenticated,
//     userProfile,
//     isLoadingProfile,
//   });
  
//   // --- Dynamic Styling Logic ---
//   const outerHeaderWrapperClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out";
//   const outerHeaderPaddingScrolled = 'pt-2.5 sm:pt-3'; 
//   const outerHeaderPaddingNotScrolled = 'pt-0';
//   const innerElementBaseClasses = "transition-all duration-300 ease-in-out";
//   const innerElementVerticalPadding = "py-3 sm:py-3.5"; 
//   let innerElementLayoutStyles = "";
//   const textAndIconColorForLinks = "text-foreground"; 
//   const logoColorClass = "text-primary"; 
  
//   if (isScrolled || isMobileMenuOpen) { 
//     innerElementLayoutStyles = `mx-2.5 sm:mx-3 md:mx-4 rounded-lg md:rounded-xl bg-card/80 dark:bg-card/75 backdrop-blur-lg shadow-lg border border-border/30`;
//   } else {
//     innerElementLayoutStyles = `bg-transparent px-4 sm:px-6 lg:px-8`;
//   }
//   const finalInnerElementClasses = `${innerElementBaseClasses} ${innerElementLayoutStyles} ${innerElementVerticalPadding}`;
//   const contentWrapperClasses = isScrolled || isMobileMenuOpen ? `px-3 sm:px-4` : '';

//   // --- Link Rendering ---
//   const linkBaseClasses = `font-medium text-sm transition-colors duration-150`;
//   const linkHoverClass = "hover:text-primary"; // Relies on primary being themeable
//   const linkActiveClass = "text-primary font-semibold";

//   const renderNavLink = (link: NavLinkItem, isMobile = false) => {
//     const IconComponent = link.icon;
//     const isActive = pathname === link.href || (link.href.includes('#') && pathname === '/' && typeof window !== 'undefined' && window.location.hash === link.href.substring(link.href.indexOf('#')));
//     const currentLinkColor = isActive ? linkActiveClass : textAndIconColorForLinks;
    
//     const desktopLinkClasses = `${linkBaseClasses} ${currentLinkColor} ${!isActive ? linkHoverClass : ''} py-2`;
//     const mobileLinkClasses = `flex items-center w-full px-3 py-3 text-base rounded-md ${linkBaseClasses} ${currentLinkColor} ${!isActive ? ('hover:bg-primary/5 dark:hover:bg-primary/5 ' + linkHoverClass) : 'bg-primary/10 dark:bg-primary/10'}`;

//     return (
//       <Link key={link.href + (isMobile ? '-mobile' : '')} href={link.href} onClick={closeMobileMenu} className={isMobile ? mobileLinkClasses : desktopLinkClasses}>
//         {IconComponent && isMobile && <IconComponent size={18} className="mr-3 flex-shrink-0" />}
//         <span>{link.label}</span>
//       </Link>
//     );
//   };

//   // --- Conditional Return for Initial Loading State ---
//   if (!isFullyInitialized && isOverallLoading) { // Show minimal header while critical auth/profile info loads
//     return (
//       <header className={`${outerHeaderWrapperClasses} ${outerHeaderPaddingNotScrolled}`}>
//         <div className={`${finalInnerElementClasses.replace('bg-transparent', 'bg-card/80 dark:bg-card/75 backdrop-blur-lg')}`}> {/* Ensure it has a background during load */}
//           <div className={`flex h-12 md:h-14 items-center justify-between ${contentWrapperClasses}`}>
//             <Link href="/" className="flex items-center">
//               <span className={`font-display text-2xl md:text-3xl font-bold ${logoColorClass}`}>CareerCrew</span>
//             </Link>
//             <div className="flex items-center space-x-3">
//               <div className="w-20 h-8 bg-muted rounded-md animate-pulse"></div> {/* Placeholder for links */}
//               <ThemeToggleButton />
//             </div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   // --- Main Header Render ---
//   return (
//     <header className={`${outerHeaderWrapperClasses} ${isScrolled || isMobileMenuOpen ? outerHeaderPaddingScrolled : outerHeaderPaddingNotScrolled}`}>
//       <div className={finalInnerElementClasses}>
//         <div className={`flex h-12 md:h-14 items-center justify-between ${contentWrapperClasses}`}>
//           <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
//             <span className={`font-display text-2xl md:text-3xl font-bold ${logoColorClass}`}>CareerCrew</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-4 lg:space-x-5">
//             {mainNav.map(link => renderNavLink(link))}
//           </nav>

//           <div className="flex items-center">
//             {/* Desktop Auth Links/Button */}
//             <div className="hidden md:flex items-center space-x-2">
//               {authNav.map(link => (
//                 link.isPrimaryAction 
//                 ? <Link key={link.href} href={link.href} className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-opacity bg-primary text-primary-foreground hover:opacity-90`}>{link.label}</Link>
//                 : <Link key={link.href} href={link.href} className={`${linkBaseClasses} ${textAndIconColorForLinks} ${linkHoverClass} px-4 py-2 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.03]`}>{link.label}</Link>
//               ))}
//               {isAuthenticated && (
//                 <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={isOverallLoading} className={`${linkBaseClasses} ${textAndIconColorForLinks} hover:bg-destructive/10 text-destructive px-3 py-2`}>
//                   <LogOutIcon size={16} className="mr-1.5" /> Logout
//                 </Button>
//               )}
//             </div>
            
//             <div className="ml-3">
//               <ThemeToggleButton />
//             </div>

//             {/* Mobile Menu Toggle */}
//             <div className="md:hidden ml-2">
//               <button onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen} className={`p-2 rounded-md ${textAndIconColorForLinks} hover:bg-black/5 dark:hover:bg-white/10`}>
//                 {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Panel */}
//       {isMobileMenuOpen && (
//         <motion.div 
//           className={`md:hidden absolute left-0 right-0 top-full shadow-xl ${isScrolled ? 'mx-2.5 sm:mx-3 rounded-b-lg border-x border-b border-border/30' : 'border-b border-border'} bg-card/95 backdrop-blur-md`}
//           initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: 'easeOut' }}
//         >
//           <nav className="px-2 pt-2 pb-3 space-y-1">
//             {mainNav.map(link => renderNavLink(link, true))}
//             <div className={`pt-3 mt-2 border-t ${isScrolled ? 'border-border/30' : 'border-border'} space-y-2`}>
//               {mobileAuthNav.map(link => (
//                  link.isPrimaryAction
//                  ? <Link key={link.href + "-mobile"} href={link.href} onClick={closeMobileMenu} className={`flex items-center w-full px-3 py-3 text-base rounded-md font-semibold transition-all duration-150 bg-primary text-primary-foreground hover:opacity-90`}>
//                      {link.icon && React.createElement(link.icon, { size: 18, className: "mr-3 flex-shrink-0" })}<span>{link.label}</span>
//                    </Link>
//                  : renderNavLink({...link, icon: link.icon || (link.label === 'Login' ? LogIn : undefined)}, true) // Pass correct icons
//               ))}
//               {isAuthenticated && (
//                  <button onClick={handleSignOut} disabled={isOverallLoading} className={`${linkBaseClasses} ${textAndIconColorForLinks} flex items-center w-full px-3 py-3 text-base rounded-md hover:bg-destructive/10 text-destructive`}>
//                     <LogOutIcon size={18} className="mr-3 flex-shrink-0" /><span>Logout</span>
//                   </button>
//               )}
//             </div>
//           </nav>
//         </motion.div>
//       )}
//     </header>
//   );
// }

// This header was for before we had a separate login/register page.
// src/components/layout/Header.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
// // import { useUserProfile } from '@/contexts/UserProfileContext';
// import { publicHeaderNavLinks, authenticatedHeaderNavLinks, type NavLink } from './Header/headerConfig';
// import UserNav from './Header/UserNav';
// import { cn } from '@/lib/utils';
// // import { Menu, X } from 'lucide-react';

// export default function Header() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const { user, isInitialized } = useAuth();
//   // const { userProfile } = useUserProfile();
//   const pathname = usePathname();

//   const isLandingPage = pathname === '/';

//   useEffect(() => {
//     if (pathname.startsWith('/dashboard')) return;
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     handleScroll();
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [pathname]);

//   useEffect(() => {
//     // This hook for mobile menu is not currently used since mobile nav is simplified,
//     // but can be uncommented if you re-add a full-panel mobile menu.
//     // document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
//   }, [/* isMobileMenuOpen */]);

//   const isDashboardRoute = pathname.startsWith('/dashboard');
//   if (isDashboardRoute) {
//     return null; 
//   }

//   const navLinks: NavLink[] = (isInitialized && user) ? authenticatedHeaderNavLinks : publicHeaderNavLinks;
  
//   const headerClasses = cn(
//     "fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out",
//     // Make the header taller: h-20 (80px) instead of h-16 (64px)
//     "h-20", 
//     {
//       "bg-card/90 backdrop-blur-lg border-b border-border": !isLandingPage || isScrolled,
//       "bg-transparent border-b border-transparent": isLandingPage && !isScrolled,
//     }
//   );
  
//   const linkClasses = (href: string) => cn(
//     "text-sm font-medium transition-colors hover:text-primary",
//     pathname === href ? "text-primary font-semibold" : "text-muted-foreground"
//   );

//   return (
//     <header className={headerClasses}> 
//       <div className="container mx-auto flex h-full items-center">
//         {/* Left Section: Logo */}
//         <div className="flex-1 flex justify-start">
//           <Link href="/" className="flex items-center space-x-2">
//             {/* Make the logo font larger: text-3xl */}
//             <span className="font-display text-3xl font-bold text-primary">
//               CareerCrew
//             </span>
//           </Link>
//         </div>

//         {/* Center Section: Desktop Navigation */}
//         <nav className="hidden md:flex items-center space-x-6">
//           {navLinks.map(link => (
//             <Link key={link.label} href={link.href} className={linkClasses(link.href)}>
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         {/* Right Section: User Navigation */}
//         <div className="flex-1 flex justify-end">
//           <UserNav />
//         </div>
        
//         {/* Mobile menu logic can be added back here later */}
//       </div>
//     </header>
//   );
// }

// this is the new header component that replaces the old one with separate login/register pages.
// src/components/layout/Header.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserNav from './Header/UserNav';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, isInitialized } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isLandingPage = pathname === '/';

  // Effect for handling scroll-based header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isLandingPage]);

  const headerClasses = cn(
    "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
    {
      "border-b": !isLandingPage || isScrolled,
      "bg-background/95 backdrop-blur": !isLandingPage || isScrolled,
      "border-transparent": isLandingPage && !isScrolled,
    }
  );

  return (
    <header className={headerClasses}>
      <div className="container flex h-16 items-center">
        {/* Left Section */}
        <div className="flex items-center">
          <Link href="/" className="font-bold text-lg text-foreground">CareerCrew</Link>
        </div>

        {/* Center Section: "mx-auto" is the key to centering this */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium mx-auto">
          <Link href="/jobs" className="text-foreground/80 hover:text-foreground">Jobs</Link>
          <Link href="/#features-for-seekers" className="text-foreground/80 hover:text-foreground">For Job Seekers</Link>
          <Link href="/#features-for-companies" className="text-foreground/80 hover:text-foreground">For Companies</Link>
        </nav>
        
        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* <ThemeToggleButton /> */}
          {!isInitialized ? (
            <div className="w-40 h-9 rounded-md bg-muted animate-pulse" />
          ) : user ? (
            <UserNav />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button>Sign Up</Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/signup/job-seeker" className="cursor-pointer">I&apos;m looking for a job</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup/employer" className="cursor-pointer">I&apos;m looking for candidates</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}