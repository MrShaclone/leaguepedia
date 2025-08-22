const URL = "https://ddragon.leagueoflegends.com/cdn/15.16.1/data/pt_BR/champion.json";
const IMAGE_URL = "https://ddragon.leagueoflegends.com/cdn/15.16.1/img/champion/";

// URL da API dos itens agora usa a versão em inglês
const ITEM_API_URL = "https://ddragon.leagueoflegends.com/cdn/15.16.1/data/en_US/item.json"; // URL da API dos itens

const cardsContainer = document.querySelector(".cards-champs"); // Pegando o container dos cards
const giantCard = document.querySelector(".giant-card"); // Pegando o giant card
const championName = document.querySelector(".champion-info h2"); // Pegando o nome do campeão
const championInfo = document.querySelector(".champion-info p"); // Pegando a descrição do campeão
const buildList = document.querySelector(".list-build"); // Lista da build

let campeoes = {}; // Objeto que vai armazenar os campeões

// Função para chamar a API do LoL e obter campeões
async function chamarAPI() {
  const resp = await fetch(URL);
  if (resp.status === 200) {
    const data = await resp.json(); // Transforma a resposta em JSON
    campeoes = data.data; // Armazenando os campeões no objeto
    gerarCards(campeoes); // Chama a função que gera os cards
  }
}

// Função para gerar cards de campeões
function gerarCards(campeoes) {
  for (const nome in campeoes) {
    const champ = campeoes[nome]; // Armazenando o campeão atual

    const li = document.createElement("li"); // Criando o elemento li
    li.classList.add("card-champ"); // Adicionando a classe card-champ
    li.innerHTML = `
        <img src="${IMAGE_URL + champ.image.full}" alt="${champ.name}">
        <p>${champ.name}</p>
    `; // Adicionando o conteúdo do card

    li.addEventListener("click", () => { // Adicionando o evento de clique no card
        mostrarCampeao(champ);
    });

    cardsContainer.appendChild(li); // Adicionando o card ao container
  }
}

// Função para mostrar informações do campeão
async function mostrarCampeao(champ) {
  giantCard.innerHTML = ` 
    <img src="${IMAGE_URL + champ.image.full}" style="max-width: 300px;">
  `;
  championName.textContent = champ.name;

  // Requisição para pegar a lore e função do campeão
  const resp = await fetch(`https://ddragon.leagueoflegends.com/cdn/15.16.1/data/pt_BR/champion/${champ.id}.json`);
  const data = await resp.json();
  const champCompleto = data.data[champ.id];

  // Atualiza as informações com base nos dados completos
  championInfo.innerHTML = `
    <strong>História:</strong> ${champCompleto.lore}
    <br><strong>Função:</strong> ${champ.tags.join(", ")}
  `;

  // Limpa a lista de build antes de carregar
  buildList.innerHTML = '<p>Carregando build...</p>';

  // Chama a API local para pegar a build do campeão
  try {
    const response = await fetch(`http://localhost:3000/builds/${champ.name.toLowerCase()}`);
    if (!response.ok) throw new Error("Erro ao buscar build");

    const build = await response.json();

    // Verifica se há itens na build
    if (build.length === 0) {
      buildList.innerHTML = "<p>Nenhum item encontrado.</p>";
      return;
    }

    // Limpa a lista de build e adiciona os itens
buildList.innerHTML = ""; // Limpa a lista de itens
for (const item of build) {
  const itemImage = await getItemImage(item.itemName);  // Obtém a imagem correta do item
  const li = document.createElement("li");
  li.classList.add("item-build");
  li.innerHTML = `
    <img src="${itemImage}" alt="${item.itemName}">
    <p>${item.itemName}</p>
  `;
  buildList.appendChild(li);
}
  } catch (error) {
    console.error(error);
    buildList.innerHTML = "<p>Erro ao carregar build.</p>";
  }
}

// Função para pegar a imagem do item baseado no nome
async function getItemImage(itemName) {
  try {
    const resp = await fetch(ITEM_API_URL);
    const data = await resp.json();

    // Procura pelo item no objeto retornado pela API
    for (const key in data.data) {
      const item = data.data[key];
      if (item.name.toLowerCase() === itemName.toLowerCase()) {
        return `https://ddragon.leagueoflegends.com/cdn/15.16.1/img/item/${item.image.full}`;
      }
    }

    // Retorna uma imagem padrão se o item não for encontrado
    return 'https://ddragon.leagueoflegends.com/cdn/15.16.1/img/item/undefined.png';  
  } catch (error) {
    console.error("Erro ao buscar imagem do item:", error);
    return 'https://ddragon.leagueoflegends.com/cdn/15.16.1/img/item/undefined.png';  // Retorna uma imagem padrão em caso de erro
  }
}

// Inicia a chamada para pegar os campeões e gerar os cards
chamarAPI();
