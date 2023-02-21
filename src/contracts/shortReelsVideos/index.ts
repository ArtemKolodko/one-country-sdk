import {OneCountryBase, OneCountryConfig} from "../../base";
import {Contract} from "web3-eth-contract";
import {AbiItem} from "web3-utils";
// @ts-ignore
import ABI from './abi.json'

export class ShortReelsVideos extends OneCountryBase {
  protected contract: Contract

  constructor(config: OneCountryConfig) {
    super(config)
    this.contract = new this.web3.eth.Contract(
      ABI as AbiItem[],
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
