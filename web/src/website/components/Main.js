import React from 'react';
import { Link } from 'react-router-dom';
import '../scss/Main.scss';

const Main = () => {
    return (
        <main className='website'>
            <nav>
                <ul>
                    <li><Link to='/panel'>Panel</Link></li>
                    <li><Link to='/example1'>Podstrona 1</Link></li>
                    <li><Link to='/example2'>Podstrona 2</Link></li>
                    <li><Link to='/example3'>Podstrona 3</Link></li>
                </ul>
            </nav>
        </main>
    );
};

export default Main;