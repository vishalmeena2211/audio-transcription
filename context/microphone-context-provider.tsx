"use client";

// Import necessary types and hooks
import { MicrophoneContextProviderProps, MicrophoneContextType, MicrophoneState } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

// Create a context for the microphone
const MicrophoneContext = createContext<MicrophoneContextType | undefined>(
  undefined
);

// Define the MicrophoneContextProvider component
const MicrophoneContextProvider: React.FC<MicrophoneContextProviderProps> = ({
  children,
}) => {
  // State to manage the microphone state
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(
    MicrophoneState.NotSetup
  );
  // State to manage the MediaRecorder instance
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);

  // Function to setup the microphone
  const setupMicrophone = async () => {
    setMicrophoneState(MicrophoneState.SettingUp);

    try {
      // Request user media with audio constraints
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      // Create a MediaRecorder instance
      const microphone = new MediaRecorder(userMedia);

      // Update state to indicate the microphone is ready
      setMicrophoneState(MicrophoneState.Ready);
      setMicrophone(microphone);
    } catch (err: unknown) {
      console.error(err);

      throw err;
    }
  };

  // Function to stop the microphone
  const stopMicrophone = useCallback(() => {
    setMicrophoneState(MicrophoneState.Pausing);

    if (microphone?.state === "recording") {
      microphone.pause();
      setMicrophoneState(MicrophoneState.Paused);
    }
  }, [microphone]);

  // Function to start the microphone
  const startMicrophone = useCallback(() => {
    setMicrophoneState(MicrophoneState.Opening);

    if (microphone?.state === "paused") {
      microphone.resume();
    } else {
      microphone?.start(250);
    }

    setMicrophoneState(MicrophoneState.Open);
  }, [microphone]);

  // Provide the context value to children components
  return (
    <MicrophoneContext.Provider
      value={{
        microphone,
        startMicrophone,
        stopMicrophone,
        setupMicrophone,
        microphoneState,
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};

// Custom hook to use the MicrophoneContext
function useMicrophone(): MicrophoneContextType {
  const context = useContext(MicrophoneContext);

  if (context === undefined) {
    throw new Error(
      "useMicrophone must be used within a MicrophoneContextProvider"
    );
  }

  return context;
}

export { MicrophoneContextProvider, useMicrophone };