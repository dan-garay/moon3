import { getMoonraceMintKey, MOONRACE_PROGRAM_ID, getTestUsdcMint, getUSDCPoolPubKey, getMoonracePoolPubKey} from './Constants.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Keypair } from '@solana/web3.js';
import React, { useCallback } from 'react';
import { Provider, Program } from '@project-serum/anchor'
import { getMoonraceMintKey, MOONRACE_PROGRAM_ID, getTestUsdcMint} from './Constants.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'

 const [usdcPoolPublicKey, tempbump6] = await getUSDCPoolPubKey(program.programId);
 const [moonracePoolPublicKey, tempbump7] = await getMoonracePoolPubKey(program.programId);
 console.log(program.account)

// Price
const usdcPoolAccountInfo =  await usdcToken.getAccountInfo(usdcPoolPublicKey)
const moonracePoolAccountInfo = await moonraceToken.getAccountInfo(moonracePoolPublicKey)
console.log(usdcPoolAccountInfo.amount.toNumber())
console.log(moonracePoolAccountInfo.amount.toNumber())