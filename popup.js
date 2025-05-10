import CONFIG from './config.js';

// Function to save word to storage
async function saveWord(wordData) {
  try {
    const { word, definition } = wordData;
    // get with default
    const { savedWords } = await chrome.storage.local.get({ savedWords: [] });
    const newWord = {
      word,
      definition,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    savedWords.push(newWord);
    // set expects an object with keys
    await chrome.storage.local.set({ savedWords });
    return true;
  } catch (error) {
    console.error('Error saving word:', error);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  async function fetchWordDefinition(word = 'serendipity') {
    try {
      const prompt = `Please provide a definition and two example sentences for the word "${word}". Format the response as a JSON with the following structure: {"word": "${word}", "definition": "definition here", "examples": ["example1", "example2"]}. Make the examples natural and contextual.`;

      const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': CONFIG.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }); // ← properly closed fetch call

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) {
        throw new Error('Invalid API response format');
      }

      const parsedData = JSON.parse(generatedText);
      if (
        !parsedData.word ||
        !parsedData.definition ||
        !Array.isArray(parsedData.examples)
      ) {
        throw new Error('Invalid response data structure');
      }

      return parsedData;
    } catch (error) {
      console.error('Error fetching word data:', error);
      return {
        word,
        definition: `Unable to fetch definition: ${error.message}`,
        examples: [
          'Please check your internet connection and try again',
          'If the problem persists, verify your API key configuration',
        ],
      };
    }
  }

  // Display word data
  function displayWord(data) {
    document.getElementById('word').textContent = data.word;
    document.getElementById('definition').textContent = data.definition;
    document.getElementById('example1').textContent = data.examples[0] || '';
    document.getElementById('example2').textContent = data.examples[1] || '';
  }

  // Initialize with API data
  const wordData = await fetchWordDefinition();
  displayWord(wordData);

  // Close popup
  document.getElementById('close').addEventListener('click', () => {
    window.close();
  });

  // Mark as learned
  document.getElementById('markLearned').addEventListener('click', async function () {
    const wordEl = document.getElementById('word');
    const defEl = document.getElementById('definition');

    if (wordEl && defEl) {
      const saved = await saveWord({
        word: wordEl.textContent,
        definition: defEl.textContent,
      });

      if (saved) {
        this.textContent = 'Saved!';
        this.style.backgroundColor = '#e2e8f0';
        this.disabled = true;
      }
    }
  });

  // Open dashboard
  document.getElementById('viewDashboard').addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('dashboard.html'),
      type: 'popup',
      width: 800,
      height: 600,
    });
  });
});
