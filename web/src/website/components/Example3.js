import { Link } from 'react-router-dom';
import { Publications } from './Publications/Publications';

const Example3 = () => (
    <>
        <h1>Example 3</h1>
        <br/>
        <br/>
        <Link to="/">Strona główna</Link>
        <br/>
        <Publications route={"example3"}/>
    </>
)

export default Example3;