const assert = require('assert');
const anchor = require('@project-serum/anchor');
const SplToken = require('@solana/spl-token')
const Web3 = require('@solana/web3.js')
const TOKEN_PROGRAM_ID = require('@solana/spl-token').TOKEN_PROGRAM_ID
const Token = require('@solana/spl-token').Token
const { SystemProgram, PublicKey, Transaction, Keypair, LAMPORTS_PER_SOL } = anchor.web3

//
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

// describe('moonrace', async () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.Provider.env());
//   const provider = anchor.Provider.env();
//   const program = anchor.workspace.Moonrace;
//   const connection = provider.connection;

//   //new simulated wallet
//   const payer = Keypair.generate();

//   //derive all public keys
//   const [moonraceMint, tempbump] =  await getMoonraceMintKey(program.programId);
//   const [usdcPoolAccount, tempbump1] =  await getUSDCPoolPubKey(program.programId);
//   const [moonracePoolAccount, tempbump2] =  await getMoonracePoolPubKey(program.programId);
//   const [moonraceAirdropAccount, tempbump3] =  await getMoonraceAirdropPubKey(program.programId);
//   const [airdropStateAccount, airdropbump] =  await getAirdropStatePubkey(program.programId);
//   const [userAirdropStateAccount, userairdropbump] =  await getUserAirdropStatePubkey(program.programId, provider.wallet.publicKey.toString());
//   const [usdcFundAccount, tempbump4] =  await getUSDCFundPubKey(program.programId);

//   // for mainnet
//   // const usdcKey = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
//   //for testnet
//   const [usdcMint, tempbump5] =  await getTestUsdcMint(program.programId);

//   console.log("Moonrace mint",moonraceMint.toString());
//   console.log("USDC Pool PDA",usdcPoolAccount.toString());
//   console.log("Moonrace Pool PDA",moonracePoolAccount.toString());
//   console.log("USDC_Test mint",usdcMint.toString());
//   console.log("Public key of env wallet", provider.wallet.publicKey.toString());
//   console.log("Public key of UserAirdropWallet", userAirdropStateAccount.toString());
//   console.log("Public key of USDC Fee Pool", usdcFundAccount.toString());

//   it('Can init all', async () => {

//     //check token created
//     const moonraceinfob = await provider.connection.getAccountInfo(moonraceMint);
//     assert(!moonraceinfob)


//     //call usdc test init
//     await program.rpc.usdcInit({
//       accounts: {
//         signer: provider.wallet.publicKey,
//         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//         splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         usdcMint: usdcMint,
//       },
//       signers: [],
//     });

//     //call init
//     await program.rpc.initialize(
//       airdropbump,{
//       accounts: {
//         signer: provider.wallet.publicKey,
//         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//         airdropState: airdropStateAccount,
//         moonraceMint: moonraceMint,
//         splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         usdcPoolAccount: usdcPoolAccount,
//         usdcFundAccount: usdcFundAccount,
//         moonracePoolAccount: moonracePoolAccount,
//         moonraceAirdropAccount: moonraceAirdropAccount,
//         usdcMint: usdcMint,
//       },
//       signers: [],
//     });

//     //check token created
//     const moonraceinfo = await provider.connection.getAccountInfo(moonraceMint);
//     assert(moonraceinfo.data.length != 0)
//   });

//   it('Prints USDC', async () => {
//     //await connection.confirmTransaction(await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL * 1000))

//     const USDC = new Token(
//       connection,
//       usdcMint,
//       TOKEN_PROGRAM_ID,
//       provider.wallet.payer
//     );

//     console.log("payer", provider.wallet.payer.toString())
//     console.log("trying to derive address")
//     let usdc_user_account = await USDC.getOrCreateAssociatedAccountInfo(
//       provider.wallet.publicKey,
//     )
//     let UserUsdcAccount = await USDC.getAccountInfo(usdc_user_account.address);

//     console.log("USDC deposit add:",UserUsdcAccount.address.toString())

