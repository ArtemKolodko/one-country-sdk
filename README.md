# one-country-sdk

Web3 library for [1.country](https://1.country/) [smart contract](https://github.com/harmony-one/.1.country) (Harmony One)

## Installing
```shell
npm i one-country-sdk --save
```

## Getting Started
### 1) Using Metamask provider
```shell
import detectEthereumProvider from '@metamask/detect-provider'
import { OneCountry } from 'one-country-sdk'

const provider = await detectEthereumProvider()
const oneCountry = new OneCountry({
  provider,
  contractAddress: '0x3C84F4690De96a0428Bc6777f5aA5f5a92150Ef2'
})
const [ address ] = await window.ethereum.request({ method: 'eth_requestAccounts' })
oneCountry.setAccountAddress(address)

const price = await oneCountry.getPriceByName('all')
```

### 2) Using private key (for backend apps)
```shell
const oneCountry = new OneCountry({
  contractAddress: '0x3C84F4690De96a0428Bc6777f5aA5f5a92150Ef2',
  privateKey: '12345'
})
const price = await oneCountry.getPriceByName('all')
```

### 3) No providers, read only
```shell
const oneCountry = new OneCountry({ contractAddress: '0x3C84F4690De96a0428Bc6777f5aA5f5a92150Ef2' })
const price = await oneCountry.getPriceByName('all')
```

## Configuration
```shell
const provider = await detectEthereumProvider()
const oneCountry = new OneCountry({ provider, contractAddress: '0x3C84F4690De96a0428Bc6777f5aA5f5a92150Ef2' })
const vanityUrl = new VanityUrl({ provider, contractAddress: '0x88a1afC4134f385337Dd5F530D452079fC9E14CC' })
const shortVideos = new ShortReelsVideos({ provider, contractAddress: '0x3a6843f2AbC3CA960845108908Eae8D9d9CE058D' })
```

### Options
```shell
export interface OneCountryConfig {
  contractAddress: string;
  provider?: HttpProvider;
  rpcUrl?: string;
  privateKey?: string
}
```

### OneCountry
#### Init
```shell
const provider = await detectEthereumProvider()
const oneCountry = new OneCountry({ contractAddress: '0x3C84F4690De96a0428Bc6777f5aA5f5a92150Ef2', provider })
```

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
const tx = await oneCountry.setNameForRenter('artem')
```

#### getNameForRenter
```javascript
const name = await oneCountry.getNameForRenter('0x726A7a5403c9C1F49f72789794358A2FfdacCA85')
```

### Vanity URL
#### Init
```shell
const provider = await detectEthereumProvider()
const vanityUrl = new VanityUrl({ contractAddress: '0x88a1afC4134f385337Dd5F530D452079fC9E14CC', provider })
```
#### getUrlUpdatePrice
```javascript
const price = await vanityUrl.getUrlUpdatePrice()
```

#### setNewURL
```javascript
const tx = await vanityUrl.setNewURL('artem', 'someAlias', 'https://twitter.com', '1000000000000000000')
```

#### getVanityUrlPrice
```javascript
const price = await vanityUrl.getVanityUrlPrice('artem', 'someAlias')
```

### Short reels videos
#### Init
```shell
const provider = await detectEthereumProvider()
const shortReelsVideos = new ShortReelsVideos({ contractAddress: '0x3a6843f2AbC3CA960845108908Eae8D9d9CE058D', provider })
```
#### payForVanityURLAccessFor
```javascript
const tx = await shortReelsVideos.payForVanityURLAccessFor('0x95D02e967Dd2D2B1839347e0B84E59136b11A073', 'artem', 'someAlias', '1000000000000000000', 12345)
```

#### sendDonationFor
```javascript
const tx = await shortReelsVideos.sendDonationFor('0x95D02e967Dd2D2B1839347e0B84E59136b11A073', 'artem', 'someAlias', '1000000000000000000')
```

### Testing
1) Create new `.env` file in root directory, add private key
```
PRIVATE_KEY=12345
```
2) Run test script `npm run test`

### Harmony mainnet contracts
```
  contractAddress: '0x3C84F4690De96a0428Bc6777f5aA5f5a92150Ef2',
  vanityUrlContractAddress: '0x88a1afC4134f385337Dd5F530D452079fC9E14CC',
  shortReelsVideosContractAddress: '0x3a6843f2AbC3CA960845108908Eae8D9d9CE058D',
```
