import Web3 from 'web3'
import * as dotenv from 'dotenv'
import {describe, expect, test} from '@jest/globals';
import {OneCountry} from '../src';

dotenv.config()

// TESTNET https://explorer.pops.one/
const nodeUrl = 'https://api.harmony.one'
const contractAddress = '0x3cC3C5F98AC3FF544279919DfceBfb7aFe03A2cA'
const privateKey = process.env.PRIVATE_KEY || ''

const getRandomArbitrary = (min = 0, max = 10000) => Math.round(Math.random() * (max - min) + min);

let oneCountry: OneCountry;
const RentDomain = 'all' + getRandomArbitrary()

beforeAll(() => {
  const provider = new Web3.providers.HttpProvider(nodeUrl)
  oneCountry = new OneCountry({ provider, contractAddress, privateKey })
})

describe('One Country V2', () => {
  test('Check price', async () => {
    const price = await oneCountry.getPriceByName(RentDomain)
    expect(price).toBe('1000000000000000000')
  });

  test('Rent domain and transfer it to another address', async () => {
    const name = RentDomain
    const tx = await oneCountry.rent(name, 'https://twitter.com/halfin/status/1072874040', '1000000000000000000', 'artemcode', 'temakolodko@test.com', '123123123')
    expect(typeof tx.transactionHash).toBe('string');

    await new Promise(resolve => setTimeout(resolve, 5000))

    const nameBytes = Web3.utils.keccak256(RentDomain)
    const transferTx = await oneCountry.safeTransferFrom(oneCountry.accountAddress, '0x199177Bcc7cdB22eC10E3A2DA888c7811275fc38', nameBytes)
    expect(typeof transferTx.transactionHash).toBe('string');

  }, 60000);
});
