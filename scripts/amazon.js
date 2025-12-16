import { cart, addToCart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

loadProducts(renderProductsGrid);

function renderProductsGrid(productsToRender) {
  
  if (!productsToRender) {
    productsToRender = products;
  }

  let productsHTML = '';

  productsToRender.forEach((product) => {
    productsHTML += `
    <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select>
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id = "${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }
  
  // Run this once to set the cart number on page load
  updateCartQuantity();

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId);
      updateCartQuantity();
    });
  });
}

// The Search Function
function handleSearch() {
  const searchInput = document.querySelector('.search-bar');
  const searchTerm = searchInput.value.toLowerCase();

  const filteredProducts = products.filter((product) => {
    // Check if the name matches
    const nameMatch = product.name.toLowerCase().includes(searchTerm);
    
    // Check if any keywords match (e.g. searching "gym" for socks)
    // We use optional chaining '?' because some products might not have keywords
    const keywordMatch = product.keywords?.some((keyword) => 
      keyword.toLowerCase().includes(searchTerm)
    );

    return nameMatch || keywordMatch;
  });

  // Re-render only the matching products
  renderProductsGrid(filteredProducts);
}

//Add Event Listeners for the Search Button and 'Enter' key
document.querySelector('.search-button').addEventListener('click', handleSearch);

document.querySelector('.search-bar').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
});