// Sample data structure for saved words
let savedWords = [
  {
    word: 'serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way',
    dateAdded: '2024-01-15'
  },
  {
    word: 'ephemeral',
    definition: 'Lasting for a very short time',
    dateAdded: '2024-01-14'
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.search-input');
  const sortSelect = document.querySelector('.sort-select');
  const wordList = document.getElementById('wordList');

  // Render word card
  function createWordCard(wordData) {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.innerHTML = `
      <div class="word-header">
        <h3 class="word-title">${wordData.word}</h3>
        <div class="word-actions">
          <button class="action-btn edit-btn" data-word="${wordData.word}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.7 1.3C11.3 0.9 10.7 0.9 10.3 1.3L2.3 9.3C2.1 9.5 2 9.7 2 10V12C2 12.6 2.4 13 3 13H5C5.3 13 5.5 12.9 5.7 12.7L13.7 4.7C14.1 4.3 14.1 3.7 13.7 3.3L11.7 1.3Z" fill="currentColor"/>
            </svg>
          </button>
          <button class="action-btn delete-btn" data-word="${wordData.word}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 3H3C2.4 3 2 3.4 2 4V12C2 12.6 2.4 13 3 13H13C13.6 13 14 12.6 14 12V4C14 3.4 13.6 3 13 3ZM11.1 9.9L10.2 10.8L8 8.6L5.8 10.8L4.9 9.9L7.1 7.7L4.9 5.5L5.8 4.6L8 6.8L10.2 4.6L11.1 5.5L8.9 7.7L11.1 9.9Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
      <p class="word-definition" contenteditable="false">${wordData.definition}</p>
      <span class="word-date">Added on ${wordData.dateAdded}</span>
    `;

    // Add event listeners for edit and delete buttons
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    const definitionEl = card.querySelector('.word-definition');

    editBtn.addEventListener('click', () => {
      const isEditing = definitionEl.contentEditable === 'true';
      definitionEl.contentEditable = !isEditing;
      definitionEl.focus();
      
      if (isEditing) {
        // Save changes
        const wordToEdit = editBtn.dataset.word;
        const newDefinition = definitionEl.textContent;
        savedWords = savedWords.map(w => 
          w.word === wordToEdit 
            ? { ...w, definition: newDefinition }
            : w
        );
        definitionEl.blur();
        editBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.7 1.3C11.3 0.9 10.7 0.9 10.3 1.3L2.3 9.3C2.1 9.5 2 9.7 2 10V12C2 12.6 2.4 13 3 13H5C5.3 13 5.5 12.9 5.7 12.7L13.7 4.7C14.1 4.3 14.1 3.7 13.7 3.3L11.7 1.3Z" fill="currentColor"/>
        </svg>`;
      } else {
        // Enter edit mode
        editBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 3H3C2.4 3 2 3.4 2 4V12C2 12.6 2.4 13 3 13H13C13.6 13 14 12.6 14 12V4C14 3.4 13.6 3 13 3ZM11.1 9.9L10.2 10.8L8 8.6L5.8 10.8L4.9 9.9L7.1 7.7L4.9 5.5L5.8 4.6L8 6.8L10.2 4.6L11.1 5.5L8.9 7.7L11.1 9.9Z" fill="currentColor"/>
        </svg>`;
      }
    });

    deleteBtn.addEventListener('click', () => {
      const wordToDelete = deleteBtn.dataset.word;
      deleteWord(wordToDelete);
    });

    return card;
  }

  // Filter and sort words
  function filterAndSortWords() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortBy = sortSelect.value;

    let filteredWords = savedWords.filter(word =>
      word.word.toLowerCase().includes(searchTerm) ||
      word.definition.toLowerCase().includes(searchTerm)
    );

    if (sortBy === 'alpha') {
      filteredWords.sort((a, b) => a.word.localeCompare(b.word));
    } else {
      filteredWords.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }

    renderWords(filteredWords);
  }

  // Render all words
  function renderWords(words) {
    wordList.innerHTML = '';
    words.forEach(word => {
      wordList.appendChild(createWordCard(word));
    });
  }

  // Delete word function
  function deleteWord(word) {
    savedWords = savedWords.filter(w => w.word !== word);
    filterAndSortWords();
  }

  // Event listeners
  searchInput.addEventListener('input', filterAndSortWords);
  sortSelect.addEventListener('change', filterAndSortWords);

  // Initial render
  filterAndSortWords();
});