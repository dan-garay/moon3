import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';

export const Navigation = () => {
    const { wallet } = useWallet();

    return (
        <nav>
            <h1>Moonrace</h1>
            <div>
                <WalletMultiButton />
                {wallet && <WalletDisconnectButton />}
            </div>
        </nav>
    );
};