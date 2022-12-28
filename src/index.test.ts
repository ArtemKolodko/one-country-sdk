import Web3 from 'web3'
import * as dotenv from 'dotenv'
import {describe, expect, test} from '@jest/globals';
import {OneCountry} from '../src';

dotenv.config()

// TESTNET https://explorer.pops.one/
const NODE_URL = 'https://api.s0.b.hmny.io'
const CONTRACT_ADDRESS = '0x5A7c77B898bd5F554888FEc4AB4c22f52F66Ed24'
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

const getRandomArbitrary = (min = 0, max = 10000) => Math.round(Math.random() * (max - min) + min);

let oneCountry: OneCountry;
const RentDomain = 'all_' + getRandomArbitrary()
const RentDomain2 = RentDomain + '_2'

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

  test('Check random record', async () => {
    const record = await oneCountry.getRecordByName('all_' + getRandomArbitrary())
    expect(record.renter).toBe(null);
    expect(record.url.length).toBe(0);
    expect(record.lastPrice.amount).toBe('0');
  });

  test('Rent domain', async () => {
    const name = RentDomain
    const price = await oneCountry.getPriceByName(name)
    const tx = await oneCountry.rent(name, 'https://twitter.com/halfin/status/1072874040', price)
    expect(typeof tx.blockNumber).toBe('number');
    expect(typeof tx.transactionHash).toBe('string');
  });

  test('Check rented record', async () => {
    const record = await oneCountry.getRecordByName(RentDomain)
    expect(record.renter.length).toBeGreaterThan(0);
    expect(record.url.length).toBeGreaterThan(0);
    expect(+record.lastPrice.amount).toBeGreaterThan(0);
  });

  test('Change existing url', async () => {
    const name = RentDomain
    const tx = await oneCountry.updateURL(name, 'https://twitter.com/halfin/status/321214052')
    expect(typeof tx.blockNumber).toBe('number');
    expect(typeof tx.transactionHash).toBe('string');
  });

  test('Rent another domain', async () => {
    const name = RentDomain2
    const price = await oneCountry.getPriceByName(name)
    const tx = await oneCountry.rent(name, 'https://twitter.com/halfin/status/1072874040', price)
    expect(typeof tx.blockNumber).toBe('number');
    expect(typeof tx.transactionHash).toBe('string');
  });

  test('Set reverse name lookup for renter', async () => {
    const tx = await oneCountry.setNameForRenter(RentDomain2)
    expect(typeof tx.blockNumber).toBe('number');
    expect(typeof tx.transactionHash).toBe('string');
  });

  test('Check reverse name lookup', async () => {
    const name = await oneCountry.getNameForRenter()
    expect(name).toBe(RentDomain2);
  });

  test('Check reverse name lookup for random address (should be empty)', async () => {
    const web3 = new Web3()
    const account = web3.eth.accounts.create()
    const name = await oneCountry.getNameForRenter(account.address)
    expect(name).toBe('');
  });
});
