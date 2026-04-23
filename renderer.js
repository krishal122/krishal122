window.addEventListener('DOMContentLoaded', async () => {
  const textarea = document.getElementById('note');
  const newNoteBtn = document.getElementById('new-note');
  const openBtn = document.getElementById('open');
  const saveBtn = document.getElementById('save');
  const saveAsBtn = document.getElementById('save-as');
  const statusEl = document.getElementById('status');

  // Load saved note on startup
  const savedNote = await window.electronAPI.loadNote();
  textarea.value = savedNote;

  newNoteBtn.addEventListener('click', async () => {
    const result = await window.electronAPI.newNote();
    if (result.confirmed) {
      textarea.value = '';
      statusEl.textContent = 'Ready for a new note.';
    }
  });

  // New: Open file button
  openBtn.addEventListener('click', async () => {
    const result = await window.electronAPI.openFile();
    if (result.success) {
      textarea.value = result.content;
      statusEl.textContent = `Opened: ${result.filePath}`;
    } else {
      statusEl.textContent = 'Open file cancelled.';
    }
  });
// New: Save note button

  saveBtn.addEventListener('click', async () => {
    await window.electronAPI.saveNote(textarea.value);
    alert('Note saved successfully!');
    statusEl.textContent = 'Note saved to your Documents folder.';
  });

  // New: Save As button

  saveAsBtn.addEventListener('click', async () => {
    const result = await window.electronAPI.saveAs(textarea.value);
    if (result.success) {
      statusEl.textContent = `Saved to: ${result.filePath}`;
    } else {
      statusEl.textContent = 'Save As cancelled.';
    }
  });
});

