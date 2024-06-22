document.addEventListener("DOMContentLoaded", function() {
    var coll = document.getElementsByClassName("housePrice_collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

    document.querySelector('.housePrice_menu-toggle').addEventListener('click', function() {
        document.querySelector('.housePrice_form-container .housePrice_content').classList.toggle('open');
        // Ensuring reflow if necessary
        document.body.style.height = 'auto';
        document.body.style.height = '100%';
    });
});

async function housePrice_comparePrices() {
    const location1 = document.getElementById('housePrice_location1').value;
    const location2 = document.getElementById('housePrice_location2').value;

    if (location1 === '' || location2 === '') {
        alert('Please enter both locations.');
        return;
    }

    try {
        const price1 = await fetchHousePrice(location1);
        const price2 = await fetchHousePrice(location2);

        if (price1 === null || price2 === null) {
            alert('One or both locations are not available.');
            return;
        }

        let resultText = `House prices in ${location1}: $${price1}<br>`;
        resultText += `House prices in ${location2}: $${price2}<br><br>`;

        if (price1 > price2) {
            resultText += `${location1} is more expensive than ${location2}.`;
        } else if (price1 < price2) {
            resultText += `${location2} is more expensive than ${location1}.`;
        } else {
            resultText += `${location1} and ${location2} have the same house prices.`;
        }

        document.getElementById('housePrice_result').innerHTML = resultText;
    } catch (error) {
        console.error('Error comparing house prices:', error);
        alert('An error occurred while comparing house prices.');
    }
}

async function fetchHousePrice(location) {
    try {
        // Replace with your actual web scraping endpoint
        const response = await fetch(`http://example.com/scrape-house-price?location=${location}`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json(); // Adjust parsing based on actual response format
        return data.price; // Assuming data.price is where the scraped price is stored
    } catch (error) {
        console.error('Error fetching house price:', error);
        throw error;
    }
}

async function housePrice_login() {
    const username = document.getElementById('housePrice_username').value;
    const password = document.getElementById('housePrice_password').value;

    if (username === '' || password === '') {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (result.success) {
            document.getElementById('housePrice_login-message').textContent = 'Login successful!';
        } else {
            document.getElementById('housePrice_login-message').textContent = 'Login failed.';
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
}

async function housePrice_register() {
    const newUsername = document.getElementById('housePrice_new-username').value;
    const newPassword = document.getElementById('housePrice_new-password').value;

    if (newUsername === '' || newPassword === '') {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: newUsername, password: newPassword })
        });

        const result = await response.json();
        if (result.success) {
            document.getElementById('housePrice_register-message').textContent = 'Registration successful!';
        } else {
            document.getElementById('housePrice_register-message').textContent = 'Registration failed.';
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration.');
    }
}

async function housePrice_saveProperty() {
    const username = document.getElementById('housePrice_username').value;
    const result = document.getElementById('housePrice_result').innerHTML;

    try {
        const response = await fetch('http://localhost:3000/save-property', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, result })
        });

        const saveResult = await response.json();
        if (saveResult.success) {
            alert('Property saved successfully!');
        } else {
            alert('Failed to save property.');
        }
    } catch (error) {
        console.error('Error saving property:', error);
        alert('An error occurred while saving property.');
    }
}

async function housePrice_getSavedProperties() {
    const username = document.getElementById('housePrice_username').value;

    try {
        const response = await fetch('http://localhost:3000/get-saved-properties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const result = await response.json();
        if (result.success) {
            const savedPropertiesContainer = document.getElementById('housePrice_saved-properties');
            savedPropertiesContainer.innerHTML = '<h2>Saved Properties</h2>';
            if (result.savedProperties.length > 0) {
                result.savedProperties.forEach(property => {
                    const propertyElement = document.createElement('p');
                    propertyElement.textContent = property;

                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.onclick = () => housePrice_removeSavedProperty(username, property);

                    const propertyContainer = document.createElement('div');
                    propertyContainer.appendChild(propertyElement);
                    propertyContainer.appendChild(removeButton);
                    savedPropertiesContainer.appendChild(propertyContainer);
                });
            } else {
                savedPropertiesContainer.innerHTML += '<p>No saved properties.</p>';
            }
        } else {
            alert('Failed to retrieve saved properties.');
        }
    } catch (error) {
        console.error('Error fetching saved properties:', error);
        alert('An error occurred while fetching saved properties.');
    }
}

async function housePrice_removeSavedProperty(username, property) {
    try {
        const response = await fetch('http://localhost:3000/remove-saved-property', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, property })
        });

        const result = await response.json();
        if (result.success) {
            alert('Property removed successfully!');
            housePrice_getSavedProperties(); 
        } else {
            alert('Failed to remove property.');
        }
    } catch (error) {
        console.error('Error removing property:', error);
        alert('An error occurred while removing property.');
    }
}
