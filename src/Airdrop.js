import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, sendAndConfirmRawTransaction } from '@solana/web3.js';
import React, { useCallback } from 'react';
import { Provider, Program, BN } from '@project-serum/anchor'
import { getUserAirdropStatePubkey, getAirdropStatePubkey, getMoonraceAirdropPubKey, getMoonraceMintKey } from './util.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
const SplToken = require('@solana/spl-token')


export const MOONRACE_PROGRAM_ID = '6dsJRgf4Kdq6jE7Q5cgn2ow4KkTmRqukw9DDrYP4uvij';
export const HEDGE_PROGRAM_ID = '6dsJRgf4Kdq6jE7Q5cgn2ow4KkTmRqukw9DDrYP4uvij'
// export const HEDGE_PROGRAM_ID = 'HEDGEau7kb5L9ChcchUC19zSYbgGt3mVCpaTK6SMD8P4'

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


        const moonraceAccountPublicKey = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            moonraceMint,
            userWalletPublicKey
          )

        const moonraceAccountInfo = await connection.getAccountInfo(moonraceAccountPublicKey)

        const airdropAccountInfo = await connection.getAccountInfo(userAirdropStateAccount)

        // This account has no associated token account for this user
        if (!airdropAccountInfo) {
            const createAssociatedAccountInstruction = Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            airdropStateAccount,
            airdropAccountPublicKey,
            userWalletPublicKey,
            userWalletPublicKey
            )

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
            transaction.add(createAssociatedAccountInstruction)
        }

        const airdropTx = new Transaction().add(
            await program.instruction.airdrop({
                accounts: {
                  signer: provider.wallet.publicKey,
                  systemProgram: SystemProgram.programId,
                  userAirdropState: userAirdropStateAccount,
                  splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
                  airdropState: airdropStateAccount,
                  moonraceUserAccount: airdropAccountPublicKey,
                  moonraceAirdropAccount: moonraceAirdropAccount,
                },
                signers: [provider.wallet.payer],
              })
        )

        transaction.add(initTx)
        transaction.add(airdropTx)
        return transaction;

    }, [Wallet, connection, userWalletPublicKey, provider]);

    const handleClick = async () => {

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