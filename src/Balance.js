import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair } from '@solana/web3.js';
import React, { useCallback } from 'react';
import { Provider, Program } from '@project-serum/anchor'
import { getMoonraceMintKey, MOONRACE_PROGRAM_ID, getTestUsdcMint} from './Constants.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'

export function Balance() {
    // Connection and wallet
    const { connection } = useConnection()
    const { publicKey: userWalletPublicKey } = useWallet()
    const Wallet = useWallet()

    // Solana balance
    const solanaBalance = useCallback(async () => {
        // Update wallet Sol Balance
        const balance = await connection.getBalance(userWalletPublicKey)
        return balance;
    }, [connection, userWalletPublicKey])

    const usdcBalance = useCallback(async () => {
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
        const [usdcMint, tempbump5] =  await getTestUsdcMint(program.programId);


        // USDC Public Key
        const usdcAccountPublicKey = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            usdcMint,
            userWalletPublicKey
        )

        const usdcToken = await new Token(
            connection,
            usdcMint,
            TOKEN_PROGRAM_ID,
            Keypair.generate()
        )

        // MOONRACE Account Info
        const usdcAccountInfo = await usdcToken.getAccountInfo(usdcAccountPublicKey)
        return usdcAccountInfo.amount.toNumber();

    }, [Wallet, connection, userWalletPublicKey]);

    // Moonrace balance
    const moonraceBalance = useCallback(async () => {
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
        const [moonraceMint, tempbump] =  await getMoonraceMintKey(program.programId);

        const moonraceAccountPublicKey = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            moonraceMint,
            userWalletPublicKey
          )

        const moonraceToken = await new Token(
            connection,
            moonraceMint,
            TOKEN_PROGRAM_ID,
            Keypair.generate()
        )

        const moonraceAccountInfo = await moonraceToken.getAccountInfo(moonraceAccountPublicKey)

        // This account has no associated token account for this user
        if (!moonraceAccountInfo) {
            console.log('No MOONRACE account found');
        }

        return moonraceAccountInfo.amount.toNumber();
    }, [Wallet, connection, userWalletPublicKey]);

    const handleClick = async () => {

        const solBalance = await solanaBalance()
        const moonBalance = await moonraceBalance()
        const usdBalance =  await usdcBalance()
        console.log('MOONRACE BALANCE:', moonBalance)
        console.log('SOLANA BALANCE:', solBalance)
        console.log('USDC BALANCE:', usdBalance)
    }

    return (
        <button onClick={handleClick} >
            Check Balance
        </button>
    );
};