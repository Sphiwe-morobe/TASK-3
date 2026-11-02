

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       MOBILE NAVIGATION
       ===================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            mainNav.classList.toggle("show");
        });
    }


    /* =====================================
       PRODUCT SEARCH AND CATEGORY FILTERS
       ===================================== */

    const searchBox = document.getElementById("menuSearch");
    const products = document.querySelectorAll(".menu-item");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const clearSearchButton = document.getElementById("clearSearch");
    const noProductsMessage = document.getElementById("noProducts");
    const resultsMessage = document.getElementById("searchResults");

    let selectedCategory = "all";

    function filterProducts() {

        if (!searchBox || products.length === 0) {
            return;
        }

        const searchText = searchBox.value.toLowerCase().trim();
        let visibleCount = 0;

        products.forEach(function (product) {

            const productText = product.textContent.toLowerCase();
            const productCategory = product.dataset.category;

            const matchesSearch = productText.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                productCategory === selectedCategory;

            const showProduct = matchesSearch && matchesCategory;

            product.hidden = !showProduct;

            if (showProduct) {
                visibleCount++;
            }
        });

        if (noProductsMessage) {
            noProductsMessage.hidden = visibleCount !== 0;
        }

        if (resultsMessage) {
            resultsMessage.textContent =
                visibleCount +
                (visibleCount === 1 ? " product found" : " products found");
        }
    }

    if (searchBox) {
        searchBox.addEventListener("input", filterProducts);
    }

    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            selectedCategory = button.dataset.category;

            categoryButtons.forEach(function (categoryButton) {
                categoryButton.classList.remove("active");
            });

            button.classList.add("active");

            filterProducts();
        });
    });

    if (clearSearchButton) {

        clearSearchButton.addEventListener("click", function () {

            if (searchBox) {
                searchBox.value = "";
            }

            selectedCategory = "all";

            categoryButtons.forEach(function (button) {
                button.classList.toggle(
                    "active",
                    button.dataset.category === "all"
                );
            });

            filterProducts();
        });
    }

    filterProducts();


    /* =====================================
       SHOPPING CART
       ===================================== */

    
/* =====================================
   SHOPPING CART - THE DAILY LOAF BAKERY
   ===================================== */

const cartDisplay = document.getElementById("cartItems");
const totalDisplay = document.getElementById("cartTotal");
const clearCartButton = document.getElementById("clearCart");
const checkoutButton = document.getElementById("proceedToCheckout");

let bakeryCart = [];

try {
    bakeryCart = JSON.parse(
        localStorage.getItem("dailyLoafCart") || "[]"
    );

    if (!Array.isArray(bakeryCart)) {
        bakeryCart = [];
    }
} catch (error) {
    bakeryCart = [];
}

// Save cart
function saveCart() {
    localStorage.setItem(
        "dailyLoafCart",
        JSON.stringify(bakeryCart)
    );
}

// Display money
function formatPrice(amount) {
    return "R" + Number(amount).toFixed(2);
}

