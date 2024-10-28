"use client";

import { DeepgramContextProviderProps, DeepgramContextType } from "@/lib/types";
import {
  createClient,
  LiveClient,
  SOCKET_STATES,
  LiveTranscriptionEvents,
  type LiveSchema,
  type LiveTranscriptionEvent,
} from "@deepgram/sdk";

import {
  createContext,
  useContext,
  useState,
  FunctionComponent,
} from "react";

// Create a context for Deepgram
const DeepgramContext = createContext<DeepgramContextType | undefined>(
  undefined
);

// Define the DeepgramContextProvider component
const DeepgramContextProvider: FunctionComponent<
  DeepgramContextProviderProps
> = ({ children }) => {
  // State to manage the connection to Deepgram
  const [connection, setConnection] = useState<LiveClient | null>(null);
  // State to manage the connection state
  const [connectionState, setConnectionState] = useState<SOCKET_STATES>(
    SOCKET_STATES.closed
  );

  // Function to connect to Deepgram
  const connectToDeepgram = async (options: LiveSchema, endpoint?: string) => {
    // Hardcoded key because it's a test project
    const key = process.env.DEEPGRAM_API_KEY ?? "a4595c3e5cc86dd7b1f0efe2a315dd8b438a17f2";
    const deepgram = createClient(key);

    // Establish a live connection to Deepgram
    const conn = deepgram.listen.live(options, endpoint);

    // Add event listeners for connection state changes
    conn.addListener(LiveTranscriptionEvents.Open, () => {
      setConnectionState(SOCKET_STATES.open);
    });

    conn.addListener(LiveTranscriptionEvents.Close, () => {
      setConnectionState(SOCKET_STATES.closed);
    });

    // Set the connection state
    setConnection(conn);
  };

  // Function to disconnect from Deepgram
  const disconnectFromDeepgram = async () => {
    if (connection) {
      connection.requestClose();
      setConnection(null);
    }
  };

  return (
    // Provide the context to child components
    <DeepgramContext.Provider
      value={{
        connection,
        connectToDeepgram,
        disconnectFromDeepgram,
        connectionState,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

// Custom hook to use the Deepgram context
function useDeepgram(): DeepgramContextType {
  const context = useContext(DeepgramContext);
  if (context === undefined) {
    throw new Error(
      "useDeepgram must be used within a DeepgramContextProvider"
    );
  }
  return context;
}

export {
  DeepgramContextProvider,
  useDeepgram,
  SOCKET_STATES,
  LiveTranscriptionEvents,
  type LiveTranscriptionEvent,
};