const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  console.log('Generating Process Book PDF...');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const htmlPath = path.join(__dirname, '../milestones/milestone3/process-book.html');
  const fileUrl = 'file://' + htmlPath;

  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const pdfPath = path.join(__dirname, '../milestones/milestone3/process-book.pdf');

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '2cm',
      right: '2cm',
      bottom: '2cm',
      left: '2cm'
    }
  });

  await browser.close();

  const size = (fs.statSync(pdfPath).size / 1024).toFixed(1);
  console.log(`PDF generated: ${pdfPath} (${size} KB)`);
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
