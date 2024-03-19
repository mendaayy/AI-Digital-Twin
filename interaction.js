document.addEventListener('DOMContentLoaded', function() {
    const talkButton = document.getElementById('talkButton');
    const stopButton = document.getElementById('stopButton');
    const wsUrl = 'ws://localhost:3000'; 
    const ws = new WebSocket(wsUrl);
    let audioQueue = [];
    let isAudioPlaying = false;
    let currentAudio = null;
    let recognition; 

    function startWebSocket() {
        ws.binaryType = 'arraybuffer';
    
        ws.onopen = function() {
            console.log('WebSocket connection established');
        };
    
        ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                handleAudioData(event.data);
            } else {
                console.log('Received message:', event.data);
            }
        };
    
        ws.onerror = function(event) {
            console.error('WebSocket error:', event);
        };
    
        ws.onclose = function() {
            console.log('WebSocket connection closed');
        };
    } 
    
    startWebSocket();

    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.onstart = function() {
            console.log('Voice recognition started. Speak into the microphone.');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log(`You said: ${transcript}`);
            if (ws.readyState === WebSocket.OPEN) {
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

    function handleAudioData(arrayBuffer) {
        const blob = new Blob([arrayBuffer], {type: 'audio/mpeg'});
        audioQueue.push(blob);
        playAudioFromQueue();
    }

    function playAudioFromQueue() {
        if (audioQueue.length > 0 && !isAudioPlaying) {
            const audioBlob = audioQueue.shift();
            const audioURL = URL.createObjectURL(audioBlob);
            currentAudio = new Audio(audioURL);
            isAudioPlaying = true;
            currentAudio.play().then(() => {
                console.log('Audio playback started');
            }).catch(error => {
                console.error('Playback failed', error);
            });
            currentAudio.onended = () => {
                console.log('Audio playback ended');
                isAudioPlaying = false;
                if (audioQueue.length > 0) {
                    playAudioFromQueue();
                } else {
                    console.log('No more audio in queue.');
                    setTimeout(() => {
                       recognition.start();
                    }, 500); 
                }
            };
        } else {
            if (isAudioPlaying) {
                console.log('Audio is currently playing, waiting for it to end...');
            } else {
                console.log('Audio queue is empty, no playback initiated.');
            }
        }
    }

    talkButton.addEventListener('click', () => {
        console.log('Talk button clicked, initializing...');
        recognition.start();
    });

    stopButton.addEventListener('click', () => {
        console.log('Stopped recognition');
        recognition.stop();

        if (isAudioPlaying && currentAudio) {
            currentAudio.pause(); 
            currentAudio.currentTime = 0; 
            isAudioPlaying = false; 
            console.log("Audio playback stopped.");
        }
    
        audioQueue = [];
        console.log("Audio queue cleared.");
    });

    initSpeechRecognition(); 
});



