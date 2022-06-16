import { Link } from 'react-router-dom';
import "../scss/Main.scss"
import { Publications } from './Publications/Publications';


const Main = () => {
	return (
		<>
			<div>Strona główna</div>
			<Link to="/panel">Panel</Link>
			<br/>
			<Link to="/example1">Podstrona1</Link>
			<br/>
			<Link to="/example2">Podstrona2</Link>
			<br/>
			<Link to="/example3">Podstrona3</Link>
		</>
	)
}

export default Main