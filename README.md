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

### Usage

#### getPriceByName
```javascript
const price = oneCountry.getPriceByName('artem')
```

#### getRecordByName
```javascript
const record = oneCountry.getRecordByName('artem')
```

#### rent
```javascript
const price = getPriceByName('artem')
const tx = await oneCountry.rent('artem', 'https://twitter.com/halfin/status/1072874040', price)
```

#### updateURL
```javascript
const tx = await oneCountry.updateURL('artem', 'https://twitter.com/halfin/status/321214052')
```

#### setNameForRenter
```javascript
// Assign provided name with account address
const tx = await oneCountry.setNameForRenter('artem')
```

#### getNameForRenter
```javascript
// Address param is optional
// If oneContry was initialized using Metamask provider or privateKey, user account address will be used by default. 
const name = await oneCountry.getNameForRenter('0x726A7a5403c9C1F49f72789794358A2FfdacCA85')
```

### Testing

```javascript
npm run test
```

#### Testnet contracts
```javascript
deploying "NameResolver" (tx: 0xb1b4bb92d898f7dd6ef65f2011ecf539aa2b7068a62fbcd77f4b6210049b69d3)...: deployed at 0xDC797b13Dad4Be96A4bd835232baC6978E1f1a9b with 825365 gas
deploying "D1DC" (tx: 0x67d8d3513ddc48c90184339d23722c5ebad54bbc9677d214ce484a6561cb1849)...: deployed at 0x1018A301Aff4A41e4F190ED2599650358dcC02B8 with 3202726 gas
D1DC address: 0x1018A301Aff4A41e4F190ED2599650358dcC02B8
Set nameResolver manager to d1dc (0x1018A301Aff4A41e4F190ED2599650358dcC02B8)
Set d1dc default resolver to nameResolver (0xDC797b13Dad4Be96A4bd835232baC6978E1f1a9b)
D1DC finished initialization
```
