const API_URL = "https://notes-backend162-639911956774.us-central1.run.app";

// Helper function for authenticated requests
async function makeAuthenticatedRequest(url, method, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${url}`, options);

  if (response.status === 401) {
    // Token expired or invalid
    logout();
    return null;
  }

  return response;
}

function logout() {
  localStorage.removeItem('accessToken');
  window.location.href = 'login.html';
}

// Expose to window
window.makeAuthenticatedRequest = makeAuthenticatedRequest;
window.logout = logout;