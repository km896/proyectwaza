let cart = [];
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');
const commentForm = document.querySelector('#comment-form');
const commentsContainer = document.querySelector('.comments-grid');

// Notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #2c3e50;
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
    .cart-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }
    .cart-item img {
        width: 80px;
        height: 80px;
        margin-right: 10px;
    }
    .cart-item-info {
        flex-grow: 1;
    }
    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .cart-item-quantity button {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
    }
    .cart-item-remove {
        color: #e74c3c;
        cursor: pointer;
        font-size: 14px;
    }
`;
document.head.appendChild(style);

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
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

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

        // Show notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = `${name} añadido al carrito`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    });
});

// Update cart UI
function updateCart() {
    renderCartItems();
    updateCartTotal();
    updateCartCount();
}

// Render cart items
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

    // Event listeners for quantity buttons
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
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
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            item.quantity += 1;
            updateCart();
        });
    });

    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            cart = cart.filter(item => item.id !== id);
            updateCart();
        });
    });
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// PDF Generation with Enhanced Design
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Colors and fonts
    doc.setFont('Helvetica', 'bold');
    const primaryColor = '#2c3e50';
    const accentColor = '#e74c3c';
    const lightGray = '#f1f1f1';

    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Zapatería Jiménez', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Av. Principal 123, Centro, Ciudad', 105, 22, { align: 'center' });
    doc.text('info@zapateriajimenez.com | (555) 123-4567', 105, 27, { align: 'center' });

    // Receipt title and metadata
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Recibo de Compra', 20, 40);
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, 20, 48);
    doc.text(`Hora: ${new Date().toLocaleTimeString('es-MX')}`, 20, 54);

    // Table header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setFillColor(200, 200, 200);
    doc.rect(20, 60, 170, 8, 'F');
    doc.text('Producto', 22, 66);
    doc.text('Cantidad', 120, 66);
    doc.text('Precio', 160, 66, { align: 'right' });

    // Table content
    let y = 68;
    cart.forEach((item, index) => {
        y += 8;
        doc.setFillColor(index % 2 === 0 ? lightGray : 255, 255, 255);
        doc.rect(20, y, 170, 8, 'F');
        doc.setFont('Helvetica', 'normal');
        doc.text(item.name, 22, y + 6);
        doc.text(`${item.quantity}`, 120, y + 6);
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 160, y + 6, { align: 'right' });
    });

    // Table border
    doc.setDrawColor(0);
    doc.rect(20, 60, 170, y - 52); // Adjust height based on items

    // Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(accentColor);
    doc.text(`Total: $${total.toFixed(2)}`, 160, y + 12, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'italic');
    doc.text('Gracias por su compra en Zapatería Jiménez.', 105, 270, { align: 'center' });
    doc.text('¡Esperamos verle pronto!', 105, 275, { align: 'center' });

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
