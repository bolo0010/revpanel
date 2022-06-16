import '../../scss/addons/Confirmation.scss';
import ConfirmationButtons from './ConfirmationButtons';

const Confirmation = ({ message, title, handleConfirmation }) => {
    return (
        <>
            <div className="confirmation-container">
                <div className="confirmation-title">{title}</div>
                <div className="confirmation-text">{message}</div>
                <ConfirmationButtons handleConfirmation={handleConfirmation} cancel={'Nie'} ok={'Tak'} />
            </div>
            <div className="confirmation-background" />
        </>
    );
};

export default Confirmation;
