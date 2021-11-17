const anchor = require('@project-serum/anchor');
const { PublicKey } = anchor.web3

// Program ID
export const MOONRACE_PROGRAM_ID = 'G5kUH2NHxfy4VTQR3v14UyTx33ebUM3iV19wiyJ8t5ob';

// Derive public keys
export async function getMoonraceMintKey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('moonrace')], programId)
  return [findMintPublicKey, bump]
}

export async function getTestUsdcMint (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('usdc')], programId)
  return [findMintPublicKey, bump]
}

export async function getUSDCPoolPubKey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('usdcpool')], programId)
  return [findMintPublicKey, bump]
}

export async function getUSDCFundPubKey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('usdcfund')], programId)
  return [findMintPublicKey, bump]
}

export async function getMoonracePoolPubKey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('moonracepool')], programId)
  return [findMintPublicKey, bump]
}

export async function getMoonraceAirdropPubKey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('moonraceairdrop')], programId)
  return [findMintPublicKey, bump]
}

export async function getAirdropStatePubkey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('airdropstate')], programId)
  return [findMintPublicKey, bump]
}

export async function getUserAirdropStatePubkey (programId, pubkey) {
  const enc = new TextEncoder()
  const toEncode = pubkey.slice(0,32)
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode(toEncode)], programId)
  return [findMintPublicKey, bump]
}

export async function getMoonraceConstPubkey (programId) {
  const enc = new TextEncoder()
  const [findMintPublicKey, bump] = await PublicKey.findProgramAddress([enc.encode('moonconst')], programId)
  return [findMintPublicKey, bump]
}