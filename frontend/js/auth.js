// Configuration
const API_URL = "http://localhost:3000/api";

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const registerLink = document.getElementById('registerLink');
const registerModal = document.getElementById('registerModal');
const closeModal = document.querySelector('.close-modal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Event Listeners
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
  registerLink.addEventListener('click', showRegister);
  closeModal.addEventListener('click', hideRegister);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === registerModal) {
      hideRegister();
    }
  });
});

// Show Register Modal
function showRegister(e) {
  e.preventDefault();
  registerModal.style.display = 'block';
  document.getElementById('registerError').textContent = '';
}

// Hide Register Modal
function hideRegister() {
  registerModal.style.display = 'none';
}

// Handle Login
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    window.location.href = 'index.html';
  } catch (error) {
    showError('loginError', error.message || 'Login failed');
  }
}

// Handle Registration
async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirm = document.getElementById('registerConfirm').value;
  
  // Validation
  if (password !== confirm) {
    showError('registerError', "Passwords don't match");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    hideRegister();
    showError('loginError', 'Registration successful! Please login', 'success');
  } catch (error) {
    showError('registerError', error.message || 'Registration failed');
  }
}

// Helper function to show errors
function showError(elementId, message, type = 'error') {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.style.color = type === 'error' ? '#dc3545' : '#28a745';
  element.style.display = 'block';
}