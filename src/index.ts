import Web3 from 'web3'
import {AbiItem} from 'web3-utils'
import {Contract} from 'web3-eth-contract';
// @ts-ignore
import gatewayABI from './abi/gateway.json'
// @ts-ignore
import shortReelsVideosABI from './abi/shortReelsVideos.json'
// @ts-ignore
import d1dcv2ABI from './abi/d1dcv2.json'
// @ts-ignore
import vanityUrlABI from './abi/vanityUrl.json'
import {BN} from "bn.js";
import {HttpProvider} from "web3-core";

export const NullAddress = '0x0000000000000000000000000000000000000000'

export const getRandomNumber = (min = 0, max = 10000) => Math.round(Math.random() * (max - min) + min);

export interface OneCountryConfig {
  contractAddress: string;
  provider?: HttpProvider;
  rpcUrl?: string;
  privateKey?: string
}

export class OneCountryBase {
  protected web3: Web3
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

export class Gateway extends OneCountryBase {
  private contract: Contract

  constructor(config: OneCountryConfig) {
    super(config)
    this.contract = new this.web3.eth.Contract(
      gatewayABI as AbiItem[],
      config.contractAddress
    );
  }

  public getPrice(name: string, to: string) {
    return this.contract.methods
      .getPrice(name, to)
      .call()
  }

  public async rent(name: string, url: string, secret: string, to: string) {
    const secretBytes = Web3.utils.keccak256(secret)
    const callObj = { from: this.accountAddress }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.rent(name, url, secretBytes, to).estimateGas(callObj);

    const tx = await this.contract.methods
      .rent(name, url, secretBytes, to)
      .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }
}

export class OneCountry extends OneCountryBase {
  protected contract: Contract

  constructor(config: OneCountryConfig) {
    super(config)
    this.contract = new this.web3.eth.Contract(
      d1dcv2ABI as AbiItem[],
      config.contractAddress
    );
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
      .register(name, url, telegram, email, phone)
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
}

export class ShortReelsVideos extends OneCountryBase {
  protected contract: Contract

  constructor(config: OneCountryConfig) {
    super(config)
    this.contract = new this.web3.eth.Contract(
      shortReelsVideosABI as AbiItem[],
      config.contractAddress
    );
  }

  public async payForVanityURLAccessFor(userAddress: string, name: string, aliasName: string, amount: string, paidAt: number) {
    const value = Math.round(+amount / Math.pow(10, 18))
    const callObj = { from: this.accountAddress, value }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods
      .payForVanityURLAccessFor(userAddress, name, aliasName, paidAt)
      .estimateGas(callObj);

    const tx = await this.contract.methods
      .payForVanityURLAccessFor(userAddress, name, aliasName, paidAt)
      .send({ ...callObj, gasPrice, gas: gasEstimate })
    return tx
  }

  public async sendDonationFor(userAddress: string, name: string, aliasName: string, amount: string) {
    const value = Math.round(+amount / Math.pow(10, 18))
    const callObj = { from: this.accountAddress, value }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods
      .sendDonationFor(userAddress, name, aliasName)
      .estimateGas(callObj);

    const tx = await this.contract.methods
      .sendDonationFor(userAddress, name, aliasName)
      .send({ ...callObj, gasPrice, gas: gasEstimate })
    return tx
  }
}

export default class VanityUrl extends OneCountryBase {
  protected contract: Contract

  constructor(config: OneCountryConfig) {
    super(config);
    this.contract = new this.web3.eth.Contract(
      vanityUrlABI as AbiItem[],
      config.contractAddress
    );
  }

  public getUrlUpdatePrice() {
    return this.contract.methods.urlUpdatePrice().call()
  }

  public async getVanityUrlPrice(name: string, alias: string) {
    const nameBytes = Web3.utils.keccak256(name)
    const price = await this.contract.methods.vanityURLPrices(nameBytes, alias).call()
    return (+price * Math.pow(10, 18)).toString()
  }
  public async setNewURL (pageName: string, alias: string, url: string, price: string) {
    const callObj = { from: this.accountAddress, value: +price }

    const priceOne = +price / Math.pow(10, 18);
    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods
      .setNewURL(pageName, alias, url, priceOne)
      .estimateGas(callObj);

    const tx = await this.contract.methods
      .setNewURL(pageName, alias, url, priceOne)
      .send({ ...callObj, gasPrice, gas: gasEstimate })
    return tx
  }
}

