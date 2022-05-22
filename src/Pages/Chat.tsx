import { useEffect, useState } from "react"

export type ChatMessageType = {
    message: string
    photo: string
    userId: number
    userName: string
}
    
const ChatPage: React.FC = () => {
    return (
        <>
            <h1>My chat</h1>
            <Chat />
        </>
    )
}

const Chat: React.FC = () => {
    const [wsChannel, setWsChannel] = useState<WebSocket | null>(null)

    useEffect(() => {
        let ws: WebSocket;

        const closeHandler = () => {
            console.log('WS CLOSED')
            setTimeout(createChannel, 3000)
        }

        function createChannel() {
            ws?.removeEventListener('close', closeHandler)
            ws?.close()

            ws = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx');
            ws.addEventListener('close', closeHandler)
            setWsChannel(ws);
        }
    
        createChannel();

        return () => {
            ws.removeEventListener('close', closeHandler);
            ws.close()
        }
    }, [])

    return (
        <>
            <Messages wsChannel={wsChannel} />
            <AddMessageForm wsChannel={wsChannel} />
        </>
    )
}

const Messages: React.FC<{wsChannel: WebSocket | null}> = ({ wsChannel }) => {
    const [messages, setMessages] = useState<ChatMessageType[]>([])

    const messageHandler = (e: MessageEvent) => {
        let newMessages = JSON.parse(e.data)
        setMessages((prevMessages) => [...prevMessages, ...newMessages])
    }

    useEffect(() => {
        wsChannel?.addEventListener('message', messageHandler);

        return () => {
            wsChannel?.removeEventListener('message', messageHandler);
        }
    }, [wsChannel])

    return(
       <div style={{height: '400px', overflowY: 'auto' }}>
           {messages.map((m, index) => (<Message message={m} key={index}/> ))}
       </div>
    ) 
}

const Message: React.FC<{message: ChatMessageType}> = ({message}) => {
    return(

        <div key={`${message.userName}`}>
            <img src={message.photo ? message.photo : 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'} style={{borderRadius: '50%', width: '30px'}}/>
            <b>{message.userName}</b>
            <br />
            <span>{message.message}</span>
        </div>
    )
}

const AddMessageForm: React.FC<{wsChannel: WebSocket | null}> = ({ wsChannel }) => {
    const [message, setMessage] = useState<string>('');
    const [readyStatus, setReadyStatus] = useState<'pending'| 'ready'>('pending');

    const openHandler = () => {
        setReadyStatus('ready')
    }

    useEffect(() => {
        wsChannel?.addEventListener('open', openHandler)

        return () => {
            wsChannel?.removeEventListener('open', openHandler)
        }
    }, [wsChannel])

    const sendMessage = () => {
       if (!message) {
           return
       }
       
       wsChannel?.send(message);
       setMessage('')
    }
    
    return (
        <div>
            <div style={{ display: 'flex',  flexDirection: 'column', width: '300px'}}>
                <label htmlFor="textarea">Messages</label>
                <textarea id="textarea" onChange={(e) => setMessage(e.target.value)} value={message}></textarea>
            </div>
            <div>
                <button onClick={sendMessage} disabled={wsChannel === null || readyStatus !== 'ready'}>send</button>
            </div>
        </div>
    )
}

export default ChatPage;