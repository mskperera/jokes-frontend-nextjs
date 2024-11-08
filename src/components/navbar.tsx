'use client';
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <Link href="/" className="nav-link">Home</Link>
      <Link href="/submit-joke" className="nav-link">Submit Joke</Link>
     {isAuthenticated && <Link href="/moderate-joke" className="nav-link">Moderate Jokes</Link>}
      <div className="auth-buttons">
        {isAuthenticated ? (
          <button className="auth-button logout" onClick={handleLogout}>Logout</button>
        ) : (
          <Link href="/login">
            <button className="auth-button login">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};
