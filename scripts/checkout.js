import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";
// import '../data/cart-class.js';
// import '../data/backend-practice.js'

async function loadPage() {
    try {
        // throw 'error1';

        await loadProductsFetch();

        await new Promise((resolve, reject) => {
            // throw 'error 2';
            loadCart(() => {
                // reject('error 3');
                resolve();
            });
        });

    } catch (error) {
        console.log('Unexpected error. Please try again later..!');
    }

    renderOrderSummary();
    renderPaymentSummary();
}

loadPage();

/*
// built in class need to give a function
Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })
]).then((values) => {
    console.log(values);
    renderOrderSummary();
    renderPaymentSummary();
})
*/

/*
// built in class need to give a function
new Promise((resolve) => {
    loadProducts(() => {
        resolve();
    });
}).then(() => {
    return new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    });
}).then(() => {
    renderOrderSummary();
    renderPaymentSummary();
});
*/

/*
loadProducts(() => {
    loadCart(() => {
        renderOrderSummary();
        renderPaymentSummary();
    });
});
*/