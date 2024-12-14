// utils/download.js
import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'
import ArticleService from '../services/article.service.js' // Service lấy thông tin bài viết từ database

const __dirname = path.resolve()

export const downloadArticle = async (req, res, next) => {
  const { id } = req.params

  try {
    console.log(`Fetching article with ID: ${id}`)
    // Fetch article details from database
    const article = await ArticleService.getArticleById(id)

    if (!article) {
      console.warn(`Article not found: ${id}`)
      return res.status(404).send('Article not found')
    }

    // Create a minimal HTML template with the article's content
    const articleHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${article.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
          }
          h1 {
            font-size: 24px;
            font-weight: bold;
          }
          .metadata {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
          }
          .tags {
            margin-top: 20px;
          }
          .tags span {
            display: inline-block;
            background-color: #f1f1f1;
            color: #555;
            border-radius: 3px;
            padding: 5px 10px;
            margin-right: 5px;
          }
          img {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <h1>${article.title}</h1>
        <div class="metadata">
          <p>Published on: ${article.published_at}</p>
          <p>Category: ${article.category?.name || 'Uncategorized'}</p>
        </div>
        ${article.thumbnail ? `<img src="${article.thumbnail}" alt="${article.title}" />` : ''}
        <div class="content">
          ${article.content || '<p>No content available.</p>'}
        </div>
        <div class="tags">
          ${article.tags.map((tag) => `<span>${tag.name}</span>`).join('')}
        </div>
      </body>
      </html>
    `

    // Prepare temporary directory and HTML file
    const tempDir = path.join(__dirname, 'pdf-temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const tempHTMLFile = path.join(tempDir, `${id}.html`)
    fs.writeFileSync(tempHTMLFile, articleHTML)

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`file://${tempHTMLFile}`, { waitUntil: 'networkidle0' })

    const pdfPath = path.join(__dirname, 'public', 'downloads', `${id}.pdf`)
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1.5cm', right: '1.5cm' },
    })

    await browser.close()
    fs.unlinkSync(tempHTMLFile)

    console.log('PDF generated successfully, sending to user...')
    res.download(pdfPath, (err) => {
      if (err) {
        console.error('Error sending PDF:', err)
        return res.status(500).send('Error downloading file')
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    res.status(500).send('Error generating PDF')
  }
}

export default {
  downloadArticle,
}
