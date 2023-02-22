import * as dotenv from 'dotenv'
import {describe, expect, test} from '@jest/globals';
import {DC} from "./index";

dotenv.config()

const privateKey = process.env.PRIVATE_KEY || ''
const contractAddress = '0x3C84F4690De96a0428Bc6777f5aA5f5a92150Ef2'
const waitTimeout = 10000

let dc: DC;

beforeAll(() => {
  dc = new DC({ contractAddress, privateKey })
  console.log('Test account address: ', dc.accountAddress)
})

describe('DC', () => {
  test('Is name available', async () => {
    const isAvailable = await dc.isAvailable('artem')
    expect(isAvailable).toBe(false)
  }, waitTimeout);

  test('Get record', async () => {
    const record = await dc.getRecord('artem')
    expect(record.renter).toContain('0x')
  }, waitTimeout);

  test('Get price', async () => {
    const price = await dc.getPrice('artem123')
    expect(typeof price.amount).toBe('string')
    expect(+price.formatted).toBeGreaterThan(0)
  }, waitTimeout);

  test('Get params', async () => {
    const params = await dc.getParameters()
    expect(params.baseRentalPrice.amount).toBe('10000000000000000000')
    expect(typeof params.duration).toBe('number')
    expect(typeof params.lastRented).toBe('string')
  }, waitTimeout);

  test('Get reinstate cost', async () => {
    const cost = await dc.getReinstateCost('artem')
    expect(+cost).toBeGreaterThanOrEqual(0)
  });

  test('Reinstate', async () => {
    const tx = await dc.reinstate('artem', '10000')
    expect(tx.transactionHash).toContain('0x')
  }, waitTimeout);

  test('Get num urls', async () => {
    const num = await dc.getNumUrls('artem')
    expect(+num).toBeGreaterThanOrEqual(0)
  }, waitTimeout);
});
