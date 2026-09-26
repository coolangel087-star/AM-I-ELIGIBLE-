import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  params: {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Support both pathname and hash for maximum compatibility in all browser/iframe contexts
  const getInitialPath = () => {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      return window.location.hash.slice(1);
    }
    return window.location.pathname || '/';
  };

  const [path, setPath] = useState<string>(getInitialPath());

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        setPath(window.location.hash.slice(1));
      } else {
        setPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    if (to === path) return;
    try {
      window.history.pushState({}, '', to);
      setPath(to);
    } catch {
      // Fallback to hash if pushState is restricted
      window.location.hash = `#${to}`;
      setPath(to);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Basic param extraction for /opportunities/:slug
  let params: Record<string, string> = {};
  if (path.startsWith('/opportunities/')) {
    const slug = path.replace('/opportunities/', '').split('?')[0].split('#')[0];
    params = { slug };
  }

  return (
    <RouterContext.Provider value={{ path, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);
export const useRoute = useRouter;
