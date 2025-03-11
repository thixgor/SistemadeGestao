let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentOrderProducts = [];

// Initialize charts
let revenueChart, profitChart;

// Variável para armazenar produtos do orçamento atual
let quoteProducts = [];

// Add this variable at the top with other global variables
let currentTransactionProducts = [];

// DOM Elements
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const inventoryTable = document.getElementById('inventoryTable');
const transactionsTable = document.getElementById('transactionsTable');
const addProductBtn = document.getElementById('addProduct');
const generateQuoteBtn = document.getElementById('generateQuote');
const createOrderBtn = document.getElementById('createOrder');
const resetSystemBtn = document.getElementById('resetSystem');
const addEntryBtn = document.getElementById('addEntry');
const addExitBtn = document.getElementById('addExit');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
});

function initializeSystem() {
    loadDataFromStorage();
    setupEventListeners();
    initializeCharts();
    setupSearchSections();
    renderInventoryTable();
    renderTransactionsTable();
    updateDashboardStats();
    setupNavigation();
    setupAutoSave();
    checkUserName();
}

// Load data from storage
function loadDataFromStorage() {
    const storedInventory = localStorage.getItem('inventoryItems');
    const storedTransactions = localStorage.getItem('transactions');
    
    if (storedInventory) {
        inventoryItems = JSON.parse(storedInventory);
    }
    
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('nav ul li').forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            showSection(sectionId);
        });
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair do sistema?')) {
            localStorage.clear();
            window.location.reload();
        }
    });

    // Buttons
    addProductBtn?.addEventListener('click', () => openModal('productModal'));
    generateQuoteBtn?.addEventListener('click', openQuoteModal);
    createOrderBtn?.addEventListener('click', createOrder);
    addEntryBtn?.addEventListener('click', () => openTransactionModal('entry'));
    addExitBtn?.addEventListener('click', () => openTransactionModal('exit'));
    resetSystemBtn?.addEventListener('click', showResetVault);

    // Creator Info
    const creatorBtn = document.getElementById('creatorInfo');
    if (creatorBtn) {
        creatorBtn.addEventListener('click', () => {
            const modal = document.getElementById('creatorModal');
            if (modal) {
                modal.classList.add('active');
            }
        });
    }

    // Forms
    productForm?.addEventListener('submit', handleProductSubmit);
    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', handleTransactionSubmit);
        console.log('Transaction form submit event listener added'); // Debug log
    } else {
        console.error('Transaction form not found'); // Debug log
    }

    // Report buttons
    document.getElementById('salesReportBtn')?.addEventListener('click', generateSalesReport);
    document.getElementById('inventoryReportBtn')?.addEventListener('click', generateInventoryReport);
    document.getElementById('financialReportBtn')?.addEventListener('click', generateFinancialReport);
    document.getElementById('exportReport')?.addEventListener('click', exportReport);

    // Adicionar botões de backup
    document.getElementById('exportBackup')?.addEventListener('click', exportBackup);
    document.getElementById('importBackup')?.addEventListener('click', importBackup);

    // Orçamento
    document.getElementById('addOrderProduct')?.addEventListener('click', addProductToQuote);
    document.getElementById('addOrderProductForm')?.addEventListener('submit', handleAddProductToQuote);
    document.getElementById('orderForm')?.addEventListener('submit', handleQuoteSubmit);
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('dashboard-section').classList.add('active');
}

