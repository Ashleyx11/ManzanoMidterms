import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LineController,
    BarController,
} from "chart.js";
import {
    FaBars,
    FaTimes,
    FaUser,
    FaCog,
    FaEnvelope,
    FaSignOutAlt,
    FaSync,
    FaArrowUp,
    FaArrowDown,
    FaSearch,
    FaPlus,
} from "react-icons/fa";
import "./index.css";
import { faker } from '@faker-js/faker';
import moment from 'moment';

faker.locale = 'en';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LineController,
    BarController
);

const Dashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Trader";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [portfolioData, setPortfolioData] = useState(null);
    const [stockData, setStockData] = useState([]);
    const [assetAllocationData, setAssetAllocationData] = useState(null);
    const [timeRange, setTimeRange] = useState("6mo");
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStockData, setFilteredStockData] = useState([]);
    const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState(false);
    const [newPosition, setNewPosition] = useState({
        ticker: '',
        quantity: 0,
        price: 0,
    });

    // Simulated Data Fetching (Replace with API calls later)
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        console.log("fetchData started");

        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Simulated API delay complete");

            // Simulated Portfolio Data (using faker)
            const generatePortfolioData = (months) => {
                const data = [];
                let currentValue = 100000; // Starting value
                for (let i = 0; i < months; i++) {
                    const change = faker.number.int({ min: -2000, max: 3000 }); // Random change
                    currentValue += change;
                    data.push(currentValue);
                }
                return data;
            };

            const monthsMap = {
                '1mo': 1,
                '3mo': 3,
                '6mo': 6,
                '1yr': 12,
                'All': 24 // or more, depending on your needs
            };

            const portfolioMonths = monthsMap[timeRange];
            let portfolioValues = [];

            try {
                portfolioValues = generatePortfolioData(portfolioMonths);
                console.log(`Generated portfolio values for ${portfolioMonths} months`);
            } catch (err) {
                console.error("Error generating portfolio data:", err);
                setError("Failed to generate portfolio data");
                return;
            }

            let labels = [];
            try {
                labels = Array.from({ length: portfolioMonths }, (_, i) => {
                    return moment().subtract(portfolioMonths - 1 - i, 'months').format('MMM');
                });
                console.log("Generated labels:", labels);
            } catch (err) {
                console.error("Error generating labels with moment:", err);
                setError("Failed to generate labels with moment");
                return;
            }

            const simulatedPortfolioData = {
                labels: labels,
                datasets: [
                    {
                        label: "Portfolio Value",
                        data: portfolioValues,
                        backgroundColor: "rgba(0, 255, 0, 0.2)",
                        borderColor: "rgba(0, 255, 0, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                ],
            };
            console.log("simulatedPortfolioData: ", simulatedPortfolioData);

            const totalChange = portfolioValues[portfolioValues.length - 1] - portfolioValues[0];
            let totalChangePercentage = 0;
            if (portfolioValues[0] !== 0) {
                totalChangePercentage = ((totalChange / portfolioValues[0]) * 100).toFixed(2);
            } else {
                console.warn("portfolioValues[0] is zero, setting totalChangePercentage to 0");
            }
            console.log("Calculated total change and percentage");

            let simulatedStockData = [];
            try {
                simulatedStockData = Array.from({ length: 10 }, () => {
                    let name, price, change;
                    try {
                        name = faker.finance.stockSymbol();
                    } catch (err) {
                        console.error("Error generating stock symbol:", err);
                        name = "N/A";
                    }
                    try {
                        price = faker.finance.amount({ min: 50, max: 300, dec: 2 });
                    } catch (err) {
                        console.error("Error generating stock price:", err);
                        price = "0";
                    }
                    try {
                        change = faker.number.float({ min: -5, max: 5, precision: 0.01 });
                    } catch (err) {
                        console.error("Error generating stock change:", err);
                        change = 0;
                    }
                    return { name, price, change };
                });
                console.log("Generated simulated stock data");
            } catch (err) {
                console.error("Error generating stock data with faker:", err);
                setError("Failed to generate stock data");
                return;
            }

            let simulatedAssetAllocationData = null;
            try {
                simulatedAssetAllocationData = {
                    labels: ["Stocks", "Bonds", "Crypto", "Cash", "Real Estate"],
                    datasets: [
                        {
                            data: [faker.number.int({ min: 10, max: 50 }), faker.number.int({ min: 10, max: 50 }), faker.number.int({ min: 5, max: 30 }), faker.number.int({ min: 5, max: 30 }), faker.number.int({ min: 5, max: 20 })],
                            backgroundColor: ["#00ff00", "#007bff", "#ff0000", "#b3b3b3", "#FFA500"],
                        },
                    ],
                };
                console.log("Generated simulated asset allocation data");
            } catch (err) {
                console.error("Error generating asset allocation data with faker:", err);
                setError("Failed to generate asset allocation data");
                return;
            }


            setPortfolioData(prevState => {
                const newPortfolioData = {
                    chartData: simulatedPortfolioData,
                    currentValue: `$${portfolioValues[portfolioValues.length - 1].toFixed(2)}`,
                    totalPL: `${totalChange > 0 ? '+' : ''}$${totalChange.toFixed(2)}`,
                    totalPLPercentage: `${totalChangePercentage}%`,
                };
                console.log("Set portfolio data:", newPortfolioData);
                return newPortfolioData;
            });


            setStockData(simulatedStockData);
            console.log("Set stock data");

            setAssetAllocationData(simulatedAssetAllocationData);
            console.log("Set asset allocation data");


        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data. Please try again later.");
        } finally {
            setLoading(false);
            console.log("fetchData completed, loading set to false");
        }
    }, [timeRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const filtered = stockData.filter(stock =>
            stock.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStockData(filtered);
    }, [stockData, searchQuery]);


    const handleLogout = () => {
        localStorage.removeItem("username");
        navigate("/");
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleTimeRangeChange = (newTimeRange) => {
        setTimeRange(newTimeRange);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleOpenAddPositionModal = () => {
        setIsAddPositionModalOpen(true);
    };

    const handleCloseAddPositionModal = () => {
        setIsAddPositionModalOpen(false);
        setNewPosition({ ticker: '', quantity: 0, price: 0 });
    };

    const handleNewPositionChange = (e) => {
        const { name, value } = e.target;
        setNewPosition(prevState => ({
            ...prevState,
            [name]: name === 'quantity' || name === 'price' ? parseFloat(value) : value,
        }));
    };

    const handleAddPositionSubmit = (e) => {
        e.preventDefault();
        console.log("New position submitted:", newPosition);
        setStockData(prevData => [...prevData, {
            name: newPosition.ticker,
            price: newPosition.price,
            change: 0,
        }]);

        handleCloseAddPositionModal();
    };

    const portfolioValue = useMemo(() => portfolioData?.currentValue || "$0", [portfolioData]);
    const totalPL = useMemo(() => portfolioData?.totalPL || "$0", [portfolioData]);
    const totalPLPercentage = useMemo(() => portfolioData?.totalPLPercentage || "0%", [portfolioData]);


    if (loading) {
        return <div className="loading-indicator">Loading... <FaSync className="spin-icon" /></div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="dashboard-container">
            {/* header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">TRADER DASHBOARD</h1>
                <div className="menu-icon" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>
                {isMenuOpen && (
                    <div className="menu-dropdown">
                        <div className="menu-item" onClick={() => alert("Profile clicked!")}>
                            <FaUser className="menu-icon" />
                            <span>Profile</span>
                        </div>
                        <div className="menu-item" onClick={() => alert("Settings clicked!")}>
                            <FaCog className="menu-icon" />
                            <span>Settings</span>
                        </div>
                        <div className="menu-item" onClick={() => alert("Contact Us clicked!")}>
                            <FaEnvelope className="menu-icon" />
                            <span>Contact Us</span>
                        </div>
                        <div className="menu-item" onClick={handleLogout}>
                            <FaSignOutAlt className="menu-icon" />
                            <span>Logout</span>
                        </div>
                    </div>
                )}
            </div>

            {/* time range */}
            <div className="time-range-selector">
                <button onClick={() => handleTimeRangeChange("1mo")} className={timeRange === "1mo" ? "active" : ""}>1M</button>
                <button onClick={() => handleTimeRangeChange("3mo")} className={timeRange === "3mo" ? "active" : ""}>3M</button>
                <button onClick={() => handleTimeRangeChange("6mo")} className={timeRange === "6mo" ? "active" : ""}>6M</button>
                <button onClick={() => handleTimeRangeChange("1yr")} className={timeRange === "1yr" ? "active" : ""}>1Y</button>
                <button onClick={() => handleTimeRangeChange("All")} className={timeRange === "All" ? "active" : ""}>All</button>
            </div>

            {/* financial metrics */}
            <div className="dashboard-grid">
                <div className="dashboard-box">
                    <h2>Portfolio Value</h2>
                    <div className="metric-value">{portfolioValue}</div>
                    <div className="metric-label">
                        {totalPL} ({totalPLPercentage})
                    </div>
                </div>
                <div className="dashboard-box">
                    <h2>Total P&L</h2>
                    <div className={`metric-value ${parseFloat(totalPL.slice(1)) >= 0 ? 'positive' : 'negative'}`}>{totalPL}</div>
                    <div className="metric-label">{totalPLPercentage} YTD</div>
                </div>
                <div className="dashboard-box">
                    <h2>Open Positions</h2>
                    <div className="metric-value">{stockData.length}</div>
                    <div className="metric-label">View Details</div>
                </div>
                <div className="dashboard-box">
                    <h2>Risk Score</h2>
                    <div className="metric-value">7/10</div>
                    <div className="metric-label">Moderate Risk</div>
                </div>
            </div>

            {/* Stock Ticker with Search */}
            <div className="dashboard-box">
                <div className="stock-ticker-header">
                    <h2>Stock Ticker</h2>
                    <div className="stock-search">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search Stocks"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button className="add-position-button" onClick={handleOpenAddPositionModal}>
                        <FaPlus /> Add Position
                    </button>
                </div>

                {filteredStockData.length > 0 ? (
                    filteredStockData.map((ticker, index) => (
                        <div key={index} className="stock-ticker">
                            <span className="ticker-name">{ticker.name}</span>
                            <span className={`ticker-price ${ticker.change >= 0 ? 'positive' : 'negative'}`}>
                                ${ticker.price} ({ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)}%)
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="no-results">No matching stocks found.</div>
                )}
            </div>

            {/* charts */}
            <div className="chart-container">
                <div className="dashboard-box chart-box">
                    <h2>Portfolio Performance</h2>
                    <div className="chart-wrapper">
                        <Bar data={portfolioData?.chartData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            return `Value: $${context.parsed.y.toFixed(2)}`;
                                        }
                                    }
                                }
                            }
                        }} />
                    </div>
                </div>
                <div className="dashboard-box chart-box">
                    <h2>Asset Allocation</h2>
                    <div className="chart-wrapper">
                        <Pie data={assetAllocationData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const value = assetAllocationData.datasets[0].data[context.dataIndex];
                                            const label = assetAllocationData.labels[context.dataIndex];
                                            return `${label}: ${value}%`;
                                        }
                                    }
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>

            {/* position modal */}
            {isAddPositionModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseAddPositionModal}>×</span>
                        <h2>Add New Position</h2>
                        <form onSubmit={handleAddPositionSubmit}>
                            <label htmlFor="ticker">Ticker:</label>
                            <input
                                type="text"
                                id="ticker"
                                name="ticker"
                                value={newPosition.ticker}
                                onChange={handleNewPositionChange}
                                required
                            />

                            <label htmlFor="quantity">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={newPosition.quantity}
                                onChange={handleNewPositionChange}
                                required
                            />

                            <label htmlFor="price">Price:</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={newPosition.price}
                                onChange={handleNewPositionChange}
                                required
                            />

                            <button type="submit">Add</button>
                        </form>
                    </div>
                </div>
            )}


            {/* footer */}
            <div className="dashboard-footer">
                <p>© {new Date().getFullYear()} Trader Dashboard. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Dashboard;
