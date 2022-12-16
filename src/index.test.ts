import Web3 from 'web3'
import * as dotenv from 'dotenv'
import {describe, expect, test} from '@jest/globals';
import {OneCountry} from '../src';

dotenv.config()

// Testnet
const NODE_URL = 'https://api.s0.b.hmny.io'
const CONTRACT_ADDRESS = '0xE4C0C8241c5D9F00459517CC7206b5578eE22083'
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

let oneCountry: OneCountry;

const getRandomArbitrary = (min = 0, max = 10000) => Math.random() * (max - min) + min;

beforeAll(() => {
  const provider = new Web3.providers.HttpProvider(NODE_URL)
  oneCountry = new OneCountry({ provider, contractAddress: CONTRACT_ADDRESS, privateKey: PRIVATE_KEY })
})

describe('One Country', () => {
  test('Test rental price', async () => {
    const price = await oneCountry.getPriceByName('test123456')
    expect(price).toBe('1000000000000000000');
  });

  test('Check empty record', async () => {
    const record = await oneCountry.getRecordByName('test' + + getRandomArbitrary())
    expect(record.renter).toBe(null);
    expect(record.url).toBe('');
  });

  test('Check existed record', async () => {
    const record = await oneCountry.getRecordByName('all')
    expect(typeof record.renter).toBe('string');
    expect(record.url.length).toBeGreaterThanOrEqual(1);
  });

  test('Rent domain', async () => {
    const name = 'all' + getRandomArbitrary()
    const price = await oneCountry.getPriceByName(name)
    const tx = await oneCountry.rent(name, 'https://twitter.com/halfin/status/1072874040', price)
    expect(typeof tx.blockNumber).toBe('number');
    expect(typeof tx.transactionHash).toBe('string');
  });

  test('Change existing url', async () => {
    const name = 'all'
    const tx = await oneCountry.updateURL(name, 'https://twitter.com/halfin/status/321214052')
    expect(typeof tx.blockNumber).toBe('number');
    expect(typeof tx.transactionHash).toBe('string');
  });
});
