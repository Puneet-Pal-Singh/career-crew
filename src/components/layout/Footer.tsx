// src/components/layout/Footer.tsx
export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-subtle-light dark:text-subtle-dark">
            © {currentYear} Career Crew Consulting. All rights reserved.
          </p>
          {/* Add other footer links if needed */}
        </div>
      </footer>
    );
  }