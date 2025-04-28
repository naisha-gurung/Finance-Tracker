
// Predefined colors for the chart
const chartColors = [
    '#00856f', '#48a38f', '#007b5e', '#00a380', '#005d47', '#ff6347',
    '#ffa500', '#ff4500', '#6a5acd', '#4682b4', '#32cd32', '#8b0000'
];

// Map to associate categories with chart colors
const categoryColors = {};

// Function to generate a new color for a category
function getCategoryColor(category) {
    if (!categoryColors[category]) {
        const availableColors = chartColors.filter(color => !Object.values(categoryColors).includes(color));
        categoryColors[category] = availableColors.length > 0 ? availableColors[0] : '#000000'; // Default to black if colors exhausted
    }
    return categoryColors[category];
}

const transactionForm = document.getElementById('transactionForm');
const categoryForm = document.getElementById('categoryForm');
const categoryDropdown = document.getElementById('category');
const dateInput = document.getElementById('date');
const amountInput = document.getElementById('amount');
const addTransactionBtn = document.getElementById('addTransaction');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const remainingBalanceEl = document.getElementById('remainingBalance');
const transactionHistoryEl = document.getElementById('transactionHistory');
const categoryBudgetTable = document.getElementById('categoryBudgetTable');
const chartCanvas = document.getElementById('expenseChart');

let totalIncome = 0;
let totalExpenses = 0;
const transactions = [];
const budgets = {
    Rent: 1000,
    Grocery: 500,
    Transportation: 300
};

const ctx = chartCanvas.getContext('2d');
let expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            }
        }
    }
});

function updateSummary() {
    totalIncomeEl.textContent = totalIncome.toFixed(2);
    totalExpensesEl.textContent = totalExpenses.toFixed(2);
    remainingBalanceEl.textContent = (totalIncome - totalExpenses).toFixed(2);
}

function updateChart() {
    const expenseData = transactions
        .filter(t => t.category !== 'Income')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    // Update chart labels, data, and colors
    expenseChart.data.labels = Object.keys(expenseData);
    expenseChart.data.datasets[0].data = Object.values(expenseData);
    expenseChart.data.datasets[0].backgroundColor = Object.keys(expenseData).map(getCategoryColor);
    expenseChart.update();
}

function updateBudgetTable() {
    categoryBudgetTable.innerHTML = ''; // Clear table
    const spending = transactions.reduce((acc, t) => {
        if (t.category !== 'Income') {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
        }
        return acc;
    }, {});

    for (const [category, budget] of Object.entries(budgets)) {
        const spent = spending[category] || 0; // Total spent for this category
        const difference = budget - spent; // Calculate difference

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category}</td>
            <td>$${budget.toFixed(2)}</td>
            <td>$${spent.toFixed(2)}</td>
            <td>$${difference.toFixed(2)}</td>
        `;
        categoryBudgetTable.appendChild(row);
    }

    // Ensure the pie chart updates after table updates
    updateChart();
}

function addTransactionToTable(transaction) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${transaction.date}</td>
        <td>${transaction.category}</td>
        <td>$${transaction.amount.toFixed(2)}</td>
    `;
    transactionHistoryEl.appendChild(row);
}

addTransactionBtn.addEventListener('click', () => {
    const dateValue = dateInput.value;
    const categoryValue = categoryDropdown.value;
    const amountValue = parseFloat(amountInput.value);

    if (!dateValue || !amountValue) {
        alert('Please fill in all fields');
        return;
    }

    const transaction = { date: dateValue, category: categoryValue, amount: amountValue };
    transactions.push(transaction);

    if (categoryValue === 'Income') {
        totalIncome += amountValue;
    } else {
        totalExpenses += amountValue;
    }

    addTransactionToTable(transaction);
    updateSummary();
    updateChart();
    updateBudgetTable();

    dateInput.value = '';
    amountInput.value = '';
});

categoryForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const newCategory = document.getElementById('newCategory').value.trim();
    const budgetValue = parseFloat(document.getElementById('budget').value);

    if (newCategory && budgetValue) {
        const option = document.createElement('option');
        option.value = newCategory;
        option.textContent = newCategory;
        categoryDropdown.appendChild(option);

        budgets[newCategory] = budgetValue;
        getCategoryColor(newCategory); // Assign a color to the new category
        updateBudgetTable();

        alert(`Category "${newCategory}" with a budget of $${budgetValue.toFixed(2)} added!`);
        categoryForm.reset();
    }
});

updateBudgetTable();