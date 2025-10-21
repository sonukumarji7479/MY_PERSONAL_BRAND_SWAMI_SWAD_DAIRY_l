document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Hamburger Menu Functionality ---
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const allNavItems = document.querySelectorAll(".nav-links li a");

  // The 'click' listener is the core of the animation trigger.
  // The 'active' class on 'navLinks' (for menu visibility/position) and
  // the 'toggle' class on 'hamburger' (for the icon animation, e.g., 'X')
  // are the hooks for CSS transitions.
  hamburger.addEventListener("click", () => {
    // Toggles the 'active' class on the navigation links to show/hide the menu
    navLinks.classList.toggle("active");
    // Toggles the 'toggle' class on the hamburger icon for animation (e.g., turning into an 'X')
    hamburger.classList.toggle("toggle");
  });

  // Close menu when a link is clicked (for mobile usability)
  allNavItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("toggle");
      }
    });
  });

  // --- 2. Image Slider Functionality ---
  let slideIndex = 1;
  let slides = document.querySelectorAll(".slide");
  let dots = document.querySelectorAll(".dot");
  let sliderInterval;

  function showSlides(n) {
    if (slides.length === 0) return;

    // Wraps the slide index
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    // Hide all slides and deactivate all dots
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Activate the current slide and dot
    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].classList.add("active");
  }

  // Function to change slide on dot click
  window.currentSlide = function (n) {
    slideIndex = n;
    showSlides(slideIndex);
    resetInterval();
  };

  // Auto-advance function
  function autoSlides() {
    slideIndex++;
    showSlides(slideIndex);
  }

  function resetInterval() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(autoSlides, 5000); // Change image every 5 seconds
  }

  showSlides(slideIndex);
  resetInterval();

  // --- 3. Order Modal Functionality ---
  const modal = document.getElementById("orderModal");
  const closeBtn = document.querySelector(".modal .close-btn");
  const orderBtns = document.querySelectorAll(".order-product-btn");
  const navOrderBtn = document.getElementById("navOrderBtn");
  const orderFormModal = document.getElementById("orderFormModal");

  // Elements inside the modal
  const modalProductName = document.getElementById("modalProductName");
  const modalProductPriceDisplay = document.getElementById("modalProductPrice");
  const modalTotalPriceDisplay = document.getElementById("modalTotalPrice");
  const quantityInput = document.getElementById("quantity");
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus = document.getElementById("qtyPlus");
  const paymentMethodSelect = document.getElementById("paymentMethod");
  const upiDetailsDisplay = document.getElementById("upiDetailsDisplay");
  const modalProductUnitPrice = document.getElementById(
    "modalProductUnitPrice"
  );

  let productUnitPrice = 0;

  // Open Modal, setting initial product details
  function openOrderModal(productName, price, unit) {
    productUnitPrice = parseFloat(price);

    modalProductName.textContent = `Order ${productName}`;
    modalProductPriceDisplay.textContent = `₹${price} / ${unit}`;
    modalProductUnitPrice.value = price;
    quantityInput.value = 1; // Reset quantity
    calculateTotalPrice();
    modal.style.display = "block";
  }

  // Calculate Total Price
  function calculateTotalPrice() {
    const quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1) {
      quantityInput.value = 1;
    }
    const total = (quantity * productUnitPrice).toFixed(2);
    modalTotalPriceDisplay.textContent = `₹${total}`;
  }

  // Event listeners for product buttons
  orderBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const productName = card.querySelector(".h3").textContent;
      const price = card.getAttribute("data-price");
      const unit = card.getAttribute("data-unit");
      openOrderModal(productName, price, unit);
    });
  });

  // Event listener for the main Order Now button (generic inquiry)
  navOrderBtn.addEventListener("click", () => {
    openOrderModal("General Inquiry", 0, "Unit");
    modalProductName.textContent = "Place a Quick Order/Inquiry";
    modalProductPriceDisplay.textContent =
      "Price determined on product selection";
    modalProductUnitPrice.value = 0;
    quantityInput.value = 1;
    modalTotalPriceDisplay.textContent = `₹0.00`;
    productUnitPrice = 0;
  });

  // Close Modal
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Close modal on outside click
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Quantity Control Listeners
  quantityInput.addEventListener("input", calculateTotalPrice);
  qtyPlus.addEventListener("click", () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
    calculateTotalPrice();
  });
  qtyMinus.addEventListener("click", () => {
    if (parseInt(quantityInput.value) > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
      calculateTotalPrice();
    }
  });

  // Payment Method Toggle (show/hide UPI details)
  paymentMethodSelect.addEventListener("change", (e) => {
    if (e.target.value === "upi") {
      upiDetailsDisplay.style.display = "block";
    } else {
      upiDetailsDisplay.style.display = "none";
    }
  });

  // WhatsApp Order Submission
  orderFormModal.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("customerName").value;
    const address = document.getElementById("customerAddress").value;
    const phone = document.getElementById("customerPhone").value;
    const productName = modalProductName.textContent.replace("Order ", "");
    const quantity = quantityInput.value;
    const unitPrice = modalProductUnitPrice.value;
    const total = modalTotalPriceDisplay.textContent;
    const paymentMethod =
      paymentMethodSelect.value === "cod"
        ? "Cash On Delivery"
        : "UPI/Online Payment";

    let message = `*NEW ORDER from Swami Swad Dairy Website*\n\n`;
    message += `*Product:* ${productName}\n`;

    // Only include price details if a product was selected (unitPrice > 0)
    if (parseFloat(unitPrice) > 0) {
      message += `*Quantity:* ${quantity} (Unit Price: ₹${unitPrice})\n`;
      message += `*Total Payable:* ${total}\n`;
    } else {
      message += `*Inquiry Message:*(General Order/Inquiry)\n`;
    }

    message += `*Payment:* ${paymentMethod}\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n\n`;
    message += `_Please confirm availability and delivery time._`;

    // Opens WhatsApp chat with the pre-filled message
    const whatsappURL = `https://wa.me/917369879341?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");

    modal.style.display = "none";
    orderFormModal.reset(); // Clear the form
  });

  // --- 4. Load More Reviews Functionality ---
  const loadMoreReviewsBtn = document.getElementById("loadMoreReviews");
  const hiddenReviews = document.querySelectorAll(".hidden-review");

  if (loadMoreReviewsBtn) {
    loadMoreReviewsBtn.addEventListener("click", () => {
      hiddenReviews.forEach((card) => {
        card.style.display = "block";
      });
      loadMoreReviewsBtn.style.display = "none"; // Hide button after loading all
    });
  }

  // --- 5. View More Products Functionality ---
  const viewMoreProductsBtn = document.getElementById("viewMoreProductsBtn");
  const hiddenProducts = document.querySelectorAll(".hidden-product");

  if (viewMoreProductsBtn) {
    viewMoreProductsBtn.addEventListener("click", () => {
      hiddenProducts.forEach((card) => {
        card.style.display = "block";
      });
      viewMoreProductsBtn.style.display = "none"; // Hide button after showing all
    });
  }

  // --- 6. Floating WhatsApp Chat Box Toggle ---
  const whatsappFloatIcon = document.getElementById("whatsappFloatIcon");
  const whatsappChatBox = document.getElementById("whatsappChatBox");
  const closeWhatsappBtn = document.querySelector(".close-whatsapp-btn");
  const sendWhatsAppBtn = document.getElementById("sendWhatsAppBtn");
  const whatsappMessageInput = document.getElementById("whatsappMessageInput");

  if (whatsappFloatIcon) {
    whatsappFloatIcon.addEventListener("click", () => {
      whatsappChatBox.style.display =
        whatsappChatBox.style.display === "flex" ? "none" : "flex";
    });
  }

  if (closeWhatsappBtn) {
    closeWhatsappBtn.addEventListener("click", () => {
      whatsappChatBox.style.display = "none";
    });
  }

  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener("click", () => {
      const message =
        whatsappMessageInput.value ||
        "I would like to inquire about your dairy products.";
      const whatsappURL = `https://wa.me/917369879341?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappURL, "_blank");
      whatsappChatBox.style.display = "none";
      whatsappMessageInput.value = ""; // Clear input
    });
  }
});
