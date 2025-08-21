const URL = "https://ddragon.leagueoflegends.com/cdn/15.16.1/data/pt_BR/champion.json";
const IMAGE_URL = "https://ddragon.leagueoflegends.com/cdn/15.16.1/img/champion/";

const cardsContainer = document.querySelector(".cards-champs"); // Agora usamos querySelector
const giantCard = document.querySelector(".giant-card"); // Agora usamos querySelector
const championName = document.querySelector(".champion-info h2"); // Pegando o nome do campeão
const championInfo = document.querySelector(".champion-info p"); // Pegando a descrição do campeão

let campeoes = {}; // Objeto que vai armazenar os campeões

async function chamarAPI() {
  const resp = await fetch(URL);
  if (resp.status === 200) {
    const data = await resp.json(); // Transforma a resposta em JSON
    campeoes = data.data; // Armazenando os campeões no objeto
    gerarCards(campeoes); // Chama a função que gera os cards
  }
}

function gerarCards(campeoes) {
  for (const nome in campeoes) {
    const champ = campeoes[nome]; // Armazenando o campeão atual

    const li = document.createElement("li"); // Criando o elemento <li>
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

function mostrarCampeao(champ) {
  giantCard.innerHTML = `
    <img src="${IMAGE_URL + champ.image.full}" style="max-width: 300px;">
  `;
  championName.textContent = champ.name;
  championInfo.textContent = champ.title;
  championInfo.textContent += ` - ${champ.blurb}`; // Adicionando a descrição do campeão
  championInfo.innerHTML += `<br><strong>Função:</strong> ${champ.tags.join(", ")}`; // Adicionando as tags do campeão

}

chamarAPI(); // Chamando a função para buscar os campeões
