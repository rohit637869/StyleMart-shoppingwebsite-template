document.addEventListener('DOMContentLoaded', () => {
    // Initialize filter handlers
    const filterInputs = document.querySelectorAll('.filter-section input[type="checkbox"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', updateFilters);
    });

    // Initialize sort handler
    const sortSelect = document.getElementById('sort');
    sortSelect.addEventListener('change', updateSort);

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
});

function updateFilters() {
    const selectedFilters = {
        price: getSelectedValues('price'),
        size: getSelectedValues('size'),
        color: getSelectedValues('color')
    };

    // Get all product cards
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const price = parseFloat(product.querySelector('.price').textContent.replace('$', ''));
        // Add more product attributes as needed
        
        // Simple filter logic - can be expanded based on requirements
        let visible = true;
        
        if (selectedFilters.price.length > 0) {
            const priceMatch = selectedFilters.price.some(range => {
                const [min, max] = range.split('-').map(val => val === '+' ? Infinity : parseFloat(val));
                return price >= min && price <= max;
            });
            visible = visible && priceMatch;
        }

        // Apply visibility
        product.style.display = visible ? 'block' : 'none';
    });
}

function getSelectedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(input => input.value);
}

function updateSort() {
    const sortValue = document.getElementById('sort').value;
    const productGrid = document.querySelector('.category-grid');
    const sections = Array.from(productGrid.querySelectorAll('.category-section'));

    sections.forEach(section => {
        const products = Array.from(section.querySelectorAll('.product-card'));
        const sortedProducts = sortProducts(products, sortValue);
        
        const productGrid = section.querySelector('.product-grid');
        productGrid.innerHTML = '';
        sortedProducts.forEach(product => productGrid.appendChild(product));
    });
}

function sortProducts(products, sortValue) {
    return products.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
        const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));

        switch (sortValue) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            // Add more sorting options as needed
            default:
                return 0;
        }
    });
}

function addToCart(event) {
    const button = event.target;
    const product = button.closest('.product-card');
    const productId = product.dataset.productId;
    const productName = product.querySelector('h3').textContent;
    const productPrice = product.querySelector('.price').textContent;

    // Add animation feedback
    button.textContent = 'Added!';
    button.classList.add('added');
    
    // Reset button after animation
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.classList.remove('added');
    }, 2000);

    // Here you would typically send this data to a cart handler or localStorage
    const cartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1
    };

    // Dispatch custom event for cart handling
    const cartEvent = new CustomEvent('addToCart', { detail: cartItem });
    document.dispatchEvent(cartEvent);
}