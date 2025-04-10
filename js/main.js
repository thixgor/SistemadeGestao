// Valid license keys
const validLicenseKeys = [
    '9UOS-20PQ-35FH', '318Q-HPGH-FDXC', 'PCAG-EJIX-ATYX', 'BF49-D8KX-CG98',
    'IXUS-G0JQ-BL42', '9RSV-0LRT-LEIV', '14LM-5Q43-6K11', 'S18E-OPAG-MPLR',
    'R6GQ-PJS7-N0HX', 'E3J6-8E2G-DMC4', 'PDEO-IZMO-UZ5F', '80B9-DS48-JEKF',
    'WP20-9R9S-OCCO', 'L0NA-D4YZ-0VQL', 'Q090-MWGS-8A2T', '9YYG-D9HB-GH7O',
    'C2WG-DSRC-W67N', 'V4EU-1QO4-ZFUC', 'TF1L-XZA6-DF5U', 'ZFPM-4CR3-D4CV',
    'OUJW-BECP-LNKY', 'BOBK-J81U-10XA', '3VNW-S3JL-7VZI', 'NU8V-YFH3-9GJN',
    '98DS-Q2N8-R1F1', 'XP3Z-LPFV-VERB', 'D4FT-996G-P05S', 'XK4M-HXEC-8H6L',
    '1EQO-MCUE-MHDI', 'LPXK-Q1GW-CMRZ', 'TKEX-O1Z3-SNVO', 'KVSN-EK0E-WAZX',
    'WMQE-X7HM-8829', 'NKF4-W48O-YKZL', '6VM3-VEC5-7JQW', 'BKJD-66L0-ADBS',
    '0HKW-JMOA-728R', 'BTQ5-4GB0-2MDN', '590I-LEPE-ZSA1', 'HN4W-2N04-I81F',
    'SOE8-MUHI-EI6W', 'KW3M-HPY3-5WAT', 'N66H-JIEL-4UA8', 'ZOD4-A2QY-1ZOS',
    'EJ3F-U7I6-54J3', 'J0OS-YR9S-3CCH', '436Z-MEZI-VTC6', 'TYJD-Y9ZX-5NP3',
    'FFXV-IZ4G-CNWS', 'YRZY-2JEC-JU4I', 'XG2C-KV3A-DAY8', 'J6HM-CEIV-BO2X',
    'W0KA-AWPZ-R59V', '2YH6-HYGE-0L1M', 'RLLD-1T7M-ETH5', 'RBJT-MJ3J-AZVA',
    'TH11-OS3Y-5NHK', 'M1X7-SFQS-EYGD', 'PWO5-K5X3-ZVX1', 'C5QM-R6GZ-0O0Z',
    'WCGU-5HH4-8K9H', '9N2Q-NMTK-1IEM', '5XF9-QMUR-6RM0', 'L4LU-ZM41-GURW',
    'ATSQ-A535-VXZ7', 'EEKD-V04L-8Z69', 'FGIA-KA15-U1YD', 'D9S0-KE7Q-7DGQ',
    'HKDW-ZBIV-J8F2', '18K3-KCJS-YG2C', 'WS5K-26K5-UE60', '4EB3-B5TF-OKAG',
    '8HVP-ZLO5-E27O', '52DM-8MXQ-052W', 'I6FN-FWSF-EZ5U', 'Y9OT-M588-EBMO',
    '25V6-ZQ50-GV3O', 'RU1N-XQCH-HDDJ', 'YGYE-2Q6K-AOMA', '4UJ2-JZW9-HTTS',
    'G2WJ-VYIO-UAKE', '5MLL-V1LZ-TIVA', 'FOO2-MPLH-KY8W', 'CNZ3-2SKX-KTHS',
    'Q1D8-0S0O-1M7M', 'DRHU-FTI5-JLG8', 'PEEV-VGO2-8CD1', 'L8B1-TF1P-FFTX',
    'ZVPG-O38K-JU7D', 'NJ2Z-Y6GC-5VSE', '9V3I-9CA0-ZKNG', 'V1AB-68Y1-2NV9',
    '7QRQ-OIEE-JREW', '2SBJ-YK61-0Z96', 'VP8R-C62G-HTGJ', 'EB22-HMR2-B79I',
    'FQHD-OBPA-EEAE', 'T1X8-Z14Z-JMML', 'YF01-EIPY-C2UI', 'OQX4-5GA2-KD9I'
];

