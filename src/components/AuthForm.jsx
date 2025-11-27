import '../styles/pages/AuthForm.css';
import logo from '../assets/picture/LeadSightLogo.png';

function AuthForm({ onSubmit, subheading, children }) {
    return(
        <form onSubmit={ onSubmit } className="form-container">
            <div className="header">
                <img id="logo" src={logo} alt="leadsight-logo" />
                <h3 className="brand-name">LeadSight</h3>
            </div>

            <h2 className="subheading">{ subheading }</h2>

            {children}
        </form>
    );
}

export default AuthForm;