'use client'

import { useEffect, useRef, useState } from "react"
import {
  SOCKET_STATES,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/deepgram-context-provider"
import {
  useMicrophone,
} from "../context/microphone-context-provider"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { VisualizerCard } from "@/components/visualizer-card"
import { CaptionCard } from "@/components/caption-card"
import { PastCaptionsCard } from "@/components/past-captions-card"
import { MicrophoneEvents, MicrophoneState } from "@/lib/types"


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
      const thisCaption = data.channel.alternatives[0].transcript

      if (thisCaption !== "") {
        setCaption( cap => cap ? cap + " " + thisCaption : thisCaption ) 
      }
    }

    if (connectionState === SOCKET_STATES.open) {
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

    if (microphoneState !== MicrophoneState.Open && connectionState === SOCKET_STATES.open) {
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
        <VisualizerCard
          microphone={microphone}
          connectionState={connectionState}
          microphoneState={microphoneState}
          handleToggleMicrophone={handleToggleMicrophone}
        />
        <div className="mt-8 w-full max-w-4xl">
          <CaptionCard caption={caption} />
        </div>
        <div className="mt-8 w-full max-w-4xl">
          <PastCaptionsCard pastCaptions={pastCaptions} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
