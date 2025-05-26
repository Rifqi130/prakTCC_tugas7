const API_URL = "34.72.198.253/api"; // Pastikan port ini sama dengan backend

// Fungsi untuk menampilkan loading
function showLoading(show) {
  const loader = document.getElementById('loadingIndicator');
  if (loader) {
    loader.style.display = show ? 'block' : 'none';
  }
}

// Handle Registration
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;

    // Validasi
    if (!email || !password || !confirmPassword) {
      showError('registerError', "Semua field harus diisi");
      return;
    }

    if (password !== confirmPassword) {
      showError('registerError', "Password tidak sama");
      return;
    }

    if (password.length < 6) {
      showError('registerError', "Password minimal 6 karakter");
      return;
    }

    try {
      showLoading(true);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registrasi gagal');
      }

      // Redirect ke login dengan email yang sudah diisi
      window.location.href = `login.html?email=${encodeURIComponent(email)}&registered=true`;
    } catch (error) {
      showError('registerError', error.message);
    } finally {
      showLoading(false);
    }
  });
}