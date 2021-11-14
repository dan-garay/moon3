import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useCallback } from 'react';

const MOONRACE_PROGRAM_ID = '6dsJRgf4Kdq6jE7Q5cgn2ow4KkTmRqukw9DDrYP4uvij';


export const Balance = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();

        // Get balance
        function getBalance(connection, publicKey) {
            return connection.getBalance(publicKey);
        }

        // function tokenBalanace(connection, publicKey) {
        //     return connection.getParsedTokenAccountsByOwner(publicKey,
        //         { programId: MOONRACE_PROGRAM_ID, }
        //     )
        // }

        const depositAccountInfo = await connection.getAccountInfo(publicKey)

        const solBalance = getBalance(connection, publicKey);
        // const tokenBalance = tokenBalanace(connection);

        console.log('SOL Balance:', solBalance);
        // console.log('SPL Balances', tokenBalance);
        console.log(depositAccountInfo);
    }, [publicKey, sendTransaction, connection]);

    return (
        <button onClick={onClick} disabled={!publicKey}>
            Balance check
        </button>
    );
};