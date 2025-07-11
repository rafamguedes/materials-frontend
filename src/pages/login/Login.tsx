import { useState, useRef, useEffect } from 'react';
import { FaLaptopCode, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthProvider';
import { notification } from 'antd';
import Register from './Register';
import './Login.css';

function LoginPage() {
  const { Login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [api, contextHolder] = notification.useNotification();

  const notify = (type: 'success' | 'error', message: string, description?: string) => {
    api[type]({
      message,
      description,
      showProgress: false,
      pauseOnHover: true,
    });
  };
  
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      notify('error', 'Por favor, preencha todos os campos');
      return;
    }
    
    try {
      Login({ email, password });
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : undefined) ||
        err?.message ||
        'Erro ao fazer login';
      notify('error', 'Erro ao fazer login', apiMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="info">
        <h1>KIPFLOW</h1>
        <p>
          Gerenciamento de reservas e equipamentos
        </p>
        <FaLaptopCode style={{ fontSize: '160px', color: '#fff' }} />
      </div>
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <span className="border-title" />
          <input
            ref={emailInputRef}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            type="email"
            value={email}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              value={password}
              style={{ paddingRight: '40px' }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '39%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#2c4b80',
                fontSize: '1.2rem'
              }}
              tabIndex={0}
              aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <button type="submit">Entrar</button>
        </form>
        <div className="register">
          <p>
            Não tem uma conta?{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setRegisterOpen(true);
              }}
            >
              Registre-se aqui
            </a>
          </p>
        </div>
      </div>
      <Register
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
      {contextHolder}
    </div>
  );
}

export { LoginPage };