import { useState, useEffect, useContext, useRef } from 'react';
import { Box, makeStyles } from '@material-ui/core';

import { io } from 'socket.io-client';

import { getMessages, newMessages } from '../../../service/api';
import { AccountContext } from '../../../context/AccountProvider';

import { decrypt, encrypt } from '../../../service/encryption-handler';

//components
import Message from './Message';
import Footer from './Footer';

const useStyles = makeStyles({
    wrapper: {
        backgroundImage: `url(${'https://i.redd.it/rgm4jlptlv111.jpg'})`,
        // height: 'calc(100% - 114px)',
        backgroundSize: '100%'
    },
    footer: {
        height: '55px',
        background: '#ededed',
        // position: 'absolute',
        width: '100%',
        // bottom: 0
    },
    component: {
        height: '79vh',
        overflowY: 'scroll'
    },
    container: {
        padding: '1px 80px'
    }
})



const Messages = ({ person, conversation }) => {
    const classes = useStyles();

    const [messages, setMessages] = useState([]);
    const [incomingMessage, setIncomingMessage] = useState(null);
    const [value, setValue] = useState();

    const scrollRef = useRef();

    const { account, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext);

    useEffect(() => {
        
        socket.current.on('getMessage', data => {
            setIncomingMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, []);
    
    useEffect(() => {
        const getMessageDetails = async () => {
            let data = await getMessages(conversation._id);
            data = decrypt({ passPhrase: account.googleId, message: data }); // decrypt the message
            setMessages(data);
        }
        getMessageDetails();
    }, [conversation?._id, person._id, newMessageFlag]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ transition: "smooth" })
    }, [messages]);

    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.sender) && 
            setMessages((prev) => [...prev, incomingMessage]);
        
    }, [incomingMessage, conversation]);

    const receiverId = conversation?.members?.find(member => member !== account.googleId);
    const receiverPublicKey = conversation?.members?.find(member => member !== account.publicKey);
    
    const sendText = async (e) => {
        let code = e.keyCode || e.which;
        if(!value) return;

        console.log(receiverPublicKey);
        value = encrypt( {message: value, key: receiverPublicKey} ); // encrypt the message

        if(code === 13) { 
            let message = {
                sender: account.googleId,
                conversationId: conversation._id,
                text: value
            };

            socket.current.emit('sendMessage', {
                senderId: account.googleId,
                receiverId,
                text: value
            })

            await newMessages(message);

            setValue('');
            setNewMessageFlag(prev => !prev);
        } 
    }

    return (
        <Box className={classes.wrapper}>
            <Box className={classes.component}>
                {
                    messages && messages.map(message => (
                        <Box className={classes.container} ref={scrollRef}>
                            <Message message={message} />
                        </Box>
                    ))
                }
            </Box>
            <Footer sendText={sendText} value={value} setValue={setValue} />
        </Box>
    )
}

export default Messages;