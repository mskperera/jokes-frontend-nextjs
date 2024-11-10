// src/hooks/fetchWithAuth.ts
import { useAuth } from "./useAuth"; // Assuming this is the correct path

export const fetchWithAuth = async (url: string, method = 'GET', body: any = null, isAuthenticated: boolean) => {
  // if (!isAuthenticated) {
  //   console.error('User is not authenticated.');
  //   return; // You can also handle redirection or other actions here
  // }

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 400) {
        console.error('Bad Request:', errorData.message);
      } else if (response.status === 401) {
        console.error('Unauthorized. Token may be expired.');
      } else {
        console.error(`Error ${response.status}: ${errorData.message || 'Unknown error'}`);
      }

      throw errorData; // Throw error for handling
    }

    // Handle the response if the status is OK (2xx)
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetch request:', error);
    throw error; // Handle error
  }
};
