import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CSButton from '../../util/CSButton';
import dayjs from 'dayjs';
import 'dayjs/locale/tr'
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';

//mui islevleri
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

//icon
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/More';
import ChatIcon from '@material-ui/icons/InsertComment';

//redux
import { connect } from 'react-redux';
import { getPost, clearErrors } from '../../redux/actions/dataActions';



const styles = (theme) => ({
    ...theme.spreadThis,
    profileImage:{
        maxWidth: 200,
        height: 200,
        width: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute'
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
})

class PostDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    };

    componentDidMount(){
        if(this.props.openDialog){
            this.handleOpen();
        }
    };

    handleOpen = () => {
        let oldPath = window.location.pathname;

        const {userHandle, postId  } = this.props;
        const newPath = `/users/${userHandle}/post/${postId}`;

        if(oldPath === newPath) oldPath = `/users/${userHandle}`;

        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath });
        this.props.getPost(this.props.postId);
    };

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({ open: false });
        this.props.clearErrors();
    }

    render() {
        const { classes, post: { postId, body, createdAt, likeCount, commentCount, userImage, userHandle, comments }, UI: { loading } } = this.props; 

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2}/>
            </div>
        ) : (
                <Grid container spacing={16}>
                    <Grid item sm={5}>
                        <img src={userImage} alt="Profile" className={classes.profileImage} />
                    </Grid>
                    <Grid item sm={7}>
                        <Typography
                            component={Link}
                            color="primary"
                            variant="h5"
                            to={`/users/${userHandle}`}
                        >
                            @{userHandle}
                        </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <Typography variant="body2" color="textSecondary">
                            {dayjs(createdAt).locale('tr').format('h:mm, DD MMMM YYYY')}
                        </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <Typography variant="body1">
                            {body}
                        </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <LikeButton postId={postId}/>
                        <span>{likeCount} beğeniler</span>
                        <CSButton tip="yorumlar">
                        <ChatIcon color="primary" />
                        </CSButton>
                        <span>{commentCount} yorumlar</span>
                    </Grid>
                    <hr className={classes.visibleSeparator} />
                    <CommentForm postId={postId} />
                    <Comments comments={comments} />
                </Grid>
            );
        return (
            <Fragment>
                <CSButton onClick={this.handleOpen} tip="post'u ayrıntıla" tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
                </CSButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <CSButton tip="kapat" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </CSButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    getPost: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.data.post,
    UI: state.UI
});

const mapActionsToProps = {
    getPost,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostDialog));