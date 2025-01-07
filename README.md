# Hologram

This is a proof-of-concept project that features an AI-powered digital twin of Steph, the "digital twin" of a classmate, who answers people's questions about enabling technologies, through a DIY hologram. Four symmetrically opposite variations of the same image (Steph's face) are projected on to the four faces of the pyramid. Each side projects the image falling on it, to the centre of the pyramid and these 4 projections combined form a whole figure which creates a 3D face (hologram effect).

The system uses Speech-to-Text (STT), Natural Language Processing (NLP) with Cohere AI, and Text-to-Speech (TTS) with Elevenlabs AI to clone Steph's voice, providing a seamless user interaction and conversation experience.

## Why Hologram?

Hologram aims to create an interactive and engaging way for users to learn about enabling technologies through conversational AI. By cloning a real person's voice and persona, the experience feels more personal and relatable. 

## Technologies Used

- **Speech-to-Text (STT)**: Converts spoken language into text.
- **Cohere AI (NLP)**: Processes the text and generates meaningful responses.
- **Elevenlabs AI (TTS)**: Converts text responses back into speech using a cloned voice of Steph.

## API Links

- **Cohere AI (NLP)**: [Cohere API Documentation](https://docs.cohere.ai/)
- **Elevenlabs AI (TTS)**: [Elevenlabs API Documentation](https://api.elevenlabs.io/docs)

## Success Criteria for the Hologram Project

**Functional Requirements**

1. **Speech Recognition Accuracy**
- [x]    - The STT system should accurately convert spoken language into text with at least 95% accuracy.

 2. **Natural Language Understanding**
- [x]    - The NLP system should understand and interpret user queries with at least 90% accuracy in context comprehension.
- [x]    - The system should be able to handle diverse and complex questions about enabling technologies.

3. **Voice Cloning Authenticity**
- [x]    - The TTS system should replicate Steph's voice accurately, maintaining a natural and consistent tone.

## Prototype

### AI interaction
[Watch video](https://youtu.be/1jVsZG4VzpI) <br>
[Watch video](https://youtu.be/jeD3M-X2yqA) 

### Hologram DIY
[Watch video](https://youtu.be/WaS2ytwNQ6Q)

### Final Prototype
[Watch video](https://youtube.com/shorts/g_JOjYQ3pRk?feature=share")


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
