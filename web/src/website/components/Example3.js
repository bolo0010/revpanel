import React from 'react';
import { Link } from 'react-router-dom';
import { Publications } from './Publications/Publications';
import '../scss/Example3.scss'

const Example3 = () => (
    <div className='subpage'>
            <div className='header'>
                    <h1>Podstrona 3</h1>
                    <div className='back-button'>
                            <Link to='/'>Strona główna</Link>
                    </div>
            </div>
            <Publications route={'example3'} />
    </div>
)

export default Example3;