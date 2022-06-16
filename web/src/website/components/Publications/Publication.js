import React from 'react';
import { convertFromRaw, EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import "../../scss/Publications/Publication.scss"

export const Publication = ({ content, title, author, date, type }) => {
    const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(content)));
    return (
        <>
            <div className='publication-title'>
                <h2 className='publication-title__header'>
                    {title}
                </h2>
                <span className='publication-data__type'>{type}</span>
            </div>
            <div className='publication-data'>
                <span className='publication-data__author'>{author}</span>
                <span className='publication-data__date'>{date}</span>
            </div>
            <div className='publication-content'>
                <Editor readOnly={true}
                        editorState={editorState}
                        onChange={() => {
                        }}
                />
            </div>
        </>
    );

};