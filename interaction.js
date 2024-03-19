document.getElementById('talkButton').addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    const ws = new WebSocket('ws://localhost:3000');
    ws.binaryType = 'arraybuffer';

    ws.onopen = function() {
        console.log('WebSocket connection established');
    };

    let audioQueue = [];
    let isAudioPlaying = false;

    function handleAudioData(arrayBuffer) {
        const blob = new Blob([arrayBuffer], {type: 'audio/mpeg'});
        audioQueue.push(blob);
        playAudioFromQueue();
    }

    function playAudioFromQueue() {
        if (audioQueue.length > 0 && !isAudioPlaying) {
            console.log('Starting playback from queue...');
            const audioBlob = audioQueue.shift();
            const audioURL = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioURL);
            isAudioPlaying = true;
            audio.play().then(() => {
                console.log('Audio playback started successfully');
            }).catch(error => {
                console.error('Playback failed', error);
            });
            audio.onended = () => {
                isAudioPlaying = false;
                if (audioQueue.length > 0) {
                    playAudioFromQueue();
                } else {
                    console.log('No more audio in queue.');
                }
            };
        } 
    }

     ws.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
            console.log('Received WebSocket message:', event.data);
            handleAudioData(event.data);
        } else {
            console.log('Received message', event.data);
        }
    };

    ws.onerror = function(event) {
        console.error('WebSocket error:', event);
    };

    ws.onclose = function() {
        console.log('WebSocket connection closed');
    };

    recognition.onstart = function() {
        console.log('Voice recognition started. Speak into the microphone.');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log(`You said: ${transcript}`);
        
        ws.send(transcript);
    };

    recognition.onspeechend = function() {
        recognition.stop();
    };

    recognition.onerror = function(event) {
        console.error('Recognition error:', event);
    };

    recognition.start();

});

