import { useState, useEffect, useContext } from 'react';
import { Dialog } from '@material-ui/core';
import { makeStyles, Typography, List, ListItem, Box, withStyles } from '@material-ui/core';

import { GoogleLogin, GoogleLogout } from 'react-google-login';

import { addUser } from '../../service/api';
import { AccountContext } from '../../context/AccountProvider';

import { generatePair, cryptoObj, publicKey } from '../../service/encryption-handler';

import { isOverwriteKeys } from '../../index';

let googleId;

const useStyle = makeStyles({
    component: {
        display: 'flex'
    },
    dialog: {
        padding: '56px 0 56px 56px',
    },
    qr: {
        // margin: '50px 0 0 50px',
        // height: 264,
        // width: 264,
        display: 'none'
    },
    title: {
        fontSize: 26,
        marginBottom: 25,
        color: '#525252',
        fontFamily: 'Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif',
        fontWeight: 300   
    },
    list: {
        '&  > *': {
            padding: 0,
            marginTop: 15,
            fontSize: 18,
            lineHeight: '28px',
            color: '#4a4a4a'
        }
    }
})

const style = {
    dialogPaper: {
        marginTop: '12%',
        height: '95%',
        width: '60%',
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: 25,
        // boxShadow: 'none',
        overflow: 'hidden'
    }
};

const LoginDialog = ({ classes }) => {
    const classname = useStyle();
    const clientId = '474525669025-j07rmfjjj53hn0nts7beignva7gbvkdh.apps.googleusercontent.com';

    const [open, setOpen] = useState(false);

    const { account, setAccount,showloginButton, setShowloginButton, showlogoutButton, setShowlogoutButton } = useContext(AccountContext);

    const onLoginSuccess = async (res) => {
        console.log('Login Success:', res.profileObj);
        cryptoObj({ passPhrase: res.profileObj.googleId });
        res.profileObj.publicKey = publicKey();  //might be error as it is not initialized everytime
        googleId=res.profileObj.googleId;
        setShowloginButton(false);
        setShowlogoutButton(true);
        res.profileObj = await addUser( {object: res.profileObj, flag: isOverwriteKeys()});
        console.log(res.profileObj);
        setAccount(res.profileObj);
    };

    const onLoginFailure = (res) => {
        console.log('Login Failed:', res);
    };

    const onSignoutSuccess = () => {
        alert("You have been logged out successfully");
        console.clear();
        setShowloginButton(true);
        setShowlogoutButton(false);
    };

    useEffect(() => {
        setOpen(true);
    }, [])

    const url = '';

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Dialog onClose={handleClose}
            open={true}
            classes={{paper: classes.dialogPaper}} 
            BackdropProps={{style: {backgroundColor: 'unset'}}}
        >
            <Box className={classname.component}>
                <Box className={classname.dialog}>
                    <Typography className={classname.title}>End-to-end encrypted messenger</Typography>
                    <List className={classname.list}>
                        <ListItem>1. Login through your Google Account.</ListItem>
                        <ListItem>2. And you're good to go.</ListItem>
                        <ListItem>*Your google account is only used to authenticate you,</ListItem>
                        <ListItem>we only store your name, email, and display picture.</ListItem>
                    </List>
                </Box>
                <Box style={{position:'relative'}}>
                    <img src={url} alt=" " className={classname.qr} />
                    <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translateX(270%) translateY(-25%)'}}>
                        { showloginButton ?
                            <GoogleLogin
                                clientId={clientId}
                                buttonText=""
                                onSuccess={onLoginSuccess}
                                onFailure={onLoginFailure}
                                cookiePolicy={'single_host_origin'}
                                isSignedIn={true}
                            /> : null}

                        { showlogoutButton ?
                            <GoogleLogout
                                clientId={clientId}
                                buttonText=""
                                onLogoutSuccess={onSignoutSuccess}
                            >
                            </GoogleLogout> : null
                        }
                    </div>
                </Box>
            </Box>
        </Dialog>
    )
}

export const getGoogleId = async (request, response) => {
    return googleId;
}

export default withStyles(style)(LoginDialog);