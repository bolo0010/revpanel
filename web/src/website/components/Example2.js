import React from 'react';
import { Link } from 'react-router-dom';
import { Publications } from './Publications/Publications';
import '../scss/Example2.scss'

const Example2 = () => (
    <div className='subpage'>
            <div className='header'>
                    <h1>Podstrona 2</h1>
                    <div className='back-button'>
                            <Link to='/'>Strona główna</Link>
                    </div>
            </div>
            <Publications route={'example2'} />
    </div>
)

export default Example2;