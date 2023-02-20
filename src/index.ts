import OneCountry from './onecountry'
import VanityUrl from './vanityUrl'
import ShortReelsVideos from './shortReelsVideos'

export {
  OneCountry,
  VanityUrl,
  ShortReelsVideos
}

export const NullAddress = '0x0000000000000000000000000000000000000000'

export const getRandomNumber = (min = 0, max = 10000) => Math.round(Math.random() * (max - min) + min);
