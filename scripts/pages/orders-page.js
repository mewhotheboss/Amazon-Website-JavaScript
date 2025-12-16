import { orders } from '../../data/orders.js';
import { cart } from '../../data/cart.js';
import { getProduct, loadProductsFetch } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

async function loadPage() {
  await loadProductsFetch();

  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  document.querySelector('.cart-quantity').innerHTML = cartQuantity;

  renderOrdersGrid(orders);
}

function renderOrdersGrid(ordersToRender) {
  let ordersHTML = '';

  // --- MODIFIED SECTION START ---
  if (ordersToRender.length === 0) {
      document.querySelector('.js-orders-grid').innerHTML = `
        <div class="empty-orders-message">
          <h2>No orders found.</h2>
          <a href="amazon.html">
            <button class="button-primary">View products</button>
          </a>
        </div>
      `;
      return;
  }
  // --- MODIFIED SECTION END ---

  ordersToRender.forEach((order) => {
    const orderTimeString = dayjs(order.orderTime).format('MMMM D');

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsListHTML(order)}
        </div>
      </div>
    `;
  });

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

  document.querySelectorAll('.js-complete-order').forEach((button) => {
    button.addEventListener('click', () => {
      const { orderId, productId } = button.dataset;
      removeFromOrder(orderId, productId);
      renderOrdersGrid(orders); 
    });
  });
}

function productsListHTML(order) {
  let productsHTML = '';

  if (!order.products) return '';

  order.products.forEach((productDetails) => {
    const product = getProduct(productDetails.productId);

    if (!product) return;

    productsHTML += `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')}
        </div>
        <div class="product-quantity">
          Quantity: ${productDetails.quantity}
        </div>
        <button class="buy-again-button button-primary">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
        
        <button class="track-package-button button-secondary js-complete-order"
          style="margin-top: 10px;" 
          data-order-id="${order.id}" 
          data-product-id="${product.id}">
          Complete
        </button>

      </div>
    `;
  });

  return productsHTML;
}

function removeFromOrder(orderId, productId) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;

    const order = orders[orderIndex];
    order.products = order.products.filter(p => p.productId !== productId);

    if (order.products.length === 0) {
        orders.splice(orderIndex, 1);
    }

    localStorage.setItem('orders', JSON.stringify(orders));
}

function handleSearch() {
    const searchInput = document.querySelector('.search-bar');
    const searchTerm = searchInput.value.toLowerCase();

    const filteredOrders = orders.filter((order) => {
        const orderDateString = dayjs(order.orderTime).format('MMMM D').toLowerCase();
        return orderDateString.includes(searchTerm);
    });

    renderOrdersGrid(filteredOrders);
}

document.querySelector('.search-button').addEventListener('click', handleSearch);
document.querySelector('.search-bar').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') handleSearch();
});

loadPage();