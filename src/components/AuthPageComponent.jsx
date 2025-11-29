import statsIcon from '../assets/picture/10 1.png';
import '../styles/AuthPageComponent.css';

function AuthPageComponent({ children }) {
    return(
        <div className="auth-page-body">
            {/* reduce size */}
            <div className="auth-page-left">
                <img id='stats-icon' src={ statsIcon } alt="stats-illustration" />
                <h2>See the Leads, Shape the Sales</h2>
                <p>Your sales superpower is here!</p>
                <p>With AI-driven predictions and smart dashboards, you can plan better, move faster, and hit your targets with confidence.</p>

            </div>
            <hr/>
            <div className="auth-page-right">
                { children }
            </div>
        </div>
    );
}

export default AuthPageComponent;