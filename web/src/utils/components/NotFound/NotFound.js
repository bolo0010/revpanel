import './NotFound.scss';

const NotFound = () => {
	return (
		<>
			<div className="not-found-container">
				<div className="not-found">
					<h2 className="not-found__error">Błąd 404!</h2>
					<p className="not-found__message">Strona nie została odnaleziona!</p>
				</div>
			</div>
		</>
	)
}

export default NotFound;