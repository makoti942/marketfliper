type TTabsTitle = {
    [key: string]: string | number;
};
type TDashboardTabIndex = {
    [key: string]: number;
};
export const tabs_title: TTabsTitle = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});
/** Market Flipper tab order mirrors DeriMind Hub while preserving the existing bot logic. */
export const DBOT_TABS: TDashboardTabIndex = Object.freeze({
    DASHBOARD: 0,
    TRADING_BOTS: 1,
    DTRADER: 2,
    ANALYSIS: 3,
    MANUAL_TRADE: 3,
    TUTORIAL: 3,
    BOT_BUILDER: 4,
    CHART: 5,
    TRADING_VIEW: 5,
    VOLT_AI: 6,
    BULK_TRADER: 7,
    HEDGING_TOOL: 8,
    AUTO_TRADING: 9,
    TRADE_TYPES: 10,
    AI_BOTS: 11,
    QUICK_BOT: 12,
    SIGNALAI: 13,
    COPY_TRADER: 14,
    SPEEDBOT: 15,
    AUTOMATED: 16,
    SMART_RECOVERY_AI: 17,
    CHRISTMAS_GIFT: 18,
});
export const MAX_STRATEGIES = 10;
export const TAB_IDS = [
    'id-dbot-dashboard',
    'id-trading-bots',
    'id-dtrader',
    'id-super-analysis',
    'id-bot-builder',
    'id-charts',
    'id-volt-ai',
    'id-bulk-trader',
    'id-hedging-tool',
    'id-auto-trading',
    'id-trade-types',
    'id-ai-bots',
    'id-quick-bot',
    'id-signal-ai',
    'id-copy-trader',
    'id-speedbot',
    'id-automated',
    'id-smart-recovery-ai',
    'id-christmas-gift',
];
export const DEBOUNCE_INTERVAL_TIME = 500;
