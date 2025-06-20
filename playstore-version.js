const axios = require("axios");
const cheerio = require("cheerio");

export default async function handler(req, res) {
  const packageName = req.query.package || "com.mycompany.domipuntos";
  const url = `https://play.google.com/store/apps/details?id=${packageName}&hl=es&gl=US`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
    });

    const $ = cheerio.load(data);
    let version = null;

    // Buscar dentro de los scripts donde aparece la versión
    $('script').each((_, script) => {
      const content = $(script).html();
      if (content && content.includes("Current Version")) {
        const match = content.match(/"([0-9]+\.[0-9]+\.[0-9]+)"/);
        i
