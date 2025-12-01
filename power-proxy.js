import express from "express";
import fetch from "node-fetch";

const app = express();

const targetUrl = "https://energy-ua.info/grafik/%D0%9B%D1%83%D0%B1%D0%BD%D0%B8/%D0%B2%D1%83%D0%BB.+%D0%9F%D1%80%D0%B8%D0%BA%D0%BE%D1%80%D0%B4%D0%BE%D0%BD%D0%BD%D0%B8%D0%BA%D1%96%D0%B2/60%D0%90";

app.get("/power", async (req, res) => {
  try {
    const response = await fetch(targetUrl, {
      headers: {
        // браузерные заголовки, необходимые cloudflare challenge
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "uk-UA,uk;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",

        // ключевые UA-CH заголовки (обход Cloudflare challenge)
        "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-ch-ua-mobile": "?0",
      }
    });

    const html = await response.text();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (e) {
    console.error("Proxy error:", e);
    res.status(500).send("Proxy error");
  }
});

app.listen(3000, () => {
  console.log("Power proxy running on port 3000");
});
