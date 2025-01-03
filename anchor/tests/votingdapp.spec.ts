import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'

const IDL = require('../target/idl/votingdapp.json')

describe('Testing Voting App', () => {

  const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

  it('Initialize Votingdapp', async () => {
    const context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], [])
    const provider = new BankrunProvider(context);
   
    const votingProgram = new Program<Votingdapp> (
      IDL,
      provider
    )

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is favorite type or penut butter?",
      new anchor.BN(0),
      new anchor.BN(1835922190),
    ).rpc();

  }, 30000)

  
})
