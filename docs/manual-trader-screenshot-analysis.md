# Manual Trader Screenshot Analysis

## What the screen is

The screenshot shows a **mobile Deriv-style manual trading interface** for a digit **Over/Under** contract on **Volatility 10 Index**. It is a purchase ticket, not an automated bot editor.

The browser chrome at the top is outside the app. The app starts below it with the dark blue account/navigation header.

## Visual hierarchy

1. **Mobile browser chrome**
   - Red browser address-bar area.
   - Time, network signal, battery, close/back control, site title, domain, and overflow menu.
   - This should not be recreated as part of the app UI.

2. **Trading app utility header**
   - Hamburger menu.
   - Phone/contact shortcut.
   - Refresh/reconnect shortcut.
   - Account balance chip: coin icon, `4.63 USD`, and account dropdown chevron.
   - The balance is the only account/financial header element in the requested design. Transfer is intentionally not part of this header.

3. **Product tabs**
   - `Analysis Tool` with a search/magnifier icon.
   - `Manual Trader` with a monitor/screen icon; this is the selected tab.
   - `Bulk Trader` with a hands/holding icon.
   - The selected tab uses a brighter blue block and coral icon/text treatment.

4. **Market selector**
   - Instrument: `Volatility 10 Index`.
   - A small volatility/market mark on the left.
   - Current quote: `5044.989`.
   - Quote movement: `-0.128 (0.00%)`.
   - A red downward marker indicates the negative move.
   - Chevron opens the market/instrument list.

5. **Digit distribution panel**
   - Ten circular indicators for digits `0` through `9`.
   - Each displays the digit and a recent frequency/percentage, such as `10.5%`.
   - Circular progress rings visualize the percentage.
   - Accent colors call out notable states: teal, red, blue, or amber.
   - The AI bubble overlaps the left side of the panel. It is an assistant/insight overlay, not a digit control.
   - These percentages are descriptive recent distribution data; they are not a guarantee of the next tick.

6. **Navigation arrows**
   - Left and right double-chevron controls change the selected contract/trade-type view or move between available trade configurations.

7. **Trade-type summary**
   - `Learn about this trade type` is an education/help entry point.
   - Main contract type: `Over/Under` with up/down contract icons.
   - Selected digit: `Digit: 7`.
   - Chevron opens the trade-type selector.

8. **Contract parameters**
   - Duration: `1 tick`.
   - Stake: `1.00 USD`.
   - A `Stake` label indicates the amount control/field.
   - The yellow warning badge is an advisory/error/status affordance attached to the trade card.

9. **Purchase buttons**
   - Teal `Over` button with an upward contract icon.
   - Red `Under` button with a downward contract icon.
   - Each button includes a payout row: `Payout 4.13 USD` and `Payout 1.35 USD` in the screenshot.
   - Tapping a button would request a purchase for the selected instrument, contract type, duration, digit, and stake. A real implementation must request a current quote/proposal first, show confirmation or server response, then track the open contract.

10. **Mobile system/navigation area**
    - The bottom gesture bar is operating-system chrome and should not be implemented in the app.

## How a user operates it

1. Open the market selector and choose an instrument, such as Volatility 10 Index.
2. Review the current quote and recent digit distribution.
3. Choose the contract family, here `Over/Under`.
4. Select the target digit, here `7`.
5. Set duration, here `1 tick`.
6. Set the stake, here `1.00 USD`.
7. Compare the live payouts.
8. Tap `Over` or `Under` to submit the purchase request.
9. The application should display loading, acceptance/rejection, contract status, and final result states.

## Exact icon sources in the current repository

The app already uses `@deriv/quill-icons`, so the visual implementation should reuse those React components rather than emoji, raster images, or ad-hoc SVGs.

### Existing navigation/dashboard icons

- Dashboard: `LabelPairedObjectsColumnCaptionRegularIcon`
- Bot Builder: `LabelPairedPuzzlePieceTwoCaptionBoldIcon`
- Charts: `LabelPairedChartLineCaptionRegularIcon`
- Tutorials: `LegacyGuide1pxIcon`
- Dashboard action cards: `DerivLightLocalDeviceIcon`, `DerivLightMyComputerIcon`, `DerivLightGoogleDriveIcon`, `DerivLightBotBuilderIcon`, `DerivLightQuickStrategyIcon`

### Closest Quill icon mappings for the manual-trader design

- Analysis Tool: `LabelPairedSearchLgRegularIcon`
- Bulk Trader: `LabelPairedHandsHoldingDiamondMdRegularIcon`
- Navigation left/right: `LabelPairedArrowLeftMdRegularIcon`, `LabelPairedArrowRightMdRegularIcon`
- Refresh: `LabelPairedArrowRotateRightMdRegularIcon`
- Contract direction: `LabelPairedArrowUpArrowDownMdRegularIcon` or the matching trade-type icon from `@deriv/quill-icons/TradeTypes`
- Help/status: `LabelPairedCircleInfoCaptionBoldIcon`

The balance/account icon remains owned by the account switcher and is deliberately excluded from the content icon set, as requested.

## Safety and implementation boundary

The visual screen can be implemented independently. Actual `Over`/`Under` buttons would be a financial action and should not place live trades until the app has an explicit API contract, account/session handling, proposal validation, stake limits, error states, and user confirmation behavior. The safest first build is a faithful visual/demo interface with disabled or mocked purchase actions, followed by a separate live-trading integration.
