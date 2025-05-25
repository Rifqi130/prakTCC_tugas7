document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://notes-backend162-639911956774.us-central1.run.app/";
    const noteForm = document.getElementById('noteForm');
    const notesList = document.getElementById('notesList');
    const editModal = document.getElementById('editModal');
    const editNoteForm = document.getElementById('editNoteForm');
    const closeModal = document.querySelector('.close');

    let currentNoteId = null; // Untuk menyimpan ID catatan yang sedang diedit

    // Fetch all notes
    function fetchNotes() {
        fetch(`${BASE_URL}notes`)
            .then(response => response.json())
            .then(data => {
                notesList.innerHTML = '';
                data.forEach(note => {
                    const noteElement = document.createElement('div');
                    noteElement.classList.add('note');
                    noteElement.innerHTML = `
                        <h3>${note.name}</h3>
                        <p>${note.catatan}</p>
                        <small>${new Date(note.date).toLocaleDateString()}</small>
                        <button onclick="openEditModal(${note.id}, '${note.name}', '${note.catatan}', '${note.date}')">Edit</button>
                        <button onclick="deleteNote(${note.id})">Delete</button>
                    `;
                    notesList.appendChild(noteElement);
                });
            });
    }

    // Add a new note
    noteForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const catatan = document.getElementById('catatan').value;
        const date = document.getElementById('date').value;

        fetch(`${BASE_URL}notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, catatan, date }),
        })
        .then(response => response.json())
        .then(data => {
            fetchNotes();
            noteForm.reset();
        });
    });

    // Open edit modal
    window.openEditModal = function (id, name, catatan, date) {
        currentNoteId = id;
        document.getElementById('editName').value = name;
        document.getElementById('editCatatan').value = catatan;
        document.getElementById('editDate').value = date.split('T')[0]; // Format tanggal
        editModal.style.display = 'block';
    };

    // Close edit modal
    closeModal.addEventListener('click', function () {
        editModal.style.display = 'none';
    });

    // Submit edit form
    editNoteForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('editName').value;
        const catatan = document.getElementById('editCatatan').value;
        const date = document.getElementById('editDate').value;

        fetch(`${BASE_URL}notes/${currentNoteId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, catatan, date }),
        })
        .then(response => response.json())
        .then(data => {
            fetchNotes();
            editModal.style.display = 'none';
        });
    });

    // Delete a note
    window.deleteNote = function (id) {
        fetch(`${BASE_URL}notes/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            fetchNotes();
        });
    };

    // Initial fetch
    fetchNotes();
});