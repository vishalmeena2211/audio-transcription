import { Card, CardContent } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"

// Component to display past captions in a card format
export const PastCaptionsCard = ({ pastCaptions }: { pastCaptions: string[] }) => (
    // Main card container with background and shadow styling
    <Card className="bg-gray-800 shadow-xl">
        <CardContent className= "p-6">
            {/* Header for the card */}
            <h2 className="text-2xl md:text-3xl text-center font-semibold text-white mb-4">Past Captions</h2>
            {/* Scrollable area for the list of past captions */}
            <ScrollArea className="max-h-52 mt-4">
                {pastCaptions.length > 0 ? (
                    // Map through pastCaptions array and display each caption
                    pastCaptions.map((pastCaption, index) => (
                        <div key={index} className="mb-2 p-2 bg-gray-700 rounded-lg">
                            <p className="text-lg md:text-xl text-center font-medium break-words text-white">
                                {index + 1}. {pastCaption}
                            </p>
                        </div>
                    ))
                ) : (
                    // Display message if there are no past captions
                    <p className="text-lg md:text-xl text-center font-medium text-gray-400">
                        No past captions available.
                    </p>
                )}
            </ScrollArea>
        </CardContent>
    </Card>
)