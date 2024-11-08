export const fetchWithAuth = async (url, method = 'GET', body = null) => {

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found. Please log in again.');
    return;
  }

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
      } else if (response.status === 401) {
        console.error('Unauthorized. Token may be expired.');
    
      } else {
        console.error(`Error ${response.status}: ${errorData.message || 'Unknown error'}`);
      }

      throw errorData;
    }

    // Handle the response if the status is OK (2xx)
    const data = await response.json();
    return data;

  } catch (error) {
    //console.error('Error in fetch request:', error);
    throw error; 
  }
};
