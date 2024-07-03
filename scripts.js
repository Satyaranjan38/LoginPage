document.addEventListener('DOMContentLoaded', function() {
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    const loginButton = document.getElementById('login-button');
    const sendOTPButton = document.getElementById('send-otp-button');
    const verifyOTPButton = document.getElementById('verify-otp-button');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginMessageModal = document.getElementById('login-message-modal');

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

        // Replace with your actual API endpoint and handle response accordingly
        fetch('https://MovieSearch.cfapps.us10-001.hana.ondemand.com/sendOtp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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

    // Verify OTP when "Verify OTP" button is clicked
    verifyOTPButton.addEventListener('click', function() {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const otp = document.getElementById('otp-input').value;

        // Replace with your actual API endpoint and handle response accordingly
        fetch(`https://MovieSearch.cfapps.us10-001.hana.ondemand.com/verifyOtp?otp=${otp}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
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

    function redirectToMovieSearch() {
        window.location.href = 'https://satyaranjan38.github.io/MovieSearch/';
    }
});
