// Bar Inventory Manager - JavaScript
// This file contains the core logic for the Bar-OS frontend interface
// It handles data management, UI rendering, and user interactions

// Category icons mapping
const categoryIcons = {
    spirits: 'ETH',
    wine: 'VIN',
    beer: 'HOP',
    softdrinks: 'H2O',
    ingredients: 'EXT'
};

const categoryNames = {
    spirits: 'Ethanol / Spirits',
    wine: 'Vino / Sparkling',
    beer: 'Hops / Malt',
    softdrinks: 'Hydration / Softs',
    ingredients: 'Extracts / Fresh'
};

// Sample data - Realistic bar inventory with diverse items and stock levels
// This serves as initial data and demonstrates the system's capabilities
const sampleProducts = [
    { id: 1, name: 'Absolut Vodka', category: 'spirits', size: '0.7L', stock: 8, minStock: 5, price: 15.99, sellPrice: 6.50, velocity: 'HIGH', notes: 'Top Performance' },
    { id: 2, name: 'Havana Club 7 años', category: 'spirits', size: '0.7L', stock: 3, minStock: 4, price: 22.99, sellPrice: 7.50, velocity: 'STABLE', notes: 'Neural Mix Ingredient' },
    { id: 3, name: 'Tanqueray Gin', category: 'spirits', size: '0.7L', stock: 6, minStock: 3, price: 19.99, sellPrice: 7.00, velocity: 'MODERATE', notes: '' },
    { id: 4, name: 'Aperol', category: 'spirits', size: '1L', stock: 12, minStock: 5, price: 14.99, sellPrice: 5.50, velocity: 'VOLATILE', notes: 'Seasonal Spike' },
    { id: 5, name: 'Prosecco Spumante', category: 'wine', size: '0.75L', stock: 24, minStock: 10, price: 6.99, sellPrice: 5.00, velocity: 'STABLE', notes: 'Core Component' },
    { id: 6, name: 'Weißwein Riesling', category: 'wine', size: '0.75L', stock: 8, minStock: 6, price: 8.99, sellPrice: 6.00, velocity: 'LOW', notes: '' },
    { id: 7, name: 'Warsteiner Premium', category: 'beer', size: '0.5L', stock: 48, minStock: 24, price: 0.89, sellPrice: 3.50, velocity: 'HIGH', notes: 'Constant Flux' },
    { id: 8, name: 'Corona Extra', category: 'beer', size: '0.33L', stock: 18, minStock: 12, price: 1.29, sellPrice: 4.00, velocity: 'LOW', notes: '' },
    { id: 9, name: 'Coca-Cola', category: 'softdrinks', size: '1L', stock: 15, minStock: 10, price: 1.49, sellPrice: 3.00, velocity: 'STABLE', notes: '' },
    { id: 10, name: 'Red Bull', category: 'softdrinks', size: '0.25L', stock: 36, minStock: 20, price: 1.19, sellPrice: 3.50, velocity: 'HIGH', notes: '' },
    { id: 11, name: 'Tonic Water Fever-Tree', category: 'softdrinks', size: '0.2L', stock: 2, minStock: 12, price: 1.59, sellPrice: 2.50, velocity: 'CRITICAL', notes: 'URGENT RESTOCK REQUIRED' },
    { id: 12, name: 'Limetten (Bio)', category: 'ingredients', size: 'Netz 500g', stock: 4, minStock: 3, price: 2.99, sellPrice: 0.50, velocity: 'HIGH', notes: 'Organic Extract' },
    { id: 13, name: 'Minze frisch', category: 'ingredients', size: 'Bund', stock: 2, minStock: 4, price: 1.99, sellPrice: 0.30, velocity: 'HIGH', notes: 'Freshness Sensor Active' },
    { id: 14, name: 'Zucker-Sirup', category: 'ingredients', size: '1L', stock: 5, minStock: 2, price: 4.99, sellPrice: 0.20, velocity: 'LOW', notes: 'Synthetic Yield' },
];

// State - Central application state management
// Using a simple state object pattern for maintainability
let products = JSON.parse(localStorage.getItem('barInventory')) || [...sampleProducts];
let currentCategory = 'all';  // Track currently selected category filter
let searchQuery = '';         // Track current search query
let editingProductId = null;  // Track which product is being edited (if any)

// DOM Elements - Cache references to frequently used elements for performance
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
                currentCategory === 'all' ? 'Global Inventory' : categoryNames[currentCategory];
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
    const velocity = product.velocity || 'STABLE';
    const sku = `BAR-${product.category.substring(0, 3).toUpperCase()}-${String(product.id).padStart(4, '0')}`;

    return `
        <div class="product-card ${isLowStock ? 'low-stock' : ''}">
            <div class="product-header">
                <div class="product-info">
                    <div style="font-size: 0.6rem; font-family: var(--font-mono); color: var(--text-secondary); margin-bottom: 2px;">ID: ${sku}</div>
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
            <div class="stock-buttons" style="display: flex; gap: 0.4rem; margin-bottom: 1rem;">
                <button class="stock-adjust" data-id="${product.id}" data-amount="-1" style="flex:1; padding: 0.4rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-secondary); cursor: pointer; font-family: var(--font-mono); font-size: 0.75rem;">-1</button>
                <button class="stock-adjust" data-id="${product.id}" data-amount="1" style="flex:1; padding: 0.4rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-secondary); cursor: pointer; font-family: var(--font-mono); font-size: 0.75rem;">+1</button>
                <button class="stock-adjust" data-id="${product.id}" data-amount="6" style="flex:1; padding: 0.4rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-secondary); cursor: pointer; font-family: var(--font-mono); font-size: 0.75rem;">+6</button>
            </div>
            <div class="product-details">
                <div class="price-info">
                    <span style="font-size: 0.65rem; color: var(--text-secondary);">VELOCITY: <span style="color: var(--accent-primary); font-family: var(--font-mono);">${velocity}</span></span>
                    <strong>YIELD: ${product.sellPrice.toFixed(2)}€</strong>
                </div>
                <div class="product-actions">
                    <button class="edit-btn" data-id="${product.id}">MOD</button>
                    <button class="delete-btn delete" data-id="${product.id}">DEL</button>
                </div>
            </div>
            ${product.notes ? `<div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color); font-size: 0.7rem; color: var(--text-secondary); font-family: var(--font-mono); line-height: 1.2;">> ${product.notes}</div>` : ''}
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
            modalTitle.textContent = 'Modify Unit';
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
        modalTitle.textContent = 'Initialize Unit';
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
            showToast('UNIT_REGISTRY_UPDATED');
        }
    } else {
        // Add new product
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        products.push({ id: newId, ...productData });
        showToast('NEW_UNIT_INITIALIZED');
    }

    saveToLocalStorage();
    renderProducts();
    updateStats();
    updateCategoryCounts();
    closeModal();
}

// Delete product
function deleteProduct(id) {
    if (confirm('CONFIRM_UNIT_DESTRUCTION?')) {
        products = products.filter(p => p.id !== id);
        saveToLocalStorage();
        renderProducts();
        updateStats();
        updateCategoryCounts();
        showToast('UNIT_PURGED', true);
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

    showToast('EXPORT_COMPLETE');
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