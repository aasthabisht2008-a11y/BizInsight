// =======================
// DEFAULT DATA
// =======================
let defaultProducts = [
    { name: "Smart Watch", price: 5000, sales: 120, stock: 45 },
    { name: "Headphones", price: 2000, sales: 200, stock: 65 }
];

// =======================
// INIT STORAGE
// =======================
if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(defaultProducts));
}

let products = JSON.parse(localStorage.getItem("products"));

// =======================
// GLOBAL CHART INSTANCES
// =======================
let salesLineChartInstance;
let barChartInstance;

// =======================
// ADD PRODUCT
// =======================
function addProduct() {
    let name = document.getElementById("name").value;
    let price = Number(document.getElementById("price").value);
    let sales = Number(document.getElementById("sales").value);
    let stock = Number(document.getElementById("stock").value);

    if (!name || !price || !sales || !stock) {
        alert("Fill all fields");
        return;
    }

    products.push({ name, price, sales, stock });

    localStorage.setItem("products", JSON.stringify(products));

    displayProducts();
    updateDashboard();
    updateCharts();
}

// =======================
// DISPLAY PRODUCTS TABLE
// =======================
function displayProducts() {
    let table = document.getElementById("productTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Sales</th>
            <th>Stock</th>
        </tr>
    `;

    products.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>₹${p.price}</td>
                <td>${p.sales}</td>
                <td>${p.stock}</td>
            </tr>
        `;
    });
}

// =======================
// DASHBOARD UPDATE
// =======================
function updateDashboard() {
    let revenue = 0;
    let orders = 0;
    let totalStock = 0;

    products.forEach(p => {
        revenue += p.price * p.sales;
        orders += p.sales;
        totalStock += p.stock;
    });

    let conversionRate = ((orders / (orders + totalStock)) * 100).toFixed(1);

    let r = document.getElementById("revenue");
    let o = document.getElementById("orders");
    let c = document.getElementById("conversion");

    if (r) r.innerText = "₹" + revenue;
    if (o) o.innerText = orders;
    if (c) c.innerText = conversionRate + "%";
}

// =======================
// CHART UPDATE FUNCTION
// =======================
function updateCharts() {
    products = JSON.parse(localStorage.getItem("products")) || [];

    let labels = products.map(p => p.name);
    let salesData = products.map(p => p.sales);

    // ================= LINE CHART =================
    let salesChart = document.getElementById("salesChart");

    if (salesChart && typeof Chart !== "undefined") {

        if (!salesLineChartInstance) {
            salesLineChartInstance = new Chart(salesChart, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Sales",
                        data: salesData,
                        borderColor: "#a855f7",
                        fill: false
                    }]
                }
            });
        } else {
            salesLineChartInstance.data.labels = labels;
            salesLineChartInstance.data.datasets[0].data = salesData;
            salesLineChartInstance.update();
        }
    }

    // ================= BAR CHART =================
    let barChart = document.getElementById("barChart");

    if (barChart && typeof Chart !== "undefined") {

        if (!barChartInstance) {
            barChartInstance = new Chart(barChart, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Sales",
                        data: salesData,
                        backgroundColor: "#a855f7"
                    }]
                }
            });
        } else {
            barChartInstance.data.labels = labels;
            barChartInstance.data.datasets[0].data = salesData;
            barChartInstance.update();
        }
    }
}

// =======================
// REVIEW ANALYZER
// =======================
function analyzeReviews() {

    let reviews = [
        "good product",
        "excellent quality",
        "bad experience",
        "very poor service",
        "amazing item",
        "not worth it",
        "great performance",
        "terrible packaging"
    ];

    let positiveWords = ["good", "excellent", "amazing", "great"];
    let negativeWords = ["bad", "poor", "terrible", "not"];

    let positive = 0;
    let negative = 0;

    reviews.forEach(r => {
        let text = r.toLowerCase();

        positiveWords.forEach(word => {
            if (text.includes(word)) positive++;
        });

        negativeWords.forEach(word => {
            if (text.includes(word)) negative++;
        });
    });

    document.getElementById("positive").innerText =
        "Positive Reviews: " + positive;

    document.getElementById("negative").innerText =
        "Negative Reviews: " + negative;

    document.getElementById("result").innerText =
        positive > negative ? "Overall Positive Feedback" : "Needs Improvement";
}

// =======================
// INITIAL LOAD
// =======================
displayProducts();
updateDashboard();
updateCharts();