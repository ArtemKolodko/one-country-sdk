import {OneCountryBase, OneCountryConfig} from "../../base";
import {Contract} from "web3-eth-contract";
import {AbiItem} from "web3-utils";
import Web3 from "web3";
// @ts-ignore
import ABI from './abi.json'

export class Gateway extends OneCountryBase {
  private contract: Contract

  constructor(config: OneCountryConfig) {
    super(config)
    this.contract = new this.web3.eth.Contract(
      ABI as AbiItem[],
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
