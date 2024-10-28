import React, { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

const interpolateColor = (
    startColor: number[],
    endColor: number[],
    factor: number
): number[] => {
    const result = []
    for (let i = 0; i < startColor.length; i++) {
        result[i] = Math.round(
            startColor[i] + factor * (endColor[i] - startColor[i])
        )
    }
    return result
}

export default function Visualizer({ microphone }: { microphone: MediaRecorder }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const audioContext = new (window.AudioContext)()
    const analyser = audioContext.createAnalyser()
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    useEffect(() => {
        const source = audioContext.createMediaStreamSource(microphone.stream)
        source.connect(analyser)

        draw()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const draw = (): void => {
        const canvas = canvasRef.current

        if (!canvas) return

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        const context = canvas.getContext("2d")
        const width = canvas.width
        const height = canvas.height
        const centerX = width / 2
        const centerY = height / 2
        const radius = Math.min(width, height) / 2 - 10

        requestAnimationFrame(draw)

        analyser.getByteFrequencyData(dataArray)

        if (!context) return

        context.clearRect(0, 0, width, height)

        const barCount = 180
        const barWidth = (2 * Math.PI) / barCount
        const startColor = [0, 100, 0] // Dark green
        const endColor = [0, 60, 0] // Darker green

        for (let i = 0; i < barCount; i++) {
            const value = dataArray[i] || 0
            const barHeight = (value / 255) * (radius * 0.5) + 10

            const angle = i * barWidth
            const x1 = centerX + Math.cos(angle) * radius
            const y1 = centerY + Math.sin(angle) * radius
            const x2 = centerX + Math.cos(angle) * (radius - barHeight)
            const y2 = centerY + Math.sin(angle) * (radius - barHeight)

            const interpolationFactor = value / 255

            const color = interpolateColor(startColor, endColor, interpolationFactor)

            context.beginPath()
            context.moveTo(x1, y1)
            context.lineTo(x2, y2)
            context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`
            context.lineWidth = 2
            context.stroke()
        }

        // Draw circle outline
        context.beginPath()
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        context.strokeStyle = "rgba(0, 100, 0, 0.5)"
        context.lineWidth = 2
        context.stroke()
    }

    return (
        <Card className="md:w-80 md:h-80 w-60 h-60 overflow-hidden rounded-full shadow-lg flex items-center justify-center p-0">
            <div className="md:w-80 md:h-80 w-60 h-60 rounded-full bg-gray-200 overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ imageRendering: "pixelated" }}
                ></canvas>
            </div>
        </Card>
    )
}