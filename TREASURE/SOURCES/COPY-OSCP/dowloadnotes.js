(() => {
  try {
    // Step 1: Collect all note elements
    const notes = [...document.querySelectorAll('.note-content')];

    if (notes.length === 0) {
      alert('No notes found on the page. Make sure you are on the correct notes view.');
      return;
    }

    // Step 2: Format the notes
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const formattedNotes = notes.map((note, index) => {
      const titleEl = note.closest('.note')?.querySelector('span.text-sm');
      const dateEl = note.closest('.note')?.querySelectorAll('span.text-xs span')[1];
      const title = titleEl ? titleEl.innerText.trim() : `Note ${index + 1}`;
      const date = dateEl ? dateEl.innerText.trim() : 'Unknown Date';
      return `## ${title} (${date})\n\n${note.innerText.trim()}`;
    }).join('\n\n---\n\n');

    // Step 3: Download as a .txt file
    const blob = new Blob([formattedNotes], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `offsec_notes_${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('✅ Notes extracted and download started.');
  } catch (err) {
    console.error('❌ Error extracting notes:', err);
    alert('Something went wrong while extracting notes.');
  }
