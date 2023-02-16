import Web3 from 'web3'
import {AbiItem} from 'web3-utils'
import {Contract} from 'web3-eth-contract';
import { BN } from 'bn.js';
import {HttpProvider} from "web3-core";
// @ts-ignore
import d1dcv2ABI from './abi/gateway.json';

export interface GatewayConfig {
  contractAddress: string
  provider?: HttpProvider
  rpcUrl?: string
  privateKey?: string
}

export class Gateway {
  private web3: Web3
  private contract: Contract
  public accountAddress: string

  constructor(config: GatewayConfig) {
    const {
      provider,
      rpcUrl,
      contractAddress,
      privateKey
    } = config

    if(!provider && !rpcUrl) {
      throw new Error('You need to specify rpcUrl or provider')
    }
    this.web3 = new Web3(provider || rpcUrl)

    this.contract = new this.web3.eth.Contract(
      d1dcv2ABI as AbiItem[],
      contractAddress
    );

    if(privateKey) {
      const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      this.web3.eth.accounts.wallet.add(account);
      this.setAccountAddress(account.address)
    }
  }

  public setAccountAddress (address: string) {
    this.accountAddress = address
  }

  public getPrice(name: string, to: string) {
    return this.contract.methods
      .getPrice(name, to)
      .call()
  }
}
