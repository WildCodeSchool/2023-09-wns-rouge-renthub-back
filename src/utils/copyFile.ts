import fs from 'fs'

export const copyFile = (src: string, dest: string) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(src)
    const writeStream = fs.createWriteStream(dest)

    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('finish', resolve)

    readStream.pipe(writeStream)
  })
}
