import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Check, X } from "lucide-react";
import "./index.css";
import { setAuthToken } from './authUtils';

const Signup = () => {
    const [formState, setFormState] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
    });

    const [validations, setValidations] = useState({
        username: { valid: false, message: "" },
        email: { valid: false, message: "" },
        password: { valid: false, message: "" },
        confirmPassword: { valid: false, message: "" }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);

    const usernameRef = useRef(null);
    const navigate = useNavigate();

    const passwordRequirements = [
        { id: "length", label: "At least 8 characters", valid: false },
        { id: "uppercase", label: "At least one uppercase letter", valid: false },
        { id: "lowercase", label: "At least one lowercase letter", valid: false },
        { id: "number", label: "At least one number", valid: false },
        { id: "special", label: "At least one special character", valid: false }
    ];

    const [passwordChecks, setPasswordChecks] = useState(passwordRequirements);

    useEffect(() => {
        console.log("Signup component mounted");
        // Focus username input on component mount
        usernameRef.current?.focus();
    }, []);

    useEffect(() => {
        // Validate username
        console.log("Validating username:", formState.username);
        validateUsername(formState.username);
    }, [formState.username]);

    useEffect(() => {
        // Validate email
        console.log("Validating email:", formState.email);
        validateEmail(formState.email);
    }, [formState.email]);

    useEffect(() => {
        // Validate password and check strength
        console.log("Validating password");
        validatePassword(formState.password);
    }, [formState.password]);

    useEffect(() => {
        // Validate confirm password
        console.log("Validating confirm password");
        validateConfirmPassword(formState.confirmPassword);
    }, [formState.confirmPassword, formState.password]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(`Input changed - Name: ${name}, Value: ${value}, Type: ${type}, Checked: ${checked}`);

        setFormState(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        // Clear general error when user types
        if (error) setError("");
    };

    const validateUsername = (username) => {
        let valid = true;
        let message = "";

        if (!username) {
            valid = false;
            message = "Username is required";
        } else if (username.length < 3) {
            valid = false;
            message = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            valid = false;
            message = "Username can only contain letters, numbers and underscores";
        }

        console.log("Username validation result:", { valid, message });

        setValidations(prev => ({
            ...prev,
            username: { valid, message }
        }));

        return valid;
    };

    const validateEmail = (email) => {
        let valid = true;
        let message = "";

        if (!email) {
            valid = false;
            message = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            valid = false;
            message = "Please enter a valid email address";
        }

        console.log("Email validation result:", { valid, message });

        setValidations(prev => ({
            ...prev,
            email: { valid, message }
        }));

        return valid;
    };

    const validatePassword = (password) => {
        let valid = true;
        let message = "";
        let strength = 0;

        // Check all password requirements
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

        // Update password checks
        const updatedChecks = passwordRequirements.map(check => ({
            ...check,
            valid:
                (check.id === "length" && hasLength) ||
                (check.id === "uppercase" && hasUppercase) ||
                (check.id === "lowercase" && hasLowercase) ||
                (check.id === "number" && hasNumber) ||
                (check.id === "special" && hasSpecial)
        }));

        setPasswordChecks(updatedChecks);

        // Calculate password strength (0-4)
        if (password) {
            strength += hasLength ? 1 : 0;
            strength += hasUppercase ? 1 : 0;
            strength += hasLowercase ? 1 : 0;
            strength += hasNumber ? 1 : 0;
            strength += hasSpecial ? 1 : 0;
        }

        setPasswordStrength(strength);

        if (!password) {
            valid = false;
            message = "Password is required";
        } else if (!hasLength) {
            valid = false;
            message = "Password must be at least 8 characters";
        } else if (!(hasUppercase && hasLowercase && hasNumber)) {
            valid = false;
            message = "Password doesn't meet complexity requirements";
        }

        console.log("Password validation result:", { valid, message, strength });

        setValidations(prev => ({
            ...prev,
            password: { valid, message }
        }));

        return valid;
    };

    const validateConfirmPassword = (confirmPassword) => {
        let valid = true;
        let message = "";

        if (!confirmPassword) {
            valid = false;
            message = "Please confirm your password";
        } else if (confirmPassword !== formState.password) {
            valid = false;
            message = "Passwords do not match";
        }

        console.log("Confirm password validation result:", { valid, message });

        setValidations(prev => ({
            ...prev,
            confirmPassword: { valid, message }
        }));

        return valid;
    };

    const validateForm = () => {
        console.log("Validating form");
        const usernameValid = validateUsername(formState.username);
        const emailValid = validateEmail(formState.email);
        const passwordValid = validatePassword(formState.password);
        const confirmPasswordValid = validateConfirmPassword(formState.confirmPassword);

        if (!formState.agreeToTerms) {
            setError("You must agree to the Terms of Service");
            console.log("Form validation failed: Terms not agreed to");
            return false;
        }

        const isFormValid = usernameValid && emailValid && passwordValid && confirmPasswordValid;
        console.log("Form validation result:", isFormValid);

        return isFormValid;
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        console.log("Signup button clicked");

        if (!validateForm()) {
            console.log("Form is invalid, preventing signup");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            console.log("Starting signup process");
            await new Promise(resolve => setTimeout(resolve, 1000));
            const fakeApiResponse = {
                success: true,
                token: "fake-user-jwt-token",
                username: formState.username
            };

            console.log("API response:", fakeApiResponse);

            if (fakeApiResponse.success) {
                setAuthToken(fakeApiResponse.token);
                localStorage.setItem("username", fakeApiResponse.username);

                console.log("Signup successful, redirecting to dashboard");

                // Redirect to dashboard
                navigate("/dashboard");
            } else {
                throw new Error("Signup failed: " + (fakeApiResponse.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.message || "Sign up failed. Please try again.");
        } finally {
            console.log("Signup process completed, setting isLoading to false");
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        console.log(`Toggling visibility for ${field}`);
        if (field === "password") {
            setShowPassword(prev => !prev);
        } else {
            setShowConfirmPassword(prev => !prev);
        }
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return "";
        if (passwordStrength === 1) return "Very Weak";
        if (passwordStrength === 2) return "Weak";
        if (passwordStrength === 3) return "Medium";
        return "Strong";
    };

    const getPasswordStrengthClass = () => {
        if (passwordStrength === 0) return "";
        if (passwordStrength <= 2) return "strength-weak";
        if (passwordStrength === 3) return "strength-medium";
        return "strength-strong";
    };

    return (
        <div className="signup-container">
            <h1 className="signup-title">TRADER SIGNUP</h1>

            <form onSubmit={handleSignup} className="signup-form">
                {/* Username Field */}
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        ref={usernameRef}
                        value={formState.username}
                        onChange={handleInputChange}
                        placeholder="Choose a username"
                        autoComplete="username"
                        disabled={isLoading}
                        aria-invalid={!validations.username.valid && formState.username !== "" ? "true" : "false"}
                        className={formState.username && (!validations.username.valid ? "input-error" : "input-valid")}
                    />
                    {formState.username && validations.username.message && (
                        <div className="validation-message">
                            {validations.username.message}
                        </div>
                    )}
                </div>

                {/* Email Field */}
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        autoComplete="email"
                        disabled={isLoading}
                        aria-invalid={!validations.email.valid && formState.email !== "" ? "true" : "false"}
                        className={formState.email && (!validations.email.valid ? "input-error" : "input-valid")}
                    />
                    {formState.email && validations.email.message && (
                        <div className="validation-message">
                            {validations.email.message}
                        </div>
                    )}
                </div>

                {/* Password Field */}
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-container">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formState.password}
                            onChange={handleInputChange}
                            placeholder="Choose a password"
                            autoComplete="new-password"
                            disabled={isLoading}
                            aria-invalid={!validations.password.valid && formState.password !== "" ? "true" : "false"}
                            className={formState.password && (!validations.password.valid ? "input-error" : "input-valid")}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("password")}
                            className="password-toggle"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {formState.password && (
                        <>
                            <div className="password-strength">
                                <div className="strength-meter">
                                    <div
                                        className={`strength-meter-fill ${getPasswordStrengthClass()}`}
                                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <span className={`strength-text ${getPasswordStrengthClass()}`}>
                                    {getPasswordStrengthText()}
                                </span>
                            </div>
                            <ul className="password-requirements">
                                {passwordChecks.map(req => (
                                    <li key={req.id} className={req.valid ? "requirement-met" : ""}>
                                        {req.valid ? (
                                            <Check size={14} className="requirement-icon" />
                                        ) : (
                                            <X size={14} className="requirement-icon" />
                                        )}
                                        {req.label}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="password-input-container">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formState.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            disabled={isLoading}
                            aria-invalid={!validations.confirmPassword.valid && formState.confirmPassword !== "" ? "true" : "false"}
                            className={formState.confirmPassword && (!validations.confirmPassword.valid ? "input-error" : "input-valid")}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("confirm")}
                            className="password-toggle"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {formState.confirmPassword && validations.confirmPassword.message && (
                        <div className="validation-message">
                            {validations.confirmPassword.message}
                        </div>
                    )}
                </div>

                {/* Terms and Conditions */}
                <div className="checkbox-group">
                    <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formState.agreeToTerms}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <label htmlFor="agreeToTerms">
                        I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                    </label>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="signup-btn"
                    disabled={isLoading}
                    aria-busy={isLoading}
                >
                    {isLoading ? (
                        <span className="loading-spinner"></span>
                    ) : (
                        <>
                            <UserPlus size={18} />
                            <span>Create Account</span>
                        </>
                    )}
                </button>
            </form>

            {/* Login Button */}
            <p className="login-prompt">
                Already have an account? <Link to="/">Login</Link>
            </p>
        </div>
    );
};

export default Signup;
