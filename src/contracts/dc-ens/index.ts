import {NullAddress, OneCountryBase, OneCountryConfig} from "../../base";
import {Contract} from "web3-eth-contract";
import {AbiItem} from "web3-utils";
import Web3 from "web3";
import ABI from './abi'
import {BN} from "bn.js";

export class DCEns extends OneCountryBase {
  private contract: Contract

  constructor(config: OneCountryConfig) {
    super(config)
    this.contract = new this.web3.eth.Contract(
      ABI as AbiItem[],
      config.contractAddress
    );
  }

  public isAvailable(name: string) {
    return this.contract.methods.available(name).call()
  }

  public duration() {
    return this.contract.methods.duration().call()
  }

  public nameExpires(name: string) {
    return this.contract.methods.nameExpires(name).call()
  }

  public ownerOf(name: string) {
    return this.contract.methods.ownerOf(name).call()
  }

  public async getPrice(name: string) {
    const price = await this.contract.methods.getPrice(name).call()
    const amount = new BN(price).toString()
    return {
      amount,
      formatted: this.web3.utils.fromWei(amount)
    }
  }

  public async getRecord(name: string) {
    let ownerAddress = ''
    try {
      ownerAddress = await this.ownerOf(name)
    } catch (e) {}
    const rentTime = await this.duration()
    const expirationTime = await this.nameExpires(name)

    return {
      renter: ownerAddress || null,
      rentTime: new BN(rentTime).toNumber() * 1000,
      expirationTime: new BN(expirationTime).toNumber() * 1000,
    }
  }

  public async register(name: string, owner: string, secret: string, _amount?: string) {
    const amount = _amount || (await this.getPrice(name)).amount

    const callObj = { from: this.accountAddress, value: amount }
    const secretHash = Web3.utils.keccak256(secret)

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods
      .register(name, owner, secretHash)
      .estimateGas(callObj);

    const tx = await this.contract.methods
      .register(name, owner, secretHash)
      .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }

  public async renew(name: string, url: string, amount: string) {
    const callObj = { from: this.accountAddress, value: amount }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods
      .renew(name, url)
      .estimateGas(callObj);

    const tx = await this.contract.methods
      .renew(name, url)
      .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }

  public makeCommitment(name: string, address: string, secret: string) {
    const secretHash = Web3.utils.keccak256(secret)
    return this.contract.methods.makeCommitment(name, address, secretHash).call()
  }

  public async commit(commitment: string) {
    const callObj = { from: this.accountAddress }

    const gasPrice = await this.web3.eth.getGasPrice();
    const gasEstimate = await this.contract.methods.commit(commitment).estimateGas(callObj);

    const tx = await this.contract.methods
      .commit(commitment)
      .send({ ...callObj, gasPrice: gasPrice, gas: gasEstimate })
    return tx
  }
}
