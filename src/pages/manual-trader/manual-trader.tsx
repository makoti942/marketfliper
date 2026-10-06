// @ts-nocheck — the existing Deriv API transport is vendored JavaScript.
import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { api_base } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import {
    LabelPairedArrowLeftMdRegularIcon,
    LabelPairedArrowRightMdRegularIcon,
    LabelPairedArrowUpArrowDownMdRegularIcon,
    LabelPairedCircleInfoCaptionRegularIcon,
    LabelPairedComputerMdRegularIcon,
    LabelPairedHandsHoldingDiamondMdRegularIcon,
    LabelPairedSearchLgRegularIcon,
} from '@deriv/quill-icons/LabelPaired';
import { TradeTypesDigitsOverIcon, TradeTypesDigitsUnderIcon } from '@deriv/quill-icons/TradeTypes';
import './manual-trader.scss';

const DEFAULT_SYMBOL = 'R_10';
const DEFAULT_STAKE = '1.00';
const MAX_TICK_HISTORY = 100;

const getMessageData = response => response?.data ?? response ?? {};
const getLastDigit = quote => {
    const normalized = String(quote ?? '').replace(/[^0-9]/g, '');
    return Number(normalized.slice(-1));
};

const ManualTrader = observer(() => {
    const { client } = useStore();
    const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
    const [quote, setQuote] = useState('—');
    const [tickHistory, setTickHistory] = useState([]);
    const [selectedDigit, setSelectedDigit] = useState(7);
    const [stake, setStake] = useState(DEFAULT_STAKE);
    const [proposals, setProposals] = useState({ over: null, under: null });
    const [loadingProposal, setLoadingProposal] = useState(false);
    const [purchaseState, setPurchaseState] = useState('idle');
    const [contract, setContract] = useState(null);
    const [error, setError] = useState('');

    const markets = useMemo(() => {
        const activeSymbols = api_base.active_symbols ?? [];
        const volatilityMarkets = activeSymbols
            .filter(item => item?.symbol && /volatility/i.test(item.display_name ?? item.name ?? ''))
            .map(item => ({ symbol: item.symbol, name: item.display_name ?? item.name ?? item.symbol }));
        return volatilityMarkets.length > 0
            ? volatilityMarkets
            : [{ symbol: DEFAULT_SYMBOL, name: 'Volatility 10 Index' }];
    }, [api_base.active_symbols]);

    const digitPercentages = useMemo(() => {
        const counts = Array(10).fill(0);
        tickHistory.forEach(digit => {
            if (Number.isInteger(digit)) counts[digit] += 1;
        });
        const total = tickHistory.length || 1;
        return counts.map(count => (count / total) * 100);
    }, [tickHistory]);

    const selectedMarketName = markets.find(item => item.symbol === symbol)?.name ?? 'Volatility 10 Index';
    const currency = client?.currency || 'USD';

    useEffect(() => {
        const api = api_base.api;
        if (!api) return undefined;
        let subscriptionId;
        const subscription = api.onMessage().subscribe(({ data }) => {
            if (data?.msg_type !== 'tick' || data?.tick?.symbol !== symbol) return;
            const nextQuote = Number(data.tick.quote).toFixed(3);
            setQuote(nextQuote);
            setTickHistory(previous => [...previous, getLastDigit(data.tick.quote)].slice(-MAX_TICK_HISTORY));
        });
        api.send({ ticks: symbol, subscribe: 1 }).then(response => {
            subscriptionId = getMessageData(response)?.subscription?.id;
        }).catch(() => setError(localize('Unable to subscribe to live ticks.')));
        return () => {
            subscription.unsubscribe();
            if (subscriptionId) api.send({ forget: subscriptionId }).catch(() => undefined);
        };
    }, [symbol]);

    useEffect(() => {
        const api = api_base.api;
        const amount = Number(stake);
        if (!api || !Number.isFinite(amount) || amount <= 0) return undefined;
        let cancelled = false;
        setLoadingProposal(true);
        setError('');
        const requestProposal = async (direction, contractType) => {
            try {
                const response = await api.send({
                    proposal: 1,
                    amount,
                    basis: 'stake',
                    contract_type: contractType,
                    currency,
                    duration: 1,
                    duration_unit: 't',
                    barrier: selectedDigit,
                    symbol,
                });
                const proposal = getMessageData(response).proposal;
                if (!cancelled && proposal) setProposals(previous => ({ ...previous, [direction]: proposal }));
            } catch (proposalError) {
                if (!cancelled) setError(proposalError?.error?.message ?? localize('Unable to refresh payout.'));
            }
        };
        setProposals({ over: null, under: null });
        Promise.all([requestProposal('over', 'DIGITOVER'), requestProposal('under', 'DIGITUNDER')])
            .finally(() => !cancelled && setLoadingProposal(false));
        return () => { cancelled = true; };
    }, [symbol, selectedDigit, stake, currency]);

    useEffect(() => {
        const api = api_base.api;
        if (!api || !contract?.contract_id) return undefined;
        const subscription = api.onMessage().subscribe(({ data }) => {
            if (data?.msg_type !== 'proposal_open_contract') return;
            const openContract = data.proposal_open_contract;
            if (String(openContract?.contract_id) !== String(contract.contract_id)) return;
            setContract(previous => ({ ...previous, ...openContract }));
            if (openContract.is_sold || openContract.status === 'won' || openContract.status === 'lost') {
                setPurchaseState('settled');
            }
        });
        return () => subscription.unsubscribe();
    }, [contract?.contract_id]);

    const buyContract = async direction => {
        const proposal = proposals[direction];
        if (!proposal?.id || !proposal?.ask_price) {
            setError(localize('Waiting for a current payout quote.'));
            return;
        }
        if (!client?.is_logged_in || !api_base.api) {
            setError(localize('Log in to purchase a contract.'));
            return;
        }
        setPurchaseState('buying');
        setError('');
        try {
            const response = await api_base.api.send({ buy: proposal.id, price: proposal.ask_price });
            const buy = getMessageData(response).buy;
            if (!buy?.contract_id) throw new Error(localize('The contract could not be purchased.'));
            setContract(buy);
            setPurchaseState('open');
            api_base.api.send({ proposal_open_contract: 1, contract_id: buy.contract_id, subscribe: 1 }).catch(() => undefined);
        } catch (purchaseError) {
            setPurchaseState('idle');
            setError(purchaseError?.error?.message ?? purchaseError.message ?? localize('Purchase failed.'));
        }
    };

    return (
        <section className='manual-trader' aria-label={localize('Manual Trader')}>
            <div className='manual-trader__tabs' aria-label={localize('Trading tools')}>
                <button type='button' className='manual-trader__tool-tab'><LabelPairedSearchLgRegularIcon /> <span>{localize('Analysis Tool')}</span></button>
                <button type='button' className='manual-trader__tool-tab manual-trader__tool-tab--active'><LabelPairedComputerMdRegularIcon /> <span>{localize('Manual Trader')}</span></button>
                <button type='button' className='manual-trader__tool-tab'><LabelPairedHandsHoldingDiamondMdRegularIcon /> <span>{localize('Bulk Trader')}</span></button>
            </div>

            <div className='manual-trader__body'>
                <label className='manual-trader__market'>
                    <span className='manual-trader__market-mark'>10</span>
                    <span className='manual-trader__market-copy'>
                        <strong>{selectedMarketName}</strong>
                        <small>{quote} <em>— 0.00%</em></small>
                    </span>
                    <select value={symbol} onChange={event => setSymbol(event.target.value)} aria-label={localize('Market')}>
                        {markets.map(market => <option key={market.symbol} value={market.symbol}>{market.name}</option>)}
                    </select>
                    <span className='manual-trader__chevron'>⌄</span>
                </label>

                <div className='manual-trader__digits' aria-label={localize('Recent digit distribution')}>
                    {digitPercentages.map((percentage, digit) => (
                        <button
                            type='button'
                            key={digit}
                            className={`manual-trader__digit manual-trader__digit--${digit === selectedDigit ? 'selected' : ''}`}
                            style={{ '--digit-progress': `${Math.max(8, percentage)}%` }}
                            onClick={() => setSelectedDigit(digit)}
                            aria-pressed={digit === selectedDigit}
                        >
                            <strong>{digit}</strong>
                            <span>{percentage.toFixed(1)}%</span>
                        </button>
                    ))}
                </div>

                <div className='manual-trader__pager'>
                    <button type='button' aria-label={localize('Previous trade type')}><LabelPairedArrowLeftMdRegularIcon /></button>
                    <button type='button' aria-label={localize('Next trade type')}><LabelPairedArrowRightMdRegularIcon /></button>
                </div>

                <div className='manual-trader__ticket'>
                    <button type='button' className='manual-trader__learn'><LabelPairedCircleInfoCaptionRegularIcon /> {localize('Learn about this trade type')}</button>
                    <div className='manual-trader__contract-heading'>
                        <button type='button' className='manual-trader__contract-type'><LabelPairedArrowUpArrowDownMdRegularIcon /> <strong>{localize('Over/Under')}</strong> <span>›</span></button>
                        <button type='button' className='manual-trader__digit-choice'>{localize('Digit')}: {selectedDigit}</button>
                    </div>
                    <div className='manual-trader__params'>
                        <label>{localize('Duration')} <strong>1 {localize('tick')}</strong></label>
                        <label>{localize('Stake')} <input inputMode='decimal' value={stake} onChange={event => setStake(event.target.value)} aria-label={localize('Stake')} /> <span>{currency}</span></label>
                    </div>
                    <div className='manual-trader__actions'>
                        <button type='button' className='manual-trader__buy manual-trader__buy--over' onClick={() => buyContract('over')} disabled={loadingProposal || purchaseState === 'buying'}>
                            <span><TradeTypesDigitsOverIcon /> {localize('Over')}</span>
                            <small>{localize('Payout')} <strong>{proposals.over?.payout ? `${Number(proposals.over.payout).toFixed(2)} ${currency}` : '—'}</strong></small>
                        </button>
                        <button type='button' className='manual-trader__buy manual-trader__buy--under' onClick={() => buyContract('under')} disabled={loadingProposal || purchaseState === 'buying'}>
                            <span><TradeTypesDigitsUnderIcon /> {localize('Under')}</span>
                            <small>{localize('Payout')} <strong>{proposals.under?.payout ? `${Number(proposals.under.payout).toFixed(2)} ${currency}` : '—'}</strong></small>
                        </button>
                    </div>
                    {contract?.contract_id && <p className={`manual-trader__status manual-trader__status--${purchaseState === 'settled' ? (contract.status === 'won' ? 'success' : 'error') : 'success'}`}>
                        {purchaseState === 'settled' ? `${localize('Contract')} ${contract.status ?? localize('settled')}` : localize('Contract purchased')} · {contract.contract_id}
                    </p>}
                    {error && <p className='manual-trader__status manual-trader__status--error'>{error}</p>}
                </div>
            </div>
        </section>
    );
});

export default ManualTrader;
