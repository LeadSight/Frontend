import AuthPageComponent from "../components/AuthPageComponent";
import useInput from "../hooks/useInput";
import AuthForm from "../components/AuthForm";
import SubmitButton from "../components/SubmitButton";
import Input from '../components/Input'
import { Link } from "react-router-dom";
import { resetPassword } from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || {};
    const [password, onPasswordChange] = useInput('');

    async function onSubmitHandler(e) {
        e.preventDefault();
        
        const resetStat = await resetPassword({ username, password });
        if (!resetStat.error) {
            console.log("Password Reset Successful");
            alert("Password Reset Complete");
            
            navigate('/');
        }
    }
    
    return(
        <AuthPageComponent>
            <AuthForm onSubmit={ onSubmitHandler } subheading = 'Forgot Password'>

                <Input
                label={"Password"}
                type={"password"}
                value={password}
                maxLength={100}
                onChange={onPasswordChange}
                />

                <SubmitButton
                label='Reset'
                />

                <div className="links">
                    <small>Already have an account? <Link to='/'>Login here</Link></small>
                </div>
            </AuthForm>
        </AuthPageComponent>
    );
}

export default ResetPasswordPage;