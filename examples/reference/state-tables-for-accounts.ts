import { DFUSE_API_KEY, runMain, prettifyJson, DFUSE_API_NETWORK } from "../config"
import { createDfuseClient } from "@dfuse/client"

async function main(): Promise<void> {
  const client = createDfuseClient({ apiKey: DFUSE_API_KEY, network: DFUSE_API_NETWORK })

  try {
    const response = await client.stateTablesForAccounts(
      ["eosio.token", "trybenetwork", "parslseed123", "zkstokensr4u"],
      "eoscanadacom",
      "accounts",
      {
        keyType: "symbol_code",
      }
    )

    console.log("State tables for accounts response", prettifyJson(response))
  } catch (error) {
    console.log("An error occurred", error)
  }

  client.release()
}

runMain(main)
