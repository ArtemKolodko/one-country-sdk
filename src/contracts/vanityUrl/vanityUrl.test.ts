import Web3 from 'web3'
import * as dotenv from 'dotenv'
import {describe, expect, test} from '@jest/globals';
import {getRandomNumber} from "../../base";
import { VanityUrl } from "./index";

dotenv.config()

const privateKey = process.env.PRIVATE_KEY || ''
const waitTimeout = 10000

let vanityUrl: VanityUrl;
const domainName = 'sdk_test'
const aliasName = 'sdk_test_alias'
const linkUrl = 'https://twitter.com/halfin/status/1072874040'

const changeUrlPrice = '1000000000000000000'
const vanityUrlPrice = '1000000000000000000'

beforeAll(() => {
  vanityUrl = new VanityUrl({ contractAddress: '0x88a1afC4134f385337Dd5F530D452079fC9E14CC', privateKey })
  console.log('Test account address: ', vanityUrl.accountAddress)
})

describe('Vanity URL', () => {
  test('Check url update price', async () => {
    const price = await vanityUrl.getUrlUpdatePrice()
    expect(price).toBe(changeUrlPrice)
  });

  test('Set new url', async () => {
    const tx = await vanityUrl.setNewURL(domainName, aliasName, linkUrl, changeUrlPrice)
    expect(typeof tx.transactionHash).toBe('string')
  }, waitTimeout);

  test('Get random vanity url price', async () => {
    const price = await vanityUrl.getVanityUrlPrice(domainName, 'test_' + getRandomNumber())
    expect(price).toBe('0')
  });

  test('Get existed vanity url price', async () => {
    const price = await vanityUrl.getVanityUrlPrice(domainName, aliasName)
    expect(price).toBe(vanityUrlPrice)
  });

  test('should return owner address', async () => {
    const address = await vanityUrl.getNameOwner(domainName)
    expect(typeof address).toBe('string')
  });

  test('should return registry address', async () => {
    const address = await vanityUrl.getAddressRegistry()
    expect(typeof address).toBe('string')
  });
});