function showSection(sectionId) {
    // Hide all sections and remove active class
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('nav ul li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section and add active class
    const selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = 'block';
    selectedSection.classList.add('active');
    
    // Add active class to nav item
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

// Reset System with Vault
function showResetVault() {
    const modal = document.getElementById('resetVaultModal');
    const display = document.getElementById('vaultPassword');
    const buttons = modal.querySelectorAll('.vault-btn');
    let currentPassword = '';
    const correctPassword = '0000';

    // Reset display
    display.textContent = '****';
    
    // Remove existing error message if any
    const existingError = modal.querySelector('.vault-error');
    if (existingError) {
        existingError.remove();
    }

    // Add event listeners to buttons
    buttons.forEach(button => {
        button.onclick = (e) => {
            if (button.classList.contains('vault-clear')) {
                // Clear button
                currentPassword = '';
                display.textContent = '****';
            } else if (button.classList.contains('vault-enter')) {
                // Enter button
                if (currentPassword === correctPassword) {
                    closeModal('resetVaultModal');
                    executeReset();
                } else {
                    // Show error message
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'vault-error';
                    errorDiv.textContent = 'Senha incorreta!';
                    modal.querySelector('.modal-content').appendChild(errorDiv);
                    
                    // Clear password
                    currentPassword = '';
                    display.textContent = '****';
                    
                    // Add and remove active class for animation
                    errorDiv.classList.add('active');
                    setTimeout(() => errorDiv.classList.remove('active'), 500);
                }
            } else {
                // Number button
                if (currentPassword.length < 4) {
                    const number = button.dataset.number;
                    currentPassword += number;
                    display.textContent = currentPassword.padEnd(4, '*');
                }
            }
        };
    });

    modal.classList.add('active');
}

function executeReset() {
    const email = localStorage.getItem('userEmail'); // Salva o email atual
    const userName = localStorage.getItem('userName'); // Salva o nome do usuário também
    
    localStorage.clear(); // Limpa todo o localStorage
    
    // Restaura o email e o nome do usuário
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', userName);
    
    inventoryItems = [];
    transactions = [];
    updateDashboardStats();
    renderInventoryTable();
    renderTransactionsTable();
    initializeCharts();
    updateWelcomeName(userName);
    alert('Sistema resetado com sucesso!');
}

// Transaction Modal Functions
function openTransactionModal(type) {
    console.log('Opening transaction modal for type:', type); // Debug log
    
    const modal = document.getElementById('transactionModal');
    const title = document.getElementById('transactionModalTitle');
    const clientField = document.getElementById('clientField');
    const sellerField = document.getElementById('sellerField');
    const paymentMethodField = document.getElementById('paymentMethodField');
    const installmentsField = document.getElementById('installmentsField');
    const form = document.getElementById('transactionForm');
    const saveButton = modal.querySelector('.save-btn');

    // Reset current transaction products
    currentTransactionProducts = [];
    updateTransactionProductsTable();
    
    title.textContent = type === 'entry' ? 'Entrada de Produtos' : 'Saída de Produtos';
    
    // Show/hide fields based on transaction type
    clientField.style.display = type === 'exit' ? 'block' : 'none';
    sellerField.style.display = type === 'exit' ? 'block' : 'none';
    paymentMethodField.style.display = type === 'exit' ? 'block' : 'none';
    installmentsField.style.display = 'none';

    // Add payment method change listener
    const paymentSelect = document.getElementById('transactionPayment');
    paymentSelect.value = '';
    paymentSelect.onchange = function() {
        installmentsField.style.display = this.value === 'credito' ? 'block' : 'none';
    };

    // Setup add product button
    document.getElementById('addTransactionProduct').onclick = showAddTransactionProductModal;

    // Set the transaction type
    modal.dataset.type = type;
    console.log('Modal type set to:', modal.dataset.type); // Debug log

    // Reset form and event listeners
    form.reset();
    form.removeEventListener('submit', handleTransactionSubmit);
    saveButton.removeEventListener('click', handleTransactionSubmit);

    // Add only ONE event listener (for the form submit)
    form.addEventListener('submit', handleTransactionSubmit);

    // Remove the click event from the save button
    saveButton.onclick = null;

    // Show modal
    modal.classList.add('active');
}

function handleTransactionSubmit(e) {
    e.preventDefault();
    console.log('Form submitted'); // Debug log
    
    const modal = document.getElementById('transactionModal');
    const type = modal.dataset.type;
    
    // Só pega os valores dos campos se for uma saída
    const client = type === 'exit' ? document.getElementById('transactionClient').value : '';
    const seller = type === 'exit' ? document.getElementById('transactionSeller').value : '';
    const paymentMethod = type === 'exit' ? document.getElementById('transactionPayment').value : '';
    const installments = type === 'exit' ? document.getElementById('transactionInstallments').value : '1';

    if (currentTransactionProducts.length === 0) {
        alert('Adicione pelo menos um produto à transação!');
        return;
    }

    // Validação adicional apenas para saídas
    if (type === 'exit') {
        if (!client || !seller || !paymentMethod) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }
    }

    // Calculate total
    const total = currentTransactionProducts.reduce((sum, item) => sum + item.total, 0);
    console.log('Transaction total:', total); // Debug log

    try {
        // Update inventory only for stock products
        currentTransactionProducts.forEach(item => {
            if (item.type === 'stock') { // Apenas produtos do estoque
                const productIndex = inventoryItems.findIndex(invItem => invItem.code === item.code);
                if (productIndex === -1) {
                    throw new Error(`Produto ${item.name} não encontrado no estoque!`);
                }
                
                if (type === 'entry') {
                    inventoryItems[productIndex].quantity += item.quantity;
                } else {
                    if (item.quantity > inventoryItems[productIndex].quantity) {
                        throw new Error(`Quantidade insuficiente em estoque para o produto ${item.name}!`);
                    }
                    inventoryItems[productIndex].quantity -= item.quantity;
                }
            }
        });

        // Create transaction record
        const transaction = {
            date: new Date().toISOString(),
            type,
            products: currentTransactionProducts,
            total,
            client: type === 'exit' ? client : '',
            seller: type === 'exit' ? seller : '',
            paymentMethod: type === 'exit' ? paymentMethod : '',
            installments: type === 'exit' && paymentMethod === 'credito' ? parseInt(installments) : 1
        };
        console.log('New transaction:', transaction); // Debug log

        transactions.push(transaction);
        saveToLocalStorage();
        renderInventoryTable();
        renderTransactionsTable();
        updateDashboardStats();
        closeModal('transactionModal');
        
        // Após sucesso, limpe os produtos e feche o modal
        currentTransactionProducts = [];
        
        alert(type === 'entry' ? 'Entrada de produtos registrada com sucesso!' : 'Saída de produtos registrada com sucesso!');
    } catch (error) {
        alert(error.message);
        console.error('Error in transaction:', error); // Debug log
    }
}

// Render Transactions Table
function renderTransactionsTable() {
    const tbody = transactionsTable.querySelector('tbody');
    tbody.innerHTML = '';

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((transaction, index) => {
        if (transaction.type === 'exit') {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>Saída</td>
                <td>${transaction.products.map(p => p.name).join(', ')}</td>
                <td>${transaction.products.reduce((sum, p) => sum + p.quantity, 0)}</td>
                <td>R$ ${transaction.total.toFixed(2)}</td>
                <td>
                    <button onclick="generateOrderPDF(${index})" class="secondary-btn" title="Gerar Nota Fiscal">
                        <i class="material-icons">picture_as_pdf</i>
                    </button>
                    <button onclick="deleteTransaction(${index})" class="secondary-btn" title="Excluir">
                        <i class="material-icons">delete</i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>Entrada</td>
                <td>${transaction.products.map(p => p.name).join(', ')}</td>
                <td>${transaction.products.reduce((sum, p) => sum + p.quantity, 0)}</td>
                <td>R$ ${transaction.total.toFixed(2)}</td>
                <td>
                    <button onclick="deleteTransaction(${index})" class="secondary-btn" title="Excluir">
                        <i class="material-icons">delete</i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        }
    });
}

function deleteTransaction(index) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        const transaction = transactions[index];
        
        // Reverse inventory changes only for stock products
        transaction.products.forEach(transactionProduct => {
            if (transactionProduct.type === 'stock') {
                const product = inventoryItems.find(item => item.code === transactionProduct.code);
                if (product) {
                    if (transaction.type === 'entry') {
                        product.quantity -= transactionProduct.quantity;
                    } else {
                        product.quantity += transactionProduct.quantity;
                    }
                }
            }
        });

        transactions.splice(index, 1);
        saveToLocalStorage();
        renderInventoryTable();
        renderTransactionsTable();
        updateDashboardStats();
    }
}

