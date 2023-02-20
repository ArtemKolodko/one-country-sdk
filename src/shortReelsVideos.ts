import {AbiItem} from 'web3-utils'
import { shortReelsVideosABI } from './abi'
import {OneCountryBase, OneCountryConfig} from "./oneCountryBase";

export default class ShortReelsVideos extends OneCountryBase {
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
