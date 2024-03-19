document.addEventListener('DOMContentLoaded', function() {
    const talkButton = document.getElementById('talkButton');
    const stopButton = document.getElementById('stopButton');
    
    const wsUrl = 'ws://localhost:3000'; 
    const ws = new WebSocket(wsUrl);
    let recognition; 

    // Audio queue management
    let audioQueue = [];
    let isAudioPlaying = false;
    let currentAudio = null;

    function startWebSocket() {
        // Binary -> buffer
        ws.binaryType = 'arraybuffer';
    
        ws.onopen = function() {
            console.log('WebSocket connection established');
        };
    
        ws.onmessage = (event) => {
            // Audio data
            if (event.data instanceof ArrayBuffer) {
                handleAudioData(event.data);
            // Non-audio data - TTS completed
            } else if (typeof event.data === "string") {
                console.log('End of TTS');
                replaceImageSources('/gif/static.gif');
                recognition.start();
            }
        };
    
        ws.onerror = function(event) {
            console.error('WebSocket error:', event);
        };
    
        ws.onclose = function() {
            console.log('WebSocket connection closed');
        };
    } 
    
    // Websocket connection
    startWebSocket();

    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.onstart = function() {
            console.log('Voice recognition started. Speak into the microphone.');
        };

        // Send transcript to NLP
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log(`You said: ${transcript}`);

            if (ws.readyState === WebSocket.OPEN) {
                // Send to NLP ws
                ws.send(transcript);
            } else {
                console.error('WebSocket is not open. Unable to send transcript.');
            }
        };

        recognition.onspeechend = function() {
            console.log('Speech recognition ended.');
        };

        recognition.onerror = function(event) {
            console.error('Recognition error:', event);
        };
    }

    // Push to queue
    function handleAudioData(arrayBuffer) {
        // Buffer to blob
        const blob = new Blob([arrayBuffer], {type: 'audio/mpeg'});
        audioQueue.push(blob);
        playAudioFromQueue();
    }

    function playAudioFromQueue() {
        // Play received audio
        if (audioQueue.length > 0 && !isAudioPlaying) {

            const audioBlob = audioQueue.shift();
            const audioURL = URL.createObjectURL(audioBlob);
            currentAudio = new Audio(audioURL);
            isAudioPlaying = true;

            // Audio is playing -> moving gif
            currentAudio.play().then(() => {
                replaceImageSources('/gif/moving.gif');
                console.log('Audio playback started');
            }).catch(error => {
                console.error('Playback failed', error);
            });

            currentAudio.onended = () => {
                console.log('Audio playback ended');
                isAudioPlaying = false;

                // Playing next queued audio
                if (audioQueue.length > 0) {
                    playAudioFromQueue();

                // Pause, waiting to receive audio
                } else {
                    console.log('Waiting for audio...')
                    replaceImageSources('/gif/pause.gif');
            }
            };

        } else {
            // Received audio with pauses (size:0)
            if (isAudioPlaying) {
                console.log('Waiting for audio...');
            } else {
                console.log('Audio queue is empty, no playback initiated.');
            }
        }
    }

    // Start transcript
    talkButton.addEventListener('click', () => {
        console.log('Talk button clicked, initializing...');
        recognition.start();
    });

    // Stop transcript + audio
    stopButton.addEventListener('click', () => {
        replaceImageSources('/gif/static.gif');
        console.log('Stopped recognition');
        recognition.stop();

        // Stop audio
        if (isAudioPlaying && currentAudio) {
            currentAudio.pause(); 
            currentAudio.currentTime = 0; 
            isAudioPlaying = false; 
            console.log("Audio playback stopped.");
        }
    
        // Empty audio
        audioQueue = [];
        console.log("Audio queue cleared.");
    });

    // Replacing the gif
    function replaceImageSources(newSrc) {
        const images = document.querySelectorAll('.static');

        // Iterate over each image and update its src attribute
        images.forEach(image => {
            image.src = newSrc;
        });
    }

    initSpeechRecognition(); 
});



