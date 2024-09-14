// Select elements
const investmentForm = document.getElementById('investment-form');
const assetNameInput = document.getElementById('asset-name');
const amountInvestedInput = document.getElementById('amount-invested');
const currentValueInput = document.getElementById('current-value');
const investmentList = document.getElementById('investment-list');
const portfolioValue = document.getElementById('portfolio-value');
const portfolioChartElement = document.getElementById('portfolio-chart');

let investments = JSON.parse(localStorage.getItem('investments')) || [];

// Initialize the chart
let portfolioChart = new Chart(portfolioChartElement, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    },
});

// Update chart data
function updateChart() {
    portfolioChart.data.labels = investments.map(inv => inv.assetName);
    portfolioChart.data.datasets[0].data = investments.map(inv => inv.currentValue);
    portfolioChart.update();
}

// Calculate total portfolio value
function calculateTotalValue() {
    const total = investments.reduce((acc, inv) => acc + inv.currentValue, 0);
    portfolioValue.textContent = total.toFixed(2);
}

// Add investment to the table
function addInvestmentToTable(investment, index) {
    const row = document.createElement('tr');
    const percentageChange = ((investment.currentValue - investment.amountInvested) / investment.amountInvested * 100).toFixed(2);

    row.innerHTML = `
        <td>${investment.assetName}</td>
        <td>$${investment.amountInvested.toFixed(2)}</td>
        <td>$${investment.currentValue.toFixed(2)}</td>
        <td>${percentageChange}%</td>
        <td>
            <button class="update" onclick="updateInvestment(${index})">Update</button>
            <button class="remove" onclick="removeInvestment(${index})">Remove</button>
        </td>
    `;

    investmentList.appendChild(row);
}

// Render all investments
function renderInvestments() {
    investmentList.innerHTML = '';
    investments.forEach(addInvestmentToTable);
    calculateTotalValue();
    updateChart();
}

// Add a new investment
investmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newInvestment = {
        assetName: assetNameInput.value,
        amountInvested: parseFloat(amountInvestedInput.value),
        currentValue: parseFloat(currentValueInput.value),
    };

    investments.push(newInvestment);
    localStorage.setItem('investments', JSON.stringify(investments));
    renderInvestments();

    investmentForm.reset();
});

// Update an investment
window.updateInvestment = function(index) {
    const newValue = parseFloat(prompt('Enter the new current value:'));
    if (!isNaN(newValue)) {
        investments[index].currentValue = newValue;
        localStorage.setItem('investments', JSON.stringify(investments));
        renderInvestments();
    }
};

// Remove an investment
window.removeInvestment = function(index) {
    investments.splice(index, 1);
    localStorage.setItem('investments', JSON.stringify(investments));
    renderInvestments();
};

// Initial render
renderInvestments();
