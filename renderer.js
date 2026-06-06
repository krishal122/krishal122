window.addEventListener('DOMContentLoaded', async () => {

  const textarea = document.getElementById('note');
  const newNoteBtn = document.getElementById('new-note');
  const openBtn = document.getElementById('open');
  const saveBtn = document.getElementById('save');
  const saveAsBtn = document.getElementById('save-as');
  const statusEl = document.getElementById('status');
  const statsEl = document.getElementById('stats');

  const fontIncreaseBtn = document.getElementById('font-increase');
  const fontDecreaseBtn = document.getElementById('font-decrease');
  const darkModeBtn = document.getElementById('dark-mode-toggle');
  const loginScreen = document.getElementById('login-screen');
  const appContent = document.getElementById('app-content');
  const passwordInput =
  document.getElementById('password-input');
  const loginBtn =
  document.getElementById('login-btn');
  const loginMessage =
  document.getElementById('login-message');
  appContent.style.display = 'none';
  const trashBtn =
  document.getElementById('trash-note');
  const restoreBtn =
  document.getElementById('restore-note');
  const emptyTrashBtn =
  document.getElementById('empty-trash');
  loginBtn.addEventListener('click', () => {
  const password = passwordInput.value;

  if (password === '1234') {

    loginScreen.style.display = 'none';

    appContent.style.display = 'block';

  } else {

    loginMessage.textContent =
      'Incorrect Password';

    passwordInput.value = '';
  }
});

  // Word & Character Counter
  function updateStats() {
    const text = textarea.value;

    const words =
      text.trim() === ''
        ? 0
        : text.trim().split(/\s+/).length;

    const chars = text.length;

    if (statsEl) {
      statsEl.textContent =
        `Words: ${words} | Characters: ${chars}`;
    }
  }

  // Load saved note on startup
  const savedNote = await window.electronAPI.loadNote();
  textarea.value = savedNote;

  updateStats();

  textarea.addEventListener('input', updateStats);

  // New Note
  newNoteBtn.addEventListener('click', async () => {
    const result = await window.electronAPI.newNote();

    if (result.confirmed) {
      textarea.value = '';
      updateStats();
      statusEl.textContent = 'Ready for a new note.';
    }
  });

  // Open File
  openBtn.addEventListener('click', async () => {
    const result = await window.electronAPI.openFile();

    if (result.success) {
      textarea.value = result.content;
      updateStats();
      statusEl.textContent = `Opened: ${result.filePath}`;
    } else {
      statusEl.textContent = 'Open file cancelled.';
    }
  });

  // Save Note
  saveBtn.addEventListener('click', async () => {
    await window.electronAPI.saveNote(textarea.value);

    alert('Note saved successfully!');
    statusEl.textContent =
      'Note saved to your Documents folder.';
  });

  // Save As
  saveAsBtn.addEventListener('click', async () => {
    const result =
      await window.electronAPI.saveAs(textarea.value);

    if (result.success) {
      statusEl.textContent =
        `Saved to: ${result.filePath}`;
    } else {
      statusEl.textContent =
        'Save As cancelled.';
    }
  });

  // Font Size Controls
  let currentFontSize = 18;

  if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener('click', () => {
      currentFontSize += 2;
      textarea.style.fontSize =
        currentFontSize + 'px';
    });
  }

  if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener('click', () => {
      if (currentFontSize > 10) {
        currentFontSize -= 2;
        textarea.style.fontSize =
          currentFontSize + 'px';
      }
    });
  }
// Move to Trash
if (trashBtn && window.electronAPI.moveToTrash) {
  trashBtn.addEventListener('click', async () => {

    await window.electronAPI.moveToTrash(
      textarea.value
    );

    textarea.value = '';

    updateStats();

    statusEl.textContent =
      'Note moved to Trash.';
  });
}

// Restore
if (restoreBtn && window.electronAPI.restoreNote) {
  restoreBtn.addEventListener('click', async () => {

    const result =
      await window.electronAPI.restoreNote();

    if (result.success) {

      textarea.value =
        result.content;

      updateStats();

      statusEl.textContent =
        'Note restored from Trash.';
    }
  });
}

// Empty Trash
if (emptyTrashBtn && window.electronAPI.emptyTrash) {
  emptyTrashBtn.addEventListener('click', async () => {

    await window.electronAPI.emptyTrash();

    statusEl.textContent =
      'Trash permanently deleted.';
  });
}

  // Dark Mode
  let darkMode = false;

  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {

      darkMode = !darkMode;

      if (darkMode) {

        document.body.style.backgroundColor =
          '#222';

        document.body.style.color =
          '#fff';

        textarea.style.backgroundColor =
          '#333';

        textarea.style.color =
          '#fff';

        darkModeBtn.textContent =
          '☀️ Light Mode';

      } else {

        document.body.style.backgroundColor =
          '#f4f4f4';

        document.body.style.color =
          '#000';

        textarea.style.backgroundColor =
          '#fff';

        textarea.style.color =
          '#000';

        darkModeBtn.textContent =
          '🌙 Dark Mode';
      }
    });
  }

});