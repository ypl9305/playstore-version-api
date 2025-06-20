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

    // Extraer el JSON oculto en <script type="application/ld+json">
    const script = $('script[type="application/ld+json"]').html();
    if (script) {
      const json = JSON.parse(script);
      const version = json.softwareVersion;
      if (version) {
        return res.status(200).json({ version: version.trim() });
      }
    }

    // Fallback: buscar texto con patrón de versión en todo el HTML
    const match = data.match(/(\d+\.\d+(\.\d+)?)/);
    if (match) {
      return res.status(200).json({ version: match[0] });
    }

    return res.status(404).json({ error: "Versión no encontrada" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
