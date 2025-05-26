const API_URL = "http://localhost:5001/api";

async function makeAuthenticatedRequest(endpoint, method, body = null) {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    window.location.href = 'login.html';
    return null;
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (response.status === 401) {
      logout();
      return null;
    }

    return response;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

function logout() {
  localStorage.removeItem('accessToken');
  window.location.href = 'login.html';
}

// Helper functions
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

// Expose to window
window.makeAuthenticatedRequest = makeAuthenticatedRequest;
window.logout = logout;
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;