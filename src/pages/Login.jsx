import { useState, useEffect } from "react";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e?.preventDefault();
        setLoading(true);
        try {
            const res = await loginApi({ email, password });
            login({
                token: res.data.token,
                user: res.data.user
            });
            navigate("/chat");
        } catch (err) {
            alert("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (login?.token) {
            navigate("/chat");
        }
    }, []);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to continue to your account</p>
                </div>

                <form className="auth-form" onSubmit={submit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            className="form-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="footer-text">Don't have an account?</p>
                    <Link to="/register" className="auth-link">
                        Create Account
                    </Link>
                </div>
            </div>

            <style>{`
                .auth-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                }
                
                .auth-card {
                    background: white;
                    border-radius: 16px;
                    padding: 40px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                }
                
                .auth-header {
                    text-align: center;
                    margin-bottom: 32px;
                }
                
                .auth-title {
                    font-size: 28px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 8px;
                }
                
                .auth-subtitle {
                    font-size: 14px;
                    color: #7f8c8d;
                    margin-bottom: 24px;
                }
                
                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .form-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #2c3e50;
                }
                
                .form-input {
                    padding: 14px 16px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    outline: none;
                }
                
                .form-input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .form-input:disabled {
                    background: #f5f5f5;
                    cursor: not-allowed;
                }
                
                .auth-button {
                    padding: 14px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                
                .auth-button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
                }
                
                .auth-button:active:not(:disabled) {
                    transform: translateY(0);
                }
                
                .auth-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .auth-footer {
                    text-align: center;
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid #f0f0f0;
                }
                
                .footer-text {
                    font-size: 14px;
                    color: #7f8c8d;
                    margin-bottom: 8px;
                }
                
                .auth-link {
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 500;
                }
                
                .auth-link:hover {
                    text-decoration: underline;
                }
                
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}