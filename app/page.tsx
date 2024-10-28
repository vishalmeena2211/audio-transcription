'use client'

import { useEffect, useRef, useState } from "react"
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContextProvider"
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "../context/MicrophoneContextProvider"
import Visualizer from "@/components/Visualizer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mic, Wifi } from "lucide-react"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Component() {
  const [caption, setCaption] = useState<string | undefined>(undefined)
  const [pastCaptions, setPastCaptions] = useState<string[]>([])
  const { connection, connectToDeepgram, connectionState } = useDeepgram()
  const { setupMicrophone, microphone, startMicrophone, stopMicrophone, microphoneState } = useMicrophone()
  const captionTimeout = useRef<NodeJS.Timeout>()
  const keepAliveInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setupMicrophone()
  }, [])

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      })
    }
  }, [microphoneState])

  useEffect(() => {
    if (!microphone || !connection) return

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0) {
        connection?.send(e.data)
      }
    }

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data
      const thisCaption = data.channel.alternatives[0].transcript

      if (thisCaption !== "") {
        setCaption(cap => cap ? `${cap} ${thisCaption}` : thisCaption)
      }

      // if (isFinal && speechFinal) {
      //   clearTimeout(captionTimeout.current)
      //   captionTimeout.current = setTimeout(() => {
      //     setCaption(undefined)
      //     clearTimeout(captionTimeout.current)
      //   }, 3000)
      // }
    }

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript)
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData)
      startMicrophone()
    }

    return () => {
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript)
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData)
      clearTimeout(captionTimeout.current)
    }
  }, [connectionState])

  useEffect(() => {
    if (!connection) return

    if (microphoneState !== MicrophoneState.Open && connectionState === LiveConnectionState.OPEN) {
      connection.keepAlive()
      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive()
      }, 10000)
    } else {
      clearInterval(keepAliveInterval.current)
    }

    return () => {
      clearInterval(keepAliveInterval.current)
    }
  }, [microphoneState, connectionState])

  const handleToggleMicrophone = () => {
    if (microphoneState === MicrophoneState.Open) {
      if (caption) {
        setPastCaptions(prev => [...prev, caption])
        setCaption(undefined)
      }
      stopMicrophone()
    } else {
      startMicrophone()
    }
  }

  return (
    <div className="flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative">
        <Card className="w-full max-w-4xl bg-gray-900 shadow-xl">
          <CardContent className="p-6">
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden flex justify-center items-center">
              {microphone && <Visualizer microphone={microphone} />}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Badge variant="secondary" className="text-lg px-3 py-1 animate-pulse">
                    {connectionState === LiveConnectionState.OPEN ? "Connected" : "Disconnected"}
                  </Badge>
                  <div className="flex justify-center space-x-4">
                    <Badge variant={microphoneState === MicrophoneState.Open ? "default" : "secondary"} className="text-sm">
                      <Mic className="w-4 h-4 mr-2" />
                      Microphone
                    </Badge>
                    <Badge variant={connectionState === LiveConnectionState.OPEN ? "default" : "secondary"} className="text-sm">
                      <Wifi className="w-4 h-4 mr-2" />
                      Deepgram
                    </Badge>
                  </div>
                  <Button onClick={handleToggleMicrophone} className="mt-4">
                    {microphoneState === MicrophoneState.Open ? "Stop Microphone" : "Start Microphone"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 w-full max-w-4xl">
          <Card className="bg-gray-800 shadow-xl">
            <CardContent className="p-6">
              {caption && (
                <ScrollArea className="max-h-52">
                  <p className="text-xl md:text-2xl text-center font-medium break-words animate-fade-in text-white">
                    {caption}
                  </p>
                </ScrollArea>
              )}
              {!caption && (
                <p className="text-xl md:text-2xl text-center font-medium text-gray-400 animate-pulse">
                  Waiting for speech...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 w-full max-w-4xl">
          <Card className="bg-gray-800 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-2xl md:text-3xl text-center font-semibold text-white mb-4">Past Captions</h2>
              <ScrollArea className="max-h-52 mt-4">
                {pastCaptions.length > 0 ? (
                  pastCaptions.map((pastCaption, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-700 rounded-lg">
                      <p className="text-lg md:text-xl text-center font-medium break-words text-white">
                        {index + 1}. {pastCaption}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-lg md:text-xl text-center font-medium text-gray-400">
                    No past captions available.
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}