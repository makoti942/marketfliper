import ManualTrade from '../manual-trade';
import './dtrader.scss';

const DTrader = () => (
    <section className='mf-dtrader' aria-label='DTrader'>
        <header className='mf-dtrader__header'>
            <div>
                <span className='mf-dtrader__eyebrow'>LIVE DERIV WORKSPACE</span>
                <h1>DTrader</h1>
                <p>Execute and monitor contracts from the authenticated Deriv connection.</p>
            </div>
            <span className='mf-dtrader__status'>WebSocket execution enabled</span>
        </header>
        <div className='mf-dtrader__content'>
            <ManualTrade />
        </div>
    </section>
);

export default DTrader;
