// Seleciona os elementos do DOM
const categoryButtons = document.querySelectorAll("#category-filter button")
const productGallery = document.getElementById("product-gallery")
const selectedCategoryTitle = document.getElementById("selected-category")
const searchInput = document.getElementById("search-input")
const productListContainer = document.getElementById("product-list-container")

// Declara a variável global para armazenar os produtos
let products = []

// Carrega os produtos do arquivo JSON
fetch("data/products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data // Armazena os produtos na variável global
    displayProducts(products) // Exibe todos os produtos inicialmente

    // Adiciona evento de clique aos botões de categoria
    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.getAttribute("data-category")
        updateCategoryTitle(category) // Atualiza o título da categoria
        if (category === "todos") {
          displayProducts(products) // Exibe todos os produtos
        } else {
          // Filtra os produtos pela categoria selecionada
          const filteredProducts = products.filter(
            (product) =>
              product.category.toLowerCase() === category.toLowerCase()
          )
          displayProducts(filteredProducts)
        }
      })
    })
  })
  .catch((error) => console.error("Erro ao carregar os produtos:", error))

// Função para exibir os produtos na galeria
function displayProducts(products) {
  productListContainer.innerHTML = "" // Limpa a galeria
  products.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.classList.add("product-card")
    productCard.innerHTML = `
      <a href="${product.affiliateLink}" target="_blank">
        <div class="img-container">
        <img src="${product.image}" alt="${product.title}">
        </div>
        <h3 class="product_title">${product.title}</h3>
        <p class="product_price">R$ ${product.price.toFixed(2)}</p>
        <p>${"⭐".repeat(product.ranking)}</p>
        <p class="buy_button">Ver na loja</p>
      </a>
    `
    productListContainer.appendChild(productCard)
  })
}

// Função para atualizar o título da categoria
function updateCategoryTitle(category) {
  if (category === "todos") {
    selectedCategoryTitle.textContent = "Todos os Produtos"
  } else {
    selectedCategoryTitle.textContent =
      "Produtos da categoria " +
      category.charAt(0).toUpperCase() +
      category.slice(1)
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