// Dashboard Functions
function updateDashboardStats() {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === thisMonth && tDate.getFullYear() === thisYear;
    });

    // Calculate totals
    const gains = currentMonthTransactions
        .filter(t => t.type === 'exit')
        .reduce((sum, t) => sum + t.total, 0);

    const expenses = currentMonthTransactions
        .filter(t => t.type === 'entry')
        .reduce((sum, t) => sum + t.total, 0);

    const netProfit = gains - expenses;
    const profitMargin = gains > 0 ? (netProfit / gains) * 100 : 0;

    // Update dashboard values
    document.getElementById('totalRevenue').textContent = `R$ ${gains.toFixed(2)}`;
    document.getElementById('operationalCosts').textContent = `R$ ${expenses.toFixed(2)}`;
    document.getElementById('netProfit').textContent = `R$ ${netProfit.toFixed(2)}`;
    document.getElementById('profitMargin').textContent = `${profitMargin.toFixed(2)}%`;

    // Update charts
    updateCharts();
}

function updateCharts() {
    const monthlyData = getMonthlyData();
    
    // Update Revenue Chart
    revenueChart.data.datasets[0].data = monthlyData.gains;
    revenueChart.data.datasets[1].data = monthlyData.expenses;
    revenueChart.update();

    // Update Profit Chart
    profitChart.data.datasets[0].data = monthlyData.profits;
    profitChart.update();
}

function getMonthlyData() {
    const months = getLastTwelveMonths();
    const data = {
        gains: new Array(12).fill(0),
        expenses: new Array(12).fill(0),
        profits: new Array(12).fill(0)
    };

    transactions.forEach(t => {
        const tDate = new Date(t.date);
        const monthIndex = months.findIndex(m => m === getMonthName(tDate.getMonth()));
        
        if (monthIndex !== -1) {
            if (t.type === 'exit') {
                data.gains[monthIndex] += t.total;
            } else {
                data.expenses[monthIndex] += t.total;
            }
        }
    });

    // Calculate profits
    data.profits = data.gains.map((gain, i) => gain - data.expenses[i]);

    return data;
}

function getMonthName(monthIndex) {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months[monthIndex];
}

// Initialize Charts
function initializeCharts() {
    const months = getLastTwelveMonths();
    const monthlyData = getMonthlyData();

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Ganhos',
                    data: monthlyData.gains,
                    backgroundColor: 'rgba(0, 255, 157, 0.2)',
                    borderColor: 'rgba(0, 255, 157, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Gastos',
                    data: monthlyData.expenses,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#A0AEC0'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#A0AEC0'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#A0AEC0'
                    }
                }
            }
        }
    });

    // Profit Chart
    const profitCtx = document.getElementById('profitChart').getContext('2d');
    profitChart = new Chart(profitCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Lucro Líquido',
                data: monthlyData.profits,
                borderColor: 'rgba(0, 255, 157, 1)',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#A0AEC0'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#A0AEC0'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#A0AEC0'
                    }
                }
            }
        }
    });
}

// Helper function to get last 12 months
function getLastTwelveMonths() {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const last12Months = [];
    
    for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        last12Months.push(months[monthIndex]);
    }
    
    return last12Months;
}

// Inventory Management Functions
function renderInventoryTable() {
    const tbody = inventoryTable.querySelector('tbody');
    tbody.innerHTML = '';

    inventoryItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>R$ ${item.price.toFixed(2)}</td>
            <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button onclick="editItem(${index})" class="secondary-btn">
                    <i class="material-icons">edit</i>
                </button>
                <button onclick="deleteItem(${index})" class="secondary-btn">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function handleProductSubmit(e) {
    e.preventDefault();

    const formData = {
        code: document.getElementById('productCode').value,
        name: document.getElementById('productName').value,
        quantity: parseInt(document.getElementById('productQuantity').value),
        price: parseFloat(document.getElementById('productPrice').value)
    };

    if (productForm.dataset.mode === 'edit') {
        const index = parseInt(productForm.dataset.editIndex);
        inventoryItems[index] = formData;
    } else {
        inventoryItems.push(formData);
    }

    saveToLocalStorage();
    renderInventoryTable();
    updateDashboardStats();
    closeModal('productModal');
}

function editItem(index) {
    const item = inventoryItems[index];
    document.getElementById('productCode').value = item.code;
    document.getElementById('productName').value = item.name;
    document.getElementById('productQuantity').value = item.quantity;
    document.getElementById('productPrice').value = item.price;

    productForm.dataset.mode = 'edit';
    productForm.dataset.editIndex = index;
    openModal('edit');
}

function deleteItem(index) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        inventoryItems.splice(index, 1);
        saveToLocalStorage();
        renderInventoryTable();
        updateDashboardStats();
    }
}

// Modal Functions
function openModal(mode) {
    if (mode === 'add') {
        productForm.reset();
        productForm.dataset.mode = 'add';
        delete productForm.dataset.editIndex;
    }
    productModal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Reset forms if they exist
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Orçamento
function openQuoteModal() {
    quoteProducts = []; // Limpa a lista de produtos
    const modal = document.getElementById('orderModal');
    const title = document.getElementById('orderModalTitle');
    title.textContent = 'Gerar Orçamento';
    
    // Limpa a tabela de produtos
    const tbody = document.getElementById('orderProductsTable').querySelector('tbody');
    tbody.innerHTML = '';
    
    modal.classList.add('active');
}

function addProductToQuote() {
    const modal = document.getElementById('addOrderProductModal');
    
    // Reset forms
    document.getElementById('addStockProductForm').reset();
    document.getElementById('addOtherProductForm').reset();
    
    // Setup product type selector
    const typeButtons = modal.querySelectorAll('.product-type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            document.querySelectorAll('.product-form').forEach(form => form.classList.remove('active'));
            document.getElementById(`add${button.dataset.type === 'stock' ? 'Stock' : 'Other'}ProductForm`).classList.add('active');
        });
    });

    // Populate stock products select
    const select = document.getElementById('orderProductSelect');
    select.innerHTML = '<option value="">Selecione um produto</option>';
    inventoryItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.code;
        option.textContent = `${item.name} (${item.quantity} disponíveis)`;
        option.dataset.price = item.price;
        select.appendChild(option);
    });

    // Set default price when product is selected
    select.onchange = function() {
        const selectedOption = this.options[this.selectedIndex];
        const defaultPrice = selectedOption.dataset.price || '';
        document.getElementById('orderProductPrice').value = defaultPrice;
    };

    // Setup form submission
    const submitButton = document.getElementById('addOrderProductSubmit');
    submitButton.onclick = handleAddProductToQuote;

    modal.classList.add('active');
}

