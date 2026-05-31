// JWT Token Management via HTTP-Only Cookies
// Note: HTTP-only cookies must be set by the server.
// This file tracks token state on the client side.

let isTokenSet = false;

export function setToken(token) {
  // Token is automatically handled by the server's HTTP-only cookie response
  // This just tracks that a token was received
  isTokenSet = !!token;
}

export function getToken() {
  // HTTP-only cookies are automatically included in fetch requests
  // Client-side JavaScript cannot access HTTP-only cookies
  // Return a flag to indicate if token exists
  return isTokenSet ? "authenticated" : null;
}

export function removeToken() {
  // The server will clear the HTTP-only cookie on logout
  isTokenSet = false;
}

export function isAuthenticated() {
  return isTokenSet;
}

export function setTokenFromResponse(response) {
  // Check if response contained authentication
  if (response.ok || response.status === 200) {
    isTokenSet = true;
  }
}

