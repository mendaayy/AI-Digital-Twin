document.getElementById('talkButton').addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = function() {
        console.log('WebSocket connection established');
    };

    ws.onmessage = function(event) {
        console.log(event.data);
        
    };

    ws.onerror = function(event) {
        console.error('WebSocket error:', event);
    };

    recognition.onstart = function() {
        console.log('Voice recognition started. Speak into the microphone.');
    };

    recognition.onspeechend = function() {
        recognition.stop();
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log(`You said: ${transcript}`);
        
        // Send the transcript through the WebSocket
        ws.send(transcript);
    };

    recognition.onerror = function(event) {
        console.error('Recognition error:', event);
    };

    recognition.start();
});

//     recognition.onstart = function() {
//         console.log('Voice recognition started. Speak into the microphone.');
//     };

//     recognition.onspeechend = function() {
//         recognition.stop();
//     };

//     recognition.onresult = async function(event) {
//         const transcript = event.results[0][0].transcript;
//         console.log(`You said: ${transcript}`);
        
//         // Fetch response from server NLP
//         try {
//             const response = await fetch('http://localhost:3000/cohere-nlp', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ prompt: transcript }),
//             });
            
//             const data = await response.json();
//             console.log(data.response);

//             if (data.response) {

//                     // Request the TTS audio for the AI's response 
//                     const ttsResponse = await fetch('http://localhost:3000/elevenlabs-tts', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({ text: data.response })
//                     });

//                     if (ttsResponse.ok) {
//                         // Convert binary audio/mpeg to blob
//                         const audioBlob = await ttsResponse.blob();
//                         const audioUrl = URL.createObjectURL(audioBlob);
//                         const audio = new Audio(audioUrl);
//                         audio.play();
//                     } else {
//                         console.error('Failed to fetch TTS audio');
//                     }
//             } else {
//                 console.error('No response from Cohere AI.');
//             }
//         } catch (error) {
//             console.error('Error fetching Cohere AI response:', error);
//         }
//     };

//     recognition.start();
// });

