# one-country-sdk

The web3 library to interact with [http://1.country/](http://1.country/) smart contract

## Installation
```shell
npm i one-country-sdk --save
```

## Getting Started
### Using Metamask provider
```shell
import detectEthereumProvider from '@metamask/detect-provider'
import { OneCountry } from 'one-country-sdk'

const provider = await detectEthereumProvider()
const oneCountry = new OneCountry({ provider, contractAddress: '0xE4C0C8241c5D9F00459517CC7206b5578eE22083' })

const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' })
oneCountry.setAccountAddress(address)

const price = await oneCountry.getPriceByName('all')
```

### Read only
```shell
import Web3 from 'web3'
import { OneCountry } from 'one-country-sdk'

const provider = new Web3.providers.HttpProvider('https://api.s0.b.hmny.io')
const oneCountry = new OneCountry({ provider, contractAddress: '0xE4C0C8241c5D9F00459517CC7206b5578eE22083' })
const price = await oneCountry.getPriceByName('all')
```

### Using private key: read and write
```shell
import Web3 from 'web3'
import { OneCountry } from 'one-country-sdk'

const provider = new Web3.providers.HttpProvider('https://api.s0.b.hmny.io')
const oneCountry = new OneCountry({ provider, contractAddress: '0xE4C0C8241c5D9F00459517CC7206b5578eE22083', privateKey: PRIVATE_KEY })
const price = await oneCountry.getPriceByName('all')
```

## Usage

### OneCountry methods:
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

### Vanity URL methods:
#### getUrlUpdatePrice
```javascript
const price = await oneCountry.getUrlUpdatePrice()
```

#### setNewURL
```javascript
const tx = await oneCountry.setNewURL('artem', 'someAlias', 'https://twitter.com', 1000000000000000000)
```

#### getVanityUrlPrice
```javascript
const price = await oneCountry.getVanityUrlPrice('artem', 'someAlias')
```

### Short reels videos methods:
#### payForVanityURLAccessFor
```javascript
const tx = await oneCountry.payForVanityURLAccessFor('0x95D02e967Dd2D2B1839347e0B84E59136b11A073', 'artem', 'someAlias', 1, 12345)
```

#### sendDonationFor
```javascript
const tx = await oneCountry.sendDonationFor('0x95D02e967Dd2D2B1839347e0B84E59136b11A073', 'artem', 'someAlias', 1)
```

### Testing
1) Create new `.env` file in root directory, add line with private key
```shell
PRIVATE_KEY=12345
```
2) Run test script
```javascript
npm run test
```

### Mainnet contracts
```
ShortsReelsVideo: 0x3a6843f2AbC3CA960845108908Eae8D9d9CE058D
D1DCV2: 0x3cC3C5F98AC3FF544279919DfceBfb7aFe03A2cA
VanityURL: 0x88a1afC4134f385337Dd5F530D452079fC9E14CC
```