function handleAddProductToQuote(e) {
    e.preventDefault();
    const isStockProduct = document.querySelector('.product-type-btn.active').dataset.type === 'stock';
    
    if (isStockProduct) {
        handleAddStockProductToQuote();
    } else {
        handleAddOtherProductToQuote();
    }
}

function handleAddStockProductToQuote() {
    const productCode = document.getElementById('orderProductSelect').value;
    const quantity = parseInt(document.getElementById('orderProductQuantity').value);
    const price = parseFloat(document.getElementById('orderProductPrice').value);
    const discount = parseFloat(document.getElementById('orderProductDiscount').value) || 0;
    
    const product = inventoryItems.find(item => item.code === productCode);
    if (!product) {
        alert('Produto não encontrado');
        return;
    }
    
    if (quantity <= 0) {
        alert('Quantidade deve ser maior que zero');
        return;
    }

    if (price <= 0) {
        alert('Preço deve ser maior que zero');
        return;
    }

    if (discount < 0) {
        alert('Desconto não pode ser negativo');
        return;
    }
    
    // Add product to quote
    quoteProducts.push({
        code: product.code,
        name: product.name,
        quantity: quantity,
        price: price,
        discount: discount,
        total: (price * quantity) - discount,
        type: 'stock'
    });
    
    // Update the table
    updateQuoteProductsTable();
    
    // Close the modal and reset form
    closeModal('addOrderProductModal');
}

function handleAddOtherProductToQuote() {
    const name = document.getElementById('otherProductName').value.trim();
    const quantity = parseInt(document.getElementById('otherProductQuantity').value);
    const price = parseFloat(document.getElementById('otherProductPrice').value);
    const discount = parseFloat(document.getElementById('otherProductDiscount').value) || 0;
    
    if (!name) {
        alert('Por favor, informe o nome do produto');
        return;
    }
    
    if (quantity <= 0) {
        alert('Quantidade deve ser maior que zero');
        return;
    }

    if (price <= 0) {
        alert('Preço deve ser maior que zero');
        return;
    }

    if (discount < 0) {
        alert('Desconto não pode ser negativo');
        return;
    }
    
    // Add product to quote
    quoteProducts.push({
        code: 'OUTRO-' + Date.now(),
        name: name,
        quantity: quantity,
        price: price,
        discount: discount,
        total: (price * quantity) - discount,
        type: 'other'
    });
    
    // Update the table
    updateQuoteProductsTable();
    
    // Close the modal and reset form
    closeModal('addOrderProductModal');
}

