import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useCallback } from 'react';
import { Provider, Program, BN } from '@project-serum/anchor'
import { getMoonraceMintKey, getTestUsdcMint, getUSDCPoolPubKey, getUSDCFundPubKey, getMoonracePoolPubKey,
    getMoonraceAirdropPubKey, getAirdropStatePubkey, getUserAirdropStatePubkey } from './util.js';

const Token = require('@solana/spl-token').Token
const SplToken = require('@solana/spl-token')
const TOKEN_PROGRAM_ID = require('@solana/spl-token').TOKEN_PROGRAM_ID


export const MOONRACE_PROGRAM_ID = '6dsJRgf4Kdq6jE7Q5cgn2ow4KkTmRqukw9DDrYP4uvij';
export const HEDGE_PROGRAM_ID = '6dsJRgf4Kdq6jE7Q5cgn2ow4KkTmRqukw9DDrYP4uvij'
// export const HEDGE_PROGRAM_ID = 'HEDGEau7kb5L9ChcchUC19zSYbgGt3mVCpaTK6SMD8P4'



export const Swap = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { wallet } = useWallet()
    console.log('WALLET', wallet)


    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        console.log('pubkey:', publicKey.toString());

        const provider = new Provider(connection, wallet)
        console.log('PAYER', provider.wallet);

        const program = await Program.at(new PublicKey(MOONRACE_PROGRAM_ID), provider)
        console.log(program);

        const [usdcMint, tempbump5] =  await getTestUsdcMint(program.programId);

        //derive all public keys
        const [moonraceMint, tempbump] =  await getMoonraceMintKey(program.programId);
        const [usdcPoolAccount, tempbump1] =  await getUSDCPoolPubKey(program.programId);
        const [moonracePoolAccount, tempbump2] =  await getMoonracePoolPubKey(program.programId);
        const [moonraceAirdropAccount, tempbump3] =  await getMoonraceAirdropPubKey(program.programId);
        const [airdropStateAccount, airdropbump] =  await getAirdropStatePubkey(program.programId);
        const [userAirdropStateAccount, userairdropbump] =  await getUserAirdropStatePubkey(program.programId, publicKey.toString());
        const [usdcFundAccount, tempbump4] =  await getUSDCFundPubKey(program.programId);

        const moonraceToken = new Token(
            connection,
            moonraceMint,
            TOKEN_PROGRAM_ID,
            publicKey
          );

          const USDC = new Token(
            connection,
            usdcMint,
            TOKEN_PROGRAM_ID,
            publicKey
          );

          let usdc_user_account = await USDC.getOrCreateAssociatedAccountInfo(
            publicKey,
          )
          let UserUsdcAccount = await USDC.getAccountInfo(usdc_user_account.address);
          console.log('USDC ACC', UserUsdcAccount);

          let moonrace_user_account = await moonraceToken.getOrCreateAssociatedAccountInfo(
            publicKey,
          )
          let UserMoonraceAccount = await moonraceToken.getAccountInfo(moonrace_user_account.address);

        const transaction = new Transaction().add(
            await program.instruction.swap(
                new BN(3 * 10**6 * 1000),
                true,
                {
                    accounts: {
                        signer: provider.wallet.publicKey,
                        splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
                        systemProgram: SystemProgram.programId,
                        usdcUserAccount: UserUsdcAccount.address,
                        moonraceUserAccount: UserMoonraceAccount.address,
                        usdcPoolAccount: usdcPoolAccount,
                        usdcFundAccount: usdcFundAccount,
                        moonracePoolAccount: moonracePoolAccount,
                    },
                    signers: [provider.wallet.payer],
                }
            )
        );
        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'processed');
    }, [publicKey, sendTransaction, connection]);

    return (
        <button onClick={onClick} disabled={!publicKey}>
            Swap
        </button>
    );
};