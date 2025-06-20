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

    // Buscar dentro de todos los scripts
    $('script').each((_, script) => {
      const content = $(script).html();
      if (content && content.includes('"softwareVersion"')) {
        try {
          const jsonText = content.trim().match(/\{.*"softwareVersion":.*\}/s);
          if (jsonText) {
            const json = JSON.parse(jsonText[0]);
            version = json.softwareVersion?.trim();
          }
        } catch (e) {
          // ignorar errores de JSON
        }
      }
    });

    if (version) {
      return res.status(200).json({ version });
    } else {
      return res.status(404).json({ error: "Versión no encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
