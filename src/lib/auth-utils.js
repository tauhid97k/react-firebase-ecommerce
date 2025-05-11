import { redirect } from "react-router";
import { auth } from "./firebase";

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return new Promise((resolve) => {
    // Use onAuthStateChanged to get the current auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe(); // Unsubscribe immediately after getting the result
      resolve(!!user); // Resolve with boolean indicating if user exists
    });
  });
};

/**
 * Loader for protected routes (dashboard)
 * Redirects to home page if user is not authenticated
 */
export const protectedLoader = async () => {
  const isLoggedIn = await isAuthenticated();
  
  if (!isLoggedIn) {
    // User is not authenticated, redirect to home page
    return redirect("/");
  }
  
  // User is authenticated, allow access to the route
  return null;
};

/**
 * Loader for auth routes (login)
 * Redirects to dashboard if user is already authenticated
 */
export const authLoader = async () => {
  const isLoggedIn = await isAuthenticated();
  
  if (isLoggedIn) {
    // User is already authenticated, redirect to dashboard
    return redirect("/dashboard");
  }
  
  // User is not authenticated, allow access to the auth route
  return null;
};
