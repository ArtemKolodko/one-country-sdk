import {OneCountryBase, OneCountryConfig, NullAddress} from "../../base";
import {Contract} from "web3-eth-contract";
import {AbiItem} from "web3-utils";
import Web3 from "web3";
import {BN} from "bn.js";
// @ts-ignore
import ABI from './abi.json'

export class OneCountry extends OneCountryBase {
  protected contract: Contract

  constructor(config: OneCountryConfig) {
    super(config)
    this.contract = new this.web3.eth.Contract(
      ABI as AbiItem[],
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
    const gasEstimate = await this.contract.methods.rent(url, url, telegram, email, phone).estimateGas(callObj);

    const tx = await this.contract.methods
      .rent(url, url, telegram, email, phone)
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

  public getBaseRegistrar(): Promise<string> {
    return this.contract.methods.baseRegistrar().call()
  }

  public getRegistrarController(): Promise<string> {
    return this.contract.methods.registrarController().call()
  }
}
