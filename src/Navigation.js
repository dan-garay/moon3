import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';

export const Navigation = () => {
    const { wallet } = useWallet();
    console.log(wallet);

    return (
        <nav>
            <h1>Solana Starter App</h1>
            <div>
                <WalletMultiButton />
                {wallet && <WalletDisconnectButton />}
            </div>
        </nav>
    );
};