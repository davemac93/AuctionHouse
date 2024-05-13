    const container = document.getElementById('container_sign');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const loginInvalidElement = document.querySelector('.login_invalid');
    const registerInvalidElement = document.querySelector('.register_invalid');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
        if (loginInvalidElement) {
            loginInvalidElement.style.display = 'none';
        }
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
        if (registerInvalidElement) {
            registerInvalidElement.style.display = 'none';
        }
    });

    // Update this URL to match your backend URL and port
    const apiUrl = 'http://localhost:8000';

    // Example function to register a new user
    document.addEventListener('DOMContentLoaded', function () {
        const registerForm = document.getElementById('registerForm');
        const registerSubmitButton = document.getElementById('registerSubmit');

        registerSubmitButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form submission
            registerUser();
        });

        function registerUser() {
            const formData = new FormData(registerForm);
            const usersData = {
                name: formData.get('name'),
                lastname: formData.get('lastname'),
                email: formData.get('email'),
                password: formData.get('password'),
                ownedCars: []
            };

            console.log('Sending data:', usersData);

            // Custom validation
            if (!usersData.name || !usersData.lastname || !usersData.email || !usersData.password) {
                console.error('Please fill out all fields');
                if (registerInvalidElement) {
                    registerInvalidElement.style.display = 'block';
                }
                return;
            }

            fetch(`${apiUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usersData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                return response.text();
            })
            .then(data => {
                console.log('User added successfully:', data);
                if (registerInvalidElement) {
                    registerInvalidElement.style.display = 'none';
                }
                window.location.href = '/confirmationRegister';
            })
            .catch(error => {
                console.error('Error adding user:', error);
                if (registerInvalidElement) {
                    registerInvalidElement.style.display = 'block';
                }
            });
        }
    });

    

    // Example function to log in a user
    document.addEventListener('DOMContentLoaded', function () {
        const loginForm = document.getElementById('loginForm');
        const loginSubmitButton = document.getElementById('loginSubmit');

        loginSubmitButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form submission
            loginUser();
        });

        function loginUser() {
            const formData = new FormData(loginForm);
            const userData = {
                email: formData.get('email'),
                password: formData.get('password'),
            };

            console.log('Sending login data:', userData);

            // Custom validation
            if (!userData.email || !userData.password) {
                console.error('Please fill out all fields');
                if (loginInvalidElement) {
                    loginInvalidElement.style.display = 'block';
                }
                return;
            }

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Invalid email or password');
                }
                return response.text();
            })
            .then(data => {
                console.log('Login successful:', data);
                if (loginInvalidElement) {
                    loginInvalidElement.style.display = 'none';
                }
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Login error:', error.message);
                if (loginInvalidElement) {
                    loginInvalidElement.style.display = 'block';
                }
            });
        }
    });

    // Add this function to check if the user is logged in
    function checkLoggedIn() {
        fetch('/check-login')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // User is logged in, update navbar
                    const getStartedBtn = document.querySelector('.action_btn');
                    if (getStartedBtn) {
                        getStartedBtn.style.display = 'none'; // Hide Get Started button
                    }
                } else {
                    // User is not logged in, update navbar
                    const profileLink = document.createElement('li');
                    profileLink.innerHTML = '<a href="/profile" class="mainbar"><i class="fa-solid fa-user"></i></a>';
                    const logoutLink = document.createElement('li');
                    logoutLink.innerHTML = '<a href="/logout" class="mainbar">Logout</a>';
                    const links = document.querySelector('.links');
                    links.appendChild(profileLink); // Add Profile link
                    links.appendChild(logoutLink); // Add Logout link
                }
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });
    }

    document.addEventListener('DOMContentLoaded', function () {
        checkLoggedIn(); // Check login status when the page loads
    });