function updateQuoteProductsTable() {
    const tbody = document.getElementById('orderProductsTable').querySelector('tbody');
    tbody.innerHTML = '';
    
    quoteProducts.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>R$ ${item.price.toFixed(2)}</td>
            <td>R$ ${item.discount.toFixed(2)}</td>
            <td>R$ ${item.total.toFixed(2)}</td>
            <td>
                <button type="button" onclick="removeQuoteProduct(${index})" class="secondary-btn">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function removeQuoteProduct(index) {
    quoteProducts.splice(index, 1);
    updateQuoteProductsTable();
}

function handleQuoteSubmit(e) {
    e.preventDefault();
    
    if (quoteProducts.length === 0) {
        alert('Adicione pelo menos um produto ao orçamento');
        return;
    }
    
    const client = document.getElementById('orderClient').value;
    const seller = document.getElementById('orderSeller').value;
    
    generateQuote(client, seller);
    closeModal('orderModal');
    document.getElementById('orderForm').reset();
}

// Atualiza a função generateQuote
function generateQuote(client, seller) {
    if (quoteProducts.length === 0) {
        alert('Adicione produtos ao orçamento antes de gerar.');
        return;
    }

    const total = quoteProducts.reduce((sum, item) => sum + item.total, 0);
    const quote = {
        date: new Date().toLocaleDateString(),
        client,
        seller,
        items: quoteProducts,
        total
    };

    // Create a printable version
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
            <head>
                <title>Orçamento</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 20px; 
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0; 
                    }
                    th, td { 
                        padding: 10px; 
                        border: 1px solid #ddd; 
                        text-align: left; 
                    }
                    .header { 
                        margin-bottom: 30px; 
                    }
                    .footer { 
                        margin-top: 30px; 
                    }
                    .info {
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Orçamento</h1>
                    <div class="info">
                        <p><strong>Data:</strong> ${quote.date}</p>
                        <p><strong>Cliente:</strong> ${quote.client}</p>
                        <p><strong>Vendedor:</strong> ${quote.seller}</p>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Preço Unit.</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${quote.items.map(item => `
                            <tr>
                                <td>${item.code}</td>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>R$ ${item.price.toFixed(2)}</td>
                                <td>R$ ${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <h3>Total: R$ ${quote.total.toFixed(2)}</h3>
                    <p>Validade do orçamento: 7 dias</p>
                    <br><br>
                    <p>_______________________________</p>
                    <p>Assinatura do Cliente</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Report Functions
function generateSalesReport() {
    // Transformar os dados das transações para o formato esperado pelo relatório
    const salesData = transactions
        .filter(t => t.type === 'exit')
        .flatMap(t => t.products.map(p => ({
            date: t.date,
            productName: p.name,
            quantity: p.quantity,
            price: p.price,
            total: p.total,
            client: t.client,
            seller: t.seller
        })));

    generateReport('Relatório de Vendas', salesData, [
        { header: 'Data', key: 'date', format: d => new Date(d).toLocaleDateString() },
        { header: 'Produto', key: 'productName' },
        { header: 'Quantidade', key: 'quantity' },
        { header: 'Valor Unit.', key: 'price', format: v => `R$ ${v.toFixed(2)}` },
        { header: 'Total', key: 'total', format: v => `R$ ${v.toFixed(2)}` },
        { header: 'Cliente', key: 'client' },
        { header: 'Vendedor', key: 'seller' }
    ]);
}

function generateInventoryReport() {
    const inventoryData = inventoryItems.map(item => ({
        ...item,
        total: item.price * item.quantity
    }));

    generateReport('Relatório de Estoque', inventoryData, [
        { header: 'Código', key: 'code' },
        { header: 'Produto', key: 'name' },
        { header: 'Quantidade', key: 'quantity' },
        { header: 'Preço Unit.', key: 'price', format: v => `R$ ${v.toFixed(2)}` },
        { header: 'Valor Total', key: 'total', format: v => `R$ ${v.toFixed(2)}` }
    ]);
}

function generateFinancialReport() {
    const now = new Date();
    const monthlyData = [];

    // Get last 12 months of data
    for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
        });

        const gains = monthTransactions
            .filter(t => t.type === 'exit')
            .reduce((sum, t) => sum + t.total, 0);

        const expenses = monthTransactions
            .filter(t => t.type === 'entry')
            .reduce((sum, t) => sum + t.total, 0);

        const netProfit = gains - expenses;
        const margin = gains > 0 ? (netProfit / gains) * 100 : 0;

        monthlyData.push({
            date,
            gains,
            expenses,
            netProfit,
            margin
        });
    }

    generateReport('Relatório Financeiro', monthlyData, [
        { header: 'Período', key: 'date', format: d => `${getMonthName(d.getMonth())}/${d.getFullYear()}` },
        { header: 'Ganhos', key: 'gains', format: v => `R$ ${v.toFixed(2)}` },
        { header: 'Gastos', key: 'expenses', format: v => `R$ ${v.toFixed(2)}` },
        { header: 'Lucro', key: 'netProfit', format: v => `R$ ${v.toFixed(2)}` },
        { header: 'Margem', key: 'margin', format: v => `${v.toFixed(2)}%` }
    ]);
}

function generateReport(title, data, columns) {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 20px; 
                    }
                    h1 { 
                        color: #333; 
                        margin-bottom: 20px; 
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0; 
                    }
                    th, td { 
                        padding: 10px; 
                        border: 1px solid #ddd; 
                        text-align: left; 
                    }
                    th { 
                        background-color: #f5f5f5; 
                    }
                    .header { 
                        margin-bottom: 30px; 
                    }
                    .footer { 
                        margin-top: 30px;
                        font-size: 0.9em;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${title}</h1>
                    <p>Data de geração: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            ${columns.map(col => `<th>${col.header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                ${columns.map(col => `
                                    <td>${col.format ? col.format(row[col.key]) : (row[col.key] || '-')}</td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <p>Relatório gerado automaticamente pelo sistema.</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function exportReport() {
    const now = new Date();
    
    // Calcular estatísticas gerais
    const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalProducts = inventoryItems.length;
    const lowStockProducts = inventoryItems.filter(item => item.quantity < 10);
    
    // Calcular estatísticas de vendas
    const salesTransactions = transactions.filter(t => t.type === 'exit');
    const totalSales = salesTransactions.reduce((sum, t) => sum + t.total, 0);
    const averageTicket = salesTransactions.length > 0 ? totalSales / salesTransactions.length : 0;
    
    // Calcular estatísticas do mês atual
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const currentMonthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === thisMonth && tDate.getFullYear() === thisYear;
    });
    
    const monthlyRevenue = currentMonthTransactions
        .filter(t => t.type === 'exit')
        .reduce((sum, t) => sum + t.total, 0);
    
    const monthlyCosts = currentMonthTransactions
        .filter(t => t.type === 'entry')
        .reduce((sum, t) => sum + t.total, 0);
    
    const monthlyNetProfit = monthlyRevenue - monthlyCosts;
    const monthlyMargin = monthlyRevenue > 0 ? (monthlyNetProfit / monthlyRevenue) * 100 : 0;

    // Criar o relatório HTML
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Relatório Geral - ${now.toLocaleDateString()}</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f8f9fa;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                        padding: 20px;
                        background: linear-gradient(135deg, #00FF9D 0%, #00A3FF 100%);
                        color: white;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 2.5em;
                    }
                    .header p {
                        margin: 10px 0 0;
                        opacity: 0.9;
                    }
                    .section {
                        background: white;
                        padding: 20px;
                        margin-bottom: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                    }
                    .section h2 {
                        color: #2D3748;
                        border-bottom: 2px solid #00FF9D;
                        padding-bottom: 10px;
                        margin-top: 0;
                    }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .stat-card {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        border: 1px solid #e9ecef;
                    }
                    .stat-card h3 {
                        margin: 0 0 10px;
                        color: #4A5568;
                        font-size: 0.9em;
                        text-transform: uppercase;
                    }
                    .stat-card .value {
                        font-size: 1.8em;
                        font-weight: bold;
                        color: #2D3748;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                        background: white;
                    }
                    th, td {
                        padding: 12px;
                        text-align: left;
                        border-bottom: 1px solid #e9ecef;
                    }
                    th {
                        background-color: #f8f9fa;
                        font-weight: 600;
                        color: #4A5568;
                    }
                    tr:hover {
                        background-color: #f8f9fa;
                    }
                    .alert {
                        padding: 10px;
                        background-color: #FFF5F5;
                        border-left: 4px solid #F56565;
                        margin: 10px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding: 20px;
                        color: #666;
                        font-size: 0.9em;
                    }
                    @media print {
                        body {
                            background: white;
                        }
                        .section {
                            break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Relatório Geral</h1>
                    <p>Gerado em ${now.toLocaleDateString()} às ${now.toLocaleTimeString()}</p>
                </div>

                <div class="section">
                    <h2>Resumo do Mês Atual</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Ganhos</h3>
                            <div class="value">R$ ${monthlyRevenue.toFixed(2)}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Gastos</h3>
                            <div class="value">R$ ${monthlyCosts.toFixed(2)}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Lucro Líquido</h3>
                            <div class="value">R$ ${monthlyNetProfit.toFixed(2)}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Margem de Lucro</h3>
                            <div class="value">${monthlyMargin.toFixed(2)}%</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Visão Geral do Estoque</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Valor Total em Estoque</h3>
                            <div class="value">R$ ${totalInventoryValue.toFixed(2)}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Total de Produtos</h3>
                            <div class="value">${totalProducts}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Produtos com Estoque Baixo</h3>
                            <div class="value">${lowStockProducts.length}</div>
                        </div>
                        <div class="stat-card">
                            <h3>Ticket Médio</h3>
                            <div class="value">R$ ${averageTicket.toFixed(2)}</div>
                        </div>
                    </div>

                    ${lowStockProducts.length > 0 ? `
                        <div class="alert">
                            <h3>⚠️ Produtos com Estoque Baixo (menos de 10 unidades):</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Produto</th>
                                        <th>Quantidade</th>
                                        <th>Valor Unit.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${lowStockProducts.map(item => `
                                        <tr>
                                            <td>${item.code}</td>
                                            <td>${item.name}</td>
                                            <td>${item.quantity}</td>
                                            <td>R$ ${item.price.toFixed(2)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : ''}
                </div>

                <div class="section">
                    <h2>Produtos em Estoque</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço Unit.</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${inventoryItems.map(item => `
                                <tr>
                                    <td>${item.code}</td>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>R$ ${item.price.toFixed(2)}</td>
                                    <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="section">
                    <h2>Últimas Transações</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Tipo</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${transactions.slice(0, 10).map(t => `
                                <tr>
                                    <td>${new Date(t.date).toLocaleDateString()}</td>
                                    <td>${t.type === 'entry' ? 'Entrada' : 'Saída'}</td>
                                    <td>${t.products.map(p => p.name).join(', ')}</td>
                                    <td>${t.products.reduce((sum, p) => sum + p.quantity, 0)}</td>
                                    <td>R$ ${t.total.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="footer">
                    <p>Este relatório foi gerado automaticamente pelo sistema de controle.</p>
                    <p>Para mais informações, consulte os relatórios específicos disponíveis no sistema.</p>
                </div>
            </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Aguardar um momento para garantir que os estilos sejam aplicados
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Função para exportar backup
function exportBackup() {
    const data = {
        inventory: inventoryItems,
        transactions: transactions,
        lastUpdate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_controle_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Função para importar backup
function importBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                
                // Validar se o arquivo tem a estrutura correta
                if (!data.inventory || !data.transactions) {
                    throw new Error('Arquivo de backup inválido');
                }
                
                // Atualizar dados
                inventoryItems = data.inventory;
                transactions = data.transactions;
                
                // Salvar no localStorage
                saveToLocalStorage();
                
                // Atualizar interface
                renderInventoryTable();
                renderTransactionsTable();
                updateDashboardStats();
                
                alert('Backup importado com sucesso!');
            } catch (error) {
                alert('Erro ao importar backup. Verifique se o arquivo está correto.');
                console.error('Erro na importação:', error);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Função para auto-save periódico
function setupAutoSave() {
    // Salva a cada 5 minutos
    setInterval(() => {
        saveToLocalStorage();
        console.log('Auto-save realizado:', new Date().toLocaleTimeString());
    }, 5 * 60 * 1000);
    
    // Salva quando o usuário fecha a página
    window.addEventListener('beforeunload', () => {
        saveToLocalStorage();
    });
}

function generateOrderPDF(index) {
    const transaction = transactions[index];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
        title: `Comprovante - Pedido ${index + 1}`,
        subject: 'Comprovante',
        author: 'Sistema de Gestão',
        keywords: 'comprovante, venda, pedido',
        creator: 'Sistema de Gestão'
    });

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.text('COMPROVANTE', 105, 20, { align: 'center' });

    // Add a line
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Add order information
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nº do Pedido: ${(index + 1).toString().padStart(6, '0')}`, 20, 35);
    doc.text(`Data: ${new Date(transaction.date).toLocaleDateString()}`, 20, 42);
    doc.text(`Cliente: ${transaction.client}`, 20, 49);
    doc.text(`Consultor Responsável: ${transaction.seller}`, 20, 56);
    
    // Add payment method information with installment details
    let paymentText = `Forma de Pagamento: ${getPaymentMethodText(transaction.paymentMethod)}`;
    if (transaction.paymentMethod === 'credito' && transaction.installments > 1) {
        const monthlyAmount = transaction.total / transaction.installments;
        paymentText += ` - ${transaction.installments}x de R$ ${monthlyAmount.toFixed(2)}`;
    }
    doc.text(paymentText, 20, 63);

    // Adjust the following line positions by adding 7 units to their y-coordinates
    doc.line(20, 67, 190, 67);
    doc.text('Detalhes da Transação', 20, 77);
    
    // Update table position with multiple products
    doc.autoTable({
        startY: 82,
        head: [['Produto', 'Quantidade', 'Valor Unit.', 'Desconto', 'Total']],
        body: transaction.products.map(product => [
            product.name,
            product.quantity.toString(),
            `R$ ${product.price.toFixed(2)}`,
            product.discount > 0 ? `R$ ${product.discount.toFixed(2)}` : '-',
            `R$ ${(product.quantity * product.price - product.discount).toFixed(2)}`
        ]),
        theme: 'striped',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
    });

    // Add total with installment information
    const finalY = doc.previousAutoTable.finalY + 10;
    const totalAmount = transaction.products.reduce((sum, p) => sum + (p.quantity * p.price - p.discount), 0);
    
    doc.setFontSize(12);
    doc.text(`Valor Total: R$ ${totalAmount.toFixed(2)}`, 150, finalY, { align: 'right' });
    if (transaction.paymentMethod === 'credito' && transaction.installments > 1) {
        const monthlyAmount = transaction.total / transaction.installments;
        doc.setFontSize(10);
        doc.text(`(${transaction.installments}x de R$ ${monthlyAmount.toFixed(2)})`, 150, finalY + 5, { align: 'right' });
    }

    // Add consumer information section
    doc.setFontSize(10);
    doc.text('Dados do Contratante', 20, finalY + 20);
    
    // Add a box for consumer information
    doc.rect(20, finalY + 25, 170, 40);
    doc.setFontSize(8);
    
    // Prepare payment info text with installments
    let paymentInfo = getPaymentMethodText(transaction.paymentMethod);
    if (transaction.paymentMethod === 'credito' && transaction.installments > 1) {
        const monthlyAmount = transaction.total / transaction.installments;
        paymentInfo += ` - ${transaction.installments}x de R$ ${monthlyAmount.toFixed(2)}`;
    }
    
    doc.text([
        'Nome/Razão Social: ' + transaction.client,
        'Consultor Designado: ' + transaction.seller,
        'Data de Emissão: ' + new Date(transaction.date).toLocaleDateString(),
        'Forma de Pagamento: ' + paymentInfo,
        'Observações: Conforme termos e condições estabelecidos em contrato'
    ], 25, finalY + 32);

    // Add legends section
    doc.setFontSize(8);
    doc.text('Termos e Condições:', 20, finalY + 75);
    doc.text([
        '* Este documento comprova a prestação dos serviços/produtos descritos acima',
        '* Eventuais alterações devem ser comunicadas em até 7 dias úteis',
        '* Este comprovante não substitui Nota Fiscal',
        '* Documento válido em todo território nacional'
    ], 20, finalY + 82);

    // Add system footer
    doc.setFontSize(7);
    doc.text('Documento emitido eletronicamente pelo Sistema de Gestão', 105, 285, { align: 'center' });
    doc.text(`Emitido em: ${new Date().toLocaleString()}`, 105, 290, { align: 'center' });

    // Save the PDF
    const fileName = `comprovante_${(index + 1).toString().padStart(6, '0')}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
}

// Helper function to get payment method text
function getPaymentMethodText(method) {
    const methods = {
        'dinheiro': 'Dinheiro',
        'pix': 'PIX',
        'credito': 'Cartão de Crédito',
        'debito': 'Cartão de Débito',
        'boleto': 'Boleto Bancário',
        'transferencia': 'Transferência Bancária'
    };
    return methods[method] || method;
}

// Add these new functions
function checkUserName() {
    const userName = localStorage.getItem('userName');
    if (!userName) {
        showNameModal();
    } else {
        updateWelcomeName(userName);
    }
}

function showNameModal() {
    const modal = document.getElementById('nameModal');
    modal.classList.add('active');
    
    // Prevent closing by clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    };

    document.getElementById('nameForm').onsubmit = (e) => {
        e.preventDefault();
        const userName = document.getElementById('userName').value.trim();
        if (userName) {
            localStorage.setItem('userName', userName);
            updateWelcomeName(userName);
            modal.classList.remove('active');
        }
    };
}

function updateWelcomeName(name) {
    const welcomeText = document.querySelector('.welcome h1');
    if (!name) {
        welcomeText.innerHTML = `Bem-vindo`;
    } else {
        welcomeText.innerHTML = `Seja bem vindo, <span class="welcome-name">${name}</span>!`;
    }
}

// Add these new functions for handling multiple products
function showAddTransactionProductModal() {
    const modal = document.getElementById('addTransactionProductModal');
    
    // Reset forms
    document.getElementById('addStockProductForm').reset();
    document.getElementById('addOtherProductForm').reset();
    
    // Setup product type selector
    const typeButtons = modal.querySelectorAll('.product-type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            document.querySelectorAll('.product-form').forEach(form => form.classList.remove('active'));
            document.getElementById(`add${button.dataset.type === 'stock' ? 'Stock' : 'Other'}ProductForm`).classList.add('active');
        });
    });

    // Populate stock products select
    const select = document.getElementById('transactionProductSelect');
    select.innerHTML = '<option value="">Selecione um produto</option>';
    inventoryItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.code;
        option.textContent = `${item.name} (${item.quantity} disponíveis)`;
        option.dataset.price = item.price;
        select.appendChild(option);
    });

    // Set default price when product is selected
    select.onchange = function() {
        const selectedOption = this.options[this.selectedIndex];
        const defaultPrice = selectedOption.dataset.price || '';
        document.getElementById('transactionProductPrice').value = defaultPrice;
    };

    // Setup form submission
    const submitButton = document.getElementById('addProductSubmit');
    submitButton.onclick = handleAddProduct;

    modal.classList.add('active');
}

function handleAddProduct() {
    const isStockProduct = document.querySelector('.product-type-btn.active').dataset.type === 'stock';
    
    if (isStockProduct) {
        handleAddStockProduct();
    } else {
        handleAddOtherProduct();
    }
}

function handleAddStockProduct() {
    const productCode = document.getElementById('transactionProductSelect').value;
    const quantity = parseInt(document.getElementById('transactionProductQuantity').value);
    const price = parseFloat(document.getElementById('transactionProductPrice').value);
    const discount = parseFloat(document.getElementById('transactionProductDiscount').value) || 0;
    
    const product = inventoryItems.find(item => item.code === productCode);
    if (!product) {
        alert('Produto não encontrado');
        return;
    }
    
    if (quantity <= 0) {
        alert('Quantidade deve ser maior que zero');
        return;
    }

    if (price <= 0) {
        alert('Preço deve ser maior que zero');
        return;
    }

    if (discount < 0) {
        alert('Desconto não pode ser negativo');
        return;
    }

    const transactionType = document.getElementById('transactionModal').dataset.type;
    if (transactionType === 'exit' && quantity > product.quantity) {
        alert('Quantidade indisponível em estoque!');
        return;
    }
    
    // Add product to current transaction
    currentTransactionProducts.push({
        code: product.code,
        name: product.name,
        quantity: quantity,
        price: price,
        discount: discount,
        total: (price * quantity) - discount,
        type: 'stock'
    });
    
    // Update the table
    updateTransactionProductsTable();
    
    // Close the modal and reset form
    closeModal('addTransactionProductModal');
}

function handleAddOtherProduct() {
    const name = document.getElementById('otherProductName').value.trim();
    const quantity = parseInt(document.getElementById('otherProductQuantity').value);
    const price = parseFloat(document.getElementById('otherProductPrice').value);
    const discount = parseFloat(document.getElementById('otherProductDiscount').value) || 0;
    
    if (!name) {
        alert('Por favor, informe o nome do produto');
        return;
    }
    
    if (quantity <= 0) {
        alert('Quantidade deve ser maior que zero');
        return;
    }

    if (price <= 0) {
        alert('Preço deve ser maior que zero');
        return;
    }

    if (discount < 0) {
        alert('Desconto não pode ser negativo');
        return;
    }
    
    // Add product to current transaction
    currentTransactionProducts.push({
        code: 'OUTRO-' + Date.now(),
        name: name,
        quantity: quantity,
        price: price,
        discount: discount,
        total: (price * quantity) - discount,
        type: 'other'
    });
    
    // Update the table
    updateTransactionProductsTable();
    
    // Close the modal and reset form
    closeModal('addTransactionProductModal');
}

function updateTransactionProductsTable() {
    const tbody = document.getElementById('transactionProductsTable').querySelector('tbody');
    const totalElement = document.getElementById('transactionTotalAmount');
    tbody.innerHTML = '';
    
    const total = currentTransactionProducts.reduce((sum, item) => sum + item.total, 0);
    
    currentTransactionProducts.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>R$ ${item.price.toFixed(2)}</td>
            <td>R$ ${item.discount.toFixed(2)}</td>
            <td>R$ ${item.total.toFixed(2)}</td>
            <td>
                <button type="button" onclick="removeTransactionProduct(${index})" class="secondary-btn">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    totalElement.innerHTML = `<strong>R$ ${total.toFixed(2)}</strong>`;
}

function removeTransactionProduct(index) {
    currentTransactionProducts.splice(index, 1);
    updateTransactionProductsTable();
}

function filterInventory() {
    const searchTerm = document.getElementById('inventorySearch').value.toLowerCase();
    const filteredItems = inventoryItems.filter(item => 
        item.code.toLowerCase().includes(searchTerm) || 
        item.name.toLowerCase().includes(searchTerm)
    );
    
    const tbody = inventoryTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (filteredItems.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" class="no-results">Nenhum produto encontrado com os filtros escolhidos.</td>
        `;
        tbody.appendChild(row);
    } else {
        filteredItems.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>R$ ${item.price.toFixed(2)}</td>
                <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button onclick="editItem(${index})" class="secondary-btn">
                        <i class="material-icons">edit</i>
                    </button>
                    <button onclick="deleteItem(${index})" class="secondary-btn">
                        <i class="material-icons">delete</i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

function clearInventorySearch() {
    document.getElementById('inventorySearch').value = '';
    renderInventoryTable();
}

function filterTransactionsByDate() {
    const searchDate = document.getElementById('transactionDateSearch').value;
    if (!searchDate) return;

    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
        return transactionDate === searchDate;
    });

    const tbody = transactionsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (filteredTransactions.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" class="no-results">Nenhum lançamento foi encontrado com os filtros escolhidos.</td>
        `;
        tbody.appendChild(row);
    } else {
        filteredTransactions.forEach((transaction, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${transaction.type === 'entry' ? 'Entrada' : 'Saída'}</td>
                <td>${transaction.products.map(p => p.name).join(', ')}</td>
                <td>${transaction.products.reduce((sum, p) => sum + p.quantity, 0)}</td>
                <td>R$ ${transaction.total.toFixed(2)}</td>
                <td>
                    ${transaction.type === 'exit' ? `
                    <button onclick="generateOrderPDF(${index})" class="secondary-btn" title="Gerar Nota Fiscal">
                        <i class="material-icons">picture_as_pdf</i>
                    </button>
                    ` : ''}
                    <button onclick="deleteTransaction(${index})" class="secondary-btn" title="Excluir">
                        <i class="material-icons">delete</i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

function clearTransactionSearch() {
    document.getElementById('transactionDateSearch').value = '';
    renderTransactionsTable();
}

// Adicionar esta nova função
function setupSearchSections() {
    // Configuração da busca no estoque
    const inventorySearchContainer = document.createElement('div');
    inventorySearchContainer.className = 'search-container';
    inventorySearchContainer.innerHTML = `
        <input type="text" id="inventorySearch" placeholder="Buscar produtos...">
        <button onclick="filterInventory()" class="search-btn" title="Buscar">
            <i class="material-icons">search</i>
        </button>
        <button onclick="clearInventorySearch()" class="clear-btn" title="Limpar busca">
            <i class="material-icons">clear</i>
        </button>
    `;
    inventoryTable.parentNode.insertBefore(inventorySearchContainer, inventoryTable);

    // Configuração da busca nos lançamentos
    const transactionsSearchContainer = document.createElement('div');
    transactionsSearchContainer.className = 'search-container';
    transactionsSearchContainer.innerHTML = `
        <input type="date" id="transactionDateSearch">
        <button onclick="filterTransactionsByDate()" class="search-btn" title="Buscar">
            <i class="material-icons">search</i>
        </button>
        <button onclick="clearTransactionSearch()" class="clear-btn" title="Limpar busca">
            <i class="material-icons">clear</i>
        </button>
    `;
    transactionsTable.parentNode.insertBefore(transactionsSearchContainer, transactionsTable);
} 