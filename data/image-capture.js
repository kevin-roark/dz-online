const chalk = require('chalk')
const fetch = require('node-fetch')
const fs = require('fs-extra')

let count = 0
const idMap = {}

const downloadMedia = media => {
  const imageDownloads = media.map(item => {
    const imageURL = item.type === 'image' ? item.media.url : item.thumbnail.url
    const filename = `archive_media/dz_${item.id}.jpg`

    return fetch(imageURL)
      .then(res => {
        if (res.status !== 200 && res.status !== 0) {
          throw new Error(`Image missing! ${res.status}`)
        }

        return res
      })
      .then(res => res.buffer())
      .then(data => fs.writeFile(filename, data))
      .then(() => {
        idMap[item.id] = { media: item, image: filename }
        return console.log('processed', count++, 'of', media.length)
      })
      .catch(err => {
        // no worries :)
        console.log('processed', count++, 'of', media.length)
      })
  })

  return Promise.all(imageDownloads)
    .then(() => {
      console.log('sudoku baby', count)
    })
    .catch(err => {
      console.log('gomuku')
      console.log(err)
    })
}

const media = require('./dz_media.json')

const finalizeMedia = () => {
  const newMedia = Object.values(idMap).map(({ media, image }) => {
    return Object.assign({}, media, { dz_image: image })
  })

  return fs.writeFile('archive_media.json', JSON.stringify(newMedia))
    .then(() => {
      console.log('all done!!')
    })
}

let chunkIndex = 0
const size = 100
const doNextMedia = () => {
  console.log(chalk.blue(`DOING CHUNK #${chunkIndex + 1} of ${Math.ceil(media.length / size)}`))
  const chunk = media.slice(chunkIndex, chunkIndex + size)
  chunkIndex += size

  downloadMedia(chunk)
    .then(() => {
      if (chunkIndex < media.length) {
        doNextMedia()
      } else {
        finalizeMedia()
      }
    })
}

doNextMedia()
