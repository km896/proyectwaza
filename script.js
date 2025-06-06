let cart = [];
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');

// Open/close cart
document.querySelector('.cart-icon').addEventListener('click', () => {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Add to cart
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const product = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: parseFloat(button.dataset.price)
        };
        cart.push(product);
        updateCart();
    });
});

// Update cart UI
function updateCart() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-item" data-index="${index}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    // Update total and count
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = cart.length;

    // Add remove item functionality
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// PDF Generation
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add store info
    doc.setFontSize(18);
    doc.text('Zapatería Jiménez', 20, 20);
    doc.setFontSize(12);
    doc.text('Av. Principal 123, Centro, Ciudad', 20, 30);
    doc.text('info@zapateriajimenez.com', 20, 35);
    doc.text('(555) 123-4567', 20, 40);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 45);

    // Add purchase details
    doc.setFontSize(14);
    doc.text('Recibo de Compra', 20, 60);
    let y = 70;
    cart.forEach(item => {
        doc.text(`${item.name}: $${item.price.toFixed(2)}`, 20, y);
        y += 10;
    });

    // Add total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    doc.setFontSize(12);
    doc.text(`Total: $${total.toFixed(2)}`, 20, y + 10);

    // Save PDF
    doc.save('recibo_zapateria_jimenez.pdf');

    // Clear cart after purchase
    cart = [];
    updateCart();
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    alert('Compra realizada con éxito. El recibo ha sido descargado.');
});

// Comments Section
const commentForm = document.querySelector('#comment-form');
const commentsContainer = document.querySelector('.comments-grid');

// Load comments from localStorage
function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    commentsContainer.innerHTML = '';
    comments.forEach(comment => {
        const commentCard = document.createElement('div');
        commentCard.classList.add('comment-card');
        commentCard.innerHTML = `
            <div class="rating">
                ${'<i class="fas fa-star"></i>'.repeat(comment.rating)}
                ${'<i class="far fa-star"></i>'.repeat(5 - comment.rating)}
            </div>
            <p>"${comment.text}"</p>
            <div class="client-info">
                <div>
                    <h4>${comment.name}</h4>
                    <span>${new Date(comment.date).toLocaleDateString()}</span>
                </div>
            </div>
        `;
        commentsContainer.appendChild(commentCard);
    });
}

// Submit comment
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = commentForm.querySelector('input[name="name"]').value;
    const text = commentForm.querySelector('textarea[name="comment"]').value;
    const rating = parseInt(commentForm.querySelector('select[name="rating"]').value);

    const comment = {
        name,
        text,
        rating,
        date: new Date().toISOString()
    };

    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));

    commentForm.reset();
    loadComments();
});

// Initialize comments
loadComments();
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const cartCount = document.querySelector('.cart-count');

    let cart = [];

    // Abrir carrito
    cartIcon.addEventListener('click', function() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });

    // Cerrar carrito
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    cartOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    // Añadir al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
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

            updateCart();

            // Mostrar notificación
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = `${name} añadido al carrito`;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        });
    });

    // Actualizar carrito
    function updateCart() {
        renderCartItems();
        updateCartTotal();
        updateCartCount();
    }

    // Renderizar items del carrito
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            return;
        }

        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';

            cartItemElement.innerHTML = `
                <img src="https://via.placeholder.com/80" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                    <span class="cart-item-remove" data-id="${item.id}">Eliminar</span>
                </div>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        // Event listeners para botones de cantidad
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);

                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== id);
                }

                updateCart();
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                item.quantity += 1;
                updateCart();
            });
        });

        // Event listeners para eliminar
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }

    // Actualizar total del carrito
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Actualizar contador del carrito
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
    }

    // Estilos para la notificación
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #5a4e3c;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 2000;
        }
        
        .notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
