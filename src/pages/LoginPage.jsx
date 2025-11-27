import AuthPageComponent from "../components/AuthPageComponent";
import useInput from "../hooks/useInput";
import AuthForm from "../components/AuthForm";
import SubmitButton from "../components/SubmitButton";
import Input from '../components/Input';
import { Link } from "react-router-dom";
import { login } from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [username, onUsernameChange] = useInput('');
    const [password, onPasswordChange] = useInput('');

    async function onSubmitHandler(e) {
        e.preventDefault();        

        const loginStat = await login({ username, password });
        if (!loginStat.error) {
            console.log("Login Successful");

            await loginUser(loginStat.data.accessToken);            
            
            navigate('/');
        }
    }
    
    return(
        <AuthPageComponent>
            <AuthForm onSubmit={ onSubmitHandler } subheading = 'Get Started Now'>
                <Input
                label={"Username"}
                type={"email"}
                value={username}
                maxLength={100}
                onChange={onUsernameChange}
                />

                <Input
                label={"Password"}
                type={"password"}
                value={password}
                maxLength={100}
                onChange={onPasswordChange}
                />

                <SubmitButton
                label='Login'
                />

                <div className="links">
                    <small>Clik to <Link to='/forgot-password'>forgot Password</Link></small>
                </div>
            </AuthForm>
        </AuthPageComponent>
    );
}

export default LoginPage;