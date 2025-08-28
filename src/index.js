// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products-container");
  const categoriesContainer = document.getElementById("categories-container");
  const searchInput = document.getElementById("search-input");
  const navLinks = document.querySelectorAll(".nav-link");
  const pageSections = document.querySelectorAll(".page-section");
  const cartButton = document.getElementById("cart-button");
  const cartModal = document.getElementById("cart-modal");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartCountEl = document.getElementById("cart-count");
  const cartTotalEl = document.getElementById("cart-total");
  const filterStatusEl = document.getElementById("filter-status");
  const filterCategoryEl = document.getElementById("filter-category");
  const clearFilterBtn = document.getElementById("clear-filter-btn");

  // --- Global State ---
  const apiUrl = "https://fakestoreapi.com/products";
  let allProducts = []; // Master list of products
  let cart = []; // Shopping cart state

  // --- PAGE NAVIGATION ---
  function navigateTo(targetPageId) {
    pageSections.forEach((section) => {
      section.classList.toggle("active", section.id === targetPageId);
    });
    window.scrollTo(0, 0); // Scroll to top on page change
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPageId = link.getAttribute("href").substring(1) + "-page";
      navigateTo(targetPageId);
    });
  });

  // --- SHOPPING CART ---
  function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCart();
  }

  function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    cartItemsContainer.innerHTML =
      cart.length === 0
        ? '<p class="text-slate-500">Your cart is empty.</p>'
        : "";

    cart.forEach((item) => {
      const cartItemEl = document.createElement("div");
      cartItemEl.className = "flex justify-between items-center mb-4";
      cartItemEl.innerHTML = `
        <div class="flex items-center">
          <img src="${item.image}" alt="${
        item.title
      }" class="w-16 h-16 object-contain mr-4 rounded">
          <div>
            <h4 class="font-semibold">${item.title}</h4>
            <p class="text-slate-500">$${item.price.toFixed(2)} x ${
        item.quantity
      }</p>
          </div>
        </div>
        <span class="font-bold">$${(item.price * item.quantity).toFixed(
          2
        )}</span>
      `;
      cartItemsContainer.appendChild(cartItemEl);
    });

    const totalCost = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cartTotalEl.textContent = `$${totalCost.toFixed(2)}`;
  }

  cartButton.addEventListener("click", () =>
    cartModal.classList.remove("hidden")
  );
  closeCartBtn.addEventListener("click", () =>
    cartModal.classList.add("hidden")
  );
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.classList.add("hidden");
  });

  // --- PRODUCT & CATEGORY RENDERING ---
  function displayProducts(productsToDisplay) {
    productsContainer.innerHTML = "";
    if (productsToDisplay.length === 0) {
      productsContainer.innerHTML =
        '<p class="col-span-full text-center text-slate-500">No products found.</p>';
      return;
    }
    productsToDisplay.forEach((product) => {
      const card = document.createElement("div");
      card.className =
        "bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col group";
      card.innerHTML = `
        <div class="relative">
          <img src="${product.image}" alt="${
        product.title
      }" class="product-image mx-auto p-4 transition-transform duration-300 group-hover:scale-105" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';">
          <div class="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold capitalize">${
            product.category
          }</div>
        </div>
        <div class="p-5 flex-grow flex flex-col">
          <h3 class="product-title text-lg font-bold text-slate-900 mb-2">${
            product.title
          }</h3>
          <p class="text-2xl font-extrabold text-teal-600 mb-4">$${product.price.toFixed(
            2
          )}</p>
          <button data-product-id="${
            product.id
          }" class="add-to-cart-btn mt-auto w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-teal-500 font-semibold transition-colors">Add to Cart</button>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  }

  /**
   * Displays category cards with representative product images.
   * @param {string[]} categories - Array of category names.
   * @param {object[]} allProducts - The master list of all products.
   */
  function displayCategories(categories, allProducts) {
    const categoryDescriptions = {
      electronics: "The latest gadgets and tech.",
      jewelery: "Elegant and sparkling accessories.",
      "men's clothing": "Sharp and modern styles.",
      "women's clothing": "Chic and trendy apparel.",
    };

    categoriesContainer.innerHTML = "";
    categories.forEach((category) => {
      // Find the first product in the master list that matches this category
      const representativeProduct = allProducts.find(
        (p) => p.category === category
      );
      // Use that product's image, or a placeholder if no product is found
      const imageUrl = representativeProduct
        ? representativeProduct.image
        : "https://placehold.co/600x400";

      const desc = categoryDescriptions[category] || "Explore our collection.";

      const categoryCard = document.createElement("div");

      categoryCard.className =
        "category-card bg-slate-900 rounded-xl shadow-lg overflow-hidden cursor-pointer group transform hover:-translate-y-2 transition-transform duration-300 relative h-64";
      categoryCard.dataset.category = category;

      categoryCard.innerHTML = `
            <img src="${imageUrl}" alt="${category}" class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div class="relative p-5 h-full flex flex-col justify-end">
              <h3 class="text-xl font-bold text-white capitalize mb-1">${category}</h3>
              <p class="text-slate-300 text-sm mb-3">${desc}</p>
              <span class="font-semibold text-teal-400 group-hover:underline">Shop Now &rarr;</span>
            </div>
        `;
      categoriesContainer.appendChild(categoryCard);
    });
  }

  // --- DATA FETCHING & INITIALIZATION ---
  async function initializeApp() {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(apiUrl),
        fetch(`${apiUrl}/categories`),
      ]);
      if (!productsResponse.ok || !categoriesResponse.ok)
        throw new Error("API request failed!");

      allProducts = await productsResponse.json();
      const categories = await categoriesResponse.json();

      displayProducts(allProducts);
      // Pass the full product list to the categories function
      displayCategories(categories, allProducts);
    } catch (error) {
      console.error("Error initializing app:", error);
      productsContainer.innerHTML =
        '<p class="col-span-full text-center text-red-600">Failed to load data.</p>';
    }
  }

  // --- EVENT LISTENERS ---
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
    filterStatusEl.classList.add("hidden"); // Hide filter status when searching
  });

  productsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const productId = parseInt(e.target.dataset.productId);
      const productToAdd = allProducts.find((p) => p.id === productId);
      if (productToAdd) addToCart(productToAdd);
    }
  });

  categoriesContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".category-card");
    if (card) {
      const category = card.dataset.category;
      const filtered = allProducts.filter((p) => p.category === category);
      displayProducts(filtered);
      filterCategoryEl.textContent = category;
      filterStatusEl.classList.remove("hidden");
      navigateTo("products-page");
    }
  });

  clearFilterBtn.addEventListener("click", () => {
    displayProducts(allProducts);
    filterStatusEl.classList.add("hidden");
    searchInput.value = "";
  });

  // --- INITIAL LOAD ---
  initializeApp();
  navigateTo("products-page"); // Show products page by default
});
