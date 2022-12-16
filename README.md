## one-country-sdk

The web3 library to interact with [http://1.country/](http://1.country/) smart contract

### Installation
```shell
npm i one-country-sdk --save
```

### Getting Started
#### Browser with Metamask
```shell
import detectEthereumProvider from '@metamask/detect-provider'
import { OneCountry } from 'one-country-sdk'

const provider = await detectEthereumProvider()
const oneCountry = new OneCountry({ provider, contractAddress: '0xE4C0C8241c5D9F00459517CC7206b5578eE22083' })

const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' })
oneCountry.setAccountAddress(address)

const price = await oneCountry.getPriceByName('all')
```

#### Browser - read only
```shell
import Web3 from 'web3'
import { OneCountry } from 'one-country-sdk'

const provider = new Web3.providers.HttpProvider('https://api.s0.b.hmny.io')
const oneCountry = new OneCountry({ provider, contractAddress: '0xE4C0C8241c5D9F00459517CC7206b5578eE22083' })
const price = await oneCountry.getPriceByName('all')
```

#### Node.js - read and write
```shell
import Web3 from 'web3'
import { OneCountry } from 'one-country-sdk'

const provider = new Web3.providers.HttpProvider('https://api.s0.b.hmny.io')
const oneCountry = new OneCountry({ provider, contractAddress: '0xE4C0C8241c5D9F00459517CC7206b5578eE22083', privateKey: PRIVATE_KEY })
const price = await oneCountry.getPriceByName('all')
```

### OneCountry public methods

#### `getPriceByName(name: string) => Promise<string>`
#### `getRecordByName(name: string) => Promise<OneCountryRecord>`
#### `rent(name: string, url: string) => Promise<EthTransaction>`
#### `updateURL(name: string, url: string) => Promise<EthTransaction>`
