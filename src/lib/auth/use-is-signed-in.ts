import { useEffect, useState } from "react";

export const useIsSignedIn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    setIsSignedIn(!!token);
    setIsLoading(false);
  }, []);

  return {
    isSignedIn,
    isLoading,
  };
};
