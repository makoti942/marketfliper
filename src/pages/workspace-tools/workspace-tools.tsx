import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import { useManualTrade, ContractMode } from '@/pages/manual-trade/use-manual-trade';
import './workspace-tools.scss';

type ToolId =
    | 'volt-ai'
    | 'bulk-trader'
    | 'hedging'
    | 'auto-trading'
    | 'trade-types'
    | 'signal-ai'
    | 'copy-trader'
    ;

type ToolConfig = {
    id: ToolId;
    title: string;
    eyebrow: string;
    description: string;
    accent: string;
    icon: string;
};

const TOOLS: Record<number, ToolConfig> = {
    [DBOT_TABS.VOLT_AI]: {
        id: 'volt-ai',
        title: 'Volt AI',
        eyebrow: 'LIVE MARKET SCANNER',
        description: 'Scan synthetic markets for momentum, volatility, and structured entry conditions.',
        accent: '#27d3c2',
        icon: '⚡',
    },
    [DBOT_TABS.BULK_TRADER]: {
        id: 'bulk-trader',
        title: 'Bulk Trader',
        eyebrow: 'MULTI-ACCOUNT EXECUTION',
        description: 'Prepare one trade plan and review it across selected demo accounts before execution.',
        accent: '#8b7cff',
        icon: '▦',
    },
    [DBOT_TABS.HEDGING_TOOL]: {
        id: 'hedging',
        title: 'Hedging Tool',
        eyebrow: 'RISK BALANCING',
        description: 'Model opposing positions and compare exposure before sending a live request.',
        accent: '#f7b955',
        icon: '◈',
    },
    [DBOT_TABS.AUTO_TRADING]: {
        id: 'auto-trading',
        title: 'Auto Trading',
        eyebrow: 'RULE-BASED WORKFLOW',
        description: 'Build a guarded automation workflow with entry, risk, and stop conditions.',
        accent: '#4e9cff',
        icon: '◉',
    },
    [DBOT_TABS.TRADE_TYPES]: {
        id: 'trade-types',
        title: 'Trade Types',
        eyebrow: 'CONTRACT EXPLORER',
        description: 'Compare available contract families and open the matching setup in DTrader.',
        accent: '#ff7b8d',
        icon: '⌁',
    },
    [DBOT_TABS.SIGNALAI]: {
        id: 'signal-ai',
        title: 'Signal AI',
        eyebrow: 'SIGNAL FEED',
        description: 'Review explainable market signals with confidence, age, and invalidation levels.',
        accent: '#a3e635',
        icon: '⌁',
    },
    [DBOT_TABS.COPY_TRADER]: {
        id: 'copy-trader',
        title: 'Copy Trader',
        eyebrow: 'PORTFOLIO WORKSPACE',
        description: 'Review connected demo accounts and prepare a controlled copy-trading plan.',
        accent: '#60a5fa',
        icon: '⟲',
    },
};

const metricByTool: Record<ToolId, [string, string, string]> = {
    'volt-ai': ['12', 'Markets scanned', '2 min ago'],
    'bulk-trader': ['03', 'Demo accounts', 'Ready'],
    hedging: ['1.00', 'Exposure ratio', 'Balanced'],
    'auto-trading': ['04', 'Guardrails', 'Armed'],
    'trade-types': ['18', 'Contract types', 'Available'],
    'signal-ai': ['84%', 'Top confidence', 'Live'],
    'copy-trader': ['02', 'Linked accounts', 'Demo only'],
};

const actionsByTool: Record<ToolId, string[]> = {
    'volt-ai': ['Scan market', 'Open chart', 'Save watchlist'],
    'bulk-trader': ['Review batch', 'Select accounts', 'Clear plan'],
    hedging: ['Calculate hedge', 'Open chart', 'Reset ratio'],
    'auto-trading': ['Scan all volatilities', 'Review best market', 'Run guarded bot'],
    'trade-types': ['Open setup', 'Compare types', 'View guide'],
    'signal-ai': ['Refresh signals', 'Open analysis', 'Filter contract'],
    'copy-trader': ['Review followers', 'Add demo account', 'Pause copying'],
};

