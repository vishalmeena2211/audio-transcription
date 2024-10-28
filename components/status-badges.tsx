import { Badge } from "@/components/ui/badge"; // Importing the Badge component
import { Mic, Wifi } from "lucide-react"; // Importing icons from lucide-react
import { SOCKET_STATES } from "@deepgram/sdk"; // Importing SOCKET_STATES from deepgram SDK
import { MicrophoneState } from "@/lib/types"; // Importing MicrophoneState type

// Defining the StatusBadges component
export const StatusBadges = ({ microphoneState, connectionState }: { microphoneState: MicrophoneState | null, connectionState: SOCKET_STATES }) => (
  <div className="flex justify-center space-x-4"> {/* Container div with flexbox and spacing */}
    <Badge variant={microphoneState === MicrophoneState.Open ? "default" : "secondary"} className="text-sm"> {/* Badge for microphone state */}
    <Mic className="w-4 h-4 mr-2" /> {/* Microphone icon */}
    Microphone
    </Badge>
    <Badge variant={connectionState === SOCKET_STATES.open ? "default" : "secondary"} className="text-sm"> {/* Badge for connection state */}
    <Wifi className="w-4 h-4 mr-2" /> {/* Wifi icon */}
    Deepgram
    </Badge>
  </div>
)