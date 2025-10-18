import { useState, useEffect } from 'react';

type Page = 'home' | 'login' | 'signup' | 'dashboard' | 'education' | 'health' | 'finance';

export const useNavigate = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || 'home';
      setCurrentPage(path as Page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page === 'home' ? '' : page}`);
  };

  return { currentPage, navigateTo };
};
