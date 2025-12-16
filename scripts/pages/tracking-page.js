import { orders } from '../../data/orders.js';
import { getProduct, loadProductsFetch } from '../../data/products.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

async function loadPage() {
    await loadProductsFetch();

    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId');

    const order = orders.find((o) => o.id === orderId);
    const product = getProduct(productId);

    if (!order || !product) {
        document.querySelector('.js-order-tracking').innerHTML = '<h2>Order not found.</h2>';
        return;
    }

    let productDetails;
    order.products.forEach((details) => {
        if (details.productId === product.id) {
            productDetails = details;
        }
    });

    const orderTime = dayjs(order.orderTime);
    const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);

    const diffInDays = deliveryTime.diff(orderTime, 'days');

    let percentProgress = 0;

    if (diffInDays >= 6) {
        percentProgress = 20;
    } else if (diffInDays >= 3) {
        percentProgress = 50;
    } else {
        percentProgress = 80;
    }

    const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${deliveryTime.format('dddd, MMMM D')}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label ${percentProgress < 50 ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${percentProgress >= 50 && percentProgress < 100 ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${percentProgress >= 100 ? 'current-status' : ''}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

    document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
}

loadPage();