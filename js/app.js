/* =========================
   CONFIGURACIÓN
========================= */

const WHATSAPP_NUMBER = "573012041255";


/* =========================
   PRODUCTOS
========================= */

const products = [

    {
        id: 1,
        name: "Pasta térmica WT-1",
        category: "componentes",
        price: 15000,
        image: "/images/NEXORA_Pasta_Termica.png",
        description:
            "Pasta térmica para mejorar la transferencia de calor."
    },

    {
        id: 2,
        name: "Hub USB 4 puertos",
        category: "accesorios",
        price: 20000,
        image: "/images/NEXORA_Hub_USB.png",
        description:
            "Hub USB con 4 puertos para ampliar la conectividad."
    },

    {
        id: 3,
        name: "Pila para boards",
        category: "componentes",
        price: 3500,
        image: "/images/NEXORA_Pila_CR2032.png",
        description:
            "Pila para placas y dispositivos electrónicos."
    },

    {
        id: 4,
        name: "Hub Tipo C 4 puertos",
        category: "accesorios",
        price: 20000,
        image: "/images/NEXORA_Hub_USB_Tipo_C.png",
        description:
            "Hub USB con 4 puertos para ampliar la conectividad."
    },
    {
        id: 5,
        name: "Pad Mouse",
        category: "accesorios",
        price: 20000,
        image: "/images/NEXORA_Pad_Mouse.png",
        description:
            "Pad para mouse con superficie suave y cómoda."
    }

];


/* =========================
   ESTADO
========================= */

let cart =
    JSON.parse(
        localStorage.getItem("innoventCart")
    ) || [];


let currentCategory = "todos";

let searchTerm = "";


/* =========================
   ELEMENTOS
========================= */

const productsGrid =
    document.getElementById(
        "productsGrid"
    );


const emptyProducts =
    document.getElementById(
        "emptyProducts"
    );


const cartElement =
    document.getElementById(
        "cart"
    );


const cartOverlay =
    document.getElementById(
        "cartOverlay"
    );


const cartItems =
    document.getElementById(
        "cartItems"
    );


const cartCount =
    document.getElementById(
        "cartCount"
    );


const cartTotal =
    document.getElementById(
        "cartTotal"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


/* =========================
   FORMATO MONEDA
========================= */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(price);

}


/* =========================
   PRODUCTOS FILTRADOS
========================= */

function getFilteredProducts() {

    return products.filter(product => {

        const matchesCategory =
            currentCategory === "todos" ||
            product.category === currentCategory;


        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                );


        return (
            matchesCategory &&
            matchesSearch
        );

    });

}


/* =========================
   RENDER PRODUCTOS
========================= */

