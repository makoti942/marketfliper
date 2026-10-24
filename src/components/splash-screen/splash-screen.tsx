import { useEffect, useState } from 'react';
import './splash-screen.scss';
type TSplashScreenProps = { onComplete: () => void };
const SplashScreen = ({ onComplete }: TSplashScreenProps) => {
    const [phase, setPhase] = useState<'loading' | 'fadeout'>('loading');
    useEffect(() => {
        const fadeTimer = window.setTimeout(() => setPhase('fadeout'), 2200);
        const completeTimer = window.setTimeout(onComplete, 2700);
        return () => { window.clearTimeout(fadeTimer); window.clearTimeout(completeTimer); };
    }, [onComplete]);
    return <div className={`splash-screen splash-screen--${phase}`}>
        <div className='splash-orb' />
        <div className='splash-content'>
            <div className='splash-wordmark'><span>Market</span> Flipper</div>
            <div className='splash-subtitle'>AUTOMATED TRADING PLATFORM</div>
            <div className='splash-loader' aria-label='Loading Market Flipper'><span className='splash-loader__bar' /></div>
            <div className='splash-status'><span /> CONNECTING TO MARKETS</div>
        </div>
    </div>;
};
export default SplashScreen;
