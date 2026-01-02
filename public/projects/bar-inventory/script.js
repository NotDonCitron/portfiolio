// Bar Inventory Manager - JavaScript

// Category icons mapping
const categoryIcons = {
    spirits: '🥃',
    wine: '🍷',
    beer: '🍺',
    softdrinks: '🥤',
    ingredients: '🍋'
};

const categoryNames = {
    spirits: 'Spirituosen',
    wine: 'Wein & Sekt',
    beer: 'Bier',
    softdrinks: 'Softdrinks',
    ingredients: 'Zutaten'
};

// Sample data - realistic bar inventory
const sampleProducts = [
    { id: 1, name: 'Absolut Vodka', category: 'spirits', size: '0.7L', stock: 8, minStock: 5, price: 15.99, sellPrice: 6.50, notes: 'Bestseller' },
    { id: 2, name: 'Havana Club 7 años', category: 'spirits', size: '0.7L', stock: 3, minStock: 4, price: 22.99, sellPrice: 7.50, notes: 'Für Mojitos' },
    { id: 3, name: 'Tanqueray Gin', category: 'spirits', size: '0.7L', stock: 6, minStock: 3, price: 19.99, sellPrice: 7.00, notes: '' },
    { id: 4, name: 'Aperol', category: 'spirits', size: '1L', stock: 12, minStock: 5, price: 14.99, sellPrice: 5.50, notes: 'Sommerklassiker' },
    { id: 5, name: 'Prosecco Spumante', category: 'wine', size: '0.75L', stock: 24, minStock: 10, price: 6.99, sellPrice: 5.00, notes: 'Für Aperol Spritz' },
    { id: 6, name: 'Weißwein Riesling', category: 'wine', size: '0.75L', stock: 8, minStock: 6, price: 8.99, sellPrice: 6.00, notes: 'Trocken' },
    { id: 7, name: 'Warsteiner Premium', category: 'beer', size: '0.5L', stock: 48, minStock: 24, price: 0.89, sellPrice: 3.50, notes: 'Flasche' },
    { id: 8, name: 'Corona Extra', category: 'beer', size: '0.33L', stock: 18, minStock: 12, price: 1.29, sellPrice: 4.00, notes: 'Mit Limette servieren' },
    { id: 9, name: 'Coca-Cola', category: 'softdrinks', size: '1L', stock: 15, minStock: 10, price: 1.49, sellPrice: 3.00, notes: '' },
    { id: 10, name: 'Red Bull', category: 'softdrinks', size: '0.25L', stock: 36, minStock: 20, price: 1.19, sellPrice: 3.50, notes: '' },
    { id: 11, name: 'Tonic Water Fever-Tree', category: 'softdrinks', size: '0.2L', stock: 2, minStock: 12, price: 1.59, sellPrice: 2.50, notes: 'DRINGEND NACHBESTELLEN' },
    { id: 12, name: 'Limetten (Bio)', category: 'ingredients', size: 'Netz 500g', stock: 4, minStock: 3, price: 2.99, sellPrice: 0.50, notes: 'Für Cocktails' },
    { id: 13, name: 'Minze frisch', category: 'ingredients', size: 'Bund', stock: 2, minStock: 4, price: 1.99, sellPrice: 0.30, notes: 'Täglich prüfen' },
    { id: 14, name: 'Zucker-Sirup', category: 'ingredients', size: '1L', stock: 5, minStock: 2, price: 4.99, sellPrice: 0.20, notes: 'Selbstgemacht günstiger' },
];

// State
let products = JSON.parse(localStorage.getItem('barInventory')) || [...sampleProducts];
let currentCategory = 'all';
let searchQuery = '';
let editingProductId = null;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const toastContainer = document.getElementById('toastContainer');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateStats();
    updateCategoryCounts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderProducts();
    });

    // Category filter
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentCategory = item.dataset.category;
            document.getElementById('currentCategoryTitle').textContent = 
                currentCategory === 'all' ? 'Alle Produkte' : categoryNames[currentCategory];
            renderProducts();
        });
    });

    // Add product button
    document.getElementById('addProductBtn').addEventListener('click', () => {
        openModal();
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);

    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
    });

    // Form submit
    productForm.addEventListener('submit', handleFormSubmit);

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (btn.dataset.view === 'list') {
                productGrid.classList.add('list-view');
            } else {
                productGrid.classList.remove('list-view');
            }
        });
    });
}

// Render products
function renderProducts() {
    const filtered = products.filter(p => {
        const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery) || 
                             (p.notes && p.notes.toLowerCase().includes(searchQuery));
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        productGrid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    productGrid.innerHTML = filtered.map(product => createProductCard(product)).join('');

    // Add event listeners to product cards
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            openModal(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            deleteProduct(id);
        });
    });

    document.querySelectorAll('.stock-adjust').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const amount = parseInt(btn.dataset.amount);
            adjustStock(id, amount);
        });
    });
}

