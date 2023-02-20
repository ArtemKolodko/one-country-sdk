import Web3 from "web3";
import {Contract} from "web3-eth-contract";
import {HttpProvider} from "web3-core";

export interface OneCountryConfig {
  contractAddress: string;
  provider?: HttpProvider;
  rpcUrl?: string;
  privateKey?: string
}

export class OneCountryBase {
  protected web3: Web3
  protected contract: Contract
  public accountAddress = ''

  constructor(config: OneCountryConfig) {
    const { privateKey } = config

    const rpcUrl = config.rpcUrl || 'https://api.harmony.one'
    const provider = config.provider || new Web3.providers.HttpProvider(rpcUrl)
    this.web3 = new Web3(provider)
    if(privateKey) {
      const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      this.web3.eth.accounts.wallet.add(account);
      this.setAccountAddress(account.address)
    }
  }

  public setAccountAddress (address: string) {
    this.accountAddress = address
  }
}
