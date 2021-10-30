
import { Box, makeStyles, Typography, Divider } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
    component: {
        background: '#f8f9fa',
        padding: '50px 0',
        textAlign: 'center',
        height: '100%'
    },
    container: {
        padding: '0 200px',
        [theme.breakpoints.down('sm')]: {
            padding: -0
        }
    },
    image: {
        width: 320,
        display: 'none'
    },
    title: {
        fontSize: 36,
        fontWeight: 300,
        color: '#525252',
        marginTop: 25
    },
    subTitle: {
        marginTop: 10,
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.45)'
    },
    divider: {
        margin: '30px 0'
    }
}));

const EmptyChat = () => {
    const classes = useStyle();
    const url = '';

    return (
        <Box className={classes.component}>
            <Box className={classes.container}>
                <img src={url} alt="dp" className={classes.image} />
                <Typography className={classes.title}>No chat selected</Typography>
                <Typography className={classes.subTitle}>Your messages are end-to-end encrypted, nobody can see your messages other than
                 you and the receiver.
                </Typography>
                <Typography className={classes.subTitle}>Made with 💖 by NMIMS Students</Typography>
                <Divider className={classes.divider} />
            </Box>
        </Box>
    )
}

export default EmptyChat;