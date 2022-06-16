import '../../scss/Publications/Comments.scss'
import Comment from './Comment';
import React from 'react';

const Comments = ({comments, setConfirmation, refreshPublication}) => {
    if (comments.length < 1) return (
        <div className='TextEditor-no-comment'>
            <p className='TextEditor-no-comment__text'>Brak komentarzy.</p>
        </div>
    );

    return (
        <div className='TextEditor-comments'>
            {comments.map(comment =>
                <Comment
                    refreshPublication={refreshPublication}
                    setConfirmation={setConfirmation}
                    role={comment.user.role.role_pl}
                    nick={comment.user.nick}
                    content={comment.comment}
                    date={comment.createdAt}
                    id={comment.id}
                    user_id={comment.user.id}
                    key={comment.id}
                />
            )}
        </div>
    );
}

export default Comments;