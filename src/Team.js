import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useCallback } from 'react';
import { Provider, Program } from '@project-serum/anchor'
import { getAirdropStatePubkey, MOONRACE_PROGRAM_ID} from './Constants.js';

export function Team() {
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
    const getTeam = useCallback(async () => {

        // Initialize program
        const program = await Program.at(new PublicKey(MOONRACE_PROGRAM_ID), provider)

        //derive all public keys
        const [airdropStateAccount, airdropbump] =  await getAirdropStatePubkey(program.programId);

        // get airdrop states
        const airdropState = await program.account.airdropState.fetch(airdropStateAccount)
        // Get allocations
        return [airdropState.blueTeamAvailToday.toString(), airdropState.redTeamAvailToday.toString()]

    }, [Wallet, connection, userWalletPublicKey]);

    const handleClick = async () => {
        // Create and sign transaction
        const team = await getTeam()
        console.log('BLUE TEAM GETS:', team[0])
        console.log('RED TEAM GETS:', team[1])
      }

    return (
        <button onClick={handleClick} >
            TEAM ALLOCATIONS
        </button>
    );
};