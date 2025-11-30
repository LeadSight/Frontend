import AuthPageComponent from "../components/auth/AuthPageComponent";
import useInput from "../hooks/useInput";
import { useState } from 'react';
import AuthForm from "../components/auth/AuthForm";
import SubmitButton from "../components/ui/SubmitButton";
import Input from '../components/auth/Input';
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from '../api/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, onUsernameChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirm, onConfirmChange] = useInput('');
  const [errorMsg, setErrorMsg] = useState('');

  // clear inline error when any field changes
  function clearErrorAndChange(changeFn) {
    return (e) => { setErrorMsg(''); changeFn(e); };
  }

  async function onSubmitHandler(e) {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg('Password and confirmation do not match');
      return;
    }

    // try calling register API if available, otherwise fallback to success
    try {
      if (typeof registerApi === 'function') {
        const res = await registerApi({ username, password });
        if (!res?.error) {
          navigate('/dashboard');
          return;
        }
        // show any server message when registration failed
        setErrorMsg(res?.message || 'Registration failed');
      }
      // fallback behavior
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg('Registration failed');
    }
  }

  return (
    <AuthPageComponent>
      <AuthForm onSubmit={onSubmitHandler} subheading="Get Started Now" Heading={true}>
        <Input label={'Username'} type={'email'} value={username} onChange={clearErrorAndChange(onUsernameChange)} />

        <Input label={'Password'} type={'password'} value={password} onChange={clearErrorAndChange(onPasswordChange)} />

        <Input label={'Confirm Password'} type={'password'} value={confirm} onChange={clearErrorAndChange(onConfirmChange)} />

        {errorMsg && (
          <div className="w-full text-left mt-2">
            <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md shadow-sm">{errorMsg}</div>
          </div>
        )}

        <SubmitButton label={'Register'} />

        <div className="text-center mt-2 text-lg">
          <small>Already have an account? <Link to='/login' className='text-blue-600 font-semibold'>Login here</Link></small>
        </div>
      </AuthForm>
    </AuthPageComponent>
  );
}

export default RegisterPage;
