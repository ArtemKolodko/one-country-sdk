import * as dotenv from 'dotenv'
import {describe, expect, test} from '@jest/globals';
import { ShortReelsVideos } from "./index";

dotenv.config()

const privateKey = process.env.PRIVATE_KEY || ''
let shortReelsVideos: ShortReelsVideos;

const waitTimeout = 10000
const domainName = 'sdk_test'
const aliasName = 'sdk_test_alias'
const vanityUrlPrice = '1000000000000000000'

beforeAll(() => {
  shortReelsVideos = new ShortReelsVideos({ contractAddress: '0x3a6843f2AbC3CA960845108908Eae8D9d9CE058D', privateKey })
  console.log('Test account address: ', shortReelsVideos.accountAddress)
})

describe('Short reels videos', () => {
  test('Pay for vanity url access', async () => {
    const tx = await shortReelsVideos.payForVanityURLAccessFor('0x95D02e967Dd2D2B1839347e0B84E59136b11A073', domainName, aliasName, vanityUrlPrice, 12345)
    expect(typeof tx.transactionHash).toBe('string')
  }, waitTimeout);

  test('Send donation for', async () => {
    const tx = await shortReelsVideos.sendDonationFor('0x95D02e967Dd2D2B1839347e0B84E59136b11A073', domainName, aliasName, vanityUrlPrice)
    expect(typeof tx.transactionHash).toBe('string')
  }, waitTimeout);
});
