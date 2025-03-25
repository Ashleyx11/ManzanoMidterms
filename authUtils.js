const TOKEN_KEY = 'authToken'; //storing the token

//set the authentication token
export const setAuthToken = (token) => {
    console.log("Setting auth token:", token);
    // to store the token.
    sessionStorage.setItem(TOKEN_KEY, token);
};

//clear the authentication token
export const clearAuthToken = () => {
    console.log("Clearing auth token");
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("username"); // Also clear username on logout, if used
};

// retrieve the authentication token (for protected routes)
export const getAuthToken = () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    console.log("Getting auth token:", token);
    return token;
};
