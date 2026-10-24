import { useState } from 'react';
import { generateOAuthURL } from '@/components/shared';
import './login-page.scss';
type TLoginPageProps = { onLogin: () => void };
type Market = { name:string; value:string; change:string; up?:boolean };
const markets: Market[] = [{name:'R10',value:'12,457.93',change:'0.20%'},{name:'R25',value:'34,819.24',change:'0.12%'},{name:'R50',value:'87,450.92',change:'0.17%',up:true},{name:'R75',value:'156,274.50',change:'0.04%'},{name:'BTC',value:'67,875.85',change:'0.22%',up:true}];
const benefits = [['↯','Fast execution','Build and run automated strategies with live market data.'],['◈','Bot automation','Let Market Flipper work while you focus on the bigger picture.'],['▤','100+ markets','Trade volatility, forex, crypto and more through Deriv.'],['⌁','Secure access','OAuth authentication keeps your Deriv account protected.'],['%','Demo friendly','Practice your next strategy before risking real funds.'],['●','Always available','Your strategies are ready whenever the market moves.']];
const LoginPage = ({ onLogin }: TLoginPageProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleDerivLogin = async () => { setIsLoading(true); try { const oauthUrl = await generateOAuthURL(); if (oauthUrl) window.location.href = oauthUrl; else onLogin(); } catch { onLogin(); } };
    return <main className='login-page'>
        <div className='login-page__glow' />
        <section className='login-hero'>
            <div className='login-wordmark'><span>Market</span> Flipper</div><div className='login-subtitle'>AUTOMATED TRADING PLATFORM</div>
            <div className='login-stats'><div><strong>14+</strong><small>TRADING BOTS</small></div><div><strong>24/7</strong><small>AUTOMATION</small></div><div><strong>100%</strong><small>FREE TO USE</small></div></div>
            <div className='market-strip'>{markets.map(m => <div className='market-strip__item' key={m.name}><small>{m.name}</small><b>{m.value}</b><em className={m.up ? 'is-up':'is-down'}>{m.up?'▲':'▼'} {m.change}</em></div>)}</div>
            <div className='live-feed'><span>↗</span><b>Market Flipper is ready for your next strategy</b><small>JUST NOW</small></div>
        </section>
        <section className='login-card' aria-labelledby='login-title'><h1 id='login-title'>Welcome Back</h1><p>Sign in to access your automated trading workspace and continue your journey.</p>
            <button className='login-action login-action--primary' onClick={handleDerivLogin} disabled={isLoading}>{isLoading ? <span className='login-spinner'/>:<span>↪</span>}{isLoading?'Connecting...':'Sign in with Deriv'}</button>
            <div className='login-divider'><span>OR</span></div><button className='login-action login-action--outline' onClick={onLogin}>Continue as Guest</button><small className='login-terms'>By signing in, you agree to our Terms of Service and Risk Disclosure.</small>
        </section>
        <section className='login-benefits'><h2>Why Market Flipper?</h2><div className='benefit-grid'>{benefits.map(([icon,title,description]) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
        <footer className='login-footer'><div className='login-wordmark'><span>Market</span> Flipper</div><p>Trade smarter. Build better. Automate with confidence.</p><nav><a href='/'>Terms</a><a href='/'>Privacy</a><a href='/'>Risk Disclosure</a></nav></footer>
    </main>;
};
export default LoginPage;
