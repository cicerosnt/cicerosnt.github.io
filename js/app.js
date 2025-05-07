// Seleciona os elementos do DOM
const categoryButtons = document.querySelectorAll("#category-filter button")
const productGallery = document.getElementById("product-gallery")
const selectedCategoryTitle = document.getElementById("selected-category")
const searchInput = document.getElementById("search-input")
const productListContainer = document.getElementById("product-list-container")

// Declara a variável global para armazenar os produtos
let products = []

// Carrega os produtos e categorias do arquivo JSON
fetch("/data/data.json")
  .then((response) => response.json())
  .then((data) => {
    if (!data.products || data.products.length === 0) {
      console.error("Nenhum produto encontrado.")
      return
    }

    products = data.products // Armazena os produtos na variável global
    displayProducts(products) // Exibe todos os produtos inicialmente

    const categoryFilter = document.getElementById("category-filter")

    // Adiciona o botão "Todos as categorias"
    const allCategoriesButton = document.createElement("li")
    allCategoriesButton.innerHTML = `<button class="active" style="margin-left: 2px" data-category="todos">Tudo</button>`
    categoryFilter.appendChild(allCategoriesButton)

    // Filtra as categorias que possuem produtos
    const categoriesWithProducts = data.categories.filter((category) =>
      products.some((product) => product.categoryId === category.id)
    )

    // Adiciona as categorias dinamicamente
        categoriesWithProducts
      .sort((a, b) => a.name.localeCompare(b.name)) // Ordena as categorias por nome em ordem alfabética
      .forEach((category) => {
        const categoryButton = document.createElement("li");
        categoryButton.innerHTML = `<button data-category="${category.id}">${category.name}</button>`;
        categoryFilter.appendChild(categoryButton);
      });
  })
  .catch((error) => console.error("Erro ao carregar os produtos:", error))

// Delegação de eventos para os botões de categoria
document
  .getElementById("category-filter")
  .addEventListener("click", (event) => {
    const button = event.target.closest("button")
    if (!button) return // Ignora cliques fora dos botões

    document.querySelectorAll("#category-filter button").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    const category = button.getAttribute("data-category")
    updateCategoryTitle(category) // Atualiza o título da categoria

    if (category === "todos") {
      displayProducts(products) // Exibe todos os produtos
    } else {
      // Filtra os produtos pela categoria selecionada
      const filteredProducts = products.filter(
        (product) => product.categoryId === parseInt(category)
      )
      displayProducts(filteredProducts)
    }
  })

// Função para exibir os produtos na galeria
function displayProducts(products) {
  productListContainer.innerHTML = "" // Limpa a galeria
  products
  //.sort((a, b) => a.title.localeCompare(b.title))
  .forEach((product) => {
    const productCard = document.createElement("div")
    productCard.classList.add("product-card")
    productCard.innerHTML = `
      <a href="${product.affiliateLink}" target="_blank" class="product-link">
        <div class="img-container">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product_info">
          <h3 class="product_title">${product.title}</h3>
          <p class="product_price">R$ ${product.price.toFixed(2)}</p>
          <p class="product_ranking">${"⭐".repeat(product.ranking)}</p>
          <button class="buy_button">
            Ver na Loja

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M14 3h7a1 1 0 0 1 1 1v7h-2V5.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
              <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z" />
            </svg>
          </button>
        </div>
      </a>
    `
    productListContainer.appendChild(productCard)

    // Adiciona evento de clique ao link do produto
    const productLink = productCard.querySelector(".product-link")
    productLink.addEventListener("click", () => {
      incrementProductClicks(product.id)
    })
  })
}

// Função para incrementar o atributo "clicks" do produto e enviar ao servidor
function incrementProductClicks(productId) {
  const product = products.find((p) => p.id === productId)
  if (product) {
    product.clicks += 1
    console.log(`Produto ID ${productId} teve ${product.clicks} cliques.`)

    // Envia a atualização para o servidor
    fetch(`/api/products/${productId}`, {
      method: "PATCH", // Ou "PUT", dependendo da configuração do servidor
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clicks: product.clicks }), // Atualiza apenas o campo "clicks"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao atualizar os cliques no servidor.")
        }
        console.log(
          `Cliques do produto ID ${productId} atualizados no servidor.`
        )
      })
      .catch((error) => console.error(error))
  }
}

// Função para atualizar o título da categoria
function updateCategoryTitle(category) {
  if (category === "todos") {
    selectedCategoryTitle.textContent = "Todos os Produtos"
  } else {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => {
        const selectedCategory = data.categories.find(
          (cat) => cat.id === parseInt(category)
        )
        if (selectedCategory) {
          selectedCategoryTitle.textContent =
            "Produtos da categoria " + selectedCategory.name
        } else {
          selectedCategoryTitle.textContent = "Categoria não encontrada"
        }
      })
      .catch((error) => console.error("Erro ao carregar as categorias:", error))
  }
}

// Adiciona evento de input para buscar produtos
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase() // Obtém o termo de busca em minúsculas
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  ) // Filtra os produtos pelo título
  displayProducts(filteredProducts) // Atualiza a exibição dos produtos
})

// Seleciona os elementos do popup
const popup = document.getElementById("popup")
const closePopupButton = document.getElementById("close-popup")

// Verifica se o popup já foi exibido
if (!localStorage.getItem("popupShown")) {
  popup.classList.remove("hidden") // Exibe o popup
}

// Fecha o popup ao clicar no botão
closePopupButton.addEventListener("click", () => {
  popup.classList.add("hidden") // Esconde o popup
  localStorage.setItem("popupShown", "true") // Marca como exibido
})

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggle-category-menu")
  const categoryMenu = document.getElementById("category-menu")

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      categoryMenu.classList.toggle("active")
    })
  }
})
