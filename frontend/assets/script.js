document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const usersContainer = document.getElementById('usersContainer');
    const notification = document.getElementById('notification');

    // Load users on page load
    fetchUsers();

    // Handle form submission
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            referralCode: document.getElementById('referralCode').value.trim().toUpperCase()
        };

        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Processing...</span><div class="spinner"></div>';
        submitBtn.disabled = true;

        // Send registration request
        fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                // Show success notification
                showNotification('Registration successful!', 'success');

                // Reset form
                registerForm.reset();
                //   console.log(data.data.users)
                //   console.log(data.users)
                // Update user list
                renderUsers(data.data.users);
            })
            .catch(error => {
                // Show error notification
                showNotification(error.error || 'An error occurred', 'error');
            })
            .finally(() => {
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });

    // Fetch all users
    function fetchUsers() {
        fetch('http://localhost:3000/api/users')
            .then(response => response.json())
            .then(users => {
                renderUsers(users.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }

    // Render users to the DOM
    function renderUsers(users) {
        usersContainer.innerHTML = '';

        if (users.length === 0) {
            usersContainer.innerHTML = '<p>No users found</p>';
            return;
        }

        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';

            userCard.innerHTML = `
        <span>${user.name}</span>
        <span>${user.referralCode}</span>
        <span>${user.points} pts</span>
      `;

            usersContainer.appendChild(userCard);
        });
    }

    // Show notification
    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `floating-notification show ${type}`;

        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});