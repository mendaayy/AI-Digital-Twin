# Hologram

This is a project that features an AI digital twin of Steph, a classmate, who answers people's questions about enabling technologies. The system uses Speech-to-Text (STT), Natural Language Processing (NLP) with Cohere AI, and Text-to-Speech (TTS) with Elevenlabs AI to clone Steph's voice, providing a seamless user interaction and conversation experience.

## Why Hologram?

Hologram aims to create an interactive and engaging way for users to learn about enabling technologies through conversational AI. By cloning a real person's voice and persona, the experience feels more personal and relatable.

## Technologies Used

- **Speech-to-Text (STT)**: Converts spoken language into text.
- **Cohere AI (NLP)**: Processes the text and generates meaningful responses.
- **Elevenlabs AI (TTS)**: Converts text responses back into speech using a cloned voice of Steph.

## API Links

- **Cohere AI (NLP)**: [Cohere API Documentation](https://docs.cohere.ai/)
- **Elevenlabs AI (TTS)**: [Elevenlabs API Documentation](https://api.elevenlabs.io/docs)

## Getting Started

### Prerequisites

- Node.js (version 18+)
- API keys for Cohere AI and Elevenlabs AI

### Installation

1. **Download the project**: Download the project ZIP file and extract it to your desired location.

2. **Navigate to the project directory**:
   ```bash
   cd your-project-directory
   ```
3. **Install dependencies**:
   ```bash
   npm install

### Configuration

1. **Set up API keys:**
    Create a .env file in the root directory and add your API keys for Cohere AI and Elevenlabs AI:

    ```bash
    COHERE_API_KEY=your-cohere-api-key
    ELEVENLABS_API_KEY=your-elevenlabs-api-key
    ```
2. **Ensure your environment is set up:**
    Make sure you have all necessary dependencies and configurations by running:

    ```bash
    npm run setup
    ```

### Running application
1. **Start the development server:**

    ```bash
    node index.js
    ```

    ```bash
    npm run dev
    ```
    Now, you can see your project running at localhost. Ctrl + Click on the link to open!

2. **Interacting with the AI Digital Twin:**
    Speak into your microphone, and the AI digital twin of Steph will respond to your questions about enabling technologies.
