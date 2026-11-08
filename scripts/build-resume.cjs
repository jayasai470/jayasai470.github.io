const fs = require('fs/promises');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');

Handlebars.registerHelper('join', function(items) {
    return Array.isArray(items) ? items.join(', ') : items;
});

// Groups consecutive roles at the same company into one block, so a single
// employer with multiple promotions (e.g. Engineer 2 -> 3 -> Staff) reads as
// one company heading with nested roles instead of repeating the company name.
function groupByCompany(work) {
  const groups = [];
  for (const role of work) {
    const last = groups[groups.length - 1];
    if (last && last.company === role.company) {
      last.roles.push(role);
    } else {
      groups.push({ company: role.company, roles: [role] });
    }
  }
  return groups.map((group) => ({
    ...group,
    multiRole: group.roles.length > 1,
    years: `${group.roles[group.roles.length - 1].dateFrom} – ${group.roles[0].dateTo}`,
  }));
}

// Strips the protocol/www/trailing slash for a clean on-page display string,
// while the real href keeps the full URL.
function displayUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}

function withSocialLinks(main) {
  const social = main.social || [];
  const linkedin = social.find((s) => s.icon === 'linkedin');
  const github = social.find((s) => s.icon === 'github');
  return {
    ...main,
    websiteDisplay: main.website ? displayUrl(main.website) : null,
    linkedinUrl: linkedin?.url ?? null,
    linkedinDisplay: linkedin ? displayUrl(linkedin.url) : null,
    githubUrl: github?.url ?? null,
    githubDisplay: github ? displayUrl(github.url) : null,
  };
}

// Renders the Handlebars template to an HTML string in memory — nothing is
// written to disk here; Puppeteer consumes the string directly.
async function renderHTML(templatePath, data) {
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);
  return template(data);
}

async function generatePDF(html, outputPath) {
  const browser = await puppeteer.launch({
    headless: true,
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

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.addStyleTag({path: './public/css/resume.css'});
  await page.emulateMediaType('print');
  // Wait for fonts/layout
  if (await page.evaluate(() => !!document.fonts)) {
    await page.evaluate(() => document.fonts.ready);
  }
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  // Convert the page to PDF
  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
}

(async () => {
  try {
    const data = require('../public/resumeData.json');
    data.companyGroups = groupByCompany(data.resume.work);
    data.main = withSocialLinks(data.main);
    const html = await renderHTML('resume.hbs', data);
    const outputPath = `./public/${data.main.resumedownload}`;
    await generatePDF(html, outputPath);
    console.log(`Resume PDF written to ${outputPath}`);
  } catch (error) {
    console.error('Error processing:', error);
    process.exit(1);
  }
})();