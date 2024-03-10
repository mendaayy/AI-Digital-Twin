require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS package
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/chatgpt-response', async (req, res) => {
    const userInput = req.body.prompt;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003', // Or any other model
                prompt: userInput,
                max_tokens: 100,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );
        res.json({ response: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching response from OpenAI' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
