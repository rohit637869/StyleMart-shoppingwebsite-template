// Get DOM elements
const summaryItems = document.getElementById('summary-items');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const shippingForm = document.getElementById('shipping-form');

// Get cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Calculate totals
const shipping = 5.00;
let subtotal = 0;

// Display cart items in summary
function displayCartItems() {
    summaryItems.innerHTML = '';
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-item';
        itemElement.innerHTML = `
            <span class="item-name">${item.name} x ${item.quantity}</span>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        summaryItems.appendChild(itemElement);
    });

    // Update totals
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    const total = subtotal + shipping;
    totalElement.textContent = `$${total.toFixed(2)}`;

    return total;
}

// Initialize PayPal button
function initPayPalButton(total) {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2)
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Clear cart after successful payment
                localStorage.removeItem('cart');
                
                // Show success message
                alert('Transaction completed by ' + details.payer.name.given_name);
                
                // Redirect to confirmation page or home
                window.location.href = 'index.html';
            });
        },
        onError: function(err) {
            console.error('PayPal Error:', err);
            alert('There was an error processing your payment. Please try again.');
        }
    }).render('#paypal-button-container');
}

// Form validation
function validateForm() {
    const inputs = shippingForm.querySelectorAll('input');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
    const total = displayCartItems();
    
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'cart.html';
        return;
    }

    initPayPalButton(total);

    // Form input validation
    shippingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Form is valid, payment can proceed
            document.querySelector('#paypal-button-container').style.display = 'block';
        }
    });
});