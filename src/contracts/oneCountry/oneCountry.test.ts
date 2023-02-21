import * as dotenv from 'dotenv'
import {describe, expect, test} from '@jest/globals';
import {getRandomNumber} from '../../base';
import { OneCountry } from './index'

dotenv.config()

const privateKey = process.env.PRIVATE_KEY || ''

let oneCountry: OneCountry;
const domainName = 'sdk_test' + getRandomNumber()
const aliasName = 'sdk_test_alias'
const linkUrl = 'https://twitter.com/halfin/status/1072874040'
const waitTimeout = 10000
const expectedRentPrice = '100000000000000000000'

beforeAll(() => {
  oneCountry = new OneCountry({ contractAddress: '0x3cC3C5F98AC3FF544279919DfceBfb7aFe03A2cA', privateKey })
  console.log('Test account address: ', oneCountry.accountAddress)
})

describe('One Country', () => {
  test('Check rental price', async () => {
    const price = await oneCountry.getPriceByName(domainName)
    expect(price).toBe(expectedRentPrice)
  });

  test('Get record by name', async () => {
    const record = await oneCountry.getRecordByName('artem')
    expect(record.renter).toContain('0x')
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
