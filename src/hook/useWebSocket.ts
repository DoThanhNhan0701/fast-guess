import { useState, useRef, useLayoutEffect } from 'react'

interface WebSocketMessage {
  action: 'submit' | 'start_game' | 'change_role' | 'judgment' | 'ready' | 'next_question'
  [key: string]: any
}

export const useWebSocket = (
  url: string,
  onMessage?: (data: any) => void,
  options?: {
    onError?: (e: Event) => void
  },
) => {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)

  useLayoutEffect(() => {
    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onopen = () => setIsConnected(true)

    socket.onclose = (ws) => {
      setIsConnected(false)
    }
    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      options?.onError?.(error)
    }

    return () => {
      socket.close()
    }
  }, [url])

  if (socketRef.current) {
    socketRef.current.onmessage = (e: MessageEvent) => {
      onMessage?.(JSON.parse(e.data))
    }
  }

  const sendMessage = (message: WebSocketMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message))
    }
  }

  return { isConnected, sendMessage }
}
