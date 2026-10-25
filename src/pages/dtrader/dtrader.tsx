import { useState } from 'react';
import { ContractMode, useManualTrade } from '../manual-trade/use-manual-trade';
import './dtrader.scss';

const modes: [ContractMode, string][] = [
    ['DIGITMATCH', 'Matches'],
    ['DIGITDIFF', 'Differs'],
    ['DIGITOVER', 'Over'],
    ['DIGITUNDER', 'Under'],
    ['DIGITEVEN', 'Even'],
    ['DIGITODD', 'Odd'],
];

const DTrader = () => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const {
        symbols, activeSymbol, setActiveSymbol, currentTick, lastDigit, stake, setStake,
        duration, setDuration, contractMode, setContractMode, selectedDigit, setSelectedDigit,
        buyWithMode, isBuying, buyResult, buyError, isConnected,
    } = useManualTrade();
    const requiresDigit = contractMode !== 'DIGITEVEN' && contractMode !== 'DIGITODD';

    return (
        <section className='mf-dtrader' aria-label='DTrader'>
            <header className='mf-dtrader__header'>
                <div><span className='mf-dtrader__eyebrow'>LIVE DERIV CONTRACTS</span><h1>DTrader</h1><p>Configure one contract and send it through the authenticated Deriv connection.</p></div>
                <span className={`mf-dtrader__status ${isConnected ? '' : 'mf-dtrader__status--offline'}`}>{isConnected ? 'WebSocket connected' : 'Connecting'}</span>
            </header>
            <div className='mf-dtrader__workspace'>
                <div className='mf-dtrader__market-card'>
                    <span className='mf-dtrader__label'>LIVE MARKET</span>
                    <select value={activeSymbol} onChange={event => setActiveSymbol(event.target.value)}>{(symbols.length ? symbols : [{ symbol: 'R_100', display_name: 'Volatility 100' }]).map(symbol => <option value={symbol.symbol} key={symbol.symbol}>{symbol.display_name || symbol.symbol}</option>)}</select>
                    <div className='mf-dtrader__quote'><span>Current quote</span><strong>{currentTick?.quote ?? '—'}</strong><small>Last digit: {lastDigit ?? '—'}</small></div>
                </div>
                <div className='mf-dtrader__trade-card'>
                    <span className='mf-dtrader__label'>CONTRACT SETUP</span>
                    <label>Contract<select value={contractMode} onChange={event => setContractMode(event.target.value as ContractMode)}>{modes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
                    {requiresDigit && <label>Barrier digit<input type='number' min='0' max='9' value={selectedDigit} onChange={event => setSelectedDigit(Math.max(0, Math.min(9, Number(event.target.value) || 0)))} /></label>}
                    <div className='mf-dtrader__form-row'><label>Stake<input inputMode='decimal' min='0.35' step='0.01' value={stake} onChange={event => setStake(event.target.value)} /></label><label>Duration<input inputMode='numeric' min='1' step='1' value={duration} onChange={event => setDuration(Math.max(1, Number(event.target.value) || 1))} /></label></div>
                    <button className='mf-dtrader__buy' type='button' disabled={!isConnected || isBuying} onClick={() => setConfirmOpen(true)}>{isBuying ? 'Sending…' : 'Review contract purchase'} →</button>
                    {buyError && <div className='mf-dtrader__result mf-dtrader__result--error'>{buyError}</div>}
                    {buyResult && <div className='mf-dtrader__result'>Contract #{buyResult.contract_id} purchased.</div>}
                </div>
            </div>
            <div className='mf-dtrader__notice'>Each order is reviewed before the Deriv buy request is sent. Bulk and hedge workflows use separate guarded controls.</div>
            {confirmOpen && <div className='mf-dtrader__modal-backdrop'><div className='mf-dtrader__modal' role='dialog' aria-modal='true'><span className='mf-dtrader__label'>FINAL REVIEW</span><h2>Confirm contract purchase</h2><p>{activeSymbol} · {contractMode} · stake {stake} · {duration} tick(s)</p><div><button type='button' onClick={() => setConfirmOpen(false)}>Cancel</button><button className='mf-dtrader__buy' type='button' onClick={() => { setConfirmOpen(false); void buyWithMode(contractMode); }}>Confirm and buy</button></div></div></div>}
        </section>
    );
};

export default DTrader;
