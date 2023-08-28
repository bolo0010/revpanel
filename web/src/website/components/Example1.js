import React from 'react';
import { Link } from 'react-router-dom';
import { Publications } from './Publications/Publications';
import '../scss/Example1.scss'

const Example1 = () => (
    <div className='subpage'>
        <div className='header'>
            <h1>Podstrona 1</h1>
            <div className='back-button'>
                <Link to='/'>Strona główna</Link>
            </div>
        </div>
        <Publications route={'example1'} />
    </div>
);

export default Example1;