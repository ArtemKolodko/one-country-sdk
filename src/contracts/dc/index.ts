import {OneCountryBase, OneCountryConfig} from "../../base";
import {Contract} from "web3-eth-contract";
import {AbiItem} from "web3-utils";
import Web3 from "web3";
import ABI from './abi'
import {BN} from "bn.js";

export class DC extends OneCountryBase {
  private contract: Contract

  constructor(config: OneCountryConfig) {
    super(config)
    this.contract = new this.web3.eth.Contract(
      ABI as AbiItem[],
      config.contractAddress
    );
  }

  public getBaseRentalPrice() {
    return this.contract.methods.baseRentalPrice().call()
  }

  public getDuration() {
    return this.contract.methods.duration().call()
  }

  public getLastRented() {
    return this.contract.methods.lastRented().call()
  }

  public async getParameters() {
    const [baseRentalPrice, duration, lastRented] = await Promise.all([
      this.getBaseRentalPrice(),
      this.getDuration(),
      this.getLastRented()
    ])

    return {
      baseRentalPrice: {
        amount: new BN(baseRentalPrice).toString(),
        formatted: this.web3.utils.fromWei(baseRentalPrice)
      },
      duration: new BN(duration).toNumber() * 1000,
      lastRented,
    }
  }

  public async getPrice(name: string) {
    const price = await this.contract.methods.getPrice(name).call()
    const amount = new BN(price).toString()
    return {
      amount,
      formatted: this.web3.utils.fromWei(amount)
    }
  }

  public async register(name: string, url: string, secret: string, amount: string) {
    const secretHash = Web3.utils.keccak256(secret)
    const callObj = { from: this.accountAddress, value: amount }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.register(name, url, secretHash).estimateGas(callObj);

    const tx = await this.contract.methods
      .register(name, url, secretHash)
      .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }

  public async commit(name: string, secret: string, amount: string) {
    const secretHash = Web3.utils.keccak256(secret)
    const callObj = { from: this.accountAddress }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.commit(name, secretHash).estimateGas(callObj);

    const tx = await this.contract.methods
      .commit(name, secretHash)
      .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }

  public async updateURL(name: string, url: string) {
    const callObj = { from: this.accountAddress }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.updateURL(name, url).estimateGas(callObj);

    const tx = await this.contract.methods
      .updateURL(name, url)
      .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }
}
