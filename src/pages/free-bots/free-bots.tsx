import { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { api_base } from '@/external/bot-skeleton';
import { fetchXmlWithCache, prefetchAllXmlInBackground } from '@/utils/freebots-cache';
import './free-bots.scss';

type TBotInfo = {
    name: string;
    file: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    strategy: string;
    features: string[];
    stars: number;
    badge: string;
};

const BOT_LIST: TBotInfo[] = [
    { name: 'Martingale Bot', file: 'martingle.xml', description: 'Classic martingale strategy with configurable multiplier', difficulty: 'Intermediate', strategy: 'Martingale', features: ['Auto-recovery', 'Multiplier', 'Loss limit'], stars: 4, badge: 'POPULAR' },
    { name: 'Dalembert Bot', file: 'dalembert.xml', description: 'Conservative progression strategy based on Dalembert system', difficulty: 'Beginner', strategy: 'Dalembert', features: ['Conservative', 'Stable', 'Low risk'], stars: 4, badge: 'SAFE' },
    { name: 'Fibonacci Bot', file: 'fibonaccibot.xml', description: 'Fibonacci sequence-based stake management', difficulty: 'Intermediate', strategy: 'Fibonacci', features: ['Sequence', 'Auto-reset', 'Trend'], stars: 4, badge: '' },
    { name: 'Test Bot', file: 'test.xml', description: 'Basic test bot for learning the platform', difficulty: 'Beginner', strategy: 'Random', features: ['Demo', 'Simple', 'Learning'], stars: 3, badge: '' },
    { name: 'Accumulator Bot', file: 'Accumulator.xml', description: 'Accumulates profits over multiple small trades', difficulty: 'Beginner', strategy: 'Accumulation', features: ['Steady', 'Low stakes', 'Compound'], stars: 4, badge: 'STEADY' },
    { name: 'Smart Bot', file: 'smartbot.xml', description: 'AI-inspired adaptive trading strategy', difficulty: 'Advanced', strategy: 'Adaptive', features: ['AI logic', 'Pattern detection', 'Dynamic'], stars: 5, badge: 'SMART' },
    { name: 'Rising / Falling Bot', file: 'RisingFalling.xml', description: 'Trades on rising and falling markets simultaneously', difficulty: 'Intermediate', strategy: 'Bilateral', features: ['Two-way', 'Hedge', 'Market split'], stars: 4, badge: '' },
    { name: 'Multiplier Bot', file: 'Multiplier.xml', description: 'Configurable multiplier for aggressive growth', difficulty: 'Advanced', strategy: 'Multiplier', features: ['High leverage', 'Aggressive', 'Configurable'], stars: 4, badge: 'POWER' },
    { name: 'Trade Bot', file: 'tradebot.xml', description: 'General-purpose automated trading bot', difficulty: 'Beginner', strategy: 'General', features: ['Flexible', 'Multi-market', 'Auto'], stars: 3, badge: '' },
    { name: 'DMZ-Martingale Bot', file: 'DMZ-martingle.xml', description: 'Modified martingale with directional bias', difficulty: 'Advanced', strategy: 'Modified Martingale', features: ['Directional', 'Modified', 'Advanced risk'], stars: 4, badge: 'ADVANCED' },
    { name: 'Digit Difference Bot', file: 'DigitDifference.xml', description: 'Trades based on digit difference patterns', difficulty: 'Intermediate', strategy: 'Digit Analysis', features: ['Pattern', 'Digit-focused', 'Statistical'], stars: 4, badge: '' },
    { name: 'Digits Bot', file: 'Digits.xml', description: 'Pure digit-based trading with multiple strategies', difficulty: 'Intermediate', strategy: 'Digit Trading', features: ['Multi-strategy', 'Digit patterns', 'Flexible'], stars: 4, badge: 'VERSATILE' },
    { name: 'Over / Under Bot', file: 'OverUnder.xml', description: 'Over/under digit prediction bot', difficulty: 'Beginner', strategy: 'Over/Under', features: ['Simple', 'Predictable', 'Low risk'], stars: 4, badge: 'EASY' },
    { name: 'Rise / Fall Bot', file: 'RiseFall.xml', description: 'Classic rise/fall prediction bot', difficulty: 'Beginner', strategy: 'Rise/Fall', features: ['Classic', 'Simple', 'Popular'], stars: 5, badge: 'TOP' },
];

const getDifficultyClass = (d: string) => {
    if (d === 'Beginner') return 'free-bot-card__badge--beginner';
    if (d === 'Intermediate') return 'free-bot-card__badge--intermediate';
    return 'free-bot-card__badge--advanced';
};

const FreeBots = observer(() => {
    const { run_panel, blockly_store } = useStore();
    const [xmlFiles, setXmlFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingBot, setLoadingBot] = useState<string | null>(null);

    useEffect(() => {
        const loadBotList = async () => {
            try {
                const files = BOT_LIST.map(b => b.file);
                setXmlFiles(files);
                prefetchAllXmlInBackground(files);
            } catch (e) {
                console.error('Failed to load bot list:', e);
            } finally {
                setLoading(false);
            }
        };
        loadBotList();
    }, []);

    const loadBot = useCallback(async (bot: TBotInfo) => {
        if (loadingBot) return;
        setLoadingBot(bot.file);
        try {
            const xml = await fetchXmlWithCache(bot.file);
            if (!xml) {
                console.error('Failed to load bot XML:', bot.file);
                return;
            }

            if (blockly_store?.workspace) {
                const Blockly = window.Blockly;
                if (Blockly) {
                    const dom = Blockly.utils.xml.textToDom(xml);
                    Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, blockly_store.workspace);
                }
            }

            if (run_panel?.setActiveTab) {
                run_panel.setActiveTab(1);
            }
        } catch (e) {
            console.error('Error loading bot:', e);
        } finally {
            setLoadingBot(null);
        }
    }, [loadingBot, run_panel, blockly_store]);

    if (loading) {
        return (
            <div className="free-bots">
                <div className="free-bots__loading">Loading bots...</div>
            </div>
        );
    }

    return (
        <div className="free-bots">
            <div className="free-bots__container">
                {BOT_LIST.length === 0 ? (
                    <div className="free-bots__empty">No bots available</div>
                ) : (
                    <div className="free-bots__grid">
                        {BOT_LIST.map((bot) => (
                            <div
                                key={bot.file}
                                className="free-bot-card"
                                data-badge={bot.badge}
                            >
                                <div className="free-bot-card__header">
                                    <div className="free-bot-card__title">{bot.name}</div>
                                </div>
                                <div className="free-bot-card__rating">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className={`star ${i < bot.stars ? 'filled' : ''}`}>
                                            {i < bot.stars ? '\u2605' : '\u2606'}
                                        </span>
                                    ))}
                                </div>
                                <div className="free-bot-card__description">{bot.description}</div>
                                <div className="free-bot-card__badges">
                                    <span className={`free-bot-card__badge ${getDifficultyClass(bot.difficulty)}`}>
                                        {bot.difficulty}
                                    </span>
                                    <span className="free-bot-card__badge free-bot-card__badge--strategy">
                                        {bot.strategy}
                                    </span>
                                </div>
                                <div className="free-bot-card__features">
                                    {bot.features.map((f) => (
                                        <span key={f} className="free-bot-card__feature-tag">{f}</span>
                                    ))}
                                </div>
                                <button
                                    className="free-bot-card__load-btn"
                                    onClick={() => loadBot(bot)}
                                    disabled={!!loadingBot}
                                >
                                    {loadingBot === bot.file ? 'Loading...' : 'Load Bot'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

export default FreeBots;
