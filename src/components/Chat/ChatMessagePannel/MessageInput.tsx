// src/components/MessageInput.tsx
import React from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import AudioRecorder from '../../Pages/audioRecorder';

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  handleVoiceMessage: (blob: Blob, url: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = React.memo(
  ({ input, setInput, sendMessage, handleVoiceMessage }) => (
    <div className="p-1 flex items-center gap-3 bg-[#F0F2F5]">
      <div className="flex gap-3 items-center">
        <IconButton aria-label="Attach file">
          <AttachFileIcon className="text-gray-500" />
        </IconButton>
        <AudioRecorder onStop={handleVoiceMessage} />
      </div>
      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        variant="outlined"
        fullWidth
        placeholder="Type a message"
        className="bg-white"
        aria-label="Message input"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={sendMessage} aria-label="Send message">
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  )
);