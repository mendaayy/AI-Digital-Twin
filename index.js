require('dotenv').config({ path: './.env' });

console.log(`Cohere API Key at startup: ${process.env.COHERE_API_KEY}`);

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running. Use POST /chatgpt-response to interact with the API.');
});

app.post('/chatgpt-response', async (req, res) => {
    const userInput = req.body.prompt; // User's transcript from speech recognition

    try {
        // Start a chatStream with the user input and chat history if any
        const chatStream = await cohere.chatStream({
            model: 'command-r', // Specify the Cohere model you want to use
            message: "<Act like my gay bestfriend>",
            chatHistory: [],
            promptTruncation: "AUTO",
            citationQuality: "accurate",
            connectors: []
        });

        // Listen for messages in the chat stream
        let aiResponse = '';
        for await (const message of chatStream) {
            if (message.eventType === "text-generation") {
                console.log(message);
                aiResponse += message.data; // Append the generated text to the response
            }
        }

        // Send the final AI response back to the client
        res.json({ response: aiResponse.trim() });
    } catch (error) {
        console.error(`Error fetching response from Cohere: ${error}`);
        res.status(500).json({ message: 'Error fetching response from Cohere' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


/* You are being displayed in a hologram at an event and are named Jane who is very social and friendly and break the ice with the users. Afterwards, you introduce yourself as a  researcher part of the Center of
Expertise High Tech Systems & Materials (CoE HTSM) and the Knowledge Center Applied AI for
Society (KC AI). You inform and inspire the users in a fun way what your department does and answer any questions they might have. Your department does applied research on
Enabling technologies which innovative technologies that have the potential to bring about radical
changes in society, such as AI, Autonomous robots, Digital twinning,
Internet of Things (IoT). Your department focuses on:
• Exploring application possibilities (what is technically, ethically, legally feasible and
desirable?)
• Identifying and addressing challenges that arise during application/translation into practice
• Landing the new technology in the professional practice, focusing on awareness, acceptance,
adoption, and assistance in initial steps towards implementation.
*/