// Check if system is licensed
function checkLicense() {
    const licenseKey = localStorage.getItem('licenseKey');
    if (!licenseKey || !validLicenseKeys.includes(licenseKey)) {
        showLicenseModal();
        return false;
    }
    return true;
}

// Show license modal
function showLicenseModal() {
    const modal = document.getElementById('licenseModal');
    modal.classList.add('active');
    
    // Prevent closing by clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    };

    // Format license key input
    const licenseInput = document.getElementById('licenseKey');
    licenseInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^A-Z0-9]/g, '');
        if (value.length > 12) value = value.slice(0, 12);
        const parts = [];
        for (let i = 0; i < value.length; i += 4) {
            parts.push(value.slice(i, i + 4));
        }
        e.target.value = parts.join('-');
    });

    // Handle license form submission
    document.getElementById('licenseForm').onsubmit = (e) => {
        e.preventDefault();
        const key = licenseInput.value;
        
        if (validLicenseKeys.includes(key)) {
            localStorage.setItem('licenseKey', key);
            modal.classList.remove('active');
            initializeSystem();
        } else {
            // Show error message
            let errorDiv = modal.querySelector('.license-error');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'license-error';
                licenseInput.parentNode.insertBefore(errorDiv, licenseInput.nextSibling);
            }
            errorDiv.textContent = 'Chave de licença inválida!';
            errorDiv.classList.add('active');
            setTimeout(() => errorDiv.classList.remove('active'), 3000);
            licenseInput.value = '';
        }
    };
}

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
    if (checkLicense()) {
        initializeSystem();
    }
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

    // Configurar listeners para campos de nome de produto
    setupProductNameListeners();
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

    // Calculate total from the product.total values
    const total = currentTransactionProducts.reduce((sum, item) => sum + item.total, 0);
    console.log('Transaction total:', total); // Debug log

    try {
        // Update inventory only for stock products
        currentTransactionProducts.forEach(item => {
            if (item.isStock) { // Usando a propriedade isStock ao invés de type
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
            if (transactionProduct.isStock) {
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
    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = '';
    
    if (inventoryItems.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="no-results">Nenhum produto cadastrado</td></tr>`;
        return;
    }
    
    inventoryItems.forEach((item, index) => {
        const row = document.createElement('tr');
        const total = item.quantity * item.price;
        
        row.innerHTML = `
            <td>${item.code}</td>
            <td>
                ${item.name}
                ${item.size ? 
                    `<span class="product-size">(${item.size})</span>` : 
                    requiresSize(item.name) ? '<span class="product-size missing-size">(Sem tamanho)</span>' : ''}
            </td>
            <td>${item.quantity}</td>
            <td>R$ ${item.price.toFixed(2)}</td>
            <td>R$ ${total.toFixed(2)}</td>
            <td>
                <button class="edit-btn" onclick="editItem(${index})">
                    <i class="material-icons">edit</i>
                </button>
                <button class="delete-btn" onclick="deleteItem(${index})">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function handleProductSubmit(e) {
    e.preventDefault();
    const code = document.getElementById('productCode').value;
    const name = document.getElementById('productName').value;
    const quantity = document.getElementById('productQuantity').value;
    const price = document.getElementById('productPrice').value;
    const size = document.getElementById('productSize').value;
    
    const productData = {
        code,
        name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        size: size || null
    };
    
    const editIndex = document.getElementById('productForm').getAttribute('data-edit-index');
    
    if (editIndex !== null && editIndex !== undefined && editIndex !== '') {
        inventoryItems[parseInt(editIndex)] = productData;
    } else {
        inventoryItems.push(productData);
    }
    
    saveToLocalStorage();
    renderInventoryTable();
    closeModal('productModal');
    document.getElementById('productForm').reset();
    document.getElementById('productForm').removeAttribute('data-edit-index');
}

function editItem(index) {
    const item = inventoryItems[index];
    document.getElementById('productCode').value = item.code;
    document.getElementById('productName').value = item.name;
    document.getElementById('productQuantity').value = item.quantity;
    document.getElementById('productPrice').value = item.price;
    
    // Always try to initialize the size field for clothing/footwear items
    const productType = requiresSize(item.name);
    if (productType) {
        toggleSizeField(item.name, 'productForm');
        if (item.size) {
            document.getElementById('productSize').value = item.size;
        }
    }
    
    document.getElementById('productForm').setAttribute('data-edit-index', index);
    openModal('productModal');
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
        option.textContent = `${item.name}${item.size ? ` (${item.size})` : ''} (${item.quantity} disponíveis)`;
        option.dataset.price = item.price;
        option.dataset.size = item.size || '';
        select.appendChild(option);
    });

    // Set default price when product is selected
    select.onchange = function() {
        const selectedOption = this.options[this.selectedIndex];
        const defaultPrice = selectedOption.dataset.price || '';
        document.getElementById('orderProductPrice').value = defaultPrice;
        
        // If the product has a size, show it in the size field
        const productId = this.value;
        if (productId) {
            const product = inventoryItems.find(item => item.code === productId);
            if (product) {
                toggleSizeField(product.name, 'addStockProductForm', product.size);
                if (product.size) {
                    document.getElementById('orderProductSize').value = product.size;
                }
            }
        }
    };

    // Setup form submission
    const submitButton = document.getElementById('addOrderProductSubmit');
    submitButton.onclick = handleAddProductToQuote;

    modal.classList.add('active');
}

function handleAddProductToQuote() {
    const productId = document.getElementById('orderProductSelect').value;
    if (!productId) {
        alert('Por favor, selecione um produto.');
        return;
    }
    
    const product = inventoryItems.find(item => item.code === productId);
    if (!product) {
        alert('Produto não encontrado no estoque.');
        return;
    }
    
    const quantity = parseInt(document.getElementById('orderProductQuantity').value);
    if (!quantity || quantity <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    
    const price = parseFloat(document.getElementById('orderProductPrice').value);
    if (!price || price <= 0) {
        alert('Por favor, insira um preço válido.');
        return;
    }
    
    const discount = parseFloat(document.getElementById('orderProductDiscount').value) || 0;
    const size = document.getElementById('orderProductSize').value || product.size || null;
    
    // Adicionar produto com tamanho, se aplicável
    currentOrderProducts.push({
        code: product.code,
        name: product.name,
        quantity,
        price,
        discount,
        size,
        isStock: true
    });
    
    updateQuoteProductsTable();
    closeModal('addOrderProductModal');
}

function handleAddOtherProductToQuote() {
    const name = document.getElementById('otherProductName').value;
    if (!name) {
        alert('Por favor, insira o nome do produto.');
        return;
    }
    
    const quantity = parseInt(document.getElementById('otherProductQuantity').value);
    if (!quantity || quantity <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    
    const price = parseFloat(document.getElementById('otherProductPrice').value);
    if (!price || price <= 0) {
        alert('Por favor, insira um preço válido.');
        return;
    }
    
    const discount = parseFloat(document.getElementById('otherProductDiscount').value) || 0;
    const size = document.getElementById('otherOrderProductSize').value || null;
    
    // Adicionar produto com tamanho, se aplicável
    currentOrderProducts.push({
        name,
        quantity,
        price,
        discount,
        size,
        isStock: false
    });
    
    updateQuoteProductsTable();
    closeModal('addOrderProductModal');
}

function updateQuoteProductsTable() {
    const tableBody = document.querySelector('#orderProductsTable tbody');
    tableBody.innerHTML = '';
    
    let totalAmount = 0;
    
    currentOrderProducts.forEach((product, index) => {
        const productTotal = (product.quantity * product.price) - product.discount;
        totalAmount += productTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}${product.size ? ` <span class="product-size">(${product.size})</span>` : ''}</td>
            <td>${product.quantity}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>R$ ${productTotal.toFixed(2)}</td>
            <td>
                <button class="delete-btn" onclick="removeQuoteProduct(${index})">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function removeQuoteProduct(index) {
    currentOrderProducts.splice(index, 1);
    updateQuoteProductsTable();
}

function handleQuoteSubmit(e) {
    e.preventDefault();
    
    if (currentOrderProducts.length === 0) {
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
    const doc = new jspdf.jsPDF();
    const now = new Date();
    const quoteNumber = 'ORC-' + now.getTime().toString().slice(-6);
    
    let yPos = 20;
    const xPos = 15;
    const lineHeight = 7;
    
    // Document title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('ORÇAMENTO', doc.internal.pageSize.width / 2, yPos, { align: 'center' });
    
    yPos += lineHeight * 2;
    
    // Quote info
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Número: ${quoteNumber}`, xPos, yPos);
    yPos += lineHeight;
    
    doc.text(`Data: ${now.toLocaleDateString()}`, xPos, yPos);
    yPos += lineHeight;
    
    doc.text(`Cliente: ${client}`, xPos, yPos);
    yPos += lineHeight;
    
    doc.text(`Vendedor: ${seller}`, xPos, yPos);
    
    yPos += lineHeight * 2;
    
    // Products table
    const tableColumn = ['Produto', 'Tamanho', 'Qtd', 'Valor Unit.', 'Total'];
    const tableRows = [];
    
    let total = 0;
    
    currentOrderProducts.forEach(product => {
        const productTotal = (product.quantity * product.price) - product.discount;
        total += productTotal;
        
        tableRows.push([
            product.name,
            product.size || '-',
            product.quantity,
            `R$ ${product.price.toFixed(2)}`,
            `R$ ${productTotal.toFixed(2)}`
        ]);
    });
    
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: yPos,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 170, 100] }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Total
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: R$ ${total.toFixed(2)}`, doc.internal.pageSize.width - 20, yPos, { align: 'right' });
    
    yPos += lineHeight * 2;
    
    // Signature lines
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const signatureX1 = 40;
    const signatureX2 = doc.internal.pageSize.width - 40;
    const signatureWidth = 60;
    
    // Client signature
    doc.line(signatureX1 - (signatureWidth / 2), yPos, signatureX1 + (signatureWidth / 2), yPos);
    yPos += 5;
    doc.text('Cliente', signatureX1, yPos, { align: 'center' });
    
    // Seller signature
    doc.line(signatureX2 - (signatureWidth / 2), yPos - 5, signatureX2 + (signatureWidth / 2), yPos - 5);
    doc.text('Vendedor', signatureX2, yPos, { align: 'center' });
    
    // Save and download
    const fileName = `Orcamento_${quoteNumber}.pdf`;
    doc.save(fileName);
    
    // Reset quote data
    currentOrderProducts = [];
    updateQuoteProductsTable();
    
    // Close modal
    closeModal('orderModal');
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
    const columns = [
        { header: 'Código', dataKey: 'code' },
        { header: 'Produto', dataKey: 'name' },
        { header: 'Tamanho', dataKey: 'size' },
        { header: 'Quantidade', dataKey: 'quantity' },
        { header: 'Preço Unit.', dataKey: 'price' },
        { header: 'Total', dataKey: 'total' }
    ];
    
    const data = inventoryItems.map(item => {
        return {
            code: item.code,
            name: item.name,
            size: item.size || '-',
            quantity: item.quantity,
            price: `R$ ${item.price.toFixed(2)}`,
            total: `R$ ${(item.quantity * item.price).toFixed(2)}`
        };
    });
    
    generateReport('Relatório de Estoque', data, columns);
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
    const doc = new jspdf.jsPDF();
    const now = new Date();
    
    let yPos = 20;
    const xPos = 15;
    const lineHeight = 7;
    
    // Document title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(title, doc.internal.pageSize.width / 2, yPos, { align: 'center' });
    
    yPos += lineHeight * 2;
    
    // Report date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Data: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, xPos, yPos);
    
    yPos += lineHeight * 2;
    
    // Create table
    const headers = columns.map(col => col.header);
    const rows = data.map(item => {
        return columns.map(col => item[col.dataKey]);
    });
    
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: yPos,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 170, 100] }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Add page number
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
    }
    
    // Save the report
    doc.save(`${title.replace(/\s+/g, '_')}_${now.toISOString().split('T')[0]}.pdf`);
}

function exportReport() {
    const doc = new jspdf.jsPDF();
    const now = new Date();
    
    // Set font and color
    doc.setFont('helvetica');
    doc.setTextColor(40, 40, 40);
    
    // Title
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('RELATÓRIO COMPLETO', doc.internal.pageSize.width / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Gerado em: ${now.toLocaleDateString()} às ${now.toLocaleTimeString()}`, doc.internal.pageSize.width / 2, 30, { align: 'center' });
    
    // Financial Summary
    let yPos = 50;
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Resumo Financeiro', doc.internal.pageSize.width / 2, yPos, { align: 'center' });
    yPos += 10;
    
    // Calculate financial data
    const financialData = getMonthlyData();
    const currentMonth = new Date().getMonth();
    const currentMonthData = financialData[currentMonth] || { revenue: 0, costs: 0, profit: 0 };
    
    // Financial metrics
    doc.setFontSize(12);
    const metrics = [
        { label: 'Receita Total', value: `R$ ${currentMonthData.revenue.toFixed(2)}` },
        { label: 'Custos Operacionais', value: `R$ ${currentMonthData.costs.toFixed(2)}` },
        { label: 'Lucro Líquido', value: `R$ ${currentMonthData.profit.toFixed(2)}` },
        { label: 'Margem de Lucro', value: `${currentMonthData.revenue > 0 ? ((currentMonthData.profit / currentMonthData.revenue) * 100).toFixed(2) : 0}%` }
    ];
    
    metrics.forEach(metric => {
        doc.setFont(undefined, 'bold');
        doc.text(metric.label + ':', 20, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(metric.value, 120, yPos);
        yPos += 10;
    });
    
    yPos += 10;
    
    // Inventory Summary
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Resumo do Estoque', doc.internal.pageSize.width / 2, yPos, { align: 'center' });
    yPos += 10;
    
    // Inventory table
    const inventoryColumns = [
        { header: 'Código', dataKey: 'code' },
        { header: 'Produto', dataKey: 'name' },
        { header: 'Tamanho', dataKey: 'size' },
        { header: 'Qtd.', dataKey: 'quantity' },
        { header: 'Preço', dataKey: 'price' },
        { header: 'Total', dataKey: 'total' }
    ];
    
    const inventoryRows = inventoryItems.map(item => {
        return [
            item.code,
            item.name,
            item.size || '-',
            item.quantity,
            `R$ ${item.price.toFixed(2)}`,
            `R$ ${(item.quantity * item.price).toFixed(2)}`
        ];
    });
    
    doc.autoTable({
        head: [inventoryColumns.map(col => col.header)],
        body: inventoryRows,
        startY: yPos,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 170, 100] }
    });
    
    yPos = doc.lastAutoTable.finalY + 20;
    
    // Transaction Summary
    if (yPos > doc.internal.pageSize.height - 60) {
        doc.addPage();
        yPos = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Últimas Transações', doc.internal.pageSize.width / 2, yPos, { align: 'center' });
    yPos += 10;
    
    // Transaction table
    const transactionColumns = [
        { header: 'Data', dataKey: 'date' },
        { header: 'Tipo', dataKey: 'type' },
        { header: 'Produto', dataKey: 'product' },
        { header: 'Tamanho', dataKey: 'size' },
        { header: 'Qtd.', dataKey: 'quantity' },
        { header: 'Valor', dataKey: 'value' }
    ];
    
    const transactionRows = transactions.slice(-15).map(transaction => {
        return [
            new Date(transaction.date).toLocaleDateString(),
            transaction.type === 'entry' ? 'Entrada' : 'Saída',
            transaction.product.name,
            transaction.product.size || '-',
            transaction.product.quantity,
            `R$ ${(transaction.product.price * transaction.product.quantity).toFixed(2)}`
        ];
    });
    
    doc.autoTable({
        head: [transactionColumns.map(col => col.header)],
        body: transactionRows,
        startY: yPos,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 170, 100] }
    });
    
    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
    }
    
    // Save report
    const fileName = `Relatorio_Completo_${now.toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
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
        head: [['Produto', 'Tamanho', 'Quantidade', 'Valor Unit.', 'Desconto', 'Total']],
        body: transaction.products.map(product => [
            product.name,
            product.size || '-',
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
    
    doc.setFontSize(12);
    doc.text(`Valor Total: R$ ${transaction.total.toFixed(2)}`, 150, finalY, { align: 'right' });
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
        option.textContent = `${item.name}${item.size ? ` (${item.size})` : ''} (${item.quantity} disponíveis)`;
        option.dataset.price = item.price;
        option.dataset.size = item.size || '';
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
    const productId = document.getElementById('transactionProductSelect').value;
    if (!productId) {
        alert('Por favor, selecione um produto.');
        return;
    }
    
    const product = inventoryItems.find(item => item.code === productId);
    if (!product) {
        alert('Produto não encontrado no estoque.');
        return;
    }
    
    const quantity = parseInt(document.getElementById('transactionProductQuantity').value);
    if (!quantity || quantity <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    
    const price = parseFloat(document.getElementById('transactionProductPrice').value);
    if (!price || price <= 0) {
        alert('Por favor, insira um preço válido.');
        return;
    }
    
    const discount = parseFloat(document.getElementById('transactionProductDiscount').value) || 0;
    const size = document.getElementById('transactionProductSize').value || product.size || null;
    
    // Adicionar produto com tamanho, se aplicável
    currentTransactionProducts.push({
        code: product.code,
        name: product.name,
        quantity,
        price,
        discount,
        size,
        isStock: true
    });
    
    updateTransactionProductsTable();
    closeModal('addTransactionProductModal');
    document.getElementById('transactionProductSelect').value = '';
    document.getElementById('transactionProductQuantity').value = '1';
    document.getElementById('transactionProductPrice').value = '';
    document.getElementById('transactionProductDiscount').value = '0';
}

function handleAddOtherProduct() {
    const name = document.getElementById('otherProductName').value;
    if (!name) {
        alert('Por favor, insira o nome do produto.');
        return;
    }
    
    const quantity = parseInt(document.getElementById('otherProductQuantity').value);
    if (!quantity || quantity <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    
    const price = parseFloat(document.getElementById('otherProductPrice').value);
    if (!price || price <= 0) {
        alert('Por favor, insira um preço válido.');
        return;
    }
    
    const discount = parseFloat(document.getElementById('otherProductDiscount').value) || 0;
    const size = document.getElementById('otherProductSize').value || null;
    
    // Adicionar produto com tamanho, se aplicável
    currentTransactionProducts.push({
        name,
        quantity,
        price,
        discount,
        size,
        isStock: false
    });
    
    updateTransactionProductsTable();
    closeModal('addTransactionProductModal');
    document.getElementById('otherProductName').value = '';
    document.getElementById('otherProductQuantity').value = '1';
    document.getElementById('otherProductPrice').value = '';
    document.getElementById('otherProductDiscount').value = '0';
}

function updateTransactionProductsTable() {
    const tableBody = document.querySelector('#transactionProductsTable tbody');
    tableBody.innerHTML = '';
    
    let totalAmount = 0;
    
    currentTransactionProducts.forEach((product, index) => {
        const productTotal = (product.quantity * product.price) - product.discount;
        // Add total property to each product for use in other functions
        product.total = productTotal;
        totalAmount += productTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}${product.size ? ` <span class="product-size">(${product.size})</span>` : ''}</td>
            <td>${product.quantity}</td>
            <td>R$ ${product.price.toFixed(2)}</td>
            <td>R$ ${product.discount.toFixed(2)}</td>
            <td>R$ ${productTotal.toFixed(2)}</td>
            <td>
                <button class="delete-btn" onclick="removeTransactionProduct(${index})">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    document.getElementById('transactionTotalAmount').innerHTML = `<strong>R$ ${totalAmount.toFixed(2)}</strong>`;
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

// Função para verificar se o produto requer tamanho
function requiresSize(productName) {
    if (!productName) return false;
    
    const clothingItems = ['blusa', 'camisa', 'camiseta', 'calça', 'bermuda', 'shorts'];
    const footwearItems = ['bota', 'chinelo', 'sandália', 'sandalia', 'tênis', 'tenis', 'botina'];
    
    productName = productName.toLowerCase();
    
    if (clothingItems.some(item => productName.includes(item))) {
        return 'clothing';
    } else if (footwearItems.some(item => productName.includes(item))) {
        return 'footwear';
    }
    
    return false;
}

// Função para mostrar ou esconder o campo de tamanho
function toggleSizeField(productName, formId, presetSize = null) {
    const productType = requiresSize(productName);
    const sizeFieldContainer = document.querySelector(`#${formId} .size-field-container`);
    
    if (!sizeFieldContainer) return;
    
    if (productType) {
        sizeFieldContainer.style.display = 'block';
        const sizeSelect = document.querySelector(`#${formId} .product-size-select`);
        
        // Limpar opções existentes
        while (sizeSelect.options.length > 1) {
            sizeSelect.remove(1);
        }
        
        // Se estamos no formulário de saída e temos um produto com tamanho específico no estoque
        if (formId === 'addStockProductForm' && presetSize) {
            const option = document.createElement('option');
            option.value = presetSize;
            option.textContent = presetSize;
            sizeSelect.appendChild(option);
        } else {
            // Adicionar tamanhos apropriados
            if (productType === 'clothing') {
                const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XGG', 'G1', 'G2', 'G3', 'G4', 'G5'];
                sizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    sizeSelect.appendChild(option);
                });
            } else if (productType === 'footwear') {
                for (let i = 31; i <= 48; i++) {
                    const option = document.createElement('option');
                    option.value = i.toString();
                    option.textContent = i.toString();
                    sizeSelect.appendChild(option);
                }
            }
        }
    } else {
        sizeFieldContainer.style.display = 'none';
    }
}

// Adicionar listener para nome do produto e atualizar campo de tamanho
function setupProductNameListeners() {
    // Para o formulário de produto
    document.getElementById('productName').addEventListener('input', function(e) {
        toggleSizeField(e.target.value, 'productForm');
    });
    
    // Para o formulário de outros produtos na transação
    document.getElementById('otherProductName').addEventListener('input', function(e) {
        toggleSizeField(e.target.value, 'addOtherProductForm');
    });
    
    // Para o formulário de produtos do estoque na transação
    document.getElementById('transactionProductSelect').addEventListener('change', function() {
        const productId = this.value;
        if (productId) {
            const product = inventoryItems.find(item => item.code === productId);
            if (product) {
                toggleSizeField(product.name, 'addStockProductForm', product.size);
                
                // Se o produto já tem um tamanho definido, usá-lo como padrão
                if (product.size) {
                    document.getElementById('transactionProductSize').value = product.size;
                }
            }
        }
    });
} 