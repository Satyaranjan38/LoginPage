document.addEventListener('DOMContentLoaded', function() {
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    const loginButton = document.getElementById('login-button');
    const sendOTPButton = document.getElementById('send-otp-button');
    const verifyOTPButton = document.getElementById('verify-otp-button');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginMessageModal = document.getElementById('login-message-modal');


    const API_BASE_URL = 'https://MovieSearch.cfapps.us10-001.hana.ondemand.com'; // Replace with your backend base URL
    const CLIENT_ID = 'sb-na-20e3ce3b-94a8-412b-ae95-e3e44623bf39!t292265'; // Replace with your XSUAA client ID
    const CLIENT_SECRET = 'yKZJl9AELfxltYhL+PcgK2lVGBw='; // Replace with your XSUAA client secret
    const TOKEN_URL = 'https://10db0aa4trial.authentication.us10.hana.ondemand.com/oauth/token'; // Replace with your XSUAA token URL

    let accessToken = getCookie('accessToken'); // Get the token from cookies

    // If token exists in cookies, redirect to the main application
    if (accessToken) {
        redirectToMovieSearch();
    } else {
        fetchAccessToken(); // Call fetchAccessToken on page load if no token
    }

    // Function to fetch access token from XSUAA
    function fetchAccessToken() {
        const body = `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${encodeURIComponent(CLIENT_SECRET)}`;
        return fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                
                
            },
            body: body
        })
        .then(response => response.json())
        .then(data => {
            accessToken = data.access_token;
            setCookie('accessToken', accessToken, 120); 
            localStorage.setItem('oauthToken' , accessToken)// Save token in cookies for 1 day
            console.log('Access Token:', accessToken);
        })
        .catch(error => {
            console.error('Error fetching access token:', error);
        });
    }

    // Call fetchAccessToken on page load
    fetchAccessToken();

    // Show signup page when "Sign Up" link is clicked
    showSignupLink.addEventListener('click', function() {
        loginPage.style.display = 'none';
        signupPage.style.display = 'block';
    });

    // Show login page when "Login" link is clicked
    showLoginLink.addEventListener('click', function() {
        signupPage.style.display = 'none';
        loginPage.style.display = 'block';
    });

    // Send OTP when "Send OTP" button is clicked
    sendOTPButton.addEventListener('click', function() {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        startOTPTimer();

        // Replace with your actual API endpoint and handle response accordingly
        fetch('https://MovieSearch.cfapps.us10-001.hana.ondemand.com/sendOtp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 'Authorization': `Bearer ${accessToken}`

            },
            body: JSON.stringify({
                name: email,
                password: password
            })
        })
        .then(response => {
            sendOTPButton.textContent = 'Sending...'; // Show loading text
            return response.json();
        })
        .then(data => {
            console.log(data); // Handle success or display message to user
            document.getElementById('otp-section').style.display = 'block';

            
            sendOTPButton.textContent = 'Send OTP'; // Reset button text on success
        })
        .catch(error => {
            console.error('Error sending OTP:', error);
            sendOTPButton.textContent = 'Send OTP'; // Reset button text on error
        });
    });


    function startOTPTimer() {
        let timer = 120;
        sendOTPButton.disabled = true;
        sendOTPButton.classList.add('disabled');
        const interval = setInterval(() => {
            if (timer > 0) {
                timer--;
                sendOTPButton.textContent = `Send OTP (${timer}s)`;
            } else {
                clearInterval(interval);
                sendOTPButton.disabled = false;
                sendOTPButton.classList.remove('disabled');
                sendOTPButton.textContent = 'Send OTP';
            }
        }, 1000);
    }

    // Verify OTP when "Verify OTP" button is clicked
    verifyOTPButton.addEventListener('click', function() {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const otp = document.getElementById('otp-input').value;

        // Replace with your actual API endpoint and handle response accordingly
        fetch(`https://MovieSearch.cfapps.us10-001.hana.ondemand.com/verifyOtp?otp=${otp}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Handle success or display message to user
            if (data.message === 'user is valid') {
                showLoginPage(); // After successful verification, show login page
            }
        })
        .catch(error => {
            console.error('Error verifying OTP:', error);
        });
    });

    // Handle login when "Login" button is clicked
    loginButton.addEventListener('click', function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Replace with your actual API endpoint and handle response accordingly
        fetch('https://MovieSearch.cfapps.us10-001.hana.ondemand.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Handle success or display message to user
            if (data.message === 'login successfully') {
                setCookie('accessToken', accessToken, 120);
                localStorage.setItem('userName' , email) ; 
                redirectToMovieSearch(); // After successful login, redirect to MovieSearch
            } else {
                showLoginFailedMessage(data.message || 'Login failed. Please check your credentials and try again.');
            }
        })
        .catch(error => {
            console.error('Error logging in:', error);
            showLoginFailedMessage('An error occurred. Please try again later.');
        });
    });

    function showLoginFailedMessage(message) {
        // Show login failed message in modal
        loginMessageModal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="window.closeModal()">&times;</span>
                <p>${message}</p>
            </div>
        `;
        loginMessageModal.style.display = 'flex';

        // Close modal after 3 seconds
        setTimeout(function() {
            window.closeModal();
        }, 3000);
    }

    function closeModal() {
        loginMessageModal.style.display = 'none';
    }

    window.closeModal = closeModal;

    function showLoginPage() {
        loginPage.style.display = 'block';
        signupPage.style.display = 'none';
    }
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days*60*1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
    
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }
    

    function redirectToMovieSearch() {
       
        window.location.href = 'https://satyaranjan38.github.io/MovieSearch/';
        // window.location.href = 'http://127.0.0.1:5500/MovieSearch/'
    }
});
