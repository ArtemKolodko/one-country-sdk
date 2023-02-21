import * as dotenv from 'dotenv'
import {describe, expect, test} from '@jest/globals';
import {Gateway} from "./index";

dotenv.config()

const privateKey = process.env.PRIVATE_KEY || ''
const contractAddress = ''
const waitTimeout = 10000

let gateway: Gateway;

beforeAll(() => {
  gateway = new Gateway({ contractAddress, privateKey })
  console.log('Test account address: ', gateway.accountAddress)
})

describe('Gateway', () => {
  test('Check rental price', async () => {
    const price = await gateway.getPrice('artem', '0x95D02e967Dd2D2B1839347e0B84E59136b11A073')
    expect(price).toBe('100000000000000000000')
  }, waitTimeout);
});
