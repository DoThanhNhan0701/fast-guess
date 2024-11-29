import { useState, useRef, useLayoutEffect } from 'react'

interface WebSocketMessage {
  type: string
  players: string[]
  message: string
}

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<WebSocketMessage>()
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)

  useLayoutEffect(() => {
    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onopen = () => setIsConnected(true)
    socket.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data)
      setMessages(data)
    }
    socket.onclose = () => setIsConnected(false)
    socket.onerror = (error) => console.error('WebSocket error:', error)

    return () => {
      socket.close()
    }
  }, [url])

  const sendMessage = (message: WebSocketMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

  return { messages, isConnected, sendMessage }
}
