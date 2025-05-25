// Config
const API_URL = "http://localhost:3000/api"; // Pastikan sesuai dengan port backend

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

// Handle Login
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  // Clear previous errors
  loginError.textContent = '';
  
  // Validation
  if (!email || !password) {
    showError(loginError, 'Email and password are required');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Untuk cookie/session jika digunakan
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Simpan token di localStorage
    localStorage.setItem('accessToken', data.accessToken);
    
    // Redirect ke halaman utama
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Login error:', error);
    showError(loginError, error.message || 'Network error: Please try again');
  }
}

// Helper function untuk menampilkan error
function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
  
  // Auto-hide error setelah 5 detik
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}

// Expose functions to window
window.login = login;