// Display products in cart
function displayCart() {

    if (!cartDisplay || !totalDisplay) return;

    cartDisplay.innerHTML = "";

    let total = 0;

    if (bakeryCart.length === 0) {
        cartDisplay.innerHTML =
            "<p>Your shopping cart is currently empty.</p>";

        totalDisplay.textContent = "R0.00";

        if (checkoutButton) {
            checkoutButton.hidden = true;
        }

        return;
    }

    bakeryCart.forEach(function(item, index) {

        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price);
        const subtotal = price * quantity;

        total += subtotal;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";

        const details = document.createElement("div");

        const productName = document.createElement("h4");
        productName.textContent = item.name;

        const productPrice = document.createElement("p");
        productPrice.textContent = formatPrice(price) + " each";

        details.appendChild(productName);
        details.appendChild(productPrice);

        const controls = document.createElement("div");
        controls.className = "cart-item-controls";

        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";

        minus.addEventListener("click", function() {
            bakeryCart[index].quantity--;

            if (bakeryCart[index].quantity <= 0) {
                bakeryCart.splice(index, 1);
            }

            saveCart();
            displayCart();
        });

        const quantityText = document.createElement("span");
        quantityText.textContent = quantity;

        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";

        plus.addEventListener("click", function() {
            bakeryCart[index].quantity++;
            saveCart();
            displayCart();
        });

        const subtotalText = document.createElement("strong");
        subtotalText.textContent = formatPrice(subtotal);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove";

        remove.addEventListener("click", function() {
            bakeryCart.splice(index, 1);
            saveCart();
            displayCart();
        });

        controls.appendChild(minus);
        controls.appendChild(quantityText);
        controls.appendChild(plus);
        controls.appendChild(subtotalText);
        controls.appendChild(remove);

        itemElement.appendChild(details);
        itemElement.appendChild(controls);

        cartDisplay.appendChild(itemElement);
    });

    totalDisplay.textContent = formatPrice(total);

    if (checkoutButton) {
        checkoutButton.hidden = false;
    }

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = bakeryCart.reduce(
            (sum, item) => sum + Number(item.quantity || 1), 0
        );
    }
}

