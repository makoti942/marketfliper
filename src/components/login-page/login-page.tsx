import { useState, useEffect, useCallback, useRef } from 'react';
import { generateOAuthURL } from '@/components/shared';
import './login-page.scss';

type TLoginPageProps = {
    onLogin: () => void;
};

const LoginPage = ({ onLogin }: TLoginPageProps) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!contentRef.current) return;
        const rect = contentRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
        setMousePos({ x, y });
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    const handleDerivLogin = async () => {
        setIsLoading(true);
        try {
            const oauth_url = await generateOAuthURL();
            if (oauth_url) {
                window.location.href = oauth_url;
            } else {
                onLogin();
            }
        } catch {
            onLogin();
        }
    };

    const contentStyle = {
        transform: `perspective(1000px) rotateY(${mousePos.x * 0.3}deg) rotateX(${-mousePos.y * 0.3}deg)`,
    };

    const titleStyle = {
        transform: `perspective(600px) rotateY(${mousePos.x * 0.5}deg) rotateX(${-mousePos.y * 0.5}deg)`,
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="login-grid" />
                <div className="login-glow login-glow--1" />
                <div className="login-glow login-glow--2" />
                <div className="login-glow login-glow--3" />
                <div className="login-lines">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="login-line"
                            style={{
                                left: `${10 + i * 12}%`,
                                animationDuration: `${6 + i * 1.5}s`,
                                animationDelay: `${i * 0.8}s`,
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="login-content" ref={contentRef} style={contentStyle}>
                <div className="login-logo-wrapper">
                    <div className="login-logo-3d">
                        <div className="logo-ring logo-ring--1" />
                        <div className="logo-ring logo-ring--2" />
                        <div className="logo-ring logo-ring--3" />
                        <svg className="logo-triangle" viewBox="0 0 100 100" fill="none">
                            <defs>
                                <linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00d4ff" />
                                    <stop offset="50%" stopColor="#7b2ff7" />
                                    <stop offset="100%" stopColor="#ff0080" />
                                </linearGradient>
                            </defs>
                            <polygon points="50,15 90,85 10,85" stroke="url(#loginGrad)" strokeWidth="3" fill="none" />
                            <polygon points="50,30 75,75 25,75" stroke="url(#loginGrad)" strokeWidth="2" fill="rgba(0,212,255,0.1)" />
                        </svg>
                    </div>
                </div>
                <h1 className="login-title" style={titleStyle}>
                    <span className="title-line">
                        {'MARKET'.split('').map((ch, i) => (
                            <span key={i} className="title-char" style={{ animationDelay: `${0.2 + i * 0.06}s` }}>
                                {ch}
                            </span>
                        ))}
                    </span>
                    <span className="title-line">
                        {'FLIPPER'.split('').map((ch, i) => (
                            <span key={i} className="title-char title-char-sub" style={{ animationDelay: `${0.6 + i * 0.06}s` }}>
                                {ch}
                            </span>
                        ))}
                    </span>
                </h1>
                <p className="login-tagline">
                    <span className="tagline-dot" />
                    Automated Trading Platform
                </p>
                <div className="login-card">
                    <div className="login-card-glow" />
                    <div className="login-card-content">
                        <h2 className="login-card-title">Welcome Back</h2>
                        <p className="login-card-subtitle">
                            Sign in with your Deriv account to access automated trading bots
                        </p>
                        <button
                            className={`login-btn login-btn-primary ${isLoading ? 'loading' : ''}`}
                            onClick={handleDerivLogin}
                            disabled={isLoading}
                        >
                            <div className="btn-bg" />
                            <div className="btn-content">
                                {isLoading ? (
                                    <div className="btn-spinner" />
                                ) : (
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <polyline points="10 17 15 12 10 7" />
                                        <line x1="15" y1="12" x2="3" y2="12" />
                                    </svg>
                                )}
                                {isLoading ? 'Signing in...' : 'Sign in with Deriv'}
                            </div>
                        </button>
                        <div className="login-divider">
                            <span>or</span>
                        </div>
                        <button className="login-btn login-btn-secondary" onClick={onLogin}>
                            <div className="btn-bg" />
                            <div className="btn-content">Continue as Guest</div>
                        </button>
                        <p className="login-footer-text">
                            By signing in, you agree to our Terms of Service
                        </p>
                    </div>
                </div>
                <div className="login-stats">
                    <div className="stat-item">
                        <span className="stat-value">14+</span>
                        <span className="stat-label">Trading Bots</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">24/7</span>
                        <span className="stat-label">Automation</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">100%</span>
                        <span className="stat-label">Free</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
