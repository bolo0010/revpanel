import React from 'react';
import { Link } from 'react-router-dom';
import { Publications } from './Publications/Publications';

const Example1 = () => (
    <>
        <h1>Example 1</h1>
        <br/>
        <br/>
        <Link to="/">Strona główna</Link>
        <br/>
        <Publications route={"example1"}/>
    </>
)

export default Example1;