//     //fund acct
//     await program.rpc.fundTestUsdc({
//       accounts: {
//         signer: provider.wallet.publicKey,
//         splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         usdcMint: usdcMint,
//         usdcDeposit: UserUsdcAccount.address
//       },
//       signers: [provider.wallet.payer],
//     });
//     assert(true)
//   });

//   it('Can initialize DEX pools', async () => {
//     const moonraceToken = new Token(
//       connection,
//       moonraceMint,
//       TOKEN_PROGRAM_ID,
//       provider.wallet.payer
//     );

//     const USDC = new Token(
//       connection,
//       usdcMint,
//       TOKEN_PROGRAM_ID,
//       provider.wallet.payer
//     );

//     let usdc_user_account = await USDC.getOrCreateAssociatedAccountInfo(
//       provider.wallet.publicKey,
//     )
//     let moonrace_user_account = await moonraceToken.getOrCreateAssociatedAccountInfo(
//       provider.wallet.publicKey,
//     )

//     let UserUsdcAccount = await USDC.getAccountInfo(usdc_user_account.address);
//     let UserMoonraceAccount = await moonraceToken.getAccountInfo(moonrace_user_account.address);
//     let PoolUsdcAccount = await USDC.getAccountInfo(usdcPoolAccount);
//     let PoolMoonraceAccount = await moonraceToken.getAccountInfo(moonracePoolAccount);

//     //fund dex pools
//     //USDC then Moonrace amount
//     await program.rpc.fundDexPools(
//       new anchor.BN(10**6 * 10000),
//       new anchor.BN(10**3 * 400000000000),{
//       accounts: {
//         signer: provider.wallet.publicKey,
//         splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         usdcMint: usdcMint,
//         moonraceMint: moonraceMint,
//         usdcUserAccount: UserUsdcAccount.address,
//         moonraceUserAccount: UserMoonraceAccount.address,
//         usdcPoolAccount: usdcPoolAccount,
//         moonracePoolAccount: moonracePoolAccount,
//       },
//       signers: [provider.wallet.payer],
//     });

//     console.log("USDC amount in user wallet: ",usdc_user_account.amount.toString());
//     console.log("USDC amount in USDC pool: ",PoolUsdcAccount.amount.toString())
//     console.log("Moonrace amount in Moonrace pool before: ",PoolMoonraceAccount.amount.toString())
//     PoolMoonraceAccount = await moonraceToken.getAccountInfo(moonracePoolAccount);
//     console.log("Moonrace amount in Moonrace pool after: ",PoolMoonraceAccount.amount.toString())
//     assert(usdc_user_account.amount.toNumber()/10**5 === 10**6 * 10000)
//   });

//   it('Can buy MOONRACE', async () => {
//     const moonraceToken = new Token(
//       connection,
//       moonraceMint,
//       TOKEN_PROGRAM_ID,
//       provider.wallet.payer
//     );

//     const USDC = new Token(
//       connection,
//       usdcMint,
//       TOKEN_PROGRAM_ID,
//       provider.wallet.payer
//     );

//     let usdc_user_account = await USDC.getOrCreateAssociatedAccountInfo(
//       provider.wallet.publicKey,
//     )
//     let UserUsdcAccount = await USDC.getAccountInfo(usdc_user_account.address);

//     let moonrace_user_account = await moonraceToken.getOrCreateAssociatedAccountInfo(
//       provider.wallet.publicKey,
//     )
//     let UserMoonraceAccount = await moonraceToken.getAccountInfo(moonrace_user_account.address);


//     //fund dex pools
//     //USDC then Moonrace amount
//     await program.rpc.swap(
//       new anchor.BN(3 * 10**6 * 1000),
//       true,{
//       accounts: {
//         signer: provider.wallet.publicKey,
//         splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         usdcUserAccount: UserUsdcAccount.address,
//         moonraceUserAccount: UserMoonraceAccount.address,
//         usdcPoolAccount: usdcPoolAccount,
//         usdcFundAccount: usdcFundAccount,
//         moonracePoolAccount: moonracePoolAccount,
//       },
//       signers: [provider.wallet.payer],
//     });
//   })

