
document.addEventListener("DOMContentLoaded", function () {

    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const checkoutForm = document.getElementById("checkoutForm");
    const orderMessage = document.getElementById("orderMessage");
    const collectionDate = document.getElementById("collectionDate");
    const placeOrderButton = checkoutForm.querySelector(
        'button[type="submit"]'
    );

    // Set the earliest collection date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");

    const minDate = `${year}-${month}-${day}`;

    collectionDate.min = minDate;
    collectionDate.value = minDate;

    // Get products saved from the menu page
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("dailyLoafCart")) || [];
    } catch (error) {
        cart = [];
    }

    // Display the order summary
    function displayCheckout() {

        checkoutItems.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {

            checkoutItems.innerHTML =
                '<p class="empty-checkout">Your cart is empty. Please return to the menu.</p>';

            checkoutTotal.textContent = "R0.00";
            placeOrderButton.disabled = true;
            return;
        }

        placeOrderButton.disabled = false;

        cart.forEach(function (item) {

            const name = item.name;
            const price = Number(item.price);
            const quantity = Number(item.quantity) || 1;
            const itemTotal = price * quantity;

            total += itemTotal;

            const itemElement = document.createElement("div");
            itemElement.className = "checkout-item";

            const itemName = document.createElement("span");
            itemName.textContent = name + " × " + quantity;

            const itemPrice = document.createElement("strong");
            itemPrice.textContent = "R" + itemTotal.toFixed(2);

            itemElement.appendChild(itemName);
            itemElement.appendChild(itemPrice);

            checkoutItems.appendChild(itemElement);
        });

        checkoutTotal.textContent = "R" + total.toFixed(2);
    }

    displayCheckout();

    // Submit the order
    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (cart.length === 0) {
            orderMessage.textContent =
                "Your cart is empty. Please add products first.";
            return;
        }

        const name = document.getElementById("customerName").value.trim();
        const email = document.getElementById("customerEmail").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const date = collectionDate.value;
        const time = document.getElementById("collectionTime").value;
        const notes = document.getElementById("orderNotes").value.trim();

        if (!name || !email || !phone || !date || !time) {
            orderMessage.textContent =
                "Please complete all required fields.";
            return;
        }

        const total = cart.reduce(function (sum, item) {
            return sum +
                (Number(item.price) * (Number(item.quantity) || 1));
        }, 0);

        let orderDetails = "";

        cart.forEach(function (item) {

            const quantity = Number(item.quantity) || 1;
            const itemTotal = Number(item.price) * quantity;

            orderDetails +=
                item.name + " x " + quantity +
                " - R" + itemTotal.toFixed(2) + "\n";
        });

        const subject = encodeURIComponent(
            "New Order - The Daily Loaf Bakery"
        );

        const body = encodeURIComponent(
            "THE DAILY LOAF BAKERY - NEW ORDER\n\n" +
            "CUSTOMER DETAILS\n" +
            "Name: " + name + "\n" +
            "Email: " + email + "\n" +
            "Phone: " + phone + "\n\n" +
            "COLLECTION DETAILS\n" +
            "Date: " + date + "\n" +
            "Time: " + time + "\n\n" +
            "ORDER SUMMARY\n" +
            orderDetails +
            "\nTOTAL: R" + total.toFixed(2) +
            "\n\nSpecial Instructions: " + (notes || "None")
        );

        // Replace with your real bakery email address
        const bakeryEmail = "yourbakeryemail@example.com";

        orderMessage.textContent =
            "Opening your email app. Please send the prepared email to submit your order.";

        window.location.href =
            "mailto:" + bakeryEmail +
            "?subject=" + subject +
            "&body=" + body;

    });

});

