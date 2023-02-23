import {OneCountryBase, OneCountryConfig} from "../../base";
import {Contract} from "web3-eth-contract";
import {AbiItem} from "web3-utils";
import Web3 from "web3";
// @ts-ignore
import ABI from './abi.json'

export class VanityUrl extends OneCountryBase {
  protected contract: Contract

  constructor(config: OneCountryConfig) {
    super(config);
    this.contract = new this.web3.eth.Contract(
      ABI as AbiItem[],
      config.contractAddress
    );
  }

  public getUrlUpdatePrice() {
    return this.contract.methods.urlUpdatePrice().call()
  }

  public getNameOwner(name: string): Promise<string> {
    return this.contract.methods.getNameOwner(name).call()
  }

  public getAddressRegistry(): Promise<string> {
    return this.contract.methods.addressRegistry().call()
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

