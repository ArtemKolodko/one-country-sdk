import Web3 from 'web3'
import {AbiItem} from 'web3-utils'
import {Contract} from 'web3-eth-contract';
import { BN } from 'bn.js';
import {HttpProvider} from "web3-core";
// @ts-ignore
import d1dcv2ABI from './abi/d1dcv2.json';
// @ts-ignore
import vanityABI from './abi/vanityUrl.json';
// @ts-ignore
import shortReelsVideosABI from './abi/shortReelsVideos.json';

const NullAddress = '0x0000000000000000000000000000000000000000'

export interface OneCountryConfig {
  contractAddress: string
  vanityUrlContractAddress?: string
  shortReelsVideosContractAddress?: string
  provider: HttpProvider
  privateKey?: string // for use on server-side
}

export class OneCountry {
  private web3: Web3
  private contract: Contract
  private vanityUrlContract: Contract
  private shortReelsVideosContract: Contract
  public accountAddress = ''

  constructor(config: OneCountryConfig) {
    const {
      provider,
      contractAddress,
      vanityUrlContractAddress = '',
      shortReelsVideosContractAddress = '',
      privateKey
    } = config

    this.web3 = new Web3(provider)

    this.contract = new this.web3.eth.Contract(
      d1dcv2ABI as AbiItem[],
        contractAddress
    );

    this.vanityUrlContract = new this.web3.eth.Contract(
      vanityABI as AbiItem[],
      vanityUrlContractAddress
    );

    this.shortReelsVideosContract = new this.web3.eth.Contract(
      shortReelsVideosABI as AbiItem[],
      shortReelsVideosContractAddress
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

  public async rent (name: string, url: string, price: string, telegram: string, email: string, phone: string) {
    const callObj = { value: price, from: this.accountAddress }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.rent(name, url, telegram, email, phone).estimateGas(callObj);

    const tx = await this.contract.methods
        .rent(name, url, telegram, email, phone)
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

  public async safeTransferFrom(from: string, to: string, name: string) {
    const callObj = { from: this.accountAddress }

    const tokenId = Web3.utils.keccak256(name)

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.safeTransferFrom(from, to, tokenId).estimateGas(callObj);

    const tx = await this.contract.methods
      .safeTransferFrom(from, to, tokenId)
      .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }

  public getUrlUpdatePrice() {
    return this.vanityUrlContract.methods.urlUpdatePrice().call()
  }

  public async getVanityUrlPrice(name: string, alias: string) {
    const nameBytes = Web3.utils.keccak256(name)
    const price = await this.vanityUrlContract.methods.vanityURLPrices(nameBytes, alias).call()
    return (+price * Math.pow(10, 18)).toString()
  }
  public async setNewURL (pageName: string, alias: string, url: string, price: number) {
    const callObj = { from: this.accountAddress, value: price }

    const priceOne = price / Math.pow(10, 18);
    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.vanityUrlContract.methods
      .setNewURL(pageName, alias, url, priceOne)
      .estimateGas(callObj);

    const tx = await this.vanityUrlContract.methods
      .setNewURL(pageName, alias, url, priceOne)
      .send({ ...callObj, gasPrice, gas: gasEstimate })
    return tx
  }

  public async payForVanityURLAccessFor(userAddress: string, name: string, aliasName: string, amount: number, paidAt: number) {
    const callObj = { from: this.accountAddress, value: amount }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.shortReelsVideosContract.methods
      .payForVanityURLAccessFor(userAddress, name, aliasName, paidAt)
      .estimateGas(callObj);

    const tx = await this.shortReelsVideosContract.methods
      .payForVanityURLAccessFor(userAddress, name, aliasName, paidAt)
      .send({ ...callObj, gasPrice, gas: gasEstimate })
    return tx
  }

  public async sendDonationFor(userAddress: string, name: string, aliasName: string, amount: number) {
    const callObj = { from: this.accountAddress, value: amount }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.shortReelsVideosContract.methods
      .sendDonationFor(userAddress, name, aliasName)
      .estimateGas(callObj);

    const tx = await this.shortReelsVideosContract.methods
      .sendDonationFor(userAddress, name, aliasName)
      .send({ ...callObj, gasPrice, gas: gasEstimate })
    return tx
  }
}
