// hooks/useAuth.ts
import { useState, useEffect } from "react";
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (!isTokenExpired) {
          setIsAuthenticated(true);
          return;
        }
       
      } catch (error) {
        console.error('Token decode failed', error);
      }
    }
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);




  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push('/login');
  };

  return {
    isAuthenticated,
    logout,
  };
};