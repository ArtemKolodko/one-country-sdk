import Web3 from 'web3'
import {AbiItem} from 'web3-utils'
import { vanityUrlABI } from './abi'
import {OneCountryBase, OneCountryConfig} from "./oneCountryBase";

export default class VanityUrl extends OneCountryBase {
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
