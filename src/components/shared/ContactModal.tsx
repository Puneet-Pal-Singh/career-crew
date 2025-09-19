// src/components/shared/ContactModal.tsx
// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Mail, Linkedin, Twitter } from 'lucide-react';

// interface ContactModalProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
// }

// const socialLinks = [
//   { 
//     icon: Linkedin,
//     href: 'https://www.linkedin.com/company/career-crew-consultants/',
//     label: 'LinkedIn'
//   },
//   { 
//     icon: Twitter,
//     href: 'https://x.com/CareerCrewJobs',
//     label: 'Twitter'
//   },
// ];

// export default function ContactModal({ isOpen, onOpenChange }: ContactModalProps) {
//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <div className="flex justify-center mb-4">
//             <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center">
//               <Mail className="h-8 w-8 text-primary" />
//             </div>
//           </div>
//           <DialogTitle className="text-center text-2xl font-bold">Contact Us</DialogTitle>
//           <DialogDescription className="text-center">
//             The best way to reach us is by email. We&apos;d love to hear from you!
//           </DialogDescription>
//         </DialogHeader>
        
//         <div className="py-4 space-y-4">
//           <a href="mailto:contact@careercrew.com" className="w-full">
//             <Button variant="default" className="w-full h-12 text-lg">
//               <Mail className="mr-2 h-5 w-5" />
//               contact@careercrew.com
//             </Button>
//           </a>
          
//           <div className="flex items-center justify-center space-x-4">
//             {socialLinks.map(({ icon: Icon, href, label }) => (
//               <a 
//                 key={label}
//                 href={href} 
//                 aria-label={label}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
//               >
//                 <Icon size={20} />
//               </a>
//             ))}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Twitter } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@careercrew.com',
    href: 'mailto:contact@careercrew.com',
    primary: true
  },
];

const socialLinks = [
  { 
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/career-crew-consultants/',
    label: 'LinkedIn',
    color: 'hover:bg-blue-600 hover:text-white'
  },
  { 
    icon: Twitter,
    href: 'https://x.com/CareerCrewJobs',
    label: 'Twitter',
    color: 'hover:bg-black hover:text-white'
  },
];

export default function ContactModal({ isOpen, onOpenChange }: ContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-16 w-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Get In Touch
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2">
            Ready to take the next step in your career? We&apos;re here to help you succeed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          {/* Primary Contact Methods */}
          <div className="space-y-3">
            {contactMethods.map(({ icon: Icon, label, value, href, primary }) => (
              <a key={label} href={href} className="block group">
                <div className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  primary 
                    ? 'border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10' 
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                }`}>
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-4 ${
                    primary ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  } group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">{value}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <div className="px-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Follow Us
            </div>
            <div className="flex-1 border-t border-border"></div>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-4">
            {socialLinks.map(({ icon: Icon, href, label, color }) => (
              <a 
                key={label}
                href={href} 
                aria-label={`Follow us on ${label}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground transition-all duration-200 hover:scale-105 hover:shadow-md ${color}`}
              >
                <Icon size={20} />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {label}
                </div>
              </a>
            ))}
          </div>

          {/* Office Hours */}
          {/* <div className="text-center pt-4 border-t border-border">
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Available Monday - Friday, 9 AM - 6 PM EST</span>
            </div>
          </div> */}
        </div> 
      </DialogContent>
    </Dialog>
  );
}