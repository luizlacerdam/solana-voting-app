import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Votingdapp } from "@/../anchor/target/idl/votingdapp.json";
import { BN, Program } from "@coral-xyz/anchor";

const IDL = require('../../../../anchor/target/idl/votingdapp.json')

export const OPTIONS = GET;

export async function GET(request: Request) {
  const actionMetdata: ActionGetResponse = {
    icon: "https://zestfulkitchen.com/wp-content/uploads/2021/09/Peanut-butter_hero_for-web-2.jpg",
    title: "Vote for your favorite type of peanut butter?",
    description: "Vote between crunchy and smooth peanut butter.",
    label: "Vote",
    links: {
      actions: [
        {
          label: "Vote for Crunchy",
          href: "/api/vote?candidate=Crunchy",
        },
        {
          label: "Vote for Smooth",
          href: "/api/vote?candidate=Smooth",
        }
      ]
    }
  };
  return Response.json(actionMetdata, { headers: ACTIONS_CORS_HEADERS});
}


export async function POST(request: Request) {
  const url = new URL(request.url);

  const candidate = url.searchParams.get("candidate");
  console.log(candidate);
  

  if (candidate !== "Smooth" && candidate !== "Crunchy") {
    return new Response("Invalid candidate", {status: 400, headers: ACTIONS_CORS_HEADERS});
  }
  
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const program: Program<Votingdapp> = new Program(IDL, {connection});
  
  const body: ActionPostRequest = await request.json();

  let voter;

  try {
    voter = new PublicKey(body.account);
  } catch (error) {
    console.log(error);
    return new Response("Invalid account", {status: 400, headers: ACTIONS_CORS_HEADERS});
  }

  const instructions = await program.methods
  .vote(candidate, new BN(1))
  .accounts({
    signer: voter,
  })
  .instruction();

  const blockhash = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: voter,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight
  })
  .add(instructions);

  const response = await createPostResponse({
    fields:{
      transaction: transaction,
    }
  })

  

  return Response.json(response, {headers: ACTIONS_CORS_HEADERS});
}

