import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function Recorder({ onTranscription }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];

    mr.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const fd = new FormData();
      fd.append('audio', blob, 'rec.webm');

      try {
        const resp = await axios.post('http://localhost:4000/transcribe', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (resp.data.ok) {
          onTranscription(resp.data);
        } else {
          alert('Transcription failed');
        }
      } catch (e) {
        console.error(e);
        alert('Napaka pri pošiljanju posnetka');
      }
    };

    mr.start();
    setRecording(true);
  };

  const stop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  return (
    <div>
      <button onClick={start} disabled={recording}>Start recording</button>
      <button onClick={stop} disabled={!recording}>Stop recording</button>
    </div>
  );
}
