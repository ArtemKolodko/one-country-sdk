import * as dotenv from 'dotenv'
import {describe, expect, test} from '@jest/globals';
import {DCEns} from "./index";

dotenv.config()

const privateKey = process.env.PRIVATE_KEY || ''
const contractAddress = '0x547942748Cc8840FEc23daFdD01E6457379B446D'
const waitTimeout = 60000
let dc: DCEns;

const secret = Math.random().toString(26).slice(2)
const domainName = 'domainname' + secret

beforeAll(() => {
  dc = new DCEns({ contractAddress, privateKey })
  console.log('Test account address: ', dc.accountAddress)
})

describe('DC-ENS', () => {
  test('Is name available', async () => {
    const isAvailable = await dc.isAvailable('artem')
    expect(isAvailable).toBe(false)
  }, waitTimeout);

  test('Get record', async () => {
    const record = await dc.getRecord('artemartem')
    expect(record.renter).toContain('0x')
    expect(record.rentTime).toBeGreaterThan(0)
    expect(record.expirationTime).toBeGreaterThan(0)
  }, waitTimeout);

  test('Get price', async () => {
    const price = await dc.getPrice('artem123')
    expect(typeof price.amount).toBe('string')
    expect(+price.formatted).toBeGreaterThan(0)
  }, waitTimeout);

  test('Commit and register', async () => {
    const commitment = await dc.makeCommitment(domainName, '0x95D02e967Dd2D2B1839347e0B84E59136b11A073', secret)
    console.log('commitment', commitment)
    const tx = await dc.commit(commitment)
    await new Promise(resolve => setTimeout(resolve, 5000))
    const registerTx = await dc.register(domainName, '0x95D02e967Dd2D2B1839347e0B84E59136b11A073', secret)
    expect(tx.transactionHash).toContain('0x')
    expect(registerTx.transactionHash).toContain('0x')
  }, waitTimeout);
});
