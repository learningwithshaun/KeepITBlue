document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('confirmationModal');
    const closeModal = document.querySelector('.close');
    const submittedDetails = document.getElementById('submittedDetails');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from submitting normally

        // Validate input
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            // Show confirmation modal with details
            submittedDetails.innerHTML = `
                Name: ${name}<br>
                Email: ${email}<br>
                Message: ${message}
            `;
            modal.style.display = 'block';
        }
    });

    // Close the modal when the user clicks on <span> (x)
    closeModal.onclick = function() {
        modal.style.display = 'none';
        form.reset(); // Reset form fields
    };

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            form.reset(); // Reset form fields
        }
    };
});