const WorkspaceTools = observer(() => {
    const { dashboard, client } = useStore();
    const [activeAction, setActiveAction] = useState('Ready');
    const [isRunning, setIsRunning] = useState(false);
    const [showTradeConfirmation, setShowTradeConfirmation] = useState(false);
    const [tradeMode, setTradeMode] = useState<ContractMode>('DIGITMATCH');
    const [volatility, setVolatility] = useState('All volatility');
    const [bulkCount, setBulkCount] = useState(3);
    const [marketType, setMarketType] = useState('Synthetic indices');
    const [hedgeMode, setHedgeMode] = useState<ContractMode>('DIGITOVER');
    const [hedgeBarrier, setHedgeBarrier] = useState(6);
    const {
        symbols,
        activeSymbol,
        setActiveSymbol,
        currentTick,
        stake,
        setStake,
        duration,
        setDuration,
        selectedDigit,
        setSelectedDigit,
        buyWithMode,
        isBuying,
        buyResult,
        buyError,
        isConnected,
    } = useManualTrade();
    const tool = TOOLS[dashboard.active_tab] || TOOLS[DBOT_TABS.VOLT_AI];
    const metrics = metricByTool[tool.id];
    const actions = actionsByTool[tool.id];
    const signalRows = useMemo(
        () => [
            ['Volatility 75', 'Momentum rising', '84%', '2m'],
            ['Volatility 25', 'Range forming', '71%', '5m'],
            ['Boom 1000', 'Waiting for confirmation', '63%', '8m'],
        ],
        []
    );

    const runAction = (action: string) => {
        if (action === 'Open setup' || action === 'Use template' || action === 'Review batch') {
            setActiveAction(`${action} ready for live review`);
            return;
        }
        setActiveAction(`${action} queued in demo mode`);
        if (action.toLowerCase().includes('pause') || action.toLowerCase().includes('stop')) setIsRunning(false);
        else if (action.toLowerCase().includes('run') || action.toLowerCase().includes('start') || action.toLowerCase().includes('scan')) setIsRunning(true);
    };

    const renderToolContent = () => {
        if (tool.id === 'bulk-trader') {
            return <div className='workspace-tools__special-form'><div className='workspace-tools__form-grid'><label>Volatility<select value={volatility} onChange={event => setVolatility(event.target.value)}><option>All volatility</option><option>Volatility 10</option><option>Volatility 25</option><option>Volatility 50</option><option>Volatility 75</option><option>Volatility 100</option></select></label><label>Market type<select value={marketType} onChange={event => setMarketType(event.target.value)}><option>Synthetic indices</option><option>Forex</option><option>Commodities</option></select></label><label>Number of bulk trades<input type='number' min='1' max='10' value={bulkCount} onChange={event => setBulkCount(Math.max(1, Math.min(10, Number(event.target.value) || 1)))} /></label><label>Stake per trade<input inputMode='decimal' min='0.35' step='0.01' value={stake} onChange={event => setStake(event.target.value)} /></label></div><div className='workspace-tools__batch-preview'><strong>{bulkCount} parallel trade threads</strong><span>{volatility} · {marketType} · {stake} stake each</span></div><button type='button' className='workspace-tools__form-action' onClick={() => setActiveAction(`Batch of ${bulkCount} trades ready for final review`)}>Review batch before execution →</button></div>;
        }
        if (tool.id === 'hedging') {
            return <div className='workspace-tools__special-form'><div className='workspace-tools__form-grid'><label>Primary leg<select value={tradeMode} onChange={event => setTradeMode(event.target.value as ContractMode)}><option value='DIGITOVER'>Over</option><option value='DIGITUNDER'>Under</option><option value='DIGITEVEN'>Even</option><option value='DIGITODD'>Odd</option></select></label><label>Primary barrier<input type='number' min='0' max='9' value={selectedDigit} onChange={event => setSelectedDigit(Math.max(0, Math.min(9, Number(event.target.value) || 0)))} /></label><label>Hedge leg<select value={hedgeMode} onChange={event => setHedgeMode(event.target.value as ContractMode)}><option value='DIGITOVER'>Over</option><option value='DIGITUNDER'>Under</option><option value='DIGITEVEN'>Even</option><option value='DIGITODD'>Odd</option></select></label><label>Hedge barrier<input type='number' min='0' max='9' value={hedgeBarrier} onChange={event => setHedgeBarrier(Math.max(0, Math.min(9, Number(event.target.value) || 0)))} /></label></div><div className='workspace-tools__batch-preview'><strong>Two-leg hedge ready</strong><span>{tradeMode} {selectedDigit} + {hedgeMode} {hedgeBarrier}</span></div><button type='button' className='workspace-tools__form-action' onClick={() => setActiveAction('Hedge legs ready for final review')}>Review both legs →</button></div>;
        }
        if (tool.id === 'auto-trading') {
            return <div className='workspace-tools__special-form'><div className='workspace-tools__form-grid'><label>Scan universe<select value={volatility} onChange={event => setVolatility(event.target.value)}><option>All volatility</option><option>Volatility 10–50</option><option>Volatility 75–100</option></select></label><label>Contract to find<select value={tradeMode} onChange={event => setTradeMode(event.target.value as ContractMode)}><option value='DIGITOVER'>Over</option><option value='DIGITUNDER'>Under</option><option value='DIGITMATCH'>Matches</option><option value='DIGITDIFF'>Differs</option></select></label></div><div className='workspace-tools__batch-preview'><strong>Scan → rank → review → run</strong><span>Find the best market first; no trade is sent during scanning.</span></div><button type='button' className='workspace-tools__form-action' onClick={() => { setIsRunning(true); setActiveAction('Scanning all selected volatilities'); }}>Run volatility scan →</button></div>;
        }
        if (tool.id === 'volt-ai') {
            return <div className='workspace-tools__signals'>{signalRows.map(([market, signal, confidence, age]) => <div className='workspace-tools__signal-row' key={market}><span className='workspace-tools__signal-symbol'>{market}</span><span>{signal}</span><b>{confidence}</b><small>{age}</small></div>)}</div>;
        }
        if (tool.id === 'copy-trader') {
            return <div className='workspace-tools__account-list'>{['VRTC••••21', 'VRTC••••48', 'VRTC••••73'].map((account, index) => <div className='workspace-tools__account-row' key={account}><span className='workspace-tools__account-avatar'>{index + 1}</span><div><b>{account}</b><small>{index === 0 ? 'Primary demo account' : 'Connected demo account'}</small></div><strong>{index === 0 ? 'LEAD' : 'READY'}</strong></div>)}</div>;
        }
        if (tool.id === 'signal-ai') return <div className='workspace-tools__special-form'><div className='workspace-tools__form-grid'><label>Market<select value={activeSymbol} onChange={event => setActiveSymbol(event.target.value)}>{symbols.slice(0, 30).map(symbol => <option value={symbol.symbol} key={symbol.symbol}>{symbol.display_name || symbol.symbol}</option>)}</select></label><label>Contract signal<select value={tradeMode} onChange={event => setTradeMode(event.target.value as ContractMode)}><option value='DIGITOVER'>Over</option><option value='DIGITUNDER'>Under</option><option value='DIGITMATCH'>Matches</option><option value='DIGITDIFF'>Differs</option><option value='DIGITEVEN'>Even</option><option value='DIGITODD'>Odd</option></select></label></div><div className='workspace-tools__signals'>{signalRows.map(([market, signal, confidence, age]) => <div className='workspace-tools__signal-row' key={market}><span className='workspace-tools__signal-symbol'>{market}</span><span>{signal}</span><b>{confidence}</b><small>{age}</small></div>)}</div></div>;
        if (tool.id === 'trade-types') {
            return <div className='workspace-tools__contract-grid'>{[['Rise / Fall', 'CALL / PUT'], ['Over / Under', 'DIGITOVER'], ['Even / Odd', 'DIGITEVEN'], ['Matches / Differs', 'DIGITMATCH']].map(([title, code]) => <button type='button' key={code} onClick={() => setActiveAction(`${title} selected for review`)}><b>{title}</b><small>{code}</small></button>)}</div>;
        }
        return <div className='workspace-tools__workflow'>{['Choose market and contract', 'Set risk guardrails', 'Review simulated outcome'].map((step, index) => <div className={`workspace-tools__step ${index === 1 ? 'workspace-tools__step--current' : ''}`} key={step}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{step}</b><small>{index === 1 ? 'Current workspace step' : 'Ready for review'}</small></div><i>{index < 1 ? '✓' : '•'}</i></div>)}</div>;
    };

    return (
        <section className='workspace-tools' style={{ '--tool-accent': tool.accent } as React.CSSProperties}>
            <div className='workspace-tools__ambient workspace-tools__ambient--one' />
            <div className='workspace-tools__ambient workspace-tools__ambient--two' />
            <div className='workspace-tools__inner'>
                <header className='workspace-tools__header'>
                    <div>
                        <div className='workspace-tools__eyebrow'><span className='workspace-tools__pulse' />{tool.eyebrow}</div>
                        <h1><span className='workspace-tools__title-icon'>{tool.icon}</span>{tool.title}</h1>
                        <p>{tool.description}</p>
                    </div>
                    <div className={`workspace-tools__status ${isRunning ? 'workspace-tools__status--active' : ''}`}>
                        <span />{isRunning ? 'SIMULATION RUNNING' : 'DEMO MODE'}
                    </div>
                </header>

                <div className='workspace-tools__metrics'>
                    {metrics.map((value, index) => <div className='workspace-tools__metric' key={value}><strong>{value}</strong><span>{index === 0 ? 'Snapshot' : index === 1 ? 'Coverage' : 'State'}</span><small>{metrics[index]}</small></div>)}
                </div>

                <div className='workspace-tools__grid'>
                    <div className='workspace-tools__panel workspace-tools__panel--primary'>
                        <div className='workspace-tools__panel-heading'><div><span className='workspace-tools__panel-kicker'>WORKSPACE PREVIEW</span><h2>{tool.title} control surface</h2></div><span className='workspace-tools__live-dot'>LIVE PREVIEW</span></div>
                        {renderToolContent()}
                        <div className='workspace-tools__chart-line'><span /><span /><span /><span /><span /><span /><span /><span /></div>
                    </div>
                    <aside className='workspace-tools__panel workspace-tools__panel--side'>
                        <span className='workspace-tools__panel-kicker'>ACTIONS</span>
                        <h2>What would you like to do?</h2>
                        <div className='workspace-tools__actions'>{actions.map(action => <button key={action} type='button' onClick={() => runAction(action)}>{action}<span>→</span></button>)}</div>
                        <div className='workspace-tools__feedback'><span className='workspace-tools__feedback-dot' />{activeAction}</div>
                    </aside>
                </div>

                <div className='workspace-tools__panel workspace-tools__panel--execution'>
                    <div className='workspace-tools__panel-heading'>
                        <div>
                            <span className='workspace-tools__panel-kicker'>LIVE DERIV EXECUTION</span>
                            <h2>Review and execute a contract</h2>
                        </div>
                        <span className={`workspace-tools__live-dot ${isConnected ? '' : 'workspace-tools__live-dot--offline'}`}>
                            {isConnected ? 'WEBSOCKET CONNECTED' : 'CONNECTING'}
                        </span>
                    </div>
                    <div className='workspace-tools__execution-grid'>
                        <label>Market
                            <select value={activeSymbol} onChange={event => setActiveSymbol(event.target.value)}>
                                {(symbols.length ? symbols : [{ symbol: 'R_100', display_name: 'Volatility 100' }]).slice(0, 40).map(symbol => <option value={symbol.symbol} key={symbol.symbol}>{symbol.display_name || symbol.symbol}</option>)}
                            </select>
                        </label>
                        <label>Contract
                            <select value={tradeMode} onChange={event => setTradeMode(event.target.value as ContractMode)}>
                                <option value='DIGITMATCH'>Matches</option>
                                <option value='DIGITDIFF'>Differs</option>
                                <option value='DIGITOVER'>Over</option>
                                <option value='DIGITUNDER'>Under</option>
                                <option value='DIGITEVEN'>Even</option>
                                <option value='DIGITODD'>Odd</option>
                            </select>
                        </label>
                        <label>Stake
                            <input inputMode='decimal' min='0.35' step='0.01' value={stake} onChange={event => setStake(event.target.value)} />
                        </label>
                        <label>Duration (ticks)
                            <input inputMode='numeric' min='1' step='1' value={duration} onChange={event => setDuration(Math.max(1, Number(event.target.value) || 1))} />
                        </label>
                        <div className='workspace-tools__quote'>
                            <span>Latest quote</span>
                            <strong>{currentTick?.quote ?? '—'}</strong>
                            <small>{client?.loginid || 'No active account'} · {client?.loginid?.startsWith('VR') ? 'Demo' : 'Live account'}</small>
                        </div>
                        <button className='workspace-tools__execute' type='button' disabled={!isConnected || isBuying} onClick={() => setShowTradeConfirmation(true)}>
                            {isBuying ? 'Sending…' : 'Review live trade'} <span>→</span>
                        </button>
                    </div>
                    {(buyError || buyResult) && <div className={`workspace-tools__trade-result ${buyError ? 'workspace-tools__trade-result--error' : ''}`}>{buyError || `Contract ${buyResult?.contract_id} purchased successfully.`}</div>}
                </div>

                <div className='workspace-tools__footer'><span>Trader workspace / {tool.title}</span><span>All live orders require a final review</span><span>Risk controls enabled</span></div>
            </div>
            {showTradeConfirmation && <div className='workspace-tools__modal-backdrop' role='presentation'>
                <div className='workspace-tools__modal' role='dialog' aria-modal='true' aria-labelledby='live-trade-confirmation'>
                    <span className='workspace-tools__panel-kicker'>FINAL REVIEW REQUIRED</span>
                    <h2 id='live-trade-confirmation'>Confirm live Deriv order</h2>
                    <p>This sends a real WebSocket buy request using the currently selected account.</p>
                    <div className='workspace-tools__confirm-summary'><span>Account<strong>{client?.loginid || 'Unknown'}</strong></span><span>Market<strong>{activeSymbol}</strong></span><span>Contract<strong>{tradeMode}</strong></span><span>Stake<strong>{stake}</strong></span><span>Duration<strong>{duration} ticks</strong></span></div>
                    <div className='workspace-tools__modal-actions'><button type='button' onClick={() => setShowTradeConfirmation(false)}>Cancel</button><button className='workspace-tools__execute' type='button' onClick={() => { setShowTradeConfirmation(false); void buyWithMode(tradeMode); }}>Confirm and buy</button></div>
                </div>
            </div>}
        </section>
    );
});

export default WorkspaceTools;
