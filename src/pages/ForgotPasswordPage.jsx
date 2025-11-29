import AuthPageComponent from "../components/AuthPageComponent";
import useInput from "../hooks/useInput";
import AuthForm from "../components/AuthForm";
import SubmitButton from "../components/SubmitButton";
import Input from '../components/Input'
import { Link } from "react-router-dom";
import { verifyUsername } from "../api/api";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, onEmailChange] = useInput('');

    async function onSubmitHandler(e) {
        e.preventDefault();

        const usernameStat = await verifyUsername({ username: email });
        if (usernameStat.data.result) {
            console.log("Username/Email Exists");
            
            navigate('/reset-password', { 
                state: { username: email }
              });
        }
    }
    
    return(
        <AuthPageComponent>
            <AuthForm onSubmit={ onSubmitHandler } subheading = 'Forgot Password'>
                <p>Please enter your registered email address to recover your account.</p>

                <Input
                label={"Email"}
                type={"email"}
                value={email}
                maxLength={100}
                onChange={onEmailChange}
                />

                <SubmitButton
                label='Send'
                />

                <div className="links">
                    <small>Already have an account? <Link to='/'>Login here</Link></small>
                </div>
            </AuthForm>
        </AuthPageComponent>
    );
}

export default ForgotPasswordPage;