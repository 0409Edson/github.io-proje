// ===== Cart State =====
let cart = [];

// ===== DOM Elements =====
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const contactForm = document.getElementById('contactForm');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

// ===== Cart Functions =====

/**
 * Add item to cart
 * @param {number} id - Product ID
 * @param {string} name - Product name
 * @param {number} price - Product price
 */
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${name} adicionado ao carrinho!`);
}

/**
 * Remove item from cart
 * @param {number} id - Product ID
 */
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

/**
 * Update item quantity
 * @param {number} id - Product ID
 * @param {number} change - Quantity change (+1 or -1)
 */
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

/**
 * Update cart UI
 */
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <p>🛒 Seu carrinho está vazio</p>
                <p>Adicione alguns chás deliciosos!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-emoji">🍵</span>
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-qty">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `€${total.toFixed(2)}`;
    
    // Save to localStorage
    localStorage.setItem('teaShopCart', JSON.stringify(cart));
}

/**
 * Checkout function
 */
function checkout() {
    if (cart.length === 0) {
        showNotification('Adicione itens ao carrinho primeiro!', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    showNotification(`Compra finalizada! Total: €${total.toFixed(2)} 🎉`, 'success');
    cart = [];
    updateCart();
    closeCartModal();
}

// ===== Modal Functions =====

/**
 * Open cart modal
 */
function openCartModal() {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close cart modal
 */
function closeCartModal() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Notification Function =====

/**
 * Show notification toast
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, warning, info)
 */
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? '#2d5a3d' : type === 'warning' ? '#e67e22' : '#3498db'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 0.95rem;
    `;
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== Event Listeners =====

// Cart icon click
cartIcon.addEventListener('click', openCartModal);

// Cart close button
cartClose.addEventListener('click', closeCartModal);

// Close modal on backdrop click
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartModal.classList.contains('active')) {
        closeCartModal();
    }
});

// Contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    
    showNotification(`Obrigado ${name}! Mensagem enviada com sucesso! 📧`, 'success');
    contactForm.reset();
});

// Mobile menu toggle (basic implementation)
mobileMenuBtn.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'white';
    navLinks.style.flexDirection = 'column';
    navLinks.style.padding = '20px';
    navLinks.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    navLinks.style.gap = '16px';
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.querySelector('.nav-links').style.display = 'none';
            }
        }
    });
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(45, 90, 61, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(45, 90, 61, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.querySelectorAll('.product-card, .feature-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('teaShopCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
});

// Console welcome message
console.log('%c🍵 Casa do Chá', 'font-size: 24px; font-weight: bold; color: #2d5a3d;');
console.log('%cBem-vindo à nossa loja de chás!', 'font-size: 14px; color: #5a6b5c;');
