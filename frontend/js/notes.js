const API_URL = "https://notes-backend162-639911956774.us-central1.run.app";
let currentNoteId = null;

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

async function loadNotes() {
  try {
    const response = await makeAuthenticatedRequest('/notes', 'GET');
    
    if (!response) return; // Handled by makeAuthenticatedRequest
    
    if (!response.ok) {
      throw new Error('Failed to load notes');
    }

    const notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    console.error('Error loading notes:', error);
    alert('Failed to load notes. Please try again.');
  }
}

function renderNotes(notes) {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';

  if (notes.length === 0) {
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

async function saveNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();

  if (!title || !content) {
    alert('Title and content are required');
    return;
  }

  try {
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
    const successMsg = currentNoteId ? 'Note updated successfully!' : 'Note created successfully!';
    showTempMessage(successMsg, 'success');
    
    currentNoteId = null;
  } catch (error) {
    console.error('Error saving note:', error);
    alert('Failed to save note. Please try again.');
  }
}

function editNote(id, title, content) {
  currentNoteId = id;
  document.getElementById('noteTitle').value = title;
  document.getElementById('noteContent').value = content;
  
  // Update UI for edit mode
  document.getElementById('saveBtn').textContent = 'Update Note';
  document.getElementById('cancelBtn').classList.remove('hidden');
  
  // Scroll to form
  document.querySelector('.note-form').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
  resetForm();
}

function resetForm() {
  currentNoteId = null;
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('saveBtn').textContent = 'Add Note';
  document.getElementById('cancelBtn').classList.add('hidden');
}

async function deleteNote(id) {
  if (!confirm('Are you sure you want to delete this note?')) {
    return;
  }

  try {
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
    alert('Failed to delete note. Please try again.');
  }
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

// Helper to show temporary message
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

// Expose functions to global scope
window.editNote = editNote;
window.deleteNote = deleteNote;