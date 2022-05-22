import { useEffect, useState } from "react"

const wsChannel = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx');

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

    return (
        <>
            <Messages />
            <AddMessageForm />
        </>
    )
}

const Messages: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>([])

    useEffect(() => {
        wsChannel.addEventListener('message', (e: MessageEvent) => {
            let newMessages = JSON.parse(e.data)
            setMessages((prevMessages) => [...prevMessages, ...newMessages])
        })
    }, [])

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

const AddMessageForm: React.FC = () => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
       if (!message) {
           return
       }
       
       wsChannel.send(message);
       setMessage('')
    }
    
    return (
        <div>
            <div style={{ display: 'flex',  flexDirection: 'column', width: '300px'}}>
                <label htmlFor="textarea">Messages</label>
                <textarea id="textarea" onChange={(e) => setMessage(e.target.value)} value={message}></textarea>
            </div>
            <div>
                <button onClick={sendMessage}>send</button>
            </div>
        </div>
    )
}

export default ChatPage;