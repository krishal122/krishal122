window.addEventListener('DOMContentLoaded', async () => {
    const textarea = document.getElementById('note');
    const saveBtn = document.getElementById('save');
    const statusEl = document.getElementById('save_status');
    // Load existing note  on startup 
    const savedNote = await window.electronAPI.loadNote();  
    textarea.value = savedNote; 

    saveBtn.addEventListener('click', async () => { 
        await window.electronAPI.saveNote(textarea.value);
        alert('Note saved successfully!');     
    });
}); 

async function autoSave() {
    const Text = textarea.value;
    if (currentText === lastSavedText) {
        statusEl.textContent = 'No changes to save.';
        return;
    }
    try {
        await window.electronApi.saveNote(currentText);
        lastSavedText = currentText;
        const noe = new Date().toLocaletimrString();
        statusEl.textContent = `Auto-saved at ${now}`;
    } catch (error) {
        console.error('Auto-save failed:', error);
        statusEl.textContent = 'Auto-save error!';
    }
}
