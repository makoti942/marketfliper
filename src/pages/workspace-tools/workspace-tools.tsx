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
    | 'ai-bots'
    | 'smart-recovery'
    | 'christmas-gift'
    | 'quick-bot'
    | 'signal-ai'
    | 'copy-trader'
    | 'speedbot'
    | 'automated';

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
    [DBOT_TABS.AI_BOTS]: {
        id: 'ai-bots',
        title: 'AI Bots',
        eyebrow: 'STRATEGY LAB',
        description: 'Choose a strategy profile and inspect its signals, limits, and current state.',
        accent: '#c084fc',
        icon: '✦',
    },
    [DBOT_TABS.SMART_RECOVERY_AI]: {
        id: 'smart-recovery',
        title: 'Smart Recovery AI',
        eyebrow: 'LOSS CONTROL',
        description: 'Configure recovery guardrails without automatically increasing risk after a loss.',
        accent: '#ff9c66',
        icon: '↻',
    },
    [DBOT_TABS.CHRISTMAS_GIFT]: {
        id: 'christmas-gift',
        title: 'Trader Challenge',
        eyebrow: 'COMMUNITY MILESTONE',
        description: 'Track workspace milestones and unlock educational strategy challenges.',
        accent: '#6ee7b7',
        icon: '◆',
    },
    [DBOT_TABS.QUICK_BOT]: {
        id: 'quick-bot',
        title: 'Quick Bot',
        eyebrow: 'FAST SETUP',
        description: 'Start from a focused template and move directly into a reviewable bot workflow.',
        accent: '#22d3ee',
        icon: '➜',
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
    [DBOT_TABS.SPEEDBOT]: {
        id: 'speedbot',
        title: 'Speedbot',
        eyebrow: 'RAPID EXECUTION',
        description: 'Tune timing and trade limits for a fast strategy while keeping the review step visible.',
        accent: '#fb7185',
        icon: '»',
    },
    [DBOT_TABS.AUTOMATED]: {
        id: 'automated',
        title: 'Automated',
        eyebrow: 'WORKFLOW MONITOR',
        description: 'Monitor all active automations, their health, and the next guarded action.',
        accent: '#34d399',
        icon: '▰',
    },
};

const metricByTool: Record<ToolId, [string, string, string]> = {
    'volt-ai': ['12', 'Markets scanned', '2 min ago'],
    'bulk-trader': ['03', 'Demo accounts', 'Ready'],
    hedging: ['1.00', 'Exposure ratio', 'Balanced'],
    'auto-trading': ['04', 'Guardrails', 'Armed'],
    'trade-types': ['18', 'Contract types', 'Available'],
    'ai-bots': ['07', 'Strategy profiles', 'Curated'],
    'smart-recovery': ['0.00%', 'Extra risk', 'Locked'],
    'christmas-gift': ['62%', 'Challenge progress', 'This month'],
    'quick-bot': ['06', 'Quick templates', 'Ready'],
    'signal-ai': ['84%', 'Top confidence', 'Live'],
    'copy-trader': ['02', 'Linked accounts', 'Demo only'],
    speedbot: ['250ms', 'Scan interval', 'Capped'],
    automated: ['03', 'Active workflows', 'Healthy'],
};

const actionsByTool: Record<ToolId, string[]> = {
    'volt-ai': ['Scan market', 'Open chart', 'Save watchlist'],
    'bulk-trader': ['Review batch', 'Select accounts', 'Clear plan'],
    hedging: ['Calculate hedge', 'Open chart', 'Reset ratio'],
    'auto-trading': ['Test workflow', 'Edit guardrails', 'Pause all'],
    'trade-types': ['Open setup', 'Compare types', 'View guide'],
    'ai-bots': ['Preview strategy', 'Run backtest', 'Open bot builder'],
    'smart-recovery': ['Simulate recovery', 'Lock risk', 'View guide'],
    'christmas-gift': ['Continue challenge', 'View rewards', 'Open tutorials'],
    'quick-bot': ['Use template', 'Preview blocks', 'Open builder'],
    'signal-ai': ['Refresh signals', 'Open analysis', 'Mute symbol'],
    'copy-trader': ['Review followers', 'Add demo account', 'Pause copying'],
    speedbot: ['Run simulation', 'Set limits', 'Pause speedbot'],
    automated: ['View activity', 'Pause workflow', 'Open logs'],
};

const WorkspaceTools = observer(() => {
    const { dashboard, client } = useStore();
    const [activeAction, setActiveAction] = useState('Ready');
    const [isRunning, setIsRunning] = useState(false);
    const [showTradeConfirmation, setShowTradeConfirmation] = useState(false);
    const [tradeMode, setTradeMode] = useState<ContractMode>('DIGITMATCH');
    const {
        symbols,
        activeSymbol,
        setActiveSymbol,
        currentTick,
        stake,
        setStake,
        duration,
        setDuration,
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
                        {tool.id === 'signal-ai' || tool.id === 'volt-ai' ? (
                            <div className='workspace-tools__signals'>{signalRows.map(([market, signal, confidence, age]) => <div className='workspace-tools__signal-row' key={market}><span className='workspace-tools__signal-symbol'>{market}</span><span>{signal}</span><b>{confidence}</b><small>{age}</small></div>)}</div>
                        ) : (
                            <div className='workspace-tools__workflow'>
                                {['Choose market and contract', 'Set risk guardrails', 'Review simulated outcome'].map((step, index) => <div className={`workspace-tools__step ${index === 1 ? 'workspace-tools__step--current' : ''}`} key={step}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{step}</b><small>{index === 1 ? 'Current workspace step' : 'Ready for review'}</small></div><i>{index < 1 ? '✓' : '•'}</i></div>)}
                            </div>
                        )}
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
