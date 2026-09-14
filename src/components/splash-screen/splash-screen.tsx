import { useEffect, useState } from 'react';
import './splash-screen.scss';

type TSplashScreenProps = {
    onComplete: () => void;
};

const SplashScreen = ({ onComplete }: TSplashScreenProps) => {
    const [phase, setPhase] = useState<'logo' | 'text' | 'fadeout'>('logo');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('text'), 800);
        const t2 = setTimeout(() => setPhase('fadeout'), 2800);
        const t3 = setTimeout(() => onComplete(), 3400);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onComplete]);

    return (
        <div className={`splash-screen splash-screen--${phase}`}>
            <div className="splash-bg">
                <div className="splash-glow splash-glow--1" />
                <div className="splash-glow splash-glow--2" />
                <div className="splash-glow splash-glow--3" />
                <div className="splash-particles">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="splash-particle" style={{ '--i': i } as React.CSSProperties} />
                    ))}
                </div>
            </div>
            <div className="splash-content">
                <div className="splash-logo-wrapper">
                    <div className="splash-logo-3d">
                        <div className="splash-ring splash-ring--1" />
                        <div className="splash-ring splash-ring--2" />
                        <div className="splash-ring splash-ring--3" />
                        <svg className="splash-triangle" viewBox="0 0 100 100" fill="none">
                            <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00d4ff" />
                                    <stop offset="50%" stopColor="#7b2ff7" />
                                    <stop offset="100%" stopColor="#ff0080" />
                                </linearGradient>
                            </defs>
                            <polygon
                                points="50,15 90,85 10,85"
                                stroke="url(#grad)"
                                strokeWidth="3"
                                fill="none"
                            />
                            <polygon
                                points="50,30 75,75 25,75"
                                stroke="url(#grad)"
                                strokeWidth="2"
                                fill="rgba(0,212,255,0.1)"
                            />
                        </svg>
                    </div>
                </div>
                <h1 className="splash-title">
                    <span className="splash-title-line">
                        {'MARKET'.split('').map((ch, i) => (
                            <span key={i} className="splash-char" style={{ animationDelay: `${0.8 + i * 0.06}s` }}>
                                {ch}
                            </span>
                        ))}
                    </span>
                    <span className="splash-title-line splash-title-line--sub">
                        {'FLIPPER'.split('').map((ch, i) => (
                            <span key={i} className="splash-char splash-char--sub" style={{ animationDelay: `${1.3 + i * 0.06}s` }}>
                                {ch}
                            </span>
                        ))}
                    </span>
                </h1>
                <p className="splash-tagline">
                    <span className="splash-tagline-dot" />
                    Automated Trading Platform
                </p>
                <div className="splash-loader">
                    <div className="splash-loader-bar" />
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
