const express = require("express");
const puppeteer = require("puppeteer-extra");
const stealth = require("puppeteer-extra-plugin-stealth");

puppeteer.use(stealth());

const URL = "https://energy-ua.info/grafik/%D0%9B%D1%83%D0%B1%D0%BD%D0%B8/%D0%B2%D1%83%D0%BB.+%D0%9F%D1%80%D0%B8%D0%BA%D0%BE%D1%80%D0%B4%D0%BE%D0%BD%D0%BD%D0%B8%D0%BA%D1%96%D0%B2/60%D0%90";

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchHtml() {
  console.log("Launching browser...");

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36"
    );

    await page.goto(URL, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // чекаємо Cloudflare
    await sleep(4000);

    const html = await page.content();
    return html;

  } catch (e) {
    console.error("Fetch error:", e);
    return null;
  } finally {
    await browser.close();
  }
}

const app = express();

app.get("/power", async (req, res) => {
  const html = await fetchHtml();
  if (!html) return res.status(500).send("Error loading page");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

app.listen(3000, () => {
  console.log("Power proxy running on port 3000");
});
