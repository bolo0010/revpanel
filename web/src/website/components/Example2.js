import { Link } from 'react-router-dom';
import { Publications } from './Publications/Publications';

const Example2 = () => (
    <>
        <h1>Example 2</h1>
        <br/>
        <br/>
        <Link to="/">Strona główna</Link>
        <br/>
        <Publications route={"example2"}/>
    </>
)

export default Example2;