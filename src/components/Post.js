import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/tr'
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import CSButton from '../util/CSButton';

//mui islevleri
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

//icons
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import { connect } from 'react-redux';
import { likePost, unlikePost } from '../redux/actions/dataActions';


const styles = {
    card: {
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};

class Post extends Component {
    likedPost = () => {
        if (this.props.user.likes && this.props.user.likes.find((like) => like.postId === this.props.post.postId))
            return true;
        else return false;
    };
    likePost = () => {
        this.props.likePost(this.props.post.postId);
    }
    unlikePost = () => {
        this.props.unlikePost(this.props.post.postId);
    }
    render() {
        dayjs.extend(relativeTime);
        const {
            classes,
            post: {
                body,
                createdAt,
                userImage,
                userHandle,
                postId,
                likeCount,
                commentCount
            },
            user: {
                authenticated
            }
        } = this.props;
        const likeButton = !authenticated ? (
            <CSButton tip="Like">
                <Link to="/login">
                    <FavoriteBorder color="primary" />
                </Link>
            </CSButton>
        ) : (
                this.likedPost() ? (
                    <CSButton tip="Undo Like" onClick={this.unlikePost}>
                        <FavoriteIcon color="primary" />
                    </CSButton>
                ) : (
                        <CSButton tip="Like" onClick={this.likePost}>
                            <FavoriteBorder color="primary" />
                        </CSButton>
                    )
            )
        return (
            <Card className={classes.card}>
                <CardMedia
                    image={userImage}
                    title="profile fotografi"
                    className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography variant="h5" color="primary" component={Link} to={`/users/${userHandle}`}>{userHandle}</Typography>
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).locale('tr').fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    {likeButton}
                    <span>{likeCount} Begeniler</span>
                    <CSButton tip="comments">
                        <ChatIcon color="primary" />
                    </CSButton>
                    <span>{commentCount} yorumlar</span>
                </CardContent>
            </Card>
        );
    }
}

Post.propTypes = {
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionsToProps = {
    likePost,
    unlikePost
}
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Post));