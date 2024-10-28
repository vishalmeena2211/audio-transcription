import { MicrophoneState } from "@/lib/types"; // Importing the MicrophoneState type
import { ConnectionStatus } from "./connection-status"; // Importing the ConnectionStatus component
import { StatusBadges } from "./status-badges"; // Importing the StatusBadges component
import { Button } from "./ui/button"; // Importing the Button component
import { Card, CardContent } from "./ui/card"; // Importing the Card and CardContent components
import Visualizer from "./visualizer"; // Importing the Visualizer component
import { SOCKET_STATES } from "@deepgram/sdk"; // Importing SOCKET_STATES from the deepgram SDK

// Defining the VisualizerCard component
export const VisualizerCard = ({ microphone, connectionState, microphoneState, handleToggleMicrophone }: { microphone: MediaRecorder | null, connectionState: SOCKET_STATES, microphoneState: MicrophoneState | null, handleToggleMicrophone: () => void }) => (
  <Card className="bg-gray-800 shadow-xl"> {/* Card component with styling */}
    <CardContent className="p-6"> {/* CardContent component with padding */}
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden flex justify-center items-center"> {/* Container for the visualizer and controls */}
        {microphone && <Visualizer microphone={microphone} />} {/* Conditionally render the Visualizer if microphone is available */}
        <div className="absolute inset-0 flex items-center justify-center"> {/* Centered overlay for status and controls */}
          <div className="text-center space-y-4"> {/* Centered text container with spacing */}
            <ConnectionStatus connectionState={connectionState} /> {/* ConnectionStatus component */}
            <StatusBadges
              microphoneState={microphoneState} connectionState={connectionState} /> {/* StatusBadges component */}
            <Button onClick={handleToggleMicrophone} className="mt-4"> {/* Button to toggle microphone */}
              {microphoneState === MicrophoneState.Open ? "Stop Microphone" : "Start Microphone"} {/* Button text based on microphone state */}
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)