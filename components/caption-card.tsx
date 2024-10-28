import { FC } from "react";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

// Define a functional component named CaptionCard that takes a prop 'caption' which can be a string or undefined
export const CaptionCard: FC<{ caption: string | undefined }> = ({ caption }) => (
    // Render a Card component with specific styling
    <Card className="bg-gray-800 shadow-xl">
        <CardContent className="p-6">
            {caption ? (
                // If caption is provided, render it inside a ScrollArea component
                <ScrollArea className="max-h-52">
                    <p className="text-xl md:text-2xl text-center font-medium break-words animate-fade-in text-white">
                        {caption}
                    </p>
                </ScrollArea>
            ) : (
                // If caption is not provided, display a placeholder text
                <p className="text-xl md:text-2xl text-center font-medium text-gray-400 animate-pulse">
                    Waiting for speech...
                </p>
            )}
        </CardContent>
    </Card>
)