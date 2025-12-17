import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart, cart } from "../data/cart.js";

async function loadPage() {
    try {
        await loadProductsFetch();

        await new Promise((resolve) => {
            loadCart(() => {
                resolve();
            });
        });

    } catch (error) {
        console.log('Unexpected error. Please try again later..!');
    }

    // Check if cart is empty
    if (cart.length === 0) {
        document.querySelector('.checkout-grid').innerHTML = `
            <div class="empty-cart-message">
                <h2>Your cart is empty.</h2>
                <a href="amazon.html">
                    <button class="button-primary">View products</button>
                </a>
            </div>
        `;
        return;
    }

    renderOrderSummary();
    renderPaymentSummary();
}

loadPage();