// Create product card HTML
function createProductCard(product) {
    const isLowStock = product.stock <= product.minStock;
    const stockPercentage = Math.min((product.stock / (product.minStock * 2)) * 100, 100);
    const stockLevel = stockPercentage > 66 ? 'high' : (stockPercentage > 33 ? 'medium' : 'low');

    return `
        <div class="product-card ${isLowStock ? 'low-stock' : ''}">
            <div class="product-header">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <span class="product-size">${product.size}</span>
                </div>
                <span class="product-category">${categoryIcons[product.category]}</span>
            </div>
            <div class="stock-display">
                <div class="stock-bar">
                    <div class="stock-fill ${stockLevel}" style="width: ${stockPercentage}%"></div>
                </div>
                <span class="stock-count">${product.stock}</span>
            </div>
            <div class="stock-buttons" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <button class="stock-adjust" data-id="${product.id}" data-amount="-1" style="flex:1; padding: 0.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-secondary); cursor: pointer;">−1</button>
                <button class="stock-adjust" data-id="${product.id}" data-amount="1" style="flex:1; padding: 0.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-secondary); cursor: pointer;">+1</button>
                <button class="stock-adjust" data-id="${product.id}" data-amount="6" style="flex:1; padding: 0.5rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-secondary); cursor: pointer;">+6</button>
            </div>
            <div class="product-details">
                <div class="price-info">
                    <span>EK: ${product.price.toFixed(2)}€</span>
                    <strong>VK: ${product.sellPrice.toFixed(2)}€</strong>
                </div>
                <div class="product-actions">
                    <button class="edit-btn" data-id="${product.id}">✏️</button>
                    <button class="delete-btn delete" data-id="${product.id}">🗑️</button>
                </div>
            </div>
            ${product.notes ? `<div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color); font-size: 0.8rem; color: var(--text-secondary); font-style: italic;">📝 ${product.notes}</div>` : ''}
        </div>
    `;
}

// Update stats
function updateStats() {
    const totalItems = products.length;
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('lowStockCount').textContent = lowStockCount;
    document.getElementById('totalValue').textContent = totalValue.toFixed(0) + '€';
}

// Update category counts
function updateCategoryCounts() {
    document.getElementById('count-all').textContent = products.length;
    document.getElementById('count-spirits').textContent = products.filter(p => p.category === 'spirits').length;
    document.getElementById('count-wine').textContent = products.filter(p => p.category === 'wine').length;
    document.getElementById('count-beer').textContent = products.filter(p => p.category === 'beer').length;
    document.getElementById('count-softdrinks').textContent = products.filter(p => p.category === 'softdrinks').length;
    document.getElementById('count-ingredients').textContent = products.filter(p => p.category === 'ingredients').length;
}

// Modal functions
function openModal(productId = null) {
    editingProductId = productId;
    productForm.reset();
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            modalTitle.textContent = 'Produkt bearbeiten';
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productSize').value = product.size;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productMinStock').value = product.minStock;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productSellPrice').value = product.sellPrice;
            document.getElementById('productNotes').value = product.notes || '';
            document.getElementById('productId').value = product.id;
        }
    } else {
        modalTitle.textContent = 'Neues Produkt';
        document.getElementById('productId').value = '';
    }
    
    productModal.classList.add('active');
}

function closeModal() {
    productModal.classList.remove('active');
    editingProductId = null;
}

// Form handling
function handleFormSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        size: document.getElementById('productSize').value || '-',
        stock: parseInt(document.getElementById('productStock').value) || 0,
        minStock: parseInt(document.getElementById('productMinStock').value) || 5,
        price: parseFloat(document.getElementById('productPrice').value) || 0,
        sellPrice: parseFloat(document.getElementById('productSellPrice').value) || 0,
        notes: document.getElementById('productNotes').value
    };

    if (editingProductId) {
        // Update existing product
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            showToast('Produkt aktualisiert ✓');
        }
    } else {
        // Add new product
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        products.push({ id: newId, ...productData });
        showToast('Produkt hinzugefügt ✓');
    }

    saveToLocalStorage();
    renderProducts();
    updateStats();
    updateCategoryCounts();
    closeModal();
}

// Delete product
function deleteProduct(id) {
    if (confirm('Produkt wirklich löschen?')) {
        products = products.filter(p => p.id !== id);
        saveToLocalStorage();
        renderProducts();
        updateStats();
        updateCategoryCounts();
        showToast('Produkt gelöscht', true);
    }
}

// Adjust stock
function adjustStock(id, amount) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.stock = Math.max(0, product.stock + amount);
        saveToLocalStorage();
        renderProducts();
        updateStats();
    }
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('barInventory', JSON.stringify(products));
}

// Export to CSV
function exportToCSV() {
    const headers = ['Name', 'Kategorie', 'Größe', 'Bestand', 'Mindestbestand', 'EK-Preis', 'VK-Preis', 'Notizen'];
    const rows = products.map(p => [
        p.name,
        categoryNames[p.category],
        p.size,
        p.stock,
        p.minStock,
        p.price.toFixed(2),
        p.sellPrice.toFixed(2),
        p.notes || ''
    ]);

    const csvContent = [
        headers.join(';'),
        ...rows.map(r => r.join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bar_inventar_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showToast('CSV exportiert ✓');
}

// Toast notification
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}