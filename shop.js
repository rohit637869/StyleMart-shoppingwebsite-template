document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const productGrid = document.querySelector('.product-grid');
    const categoryFilters = document.querySelectorAll('.filter-group input[type="checkbox"]');
    const priceSlider = document.querySelector('.price-slider');
    const priceValues = document.querySelector('.price-values');
    const sortSelect = document.getElementById('sort');

    // Store original products for filtering
    const originalProducts = Array.from(document.querySelectorAll('.product-card'));

    // Filter products based on selected categories and price
    function filterProducts() {
        const selectedCategories = Array.from(categoryFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const maxPrice = parseInt(priceSlider.value);

        const filteredProducts = originalProducts.filter(product => {
            const price = parseFloat(product.querySelector('.price').textContent.replace('$', ''));
            const matchesPrice = price <= maxPrice;

            // If no categories selected, show all products that match price
            if (selectedCategories.length === 0) return matchesPrice;

            // Check if product matches selected categories
            const productCategory = getProductCategory(product);
            return selectedCategories.includes(productCategory) && matchesPrice;
        });

        displayProducts(filteredProducts);
    }

    // Sort products based on selected option
    function sortProducts() {
        const products = Array.from(productGrid.children);
        const sortValue = sortSelect.value;

        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));

            switch (sortValue) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'newest':
                    return b.dataset.productId - a.dataset.productId;
                default: // 'popular'
                    return 0; // Maintain original order for popular
            }
        });

        displayProducts(products);
    }

    // Helper function to determine product category
    function getProductCategory(product) {
        const title = product.querySelector('h3').textContent.toLowerCase();
        if (title.includes('shirt') || title.includes('jeans')) return 'mens';
        if (title.includes('dress')) return 'womens';
        if (title.includes('wallet') || title.includes('sunglasses')) return 'accessories';
        if (title.includes('shoes')) return 'footwear';
        return 'other';
    }

    // Display filtered and sorted products
    function displayProducts(products) {
        productGrid.innerHTML = '';
        products.forEach(product => productGrid.appendChild(product));
    }

    // Update price range display
    function updatePriceRange() {
        const maxPrice = priceSlider.value;
        priceValues.children[1].textContent = `$${maxPrice}`;
    }

    // Event listeners
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', filterProducts);
    });

    priceSlider.addEventListener('input', () => {
        updatePriceRange();
        filterProducts();
    });

    sortSelect.addEventListener('change', () => {
        sortProducts();
        filterProducts(); // Apply current filters after sorting
    });
});