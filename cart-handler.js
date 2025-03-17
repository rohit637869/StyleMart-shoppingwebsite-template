// Cart data structure
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count badge
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartIcons = document.querySelectorAll('.fa-shopping-cart');
    cartIcons.forEach(icon => {
        const badge = icon.nextElementSibling || document.createElement('span');
        if (!icon.nextElementSibling) {
            badge.className = 'cart-badge';
            icon.parentElement.appendChild(badge);
        }
        badge.textContent = cartCount || '';
    });
}

// Add item to cart
function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId,
            name,
            price,
            image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    showAddedToCartFeedback();
}

// Show feedback when item is added
function showAddedToCartFeedback() {
    const feedback = document.createElement('div');
    feedback.className = 'add-to-cart-feedback';
    feedback.textContent = 'Item added to cart!';
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.classList.add('show');
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }, 100);
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Add click handlers to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        const productCard = button.closest('.product-card');
        const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
        const name = productCard.querySelector('h3').textContent;
        const price = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
        const image = productCard.querySelector('img').src;
        
        button.addEventListener('click', () => {
            addToCart(productId, name, price, image);
        });
    });
});