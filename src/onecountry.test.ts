import Web3 from 'web3'
import * as dotenv from 'dotenv'
import {describe, expect, test} from '@jest/globals';
import {OneCountry} from '../src';
import {getRandomNumber} from "./utils";

dotenv.config()

const privateKey = process.env.PRIVATE_KEY || ''

// Testnet https://explorer.pops.one/
// const rpcUrl = 'https://api.s0.b.hmny.io'
// const contractAddress = '0x1018A301Aff4A41e4F190ED2599650358dcC02B8'

// Mainnet
const rpcUrl = 'https://api.harmony.one'
const contractAddress = '0x3cC3C5F98AC3FF544279919DfceBfb7aFe03A2cA'
const vanityUrlContractAddress = '0x88a1afC4134f385337Dd5F530D452079fC9E14CC'
const shortReelsVideosContractAddress = '0x3a6843f2AbC3CA960845108908Eae8D9d9CE058D'

const waitTimeout = 10000

let oneCountry: OneCountry;
const domainName = 'sdk_test'
const aliasName = 'sdk_test_alias'
const linkUrl = 'https://twitter.com/halfin/status/1072874040'

const expectedRentPrice = '100000000000000000000'
const changeUrlPrice = '1000000000000000000'
const vanityUrlPrice = '1000000000000000000'

beforeAll(() => {
  const provider = new Web3.providers.HttpProvider(rpcUrl)
  oneCountry = new OneCountry({ provider, contractAddress, vanityUrlContractAddress, shortReelsVideosContractAddress, privateKey })
  console.log('Test account address: ', oneCountry.accountAddress)
})

describe('One Country', () => {
  test('Check rental price', async () => {
    const price = await oneCountry.getPriceByName(domainName)
    expect(price).toBe(expectedRentPrice)
  });

  test('Check record by name', async () => {
    const price = await oneCountry.getRecordByName('artem')
    expect(price.renter).toContain('0x')
  });

  test('Rent domain', async () => {
    const tx = await oneCountry.rent(domainName, linkUrl, expectedRentPrice, 'test_telegram', 'testemail@test.com', '123123123')
    expect(typeof tx.transactionHash).toBe('string');

    // await new Promise(resolve => setTimeout(resolve, 5000))
    //
    // const transferTx = await oneCountry.safeTransferFrom(oneCountry.accountAddress, '0x199177Bcc7cdB22eC10E3A2DA888c7811275fc38', domainName)
    // expect(typeof transferTx.transactionHash).toBe('string');
  }, waitTimeout);
});

describe('Vanity URL', () => {
  test('Check url update price', async () => {
    const price = await oneCountry.getUrlUpdatePrice()
    expect(price).toBe(changeUrlPrice)
  });

  test('Set new url', async () => {
    const tx = await oneCountry.setNewURL(domainName, aliasName, linkUrl, changeUrlPrice)
    expect(typeof tx.transactionHash).toBe('string')
  }, waitTimeout);

  test('Get random vanity url price', async () => {
    const price = await oneCountry.getVanityUrlPrice(domainName, 'test_' + getRandomNumber())
    expect(price).toBe('0')
  });

  test('Get existed vanity url price', async () => {
    const price = await oneCountry.getVanityUrlPrice(domainName, aliasName)
    expect(price).toBe(vanityUrlPrice)
  });
});

describe('Short reels videos', () => {
  test('Pay for vanity url access', async () => {
    const tx = await oneCountry.payForVanityURLAccessFor('0x95D02e967Dd2D2B1839347e0B84E59136b11A073', domainName, aliasName, vanityUrlPrice, 12345)
    expect(typeof tx.transactionHash).toBe('string')
  }, waitTimeout);

  test('Send donation for', async () => {
    const tx = await oneCountry.sendDonationFor('0x95D02e967Dd2D2B1839347e0B84E59136b11A073', domainName, aliasName, vanityUrlPrice)
    expect(typeof tx.transactionHash).toBe('string')
  }, waitTimeout);
});
