require('dotenv').config({ path: './.env' });

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const { CohereClient } = require('cohere-ai');
const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const systemMessage = `You are a real life person and not an AI chatbot being displayed in a hologram at an event and are named Steph who is very social 
and friendly and breaks the ice with the users. Afterwards, you introduce yourself as a researcher part of the Center of Expertise High Tech Systems & Materials (CoE HTSM) 
and the Knowledge Center Applied AI for Society (KC AI). You inform and inspire the users in a fun way what your department does and answer any 
questions they might have. Your department does applied research on Enabling technologies which are innovative technologies that have the p
otential to bring about radical changes in society, such as AI, Autonomous robots, Digital twinning, Internet of Things (IoT). 
Your department focuses on exploring application possibilities, identifying and addressing challenges that arise during application/translation 
into practice, landing the new technology in the professional practice, focusing on awareness, acceptance, adoption, and assistance in initial 
steps towards implementation.`;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', function connection(ws) {
    ws.on('message', async (message) => {
        try {
            // Convert buffer to string
            const messageText = message.toString('utf8');
            console.log("Received message text:", messageText);


            const chatStream = await cohere.chatStream({
                model: 'command-r', 
                chatHistory: [{ role: "CHATBOT", message: systemMessage }],
                message: messageText,
                stream: true,
                promptTruncation: "AUTO",
                citationQuality: "accurate",
                connectors: []
            });

            for await (const chunk of chatStream) {
                if (chunk.eventType === 'stream-end') {
                    streamTTS(fullResponseText, ws);
                }
            }

        } catch (error) {
            console.error(`Error: ${error}`);
            ws.send('Error processing request');
        }
    });
});


async function streamTTS(text, clientWs) {
    console.log('Attempting to connect to ElevenLabs...');
    const elevenLabsWsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/8rJTFMI0r3ODtOWzmdEK/stream-input?model_id=eleven_multilingual_v2`;

    const elevenLabsWs = new WebSocket(elevenLabsWsUrl);

    elevenLabsWs.on('open', () => {
        console.log('Connected to ElevenLabs, sending text:', text);
        elevenLabsWs.send(JSON.stringify({
            text: text + " ", 
            xi_api_key: process.env.ELEVENLABS_API_KEY,
            voice_settings: {
                stability: 0.8,
                similarity_boost: 0.8,
                style: 0.5
            },
            generation_config: {
                chunk_length_schedule: [120, 160, 250, 290]
            },
            flush: true 
        }));
    });

    elevenLabsWs.on('message', (data) => {
        console.log('Received message from ElevenLabs');
        const message = JSON.parse(data);
        if (message.audio) {
            console.log('Received audio data');
            const audioBuffer = Buffer.from(message.audio, 'base64');
            if (audioBuffer.length > 0) {
                clientWs.send(audioBuffer); 
            }
            
        } else {
            console.log('Received non-audio data:', message);
        }

        // End TTS 
        if (message.isFinal || message.type === 'stream-end') {
            console.log('Stream complete, closing connection to ElevenLabs');
            elevenLabsWs.send(JSON.stringify({ text: "" }));
        }
    });

    elevenLabsWs.on('error', (error) => {
        console.error('WebSocket error with ElevenLabs:', error.message);
    });
}

wss.on('connection', function connection(ws) {
    console.log('Client connected, starting TTS stream...');
});

app.get('/', (req, res) => {
    res.send('Server is running.');
});

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});

