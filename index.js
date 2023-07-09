import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
require("dotenv").config({ path: "./.env.local" });
import { ChatGPTAPI } from "chatgpt";

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOption = {
  origin: true
};

app.use(cors(corsOption));

const database = [];
const generateID = () => Math.random().toString(36).substring(2, 10);

async function chatgptFunction(content = "") {
  const api = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY });

  const getBrandName = await api.sendMessage(
    `I have a raw text of a website, what is the brand name in a single word? ${content}`
  );
  const getBrandDescription = await api.sendMessage(
    `I have a raw text of a website, can you extract the description of the website from the raw text. I need only the description and nothing else. ${content}`
  );

  return {
    brandName: getBrandName.text,
    brandDescription: getBrandDescription.text,
  };
}

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.post("/api/url", (req, res) => {
  const { url } = req.body;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // await page.screenshot({
    //   path: `./screenshot_${generateID()}.png`,
    // });
    // await page.pdf({
    //   path: `./doc_${generateID()}.pdf`,
    //   format: "A4",
    // });

    const websiteContent = await page.evaluate(() => {
      return document.documentElement.innerText.trim();
    });
    const websiteOgImage = await page.evaluate(() => {
      const metas = document.getElementsByTagName("meta");
      for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("property") === "og:image") {
          return metas[i].getAttribute("content");
        }
      }
    });

    let result = await chatgptFunction(websiteContent);
    result.brandImage = websiteOgImage;
    result.id = generateID();
    database.push(result);

    await browser.close();

    return res.json({
      message: "Request successful!",
      database,
    });
  })();
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
