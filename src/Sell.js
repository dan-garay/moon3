import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, sendAndConfirmRawTransaction } from '@solana/web3.js';
import React, { useCallback } from 'react';
import { Provider, Program, BN } from '@project-serum/anchor'
import { getMoonraceMintKey, getTestUsdcMint, getUSDCPoolPubKey, getUSDCFundPubKey,
    MOONRACE_PROGRAM_ID, getMoonracePoolPubKey, getMoonraceConstPubkey } from './Constants.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
const SplToken = require('@solana/spl-token')

export function Sell() {
    // Connection and wallet
    const { connection } = useConnection()
    const { publicKey: userWalletPublicKey } = useWallet()
    const Wallet = useWallet()

    // Button click
    const getTransaction = useCallback(async () => {
        const provider = new Provider(connection, Wallet, {
            /** disable transaction verification step */
            skipPreflight: false,
            /** desired commitment level */
            commitment: 'confirmed',
            /** preflight commitment level */
            preflightCommitment: 'confirmed'
          })

        // Initialize program
        const program = await Program.at(new PublicKey(MOONRACE_PROGRAM_ID), provider)
        // Create a transaction
        const { blockhash } = await connection.getRecentBlockhash()
        const transaction = new Transaction({
            feePayer: userWalletPublicKey,
            recentBlockhash: blockhash
        })

        //Derive all public keys
        const [usdcMint, tempbump5] =  await getTestUsdcMint(program.programId);
        const [moonraceMint, tempbump] =  await getMoonraceMintKey(program.programId);
        const [usdcPoolAccount, tempbump1] =  await getUSDCPoolPubKey(program.programId);
        const [moonracePoolAccount, tempbump2] =  await getMoonracePoolPubKey(program.programId);
        const [usdcFundAccount, tempbump4] =  await getUSDCFundPubKey(program.programId);
        const [moonraceConstants, moonraceConstantsbump] =  await getMoonraceConstPubkey(program.programId);

        // USDC Public Key
        const usdcAccountPublicKey = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            usdcMint,
            userWalletPublicKey
        )

        // MOONRACE Public Key
        const moonraceAccountPublicKey = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            moonraceMint,
            userWalletPublicKey
          )

          // MOONRACE Account Info
        const moonraceAccountInfo = await connection.getAccountInfo(moonraceAccountPublicKey)

        // This account has no associated token account for this user
        if (!moonraceAccountInfo) {
            const createAssociatedAccountInstruction = Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            moonraceMint,
            moonraceAccountPublicKey,
            userWalletPublicKey,
            userWalletPublicKey
            )
            transaction.add(createAssociatedAccountInstruction)
        }

        // Swap MOONRACE for USDC
        const swapTx = new Transaction().add(
            await program.instruction.swap(
                new BN(38461538400), // TODO: Hardcoded
                false,
                {
                    accounts: {
                        signer: provider.wallet.publicKey,
                        splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
                        systemProgram: SystemProgram.programId,
                        usdcUserAccount: usdcAccountPublicKey,
                        moonraceUserAccount: moonraceAccountPublicKey,
                        usdcPoolAccount: usdcPoolAccount,
                        usdcFundAccount: usdcFundAccount,
                        moonracePoolAccount: moonracePoolAccount,
                        moonraceConstants: moonraceConstants,
                    },
                    signers: [provider.wallet.payer],
                }
            )
        )
        // Add instruction to transaction
        transaction.add(swapTx)

        return transaction;
    }, [Wallet, connection, userWalletPublicKey]);

    const handleClick = async () => {

        // Create transaction and sign
        const transaction = await getTransaction()
        const signedTransaction = await Wallet.signTransaction(transaction)
        await sendAndConfirmRawTransaction(connection, signedTransaction.serialize())
      }

    return (
        <button onClick={handleClick} >
            Sell MOONRACE
        </button>
    );
};