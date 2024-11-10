// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import jwtDecode from 'jwt-decode'; // Ensure correct import
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();
      
      if (!isTokenExpired) {
        setIsAuthenticated(true); // Token is valid
      } else {
        setIsAuthenticated(false); // Token is expired
        localStorage.removeItem('token'); // Optionally clear the expired token
        router.push('/login'); // Redirect to login if expired
      }
    } catch (error) {
      console.error('Token decode failed', error);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      router.push('/login'); // Redirect to login on token error
    }
  }, [router]);

  return isAuthenticated;
};
