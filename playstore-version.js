const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const packageName = req.query.package || "com.mycompany.domipuntos";
  const url = `https://play.google.com/store/apps/details?id=${packageName}&hl=es&gl=US`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
      }
    });

    const $ = cheerio.load(data);
    let version = null;

    // Intenta encontrar cualquier bloque de texto que parezca ser la versión
    $('div span').each((i, el) => {
      const text = $(el).text().trim();
      if (/^\d+\.\d+(\.\d+)?$/.test(text)) {
        version = text;
        return false; // detener loop
      }
    });

    if (version) {
      return res.status(200).json({ version });
    } else {
      return res.status(404).json({ error: "No se encontró la versión" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
