import React, { useState, useRef, useEffect } from 'react';
import MicIcon from '@mui/icons-material/Mic';

interface AudioRecorderProps {
  onStop: (blob: Blob, url: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0); // State for timer
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]); // This will hold the recorded chunks
  const timerRef = useRef<number | null>(null); // To store the timer interval ID, using 'number'

  // Start or stop the recording
  const handleStartStopRecording = async () => {
    if (isRecording) {
      // Stop the recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current); // Stop the timer when recording stops
        timerRef.current = null; // Reset the timer reference
      }
      setTimer(0); // Reset the timer state to 0
    } else {
      // Start the recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data); // Collect the audio data
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = []; // Clear chunks after recording is stopped
        if (onStop) {
          onStop(audioBlob, url); // Call the onStop callback
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Start the timer
      timerRef.current = window.setInterval(() => {
        setTimer((prev) => prev + 1); // Increment the timer every second
      }, 1000);
    }
  };

  // Format the timer into MM:SS format
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Mic Button */}
      <button
        onClick={handleStartStopRecording}
        style={{
          backgroundColor: isRecording ? 'green' : 'transparent',
          color: isRecording ? 'white' : 'black',
          border: 'none',
          padding: '10px',
          borderRadius: '50%',
          cursor: 'pointer',
        }}
      >
        <MicIcon style={{ color: isRecording ? 'white' : 'black' }} />
      </button>

      {/* Timer */}
      {isRecording && (
        <div className="text-lg font-semibold text-green-500">
          {formatTimer(timer)} {/* Display the timer */}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
