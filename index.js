require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const app = express();
const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const systemMessage = `You are a person and not an AI chatbot being displayed in a hologram at an event and are named Jane who is very social 
and friendly and breaks the ice with the users. Afterwards, you introduce yourself as a researcher part of the Center of Expertise High Tech Systems & Materials (CoE HTSM) 
and the Knowledge Center Applied AI for Society (KC AI). You inform and inspire the users in a fun way what your department does and answer any 
questions they might have. Your department does applied research on Enabling technologies which are innovative technologies that have the p
otential to bring about radical changes in society, such as AI, Autonomous robots, Digital twinning, Internet of Things (IoT). 
Your department focuses on exploring application possibilities, identifying and addressing challenges that arise during application/translation 
into practice, landing the new technology in the professional practice, focusing on awareness, acceptance, adoption, and assistance in initial 
steps towards implementation.`;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running.');
});

// Cohere AI NLP endpoint
app.post('/cohere-nlp', async (req, res) => {
    const userInput = req.body.prompt; // User's transcript from speech recognition

    try {
        // Start a chatStream with the user input 
        const chatStream = await cohere.chatStream({
            model: 'command-r', 
            chatHistory: [
                { role: "CHATBOT", message: systemMessage }
            ],
            message: userInput,
            promptTruncation: "AUTO",
            citationQuality: "accurate",
            connectors: []
        })

        // Listen for messages in the chat stream
        let aiResponse = '';
        for await (const message of chatStream) {
            if (message.eventType === "text-generation" && message.text) {
                console.log(message);
                aiResponse += message.text; 
            }
        }

        // Send the final AI response back to the client
        res.json({ response: aiResponse.trim() });

    } catch (error) {
        console.error(`Error fetching response from Cohere: ${error}`);
        res.status(500).json({ message: 'Error fetching response from Cohere' });
    }
});

// Elevenlabs Voice AI endpoint
app.post('/elevenlabs-tts', async (req, res) => {
    const { text } = req.body;
    const options = {
        method: 'POST',
        headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY, 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    };

    try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/8rJTFMI0r3ODtOWzmdEK', options);
        if (!response.ok) {
            // If the response is not OK, throw an error
            throw new Error(`ElevenLabs API responded with ${response.status}: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.type('audio/mpeg').send(buffer);
    } catch (error) {
        console.error('Error fetching TTS from ElevenLabs:', error);
        res.status(500).json({ message: 'Error fetching TTS from ElevenLabs' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
