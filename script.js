// Function to animate hero section text when the page loads
window.onload = function () {
    const heroText = document.querySelector('.hero-content h1');
    const heroParagraph = document.querySelector('.hero-content p');
    
    heroText.style.opacity = '0';
    heroParagraph.style.opacity = '0';

    setTimeout(() => {
        heroText.style.transition = 'opacity 2s ease-in-out';
        heroParagraph.style.transition = 'opacity 3s ease-in-out';
        heroText.style.opacity = '1';
        heroParagraph.style.opacity = '1';
    }, 500); // Delay the animation to give a smooth effect
};

// Function to handle hover effect on buttons
document.querySelectorAll('.cta').forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
    });
});

// Scroll to top feature for better user experience
const scrollTopButton = document.createElement('button');
scrollTopButton.innerHTML = '↑ Top';
scrollTopButton.style.position = 'fixed';
scrollTopButton.style.bottom = '30px';
scrollTopButton.style.right = '30px';
scrollTopButton.style.padding = '10px';
scrollTopButton.style.backgroundColor = '#00ccff';
scrollTopButton.style.color = '#fff';
scrollTopButton.style.border = 'none';
scrollTopButton.style.borderRadius = '5px';
scrollTopButton.style.cursor = 'pointer';
scrollTopButton.style.display = 'none'; // Hidden initially

document.body.appendChild(scrollTopButton);

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.onscroll = function () {
    if (document.documentElement.scrollTop > 200) {
        scrollTopButton.style.display = 'block';
    } else {
        scrollTopButton.style.display = 'none';
    }
};



// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
    // Get the form and modal elements
    const form = document.getElementById("donation-form");
    const modal = document.getElementById("donation-modal");
    const modalContent = document.getElementById("modal-content");

    // Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Gather the input values
        const fullName = document.getElementById("full-name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const amount = document.getElementById("amount").value;
        const paymentMethod = document.getElementById("payment-method").value;

        // Validate inputs 
        if (!fullName || !email || !amount) {
            alert("Please fill in all required fields.");
            return; // Stop further execution
        }

        // Create the modal content with the user's details
        modalContent.innerHTML = `
            <h2>Donation Details</h2>
            <p><strong>Full Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Amount Donated:</strong> $${amount}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <button id="close-modal">Close</button>
        `;

        // Show the modal
        modal.style.display = "block";

        // Close modal event
        document.getElementById("close-modal").addEventListener("click", function () {
            modal.style.display = "none";
        });
    });
});
