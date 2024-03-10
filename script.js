document.getElementById('talkButton').addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = function() {
        console.log('Voice recognition started. Speak into the microphone.');
    };

    recognition.onspeechend = function() {
        recognition.stop();
    };

    recognition.onresult = async function(event) {
        const transcript = event.results[0][0].transcript;
        console.log(`You said: ${transcript}`);
        
        // Fetch response from your server
        try {
            const response = await fetch('http://localhost:3000/chatgpt-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: transcript }),
            });
            const data = await response.json();
            console.log(`AI said: ${data.response}`); // Log the AI response to the console
        } catch (error) {
            console.error('Error fetching ChatGPT response:', error);
        }
    };

    recognition.start();
});

/*
function speakResponse(message) {
    // Assuming you want to use the browser's text-to-speech
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);

    
    document.getElementById('avatarIdle').style.display = 'none';
    document.getElementById('avatarSpeaking').style.display = 'block';

    utterance.onend = () => {
        // Switch back to the idle avatar once the speech ends
        document.getElementById('avatarIdle').style.display = 'block';
        document.getElementById('avatarSpeaking').style.display = 'none';
    };
    
}
*/
