/* eslint-disable react/jsx-max-depth */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { useAuth } from '../../context/AuthProvider';
import './Login.css'; // Importe o CSS puro criado anteriormente
import { FiEye, FiEyeOff } from 'react-icons/fi';

function LoginPage() {
  const { Login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    Login({ email, password });
  };

  return (
    <div className="login-container">
      <div className="info">
        <h1>Coders Blog</h1>
        <p>
          User panel for the Coders blog.
        </p>
      </div>
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <span className="border-title" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            value={email}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              value={password}
              style={{ paddingRight: '40px' }}
            />
            {showPassword ? (
              <FiEyeOff
                className="icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            ) : (
              <FiEye
                className="icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            )}
          </div>
          <button type="submit">Access</button>
          <span className="register">
            Don&apos;t have an account?
            {' '}
            <Link to="/register">Register now!</Link>
            <br />
            <div className="back-icon">
              <BiArrowBack size={20} />
              <Link to="/"> Back to home</Link>
            </div>
          </span>
        </form>
      </div>
    </div>
  );
}

export { LoginPage };