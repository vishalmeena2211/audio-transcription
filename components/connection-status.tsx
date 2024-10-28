import { SOCKET_STATES } from "@deepgram/sdk"; // Importing SOCKET_STATES from the Deepgram SDK
import { Badge } from "./ui/badge"; // Importing the Badge component

// Defining the ConnectionStatus component which takes connectionState as a prop
export const ConnectionStatus = ({ connectionState }: { connectionState: SOCKET_STATES }) => (
  // Rendering the Badge component with specific styles and animation
  <Badge variant="secondary" className="text-lg px-3 py-1 animate-pulse">
    {/* Displaying "Connected" if the connectionState is open, otherwise "Disconnected" */}
    {connectionState === SOCKET_STATES.open ? "Connected" : "Disconnected"}
  </Badge>
)