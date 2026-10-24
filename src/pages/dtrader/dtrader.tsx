import { useState } from 'react';
import './dtrader.scss';

const DTRADER_URL = 'https://dev-everymanmarkets.pages.dev/dtrader';

const DTrader = () => {
    const [loaded, setLoaded] = useState(false);
    return (
        <section className='mf-dtrader' aria-label='DTrader'>
            {!loaded && (
                <div className='mf-dtrader__loading'>
                    <span className='mf-dtrader__spinner' />
                    <strong>Loading DTrader</strong>
                    <small>Connecting to the live Deriv trading interface</small>
                </div>
            )}
            <iframe
                className='mf-dtrader__frame'
                title='Market Flipper DTrader'
                src={DTRADER_URL}
                onLoad={() => setLoaded(true)}
                allow='clipboard-read; clipboard-write; fullscreen'
            />
        </section>
    );
};

export default DTrader;
