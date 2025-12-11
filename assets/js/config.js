// Change this to 'http://your-server-ip:3000' when deploying
const API_BASE_URL = "http://localhost:3000/api";

// Helper function to format money
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
};