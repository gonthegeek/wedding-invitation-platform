import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useLanguage';
import { LanguageSelector } from '../components/shared/LanguageSelector';
import styled from 'styled-components';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
`;

const LanguageSelectorWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const LoginForm = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin: 0 1rem;
`;

const Title = styled.h1`
  color: #667eea;
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const Subtitle = styled.h2`
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.25rem;
  font-weight: 400;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #5a67d8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #fecaca;
`;

const AuthLinks = styled.div`
  text-align: center;
  margin-top: 1.5rem;

  p {
    margin: 0.5rem 0;
    color: #64748b;
  }

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, currentUser } = useAuth();
  const t = useTranslation();

  // Redirect if already logged in
  if (currentUser) {
    const redirectPath = currentUser.role === 'admin' ? '/admin' : '/couple';
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t.validation.required);
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      setError(t.errors.authError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LanguageSelectorWrapper>
        <LanguageSelector />
      </LanguageSelectorWrapper>
      
      <LoginForm>
        <Title>Wedding Invitation Platform</Title>
        <Subtitle>{t.auth.loginTitle}</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">{t.auth.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? t.common.loading : t.auth.loginTitle}
          </SubmitButton>
        </form>
        
        <AuthLinks>
          <p>
            {t.auth.dontHaveAccount} <Link to="/register">{t.auth.createAccount}</Link>
          </p>
          <p>
            <Link to="/forgot-password">{t.auth.forgotPassword}</Link>
          </p>
        </AuthLinks>
      </LoginForm>
    </LoginContainer>
  );
};