// Add products to cart
document.addEventListener("click", function(event) {

    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    event.preventDefault();

    const productName = button.dataset.name;
    const productPrice = Number(button.dataset.price);

    if (!productName || !Number.isFinite(productPrice) ||
        productPrice <= 0) {
        alert("Product information is missing.");
        return;
    }

    const existingProduct = bakeryCart.find(function(item) {
        return item.name === productName;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        bakeryCart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    saveCart();
    displayCart();

    const originalText = button.textContent;

    button.textContent = "Added!";
    button.disabled = true;

    setTimeout(function() {
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);

});

// Clear cart
if (clearCartButton) {

    clearCartButton.addEventListener("click", function() {

        if (bakeryCart.length === 0) return;

        if (confirm("Are you sure you want to clear your cart?")) {
            bakeryCart = [];
            saveCart();
            displayCart();
        }

    });
}

// Show saved cart
displayCart();


    /* ADD TO CART BUTTONS */

    addButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productName = button.dataset.name;
            const productPrice = Number(button.dataset.price);

            if (!productName || !Number.isFinite(productPrice) ||
                productPrice <= 0) {

                alert("This product has an invalid name or price.");
                return;
            }

            const existingProduct = bakeryCart.find(function (item) {
                return item.name === productName;
            });

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                bakeryCart.push({
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }

            saveCart();
            displayCart();

            const originalText = button.textContent;

            button.textContent = "Added!";
            button.disabled = true;

            setTimeout(function () {
                button.textContent = originalText;
                button.disabled = false;
            }, 900);
        });
    });


    /* CLEAR CART BUTTON */

    if (clearCartButton) {

        clearCartButton.addEventListener("click", function () {

            if (bakeryCart.length === 0) {
                return;
            }

            if (confirm("Are you sure you want to clear your cart?")) {
                bakeryCart = [];
                saveCart();
                displayCart();
            }
        });
    }

    displayCart();


    /* =====================================
       CHECKOUT FORM ON MENU PAGE
       ===================================== */

    const checkoutForm = document.getElementById("checkoutForm");

    if (checkoutForm) {

        checkoutForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const message = document.getElementById("orderMessage");

            if (bakeryCart.length === 0) {
                message.textContent =
                    "Please add products to your cart before ordering.";
                return;
            }

            const customerName =
                document.getElementById("customerName").value.trim();

            const customerEmail =
                document.getElementById("customerEmail").value.trim();

            const customerPhone =
                document.getElementById("customerPhone").value.trim();

            const collectionDate =
                document.getElementById("collectionDate").value;

            const notes =
                document.getElementById("orderNotes").value.trim();

            if (!customerName || !customerEmail ||
                !customerPhone || !collectionDate) {

                message.textContent =
                    "Please complete all required customer details.";
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(customerEmail)) {
                message.textContent = "Please enter a valid email address.";
                return;
            }

            let orderTotal = 0;
            let orderDetails = "";

            bakeryCart.forEach(function (item) {

                const subtotal = item.price * item.quantity;
                orderTotal += subtotal;

                orderDetails +=
                    item.name + " x " + item.quantity +
                    " = " + formatPrice(subtotal) + "\n";
            });

            const subject = encodeURIComponent(
                "New Bakery Order - " + customerName
            );

            const body = encodeURIComponent(
                "THE DAILY LOAF BAKERY - NEW ORDER\n\n" +
                "Customer: " + customerName + "\n" +
                "Email: " + customerEmail + "\n" +
                "Phone: " + customerPhone + "\n" +
                "Collection Date: " + collectionDate + "\n\n" +
                "ORDER DETAILS:\n" + orderDetails +
                "\nTOTAL: " + formatPrice(orderTotal) +
                "\n\nAdditional Instructions: " + (notes || "None")
            );

            // Replace this with your real bakery email address.
            const bakeryEmail = "yourbakeryemail@example.com";

            message.textContent =
                "Your email application will open. Please send the prepared order.";

            window.location.href =
                "mailto:" + bakeryEmail +
                "?subject=" + subject +
                "&body=" + body;
        });
    }


    /* =====================================
       ENQUIRY FORM
       ===================================== */

    const bakeryEmailAddress = "yourbakeryemail@example.com";

    function checkEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const enquiryForm = document.getElementById("enquiryForm");

    if (enquiryForm) {

        enquiryForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById("enquiryName").value.trim();
            const email = document.getElementById("enquiryEmail").value.trim();
            const phone = document.getElementById("enquiryPhone").value.trim();
            const service = document.getElementById("enquiryService").value;
            const message = document.getElementById("enquiryMessage").value.trim();
            const result = document.getElementById("enquiryResult");

            if (!name || !email || !phone || !service || !message) {
                result.textContent = "Please complete all required fields.";
                return;
            }

            if (!checkEmail(email)) {
                result.textContent = "Please enter a valid email address.";
                return;
            }

            const subject = encodeURIComponent("Product Enquiry");

            const body = encodeURIComponent(
                "Name: " + name +
                "\nEmail: " + email +
                "\nPhone: " + phone +
                "\nProduct: " + service +
                "\nMessage: " + message
            );

            result.textContent = "Opening your email application...";

            window.location.href =
                "mailto:" + bakeryEmailAddress +
                "?subject=" + subject + "&body=" + body;
        });
    }


    /* =====================================
       CONTACT FORM
       ===================================== */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById("contactName").value.trim();
            const email = document.getElementById("contactEmail").value.trim();
            const type = document.getElementById("messageType").value;
            const message = document.getElementById("contactMessage").value.trim();
            const result = document.getElementById("contactResult");

            if (!name || !email || !type || !message) {
                result.textContent = "Please complete all required fields.";
                return;
            }

            if (!checkEmail(email)) {
                result.textContent = "Please enter a valid email address.";
                return;
            }

            const subject = encodeURIComponent("Contact Message - " + type);

            const body = encodeURIComponent(
                "Name: " + name +
                "\nEmail: " + email +
                "\nMessage Type: " + type +
                "\nMessage: " + message
            );

            result.textContent = "Opening your email application...";

            window.location.href =
                "mailto:" + bakeryEmailAddress +
                "?subject=" + subject + "&body=" + body;
        });
    }


    /* =====================================
       IMAGE LIGHTBOX
       ===================================== */

    const galleryImages = document.querySelectorAll(".gallery-image");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const closeLightbox = document.getElementById("closeLightbox");

    galleryImages.forEach(function (image) {

        image.addEventListener("click", function () {

            if (!lightbox || !lightboxImage) {
                return;
            }

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            lightbox.classList.add("active");
        });
    });

    if (closeLightbox && lightbox) {

        closeLightbox.addEventListener("click", function () {
            lightbox.classList.remove("active");
        });
    }

});

