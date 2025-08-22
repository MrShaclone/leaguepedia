const puppeteer = require("puppeteer");

async function scrapeHweiBuilds() {
  const url = "https://www.metasrc.com/lol/build/hwei";

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Espera o conteúdo carregar
  await page.waitForSelector("._yq1p7n", { timeout: 60000 });

  const builds = await page.evaluate(() => {
    // Seleciona os containers dos itens com a classe '_yq1p7n'
    const itemContainers = document.querySelectorAll("._yq1p7n ._djuo1l ._9jhm56 div");

    // Mapeia todos os itens da página
    const items = Array.from(itemContainers).map(container => {
      const itemImage = container.querySelector("img")?.src || "Imagem não encontrada"; // URL da imagem do item
      const itemName = container.querySelector("img")?.alt || "Nome não encontrado"; // Nome do item (usando o atributo alt da imagem)

      return {
        itemName,
        itemImage
      };
    });

    // Filtra itens inválidos e remove duplicatas
    const filteredItems = items
      .filter(item => item.itemName !== "Nome não encontrado" && item.itemImage !== "Imagem não encontrada")
      .reduce((unique, item) => {
        if (!unique.some(i => i.itemName === item.itemName && i.itemImage === item.itemImage)) {
          unique.push(item);
        }
        return unique;
      }, []);

    return filteredItems;
  });

  await browser.close();

  console.log(builds);
}

scrapeHweiBuilds();
