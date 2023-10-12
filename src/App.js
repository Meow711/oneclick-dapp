import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalStyle from './utils/ourstyle';
import { DappContextProvider } from './store/contextProvider';

import RouterPath from './router/router';
import { HashRouter as Router } from 'react-router-dom';
import styled from 'styled-components';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains([mainnet, polygon, optimism, arbitrum, base, zora], [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]);
const { connectors } = getDefaultWallets({
    appName: 'one-click',
    projectId: '9ae1de7d5c0b0cc4123c7b1c4088dbf7',
    chains,
});
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

const GlobalLayout = styled('div')`
    min-height: 100vh !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const PanelLayout = styled('div')`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

function App() {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <DappContextProvider>
                    <GlobalLayout>
                        <Router>
                            <Header></Header>
                            <PanelLayout>
                                <RouterPath></RouterPath>
                            </PanelLayout>
                            <Footer></Footer>
                        </Router>
                        <GlobalStyle />
                    </GlobalLayout>
                </DappContextProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default App;
