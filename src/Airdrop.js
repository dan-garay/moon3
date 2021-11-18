import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, sendAndConfirmRawTransaction } from '@solana/web3.js';
import React, { useCallback } from 'react';
import { Provider, Program } from '@project-serum/anchor'
import { getUserAirdropStatePubkey, getAirdropStatePubkey, getMoonraceAirdropPubKey, getMoonraceMintKey, MOONRACE_PROGRAM_ID} from './Constants.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
const SplToken = require('@solana/spl-token')

export function Airdrop() {
    // Connection and wallet
    const { connection } = useConnection()
    const { publicKey: userWalletPublicKey } = useWallet()
    const Wallet = useWallet()
    const provider = new Provider(connection, Wallet, {
        /** disable transaction verification step */
        skipPreflight: false,
        /** desired commitment level */
        commitment: 'confirmed',
        /** preflight commitment level */
        preflightCommitment: 'confirmed'
      })

    // Create acc and claim
    const getTransaction = useCallback(async () => {
        const provider = await new Provider(connection, Wallet, {
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

        //derive all public keys
        const [userAirdropStateAccount, userairdropbump] =  await getUserAirdropStatePubkey(program.programId, provider.wallet.publicKey.toString());
        const [airdropStateAccount, airdropbump] =  await getAirdropStatePubkey(program.programId);
        const [moonraceAirdropAccount, tempbump3] =  await getMoonraceAirdropPubKey(program.programId);
        const [moonraceMint, tempbump] =  await getMoonraceMintKey(program.programId);

        // MOONRACE Public Key
        const moonraceAccountPublicKey = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            moonraceMint,
            userWalletPublicKey
          )

        // Check if they have an airdrop account
        const airdropAccountInfo = await connection.getAccountInfo(userAirdropStateAccount)
        // Check 24 hours since last airdrop reset
        const airdropState = await program.account.airdropState.fetch(airdropStateAccount)
        const lastAirdropTimestamp = airdropState.lastAirdropResetTimestamp.toString()

        // Check if 24 hrs have passed or we are at the beginning
        const diff = new Date(new Date() + (1000 * 60 * 60 * 24)) - new Date(lastAirdropTimestamp * 1000) <= 0

        console.log(new Date(new Date() + (1000 * 60 * 60 * 24)) - new Date(lastAirdropTimestamp * 1000))

        const canResetAirdrop = diff || (lastAirdropTimestamp == 0)

        // Create acc if none exists
        if (!airdropAccountInfo) {
          // Init User Aidrop account
            const initTx = new Transaction().add(
                await program.instruction.initUserAirdrop(
                    userairdropbump,{
                        accounts: {
                          signer: provider.wallet.publicKey,
                          systemProgram: SystemProgram.programId,
                          userAirdropState: userAirdropStateAccount,
                        },
                        signers: [provider.wallet.payer],
                      })
            )
            transaction.add(initTx)
        }

      // Reset airdrop if can be reset (global)
      if (canResetAirdrop) {
        console.log('here')
        const resetTx = new Transaction().add(
            await program.instruction.resetAirdrop({
                accounts: {
                  systemProgram: SystemProgram.programId,
                  airdropState: airdropStateAccount,
                },
                signers: [provider.wallet.payer],
              })
        )
        transaction.add(resetTx)
      }

      // airdrop
        const airdropTx = new Transaction().add(
            await program.instruction.airdrop({
                accounts: {
                  signer: provider.wallet.publicKey,
                  systemProgram: SystemProgram.programId,
                  userAirdropState: userAirdropStateAccount,
                  splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
                  airdropState: airdropStateAccount,
                  moonraceUserAccount: moonraceAccountPublicKey,
                  moonraceAirdropAccount: moonraceAirdropAccount,
                },
                signers: [provider.wallet.payer],
              })
        )
        // Add instruction to transaction
        transaction.add(airdropTx)
        return transaction;

    }, [Wallet, connection, userWalletPublicKey, provider]);

    const handleClick = async () => {
        // Create and sign transaction
        const transaction = await getTransaction()
        const signedTransaction = await Wallet.signTransaction(transaction)
        await sendAndConfirmRawTransaction(connection, signedTransaction.serialize())
      }

    return (
        <button onClick={handleClick} >
            Aidrop MOONRACE
        </button>
    );
};