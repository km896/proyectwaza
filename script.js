document.addEventListener('DOMContentLoaded', function() {
    // Variables
    let cart = [];
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const contactForm = document.getElementById('contactForm');

    // Abrir carrito
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
        renderCartItems();
    });

    // Cerrar carrito
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Añadir producto al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            // Verificar si el producto ya está en el carrito
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            updateCartCount();
            showAddToCartFeedback(button);
        });
    });

    // Renderizar items del carrito
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
            totalAmount.textContent = '$0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name} x${item.quantity}</div>
                    <div class="cart-item-price">$${(itemTotal).toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <span class="cart-item-remove" data-id="${item.id}">🗑️</span>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        totalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.getAttribute('data-id');
                removeFromCart(itemId);
            });
        });
    }

    // Eliminar item del carrito
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCartCount();
        renderCartItems();
    }

    // Actualizar contador del carrito
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Mostrar feedback al añadir al carrito
    function showAddToCartFeedback(button) {
        const originalText = button.textContent;
        button.textContent = '¡Añadido!';
        button.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '#e67e22';
        }, 1500);
    }

    // Procesar pago
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        // Aquí iría la integración con el servicio de pago
        alert('Redirigiendo a la pasarela de pago...');
        
        // Simular pago exitoso
        setTimeout(() => {
            alert('¡Pago exitoso! Gracias por tu compra.');
            cart = [];
            updateCartCount();
            renderCartItems();
            cartModal.classList.remove('active');
        }, 2000);
    });

    // Manejar formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Aquí iría el código para enviar el formulario a un servidor
            alert(`Gracias ${name}, tu mensaje ha sido enviado. Te responderemos a ${email} pronto.`);
            
            contactForm.reset();
        });
    }

    // Smooth scrolling para enlaces del menú
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
});
