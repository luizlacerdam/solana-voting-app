#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;


#[program]
pub mod votingdapp {
    use super::*;

    pub fn initialize_poll(ctx: Context<InitializePoll>,
       poll_id: u64,
        description: String,
        poll_start: u64,
        poll_end: u64,
        candidate_amount: u64,
      ) -> Result<()> { 
        let poll = &mut ctx.accounts.poll;
        poll.poll_id = poll_id;
        poll.description = description;
        poll.poll_start = poll_start;
        poll.poll_end = poll_end;
        poll.candidate_amount = 0;
      
      Ok(())
    }
 
}





#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
  // account signer
  #[account(mut)]
  pub signer: Signer<'info>,

  // account poll
  #[account(
    init,
    payer = signer,
    space = ANCHOR_DISCRIMINATOR_SIZE + Poll::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump,
  )]
  pub poll: Account<'info, Poll>,

  pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
  pub poll_id: u64,
  #[max_len(280)]
  pub description: String,
  pub poll_start: u64,
  pub poll_end: u64,
  pub candidate_amount: u64,
}

// pub struct Candidate {
//   #[max_len(100)]
//   pub candidate_name: String,
//   pub candidate_vote: u64,
// }