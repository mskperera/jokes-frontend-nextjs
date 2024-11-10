// src/app/hoc/withProtectedPage.tsx
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const withProtectedPage = (Component: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      console.log('aaaaaau',isAuthenticated)
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push("/login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return <div>Loading...</div>; // Or a spinner
      }

    // Render the protected page component only if authenticated
  //  if (isAuthenticated) {
      return <Component {...props} />;
    //}

  //  return null; // or a loading spinner/placeholder
  };

  return Wrapper;
};
