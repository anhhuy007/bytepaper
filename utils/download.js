import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

const __dirname = path.resolve()

export const downloadArticle = async (req, res, next) => {
  const { id } = req.params
  console.log('Downloading article:', id)
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    console.log(`Accessing article page: http://localhost:3000/articles/${id}`)
    await page.goto(`http://localhost:3000/articles/${id}`, { waitUntil: 'networkidle0' })

    console.log('Waiting for element with class ".prose"')
    const contentElement = await page.waitForSelector('.prose')
    const contentHTML = await contentElement.evaluate((el) => el.outerHTML)

    const tempDir = path.join(__dirname, 'pdf-temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const tempHTMLFile = path.join(tempDir, `${id}.html`)
    console.log(`Writing content to temporary file: ${tempHTMLFile}`)
    fs.writeFileSync(tempHTMLFile, contentHTML)

    const pdfOptions = {
      path: path.join(__dirname, 'public', 'downloads', `${id}.pdf`),
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1.5cm', right: '1.5cm' },
    }

    console.log('Creating PDF...')
    await page.goto(`file://${tempHTMLFile}`, { waitUntil: 'networkidle0' })
    await page.pdf(pdfOptions)

    fs.unlinkSync(tempHTMLFile)
    await browser.close()

    console.log('Sending PDF to user...')
    res.download(pdfOptions.path, (err) => {
      if (err) {
        console.error('Download error:', err)
        return res.status(500).send('Error downloading file')
      }
      console.log(`PDF sent successfully: ${pdfOptions.path}`)
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    res.status(500).send('Error generating PDF')
  }
}

export default {
  downloadArticle,
}
