import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'

const IDL = require('../target/idl/votingdapp.json')

describe('Testing Voting App', () => {

  const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");
  let context;
  let provider;
  let votingProgram: Program<Votingdapp>;

  beforeAll(async() => {
     context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], [])
     provider = new BankrunProvider(context);
   
     votingProgram = new Program<Votingdapp> (
      IDL,
      provider
    )
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
    
  }, 30000)
  
  it('Vote Test', async () => {
    
  }, 30000)
})
