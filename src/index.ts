import Web3 from 'web3'
import {AbiItem} from 'web3-utils'
import {Contract} from 'web3-eth-contract';
import { BN } from 'bn.js';
// @ts-ignore
import d1dc from './abi/d1dc.json';
import {HttpProvider} from "web3-core";

const NullAddress = '0x0000000000000000000000000000000000000000'

export interface OneCountryConfig {
  contractAddress: string
  provider: HttpProvider
  privateKey?: string // for use on server-side
}

export class OneCountry {
  private web3: Web3
  private contract: Contract
  protected accountAddress = ''

  constructor(config: OneCountryConfig) {
    const {provider, contractAddress, privateKey} = config

    this.web3 = new Web3(provider)
    this.contract = new this.web3.eth.Contract(
        d1dc.abi as AbiItem[],
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

  public async getPriceByName (name: string): Promise<string> {
    const nameBytes = Web3.utils.keccak256(name)
    return await this.contract.methods
        .getPrice(nameBytes)
        .call()
  }

  public async getRecordByName (name: string) {
    const nameBytes = Web3.utils.keccak256(name)
    const result = await this.contract.methods
        .nameRecords(nameBytes)
        .call()

    const [renter, timeUpdated, lastPrice, url, prev, next] = Object.keys(result).map(k => result[k])

    return {
      renter: renter === NullAddress ? null : renter,
      lastPrice: {
        amount: lastPrice,
        formatted: Web3.utils.fromWei(lastPrice)
      },
      timeUpdated: new BN(timeUpdated).toNumber() * 1000,
      url,
      prev,
      next
    }
  }

  public async rent (name: string, url: string, price: string) {
    const callObj = { value: price, from: this.accountAddress }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.rent(name, url).estimateGas(callObj);

    const tx = await this.contract.methods
        .rent(name, url)
        .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }

  public async updateURL (name: string, url: string) {
    const callObj = { from: this.accountAddress }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.updateURL(name, url).estimateGas(callObj);

    const tx = await this.contract.methods
        .updateURL(name, url)
        .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }

  public async setNameForRenter (name: string) {
    const callObj = { from: this.accountAddress }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.setNameForRenter(name).estimateGas(callObj);

    const tx = await this.contract.methods
        .setNameForRenter(name)
        .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }

  public async getNameForRenter (address?: string): Promise<string> {
    const lookupAddress = address || this.accountAddress
    if(!lookupAddress) {
      throw new Error('Missing address')
    }
    const name = await this.contract.methods
        .nameOf(lookupAddress)
        .call()
    return name
  }
}