function renderProducts() {

    const filtered =
        getFilteredProducts();


    productsGrid.innerHTML = "";


    if (filtered.length === 0) {

        emptyProducts.classList.remove(
            "hidden"
        );

        return;

    }


    emptyProducts.classList.add(
        "hidden"
    );


    filtered.forEach(product => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                >

                <span
                    class="product-placeholder"
                    style="display:none"
                >
                    💻
                </span>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>


                <h3 class="product-name">
                    ${product.name}
                </h3>


                <p class="product-description">
                    ${product.description}
                </p>


                <div class="product-bottom">

                    <strong class="product-price">
                        ${formatPrice(product.price)}
                    </strong>


                    <button
                        class="add-cart"
                        data-id="${product.id}"
                    >
                        🛒 Agregar
                    </button>

                </div>

            </div>

        `;


        productsGrid.appendChild(card);

    });

}


/* =========================
   AGREGAR AL CARRITO
========================= */

function addToCart(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) return;


    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    saveCart();

    renderCart();

    openCart();

}


/* =========================
   GUARDAR CARRITO
========================= */

function saveCart() {

    localStorage.setItem(
        "innoventCart",
        JSON.stringify(cart)
    );

}


/* =========================
   RENDER CARRITO
========================= */

function renderCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:50px 10px;
                "
            >

                <div
                    style="
                        font-size:3rem;
                    "
                >
                    🛒
                </div>

                <h3>
                    Tu carrito está vacío
                </h3>

                <p>
                    Agrega productos para comenzar.
                </p>

            </div>

        `;

    }


    cart.forEach(item => {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "cart-item";


        element.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
                class="cart-item-image"
            >


            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>


                <div class="cart-item-price">

                    ${formatPrice(
                        item.price *
                        item.quantity
                    )}

                </div>


                <div class="quantity">

                    <button
                        data-action="decrease"
                        data-id="${item.id}"
                    >
                        −
                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        data-action="increase"
                        data-id="${item.id}"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove-item"
                data-action="remove"
                data-id="${item.id}"
            >
                ✕
            </button>

        `;


        cartItems.appendChild(
            element
        );

    });


    updateCartSummary();

}


/* =========================
   RESUMEN
========================= */

function updateCartSummary() {

    const quantity =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,
            0
        );


    const total =
        cart.reduce(
            (
                sum,
                item
            ) =>
                sum +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    cartCount.textContent =
        quantity;


    cartTotal.textContent =
        formatPrice(total);

}


/* =========================
   CAMBIAR CANTIDAD
========================= */

function updateQuantity(
    productId,
    action
) {

    const item =
        cart.find(
            product =>
                product.id === productId
        );


    if (!item) return;


    if (action === "increase") {

        item.quantity++;

    }


    if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart =
                cart.filter(
                    product =>
                        product.id !== productId
                );

        }

    }


    if (action === "remove") {

        cart =
            cart.filter(
                product =>
                    product.id !== productId
            );

    }


    saveCart();

    renderCart();

}


/* =========================
   ABRIR CARRITO
========================= */

function openCart() {

    cartElement.classList.add(
        "active"
    );

    cartOverlay.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


/* =========================
   CERRAR CARRITO
========================= */

function closeCart() {

    cartElement.classList.remove(
        "active"
    );

    cartOverlay.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


/* =========================
   WHATSAPP CHECKOUT
========================= */

function checkoutWhatsApp() {

    if (cart.length === 0) {

        alert(
            "Tu carrito está vacío."
        );

        return;

    }


    let message =
        "Hola Nexora Shop.%0A%0A";

    message +=
        "Quiero realizar el siguiente pedido:%0A%0A";


    cart.forEach(item => {

        message +=
            `• ${item.name} x${item.quantity} — ${formatPrice(
                item.price *
                item.quantity
            )}%0A`;

    });


    const total =
        cart.reduce(
            (
                sum,
                item
            ) =>
                sum +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    message +=
        `%0ATotal: ${formatPrice(total)}%0A%0A`;

    message +=
        "Nombre:%0A";

    message +=
        "Ciudad:%0A";

    message +=
        "Dirección:%0A";


    window.open(

        `https://wa.me/${3011834223}?text=${message}`,

        "_blank"

    );

}


/* =========================
   EVENTOS PRODUCTOS
========================= */

productsGrid.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".add-cart"
            );


        if (!button) return;


        const id =
            Number(
                button.dataset.id
            );


        addToCart(id);

    }
);


/* =========================
   EVENTOS CARRITO
========================= */

cartItems.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) return;


        const id =
            Number(
                button.dataset.id
            );


        const action =
            button.dataset.action;


        updateQuantity(
            id,
            action
        );

    }
);


/* =========================
   CATEGORÍAS
========================= */

document
    .querySelectorAll(
        ".category-card"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentCategory =
                    button.dataset.category;

                renderProducts();

                document
                    .getElementById(
                        "productos"
                    )
                    .scrollIntoView({
                        behavior:
                            "smooth"
                    });

            }
        );

    });


/* =========================
   BUSCADOR
========================= */

searchInput.addEventListener(
    "input",
    event => {

        searchTerm =
            event.target.value;

        renderProducts();

    }
);


/* =========================
   CARRITO
========================= */

document
    .getElementById(
        "openCart"
    )
    .addEventListener(
        "click",
        openCart
    );


document
    .getElementById(
        "closeCart"
    )
    .addEventListener(
        "click",
        closeCart
    );


cartOverlay.addEventListener(
    "click",
    closeCart
);


/* =========================
   VACIAR CARRITO
========================= */

document
    .getElementById(
        "clearCart"
    )
    .addEventListener(
        "click",
        () => {

            if (
                cart.length === 0
            ) return;


            const confirmed =
                confirm(
                    "¿Deseas vaciar el carrito?"
                );


            if (!confirmed) return;


            cart = [];

            saveCart();

            renderCart();

        }
    );


/* =========================
   CHECKOUT
========================= */

document
    .getElementById(
        "checkoutButton"
    )
    .addEventListener(
        "click",
        checkoutWhatsApp
    );


/* =========================
   INICIALIZACIÓN
========================= */

renderProducts();

renderCart();