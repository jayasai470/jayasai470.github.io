const fs = require('fs');  
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');  

// Register the helper  
Handlebars.registerHelper('splitSentences', function(text) {
    return text.split('. ').filter(function(sentence) {
      return sentence.trim().length > 0;  
    });
});
  
// Function to read a file  
function readFile(filePath) {  
  return new Promise((resolve, reject) => {  
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {  
      if (err) reject(err);  
      else resolve(data);  
    });  
  });
}  
  
// Function to write a file  
function writeFile(filePath, data) {  
  return new Promise((resolve, reject) => {  
    fs.writeFile(filePath, data, (err) => {  
      if (err) reject(err);  
      else resolve();  
    });  
  });  
}  
  
// Function to generate HTML from a Handlebars template  
async function generateHTML(templatePath, data, outputPath) {  
  try {  
    // Read the template file  
    const templateSource = await readFile(templatePath);  
      
    // Compile the template with Handlebars  
    const template = Handlebars.compile(templateSource);  
      
    // Generate the HTML with the provided data  
    const html = template(data);
      
    // Write the HTML to the specified output file  
    await writeFile(outputPath, html);  
      
    console.log(`HTML has been generated and written to ${outputPath}`);
    return html
  } catch (error) {  
    console.error('Error generating HTML:', error);  
  }  
}  


async function generatePDF(html, outputPath) {
    // Start a headless browser session  
  const browser = await puppeteer.launch({
    headless: "true",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none'
    ]
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));
  page.on('requestfailed', req =>
      console.error('REQUEST FAILED:', req.url(), req.failure()?.errorText)
  );


  // Set the content of the page to your rendered HTML
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.addStyleTag({path: './public/css/local.css'});
  await page.emulateMediaType('print');
  // Wait for fonts/layout
  if (await page.evaluate(() => !!document.fonts)) {
    await page.evaluate(() => document.fonts.ready);
  }
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  // await page.setViewport({
  //   width: 1280,
  //   height: 960 
  // });
  // Convert the page to PDF
  await page.pdf({
    path: outputPath,
    scale: 0.70,
    format: "A4",
    pageRanges: "1",
    // width: '8.27in',
    // height: '11.7in',
    printBackground: true,
    preferCSSPageSize: true,
    // displayHeaderFooter: true,
    // headerTemplate: '<div style="font-size:10px; color: #333; margin-left: 20px;">My Custom Header</div>',  
    // footerTemplate: '<div style="font-size:10px; color: #333; margin-left: 20px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    // margin: {
    //     bottom: '10mm',
    //     left: '10mm', 
    //     right: '10mm', 
    //     top: '10mm'
    // },
  });
  
  // Close the browser session  
  await browser.close();  
}

(async () => {
  try {
    const data = require('../public/resumeData.json');
    const html = await generateHTML('resume.hbs', data, './public/resume.html');
    await generatePDF(html, './public/jay.pdf');
  } catch (error) {
    console.error('Error processing:', error);
  }
})();