//   it('Can sell MOONRACE', async () => {
//     const moonraceToken = new Token(
//       connection,
//       moonraceMint,
//       TOKEN_PROGRAM_ID,
//       provider.wallet.payer
//     );

//     const USDC = new Token(
//       connection,
//       usdcMint,
//       TOKEN_PROGRAM_ID,
//       provider.wallet.payer
//     );

//     let usdc_user_account = await USDC.getOrCreateAssociatedAccountInfo(
//       provider.wallet.publicKey,
//     )
//     let UserUsdcAccount = await USDC.getAccountInfo(usdc_user_account.address);

//     let moonrace_user_account = await moonraceToken.getOrCreateAssociatedAccountInfo(
//       provider.wallet.publicKey,
//     )
//     let UserMoonraceAccount = await moonraceToken.getAccountInfo(moonrace_user_account.address);

//     //sells $MOONRACE
//     await program.rpc.swap(
//       new anchor.BN(38461538461538),
//       false,{
//       accounts: {
//         signer: provider.wallet.publicKey,
//         splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         usdcUserAccount: UserUsdcAccount.address,
//         moonraceUserAccount: UserMoonraceAccount.address,
//         usdcPoolAccount: usdcPoolAccount,
//         usdcFundAccount: usdcFundAccount,
//         moonracePoolAccount: moonracePoolAccount,
//       },
//       signers: [provider.wallet.payer],
//     });
//   })

//   it('Can init user account for airdrop state', async () => {
//     //init userAirdropState to write timestamp
//     await program.rpc.initUserAirdrop(
//       userairdropbump,{
//       accounts: {
//         signer: provider.wallet.publicKey,
//         systemProgram: SystemProgram.programId,
//         userAirdropState: userAirdropStateAccount,
//       },
//       signers: [provider.wallet.payer],
//     });
//   })

//   it('Can reset airdrop state', async () => {
//     //init userAirdropState to write timestamp
//     await program.rpc.resetAirdrop({
//       accounts: {
//         systemProgram: SystemProgram.programId,
//         airdropState: airdropStateAccount,
//       },
//       signers: [provider.wallet.payer],
//     });
//   })

//   it('Can airdrop', async () => {
//     const moonraceToken = new Token(
//       connection,
//       moonraceMint,
//       TOKEN_PROGRAM_ID,
//       provider.wallet.payer
//     );

//     let moonrace_user_account = await moonraceToken.getOrCreateAssociatedAccountInfo(
//       provider.wallet.publicKey,
//     )
//     let UserMoonraceAccount = await moonraceToken.getAccountInfo(moonrace_user_account.address);
//     //init userAirdropState to write timestamp
//     await program.rpc.airdrop({
//       accounts: {
//         signer: provider.wallet.publicKey,
//         systemProgram: SystemProgram.programId,
//         userAirdropState: userAirdropStateAccount,
//         splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
//         airdropState: airdropStateAccount,
//         moonraceUserAccount: UserMoonraceAccount.address,
//         moonraceAirdropAccount: moonraceAirdropAccount,
//       },
//       signers: [provider.wallet.payer],
//     });
//   })

//   it('Can take fees out of pool', async () => {
//     const USDC = new Token(
//       connection,
//       usdcMint,
//       TOKEN_PROGRAM_ID,
//       provider.wallet.payer
//     );

//     let usdc_user_account = await USDC.getOrCreateAssociatedAccountInfo(
//       provider.wallet.publicKey,
//     )
//     let UserUsdcAccount = await USDC.getAccountInfo(usdc_user_account.address);

//     //init userAirdropState to write timestamp
//     await program.rpc.collectFees({
//       accounts: {
//         signer: provider.wallet.publicKey,
//         systemProgram: SystemProgram.programId,
//         thisProgramId: program.programId,
//         splTokenProgramInfo: SplToken.TOKEN_PROGRAM_ID,
//         usdcUserAccount: UserUsdcAccount.address,
//         usdcFundAccount: usdcFundAccount,
//       },
//       signers: [provider.wallet.payer],
//     });
//   })


// });