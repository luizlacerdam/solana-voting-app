import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
import exp from 'constants'

const IDL = require('../target/idl/votingdapp.json')

describe('Testing Voting App', () => {

  const votingAddress = new PublicKey("4tnTWSczskE1sDxU8ACMrduHw3AsCSz4GQ1mgDGLj45h");
  let context;
  // let provider;
  anchor.setProvider(anchor.AnchorProvider.env()); // set the provider to the env
  let votingProgram: Program<Votingdapp> = anchor.workspace.Votingdapp;

  // locally comment this out
  beforeAll(async() => {
    //  context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], [])
    //  provider = new BankrunProvider(context);
   
    //  votingProgram = new Program<Votingdapp> (
    //   IDL,
    //   provider
    // )
  })
  it('Initialize Poll', async () => {

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is favorite type or penut butter?",
      new anchor.BN(0),
      new anchor.BN(1835922190),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    )

    // fetchs poll
    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is favorite type or penut butter?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
    expect(poll.candidateAmount.toNumber()).toEqual(0);
    

  }, 30000)

  it('Initialize candidate', async () => {
    await votingProgram.methods.initializeCandidate(
      "Smooth",
      new anchor.BN(1),
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      "Crunchy",
      new anchor.BN(1),
    ).rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8) ,Buffer.from("Crunchy")],
      votingAddress,
    )

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8) ,Buffer.from("Smooth")],
      votingAddress,
    )

    const smooth = await votingProgram.account.candidate.fetch(smoothAddress);
    const crunchy = await votingProgram.account.candidate.fetch(crunchyAddress);

    expect(smooth.candidateName).toEqual("Smooth");
    expect(crunchy.candidateName).toEqual("Crunchy");

    expect(smooth.candidateVotes.toNumber()).toEqual(0);
    expect(crunchy.candidateVotes.toNumber()).toEqual(0);

    console.log(crunchy);
    console.log(smooth);
    

  }, 30000)
  
  it('Vote Test', async () => {
    await votingProgram.methods.vote("Smooth", new anchor.BN(1)).rpc();

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8) ,Buffer.from("Smooth")],
      votingAddress,
    )

    const smooth = await votingProgram.account.candidate.fetch(smoothAddress);

    expect(smooth.candidateName).toEqual("Smooth");
    expect(smooth.candidateVotes.toNumber()).toEqual(1);

  }, 30000)
})
