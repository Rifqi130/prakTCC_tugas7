// Global variables
let currentNoteId = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!localStorage.getItem('accessToken')) {
    window.location.href = 'login.html';
    return;
  }

  loadNotes();
  
  // Setup form event listeners
  document.getElementById('saveBtn').addEventListener('click', saveNote);
  document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
});

// Load all notes from API
async function loadNotes() {
  try {
    showLoading(true);
    
    const response = await makeAuthenticatedRequest('/notes', 'GET');
    
    if (!response) return; // Handled by makeAuthenticatedRequest
    
    if (!response.ok) {
      throw new Error('Failed to load notes');
    }

    const notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    console.error('Error loading notes:', error);
    showError('Failed to load notes. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Render notes to the DOM
function renderNotes(notes) {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';

  if (!notes || notes.length === 0) {
    notesList.innerHTML = '<p class="no-notes">No notes found. Create your first note!</p>';
    return;
  }

  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.innerHTML = `
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.content)}</p>
      <small>Created: ${formatDate(note.createdAt)} • Updated: ${formatDate(note.updatedAt)}</small>
      <div class="note-actions">
        <button onclick="editNote('${note.id}', '${escapeHtml(note.title)}', '${escapeHtml(note.content)}')">
          Edit
        </button>
        <button onclick="deleteNote('${note.id}')">
          Delete
        </button>
      </div>
    `;
    notesList.appendChild(noteElement);
  });
}

// Save or update note
async function saveNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();

  if (!title || !content) {
    showError('Title and content are required');
    return;
  }

  try {
    showLoading(true);
    
    let response;
    const noteData = { title, content };

    if (currentNoteId) {
      // Update existing note
      response = await makeAuthenticatedRequest(`/notes/${currentNoteId}`, 'PUT', noteData);
    } else {
      // Create new note
      response = await makeAuthenticatedRequest('/notes', 'POST', noteData);
    }

    if (!response) return; // Handled by makeAuthenticatedRequest
    
    if (!response.ok) {
      throw new Error(currentNoteId ? 'Failed to update note' : 'Failed to create note');
    }

    const result = await response.json();
    resetForm();
    loadNotes();
    
    // Show success message
    showTempMessage(currentNoteId ? 'Note updated successfully!' : 'Note created successfully!', 'success');
    
    currentNoteId = null;
  } catch (error) {
    console.error('Error saving note:', error);
    showError('Failed to save note. Please try again.');
  } finally {
    showLoading(false);
  }
}

// Edit note - fill form with existing data
window.editNote = function(id, title, content) {
  currentNoteId = id;
  document.getElementById('noteTitle').value = title;
  document.getElementById('noteContent').value = content;
  
  // Update UI for edit mode
  document.getElementById('saveBtn').textContent = 'Update Note';
  document.getElementById('cancelBtn').classList.remove('hidden');
  
  // Scroll to form
  document.querySelector('.note-form').scrollIntoView({ behavior: 'smooth' });
};

// Cancel edit mode
function cancelEdit() {
  resetForm();
}

// Reset form to initial state
function resetForm() {
  currentNoteId = null;
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('saveBtn').textContent = 'Add Note';
  document.getElementById('cancelBtn').classList.add('hidden');
}

// Delete note
window.deleteNote = async function(id) {
  if (!confirm('Are you sure you want to delete this note?')) {
    return;
  }

  try {
    showLoading(true);
    
    const response = await makeAuthenticatedRequest(`/notes/${id}`, 'DELETE');
    
    if (!response) return; // Handled by makeAuthenticatedRequest
    
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }

    loadNotes();
    showTempMessage('Note deleted successfully!', 'success');
    
    // If we deleted the note we were editing, reset the form
    if (currentNoteId === id) {
      resetForm();
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    showError('Failed to delete note. Please try again.');
  } finally {
    showLoading(false);
  }
};

// Helper function to show loading state
function showLoading(isLoading) {
  const loader = document.getElementById('loadingIndicator') || createLoader();
  loader.style.display = isLoading ? 'block' : 'none';
  
  // Disable buttons during loading
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = isLoading;
  });
}

function createLoader() {
  const loader = document.createElement('div');
  loader.id = 'loadingIndicator';
  loader.innerHTML = `
    <div class="loader-overlay">
      <div class="loader"></div>
    </div>
  `;
  document.body.appendChild(loader);
  return loader;
}

// Helper function to show error messages
function showError(message) {
  const errorElement = document.getElementById('errorMessage') || createErrorElement();
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 5000);
}

function createErrorElement() {
  const errorElement = document.createElement('div');
  errorElement.id = 'errorMessage';
  errorElement.className = 'error-message';
  document.body.appendChild(errorElement);
  return errorElement;
}

// Helper function to show temporary success/error messages
function showTempMessage(message, type = 'success') {
  const msgElement = document.createElement('div');
  msgElement.className = `temp-message ${type}`;
  msgElement.textContent = message;
  
  document.body.appendChild(msgElement);
  
  setTimeout(() => {
    msgElement.classList.add('fade-out');
    setTimeout(() => msgElement.remove(), 500);
  }, 3000);
}

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Helper function to escape HTML (prevent XSS)
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}