document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and sections
    const navLinks = document.querySelectorAll('.profile-nav li a');
    const sections = document.querySelectorAll('.profile-section');

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and add to clicked link's parent
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => section.classList.add('hidden'));
            
            // Show the selected section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Form submission handling
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add animation to save button
            const saveBtn = this.querySelector('.save-btn');
            saveBtn.textContent = 'Saving...';
            saveBtn.disabled = true;
            
            // Simulate saving (replace with actual API call)
            setTimeout(() => {
                saveBtn.textContent = 'Saved!';
                setTimeout(() => {
                    saveBtn.textContent = 'Save Changes';
                    saveBtn.disabled = false;
                }, 1000);
            }, 1500);
        });
    }

    // Address management
    const addressList = document.querySelector('.address-list');
    const addAddressBtn = document.querySelector('.add-address-btn');

    // Sample address data structure
    let addresses = [
        {
            id: 1,
            type: 'Home',
            street: '123 Main Street',
            apt: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            zip: '10001'
        }
    ];

    // Function to create address form
    function createAddressForm(address = null) {
        const form = document.createElement('form');
        form.className = 'address-form';
        form.innerHTML = `
            <div class="form-group">
                <label>Address Type</label>
                <input type="text" name="type" value="${address ? address.type : ''}" required>
            </div>
            <div class="form-group">
                <label>Street Address</label>
                <input type="text" name="street" value="${address ? address.street : ''}" required>
            </div>
            <div class="form-group">
                <label>Apartment/Suite</label>
                <input type="text" name="apt" value="${address ? address.apt : ''}">
            </div>
            <div class="form-group">
                <label>City</label>
                <input type="text" name="city" value="${address ? address.city : ''}" required>
            </div>
            <div class="form-group">
                <label>State</label>
                <input type="text" name="state" value="${address ? address.state : ''}" required>
            </div>
            <div class="form-group">
                <label>ZIP Code</label>
                <input type="text" name="zip" value="${address ? address.zip : ''}" required>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">${address ? 'Update' : 'Add'} Address</button>
                <button type="button" class="btn-secondary cancel-btn">Cancel</button>
            </div>
        `;
        return form;
    }

    // Function to render address card
    function renderAddressCard(address) {
        const card = document.createElement('div');
        card.className = 'address-card';
        card.dataset.id = address.id;
        card.innerHTML = `
            <div class="address-type">${address.type}</div>
            <p>${address.street}</p>
            ${address.apt ? `<p>${address.apt}</p>` : ''}
            <p>${address.city}, ${address.state} ${address.zip}</p>
            <div class="address-actions">
                <button class="btn-secondary edit-btn">Edit</button>
                <button class="btn-danger delete-btn">Delete</button>
            </div>
        `;
        return card;
    }

    // Function to render all addresses
    function renderAddresses() {
        const addressContainer = document.createElement('div');
        addresses.forEach(address => {
            addressContainer.appendChild(renderAddressCard(address));
        });
        addressContainer.appendChild(addAddressBtn);
        addressList.innerHTML = '';
        addressList.appendChild(addressContainer);
    }

    // Add new address
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            const form = createAddressForm();
            addressList.insertBefore(form, addAddressBtn);
            addAddressBtn.style.display = 'none';

            // Handle form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const newAddress = {
                    id: Date.now(),
                    type: this.type.value,
                    street: this.street.value,
                    apt: this.apt.value,
                    city: this.city.value,
                    state: this.state.value,
                    zip: this.zip.value
                };
                addresses.push(newAddress);
                renderAddresses();
            });

            // Handle cancel
            form.querySelector('.cancel-btn').addEventListener('click', function() {
                form.remove();
                addAddressBtn.style.display = 'block';
            });
        });
    }

    // Edit and delete address
    if (addressList) {
        addressList.addEventListener('click', function(e) {
            const card = e.target.closest('.address-card');
            if (!card) return;

            if (e.target.classList.contains('edit-btn')) {
                const addressId = parseInt(card.dataset.id);
                const address = addresses.find(a => a.id === addressId);
                const form = createAddressForm(address);
                card.replaceWith(form);
                addAddressBtn.style.display = 'none';

                // Handle form submission
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const updatedAddress = {
                        id: addressId,
                        type: this.type.value,
                        street: this.street.value,
                        apt: this.apt.value,
                        city: this.city.value,
                        state: this.state.value,
                        zip: this.zip.value
                    };
                    addresses = addresses.map(a => a.id === addressId ? updatedAddress : a);
                    renderAddresses();
                });

                // Handle cancel
                form.querySelector('.cancel-btn').addEventListener('click', function() {
                    renderAddresses();
                });
            }

            if (e.target.classList.contains('delete-btn')) {
                if (confirm('Are you sure you want to delete this address?')) {
                    const addressId = parseInt(card.dataset.id);
                    addresses = addresses.filter(a => a.id !== addressId);
                    renderAddresses();
                }
            }
        });
    }

    // Initial render
    renderAddresses();

    // Wishlist actions
    const removeWishlistBtns = document.querySelectorAll('.remove-wishlist');
    removeWishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            productCard.style.opacity = '0';
            setTimeout(() => productCard.remove(), 300);
        });
    });

    // Settings form handling
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your settings update logic here
            alert('Settings updated successfully!');
        });
    }
});