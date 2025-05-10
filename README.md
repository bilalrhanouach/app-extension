# Word Learning Chrome Extension

A Chrome extension that helps users learn new words with definitions and example sentences.

## Features
- Displays word definitions and example sentences
- Saves learned words
- Dashboard view for reviewing saved words
- Uses Gemini API for generating definitions

## Setup
1. Clone this repository
2. Create a `config.js` file with your API keys:
```javascript
export default {
    API_ENDPOINT: "YOUR_API_ENDPOINT",
    GEMINI_API_KEY: "YOUR_GEMINI_API_KEY"
};