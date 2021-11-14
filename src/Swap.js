import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useCallback } from 'react';
import { Provider, Program} from '@project-serum/anchor';

const MOONRACE_PROGRAM_ID = '6dsJRgf4Kdq6jE7Q5cgn2ow4KkTmRqukw9DDrYP4uvij';


export const Swap = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { wallet } = useWallet()


    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();

        const provider = new Provider(connection, wallet)
        const program = await Program.at(new PublicKey(MOONRACE_PROGRAM_ID), provider)
        console.log(program);

        // const transaction = new Transaction().add(
        //     SystemProgram.transfer({
        //         fromPubkey: publicKey,
        //         toPubkey: Keypair.generate().publicKey,
        //         lamports: 1,
        //     })
        // );

        // const signature = await sendTransaction(transaction, connection);

        // await connection.confirmTransaction(signature, 'processed');
    }, [publicKey, sendTransaction, connection]);

    return (
        <button onClick={onClick} disabled={!publicKey}>
            Swap
        </button>
    );
};