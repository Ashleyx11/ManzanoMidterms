import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import "./index.css";
import { setAuthToken } from './authUtils';

const Login = () => {
    const [formState, setFormState] = useState({
        username: "",
        password: "",
        rememberMe: false
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const usernameRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Login component mounted");

        // Focus username input when component mounts
        usernameRef.current?.focus();

        // Check for saved credentials
        const savedUsername = localStorage.getItem("savedUsername");
        if (savedUsername) {
            setFormState(prev => ({
                ...prev,
                username: savedUsername,
                rememberMe: true
            }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(`Input changed - Name: ${name}, Value: ${value}, Type: ${type}, Checked: ${checked}`);

        setFormState(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        // Clear error when user types
        if (error) setError("");
    };

    const validateForm = () => {
        console.log("Validating form");
        if (!formState.username.trim()) {
            setError("Username is required");
            console.log("Form validation failed: Username is required");
            return false;
        }
        if (!formState.password) {
            setError("Password is required");
            console.log("Form validation failed: Password is required");
            return false;
        }
        console.log("Form validation successful");
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("Login button clicked");

        if (!validateForm()) {
            console.log("Form is invalid, preventing login");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            console.log("Starting login process");

            // Simulate API call with timeout (replace with real API call)
            await new Promise(resolve => setTimeout(resolve, 800));

            // Simulate API response (replace with your actual API endpoint)
            const fakeApiResponse = {
                success: true,
                token: "fake-user-jwt-token",  // Replace with JWT from your API
                username: formState.username
            };

            console.log("API response:", fakeApiResponse);

            if (fakeApiResponse.success) {
                // Store the authentication token securely
                setAuthToken(fakeApiResponse.token);

                // Handle remember me functionality
                if (formState.rememberMe) {
                    localStorage.setItem("savedUsername", formState.username);
                } else {
                    localStorage.removeItem("savedUsername");
                }

                // Store username (consider if you really need this in localStorage)
                localStorage.setItem("username", fakeApiResponse.username);

                console.log("Login successful, redirecting to dashboard");
                navigate("/dashboard"); // Redirect to dashboard
            } else {
                throw new Error("Login failed: " + (fakeApiResponse.message || "Invalid credentials"));
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please try again later.");
        } finally {
            console.log("Login process completed, setting isLoading to false");
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        console.log("Toggling password visibility");
        setShowPassword(prev => !prev);
    };

    return (
        <div className="login-container">
            <h1 className="login-title">TRADER LOGIN</h1>

            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        ref={usernameRef}
                        value={formState.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        autoComplete="username"
                        disabled={isLoading}
                        aria-invalid={error && error.includes("username") ? "true" : "false"}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-container">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formState.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            aria-invalid={error && error.includes("password") ? "true" : "false"}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="password-toggle"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="form-options">
                    <div className="remember-me">
                        <input
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            checked={formState.rememberMe}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="rememberMe">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="forgot-password">
                        Forgot password?
                    </Link>
                </div>

                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="login-btn"
                    disabled={isLoading}
                    aria-busy={isLoading}
                >
                    {isLoading ? (
                        <span className="loading-spinner"></span>
                    ) : (
                        <>
                            <LogIn size={18} />
                            <span>Login</span>
                        </>
                    )}
                </button>
            </form>

            <p className="signup-prompt">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
