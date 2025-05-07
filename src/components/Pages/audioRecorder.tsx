import React, { useState, useRef } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';

interface AudioRecorderProps {
  onStop: (blob: Blob, url: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const isResettingRef = useRef<boolean>(false);

  const handleStartStopRecording = async () => {
    if (isRecording) {
      if (timer < 2) {
        console.warn('Recording must be at least 2 seconds.');
        return;
      }

      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimer(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          if (!isResettingRef.current) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            audioChunksRef.current = [];
            onStop(audioBlob, url);
          }

          mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
          audioChunksRef.current = [];
          isResettingRef.current = false;
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);

        timerRef.current = window.setInterval(() => {
          setTimer((prev) => prev + 1);
        }, 1000);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }
  };

  const handleResetRecording = () => {
    if (isRecording) {
      isResettingRef.current = true;
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimer(0);
      setAudioUrl(null);
    }
  };

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div className="flex items-center space-x-4">
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

      {isRecording && (
        <div className="flex items-center space-x-2">
          <div className="text-lg font-semibold text-green-500">
            {formatTimer(timer)}
          </div>
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleResetRecording}
          />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
