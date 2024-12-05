import {useEffect, useRef, useState} from "react"
import SockJS from "sockjs-client"
import {Stomp} from "@stomp/stompjs"

const useWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false)
    const [lastMessage, setLastMessage] = useState()
    const stompClient = useRef(null)

    const sendMessage = (message) => {
        if (stompClient?.current?.connected) {
            stompClient.current.send("/app/sendMessage", {}, JSON.stringify(message))
        } else {
            console.error("Socket is not connected.")
        }
    }

    const onMessage = (frame) => {
        setIsConnected(true)
        stompClient.current?.subscribe("/topic/messages", (messageOutput) => {
            setLastMessage(JSON.parse(messageOutput.body))
        })
    }

    const onError = (frame) => {
        console.error("Socket connection error", frame.body)
    }

    useEffect(() => {
        const url = `http://localhost:8081/ws`
        const socket = new SockJS(url)

        stompClient.current = Stomp.over(socket)

        const headers = {
            forceBinaryWSFrames: "true",
            appendMissingNULLonIncoming: "true",
        }

        stompClient.current.connect(
            headers,
            onMessage,
            onError,
        )

        return () => {
            stompClient?.current?.disconnect(() => {
                setIsConnected(false)
            })
        }
    }, [])

    return {
        sendMessage,
        lastMessage,
        isConnected
    }
}

export default useWebSocket