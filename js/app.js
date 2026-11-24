"use strict";

// === Дані ===
// До LR10 масив був зашитий у код; тепер він приїжджає з data.json через fetch
// (функція loadData). let, а не const, бо значення присвоюється вже після
// завантаження. Ім'я `products` лишилося тим самим, що в LR8/LR9.
let products = [];

// data.json змінювати не можна, тож те, чого в ньому немає, прив'язуємо до
// назви тут: фото товару й ознаку «рекомендований».
const IMAGES = {
    "Гранола медова": "images/granola.jpg",
    "Йогурт натуральний": "images/yogurt.jpg",
    "Хумус класичний": "images/hummus.jpg",
    "Фалафель": "images/falafel.jpg",
    "Сир твердий 'Гауда'": "images/gouda.jpg",
    "Арахісова паста": "images/peanut-butter.jpg",
    "Енергетичний батончик шоколадний": "images/energy-bar.jpg",
    "Імбирний чай": "images/ginger-tea.jpg",
    "Салат кіноа": "images/quinoa-salad.jpg",
    "Кокосове печиво": "images/coconut-cookies.jpg",
};
const FEATURED_NAME = "Салат кіноа";


// === Довідкові функції (з LR8/LR9) ===

// Повертає назву відділу каталогу за категорією продукту (switch).
function categoryOf(product) {
    switch (product.category) {
        case "молочні продукти":
            return "Молочне";
        case "соуси":
        case "намазки":
            return "Соуси та намазки";
        case "напої":
            return "Напої";
        case "веганське":
        case "готові страви":
            return "Готові страви";
        default:
            return "Сніданки та снеки";
    }
}

// Сортують КОПІЮ масиву — оригінал products лишається в порядку з файла.
const sortByName = (items) => [...items].sort((a, b) => a.name.localeCompare(b.name, "uk"));
const sortByCalories = (items) => [...items].sort((a, b) => a.nutrition.cal - b.nutrition.cal);


// === Спливне повідомлення (LR9) ===

const toastBox = document.getElementById("toast");
let toastTimer = null;

// Показує коротке повідомлення й ховає його за 3 с. clearTimeout скидає
// попередній відлік, щоб підряд кілька викликів не ховали тост завчасно.
function showToast(message) {
    if (toastBox === null) {
        return;
    }
    toastBox.textContent = message;
    toastBox.hidden = false;
    toastBox.classList.add("toast--show");
    if (toastTimer !== null) {
        clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
        toastBox.classList.remove("toast--show");
        toastBox.hidden = true;
    }, 3000);
}


// === Завантаження даних: fetch + async/await (LR10) ===

// response.ok перевіряємо вручну, бо fetch НЕ кидає помилку на 404/500 —
// він відхиляє проміс лише на мережевому збої. Без перевірки на 404 ми б
// спробували розібрати сторінку помилки як JSON.
async function loadData() {
    const response = await fetch("data.json");
    if (!response.ok) {
        throw new Error(`Сервер відповів статусом ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Файл даних порожній або має неправильну структуру");
    }
    return data;
}


// === Меню (§7): кнопка-гамбургер замість <details>, керована з JS ===
const burger = document.getElementById("burger");
const navList = document.getElementById("navList");
if (burger !== null && navList !== null) {
    const setMenu = (open) => {
        burger.setAttribute("aria-expanded", String(open));
        navList.hidden = !open;
    };

    const wide = window.matchMedia("(min-width: 768px)");
    const syncToWidth = () => setMenu(wide.matches);
    syncToWidth();
    wide.addEventListener("change", syncToWidth);

    burger.addEventListener("click", () => {
        setMenu(burger.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenu(false);
        }
    });

    document.addEventListener("click", (event) => {
        if (!wide.matches && event.target.closest(".nav") === null) {
            setMenu(false);
        }
    });
}


// === Тема (§8): перемикач на JS замість inline onclick ===
const themeBtn = document.getElementById("themeToggle");
if (themeBtn !== null) {
    const root = document.documentElement;          // клас теми живе на <html>

    const isDark = () => root.classList.contains("dark-theme");

    const applyTheme = (dark) => {
        root.classList.toggle("dark-theme", dark);
        root.classList.toggle("light-theme", !dark);
        themeBtn.setAttribute("aria-pressed", String(dark));
    };

    // Стартова тема — із системного налаштування (запам'ятовування — далі в LR10).
    applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);

    themeBtn.addEventListener("click", () => applyTheme(!isDark()));
}


// === Каталог: рендер із завантажених даних (LR10) ===
const cardsBox = document.querySelector(".cards");
if (cardsBox !== null) {
    const loader = document.querySelector(".loader");
    const loadError = document.getElementById("load-error");
    const searchInput = document.getElementById("search");
    const allergenBoxes = [...document.querySelectorAll('input[name="exclude"]')];
    const countOut = document.getElementById("catalog-count");
    const emptyBox = document.getElementById("empty");

    const dialog = document.getElementById("details");
    const dialogTitle = document.getElementById("details-title");
    const dialogBody = document.getElementById("details-body");
    const closeBtn = document.getElementById("closeDetails");

    // Будує один DOM-вузол картки з даних продукту (createElement + textContent).
    function cardNode(product) {
        const featured = product.name === FEATURED_NAME;

        const card = document.createElement("article");
        card.className = featured ? "card card--featured" : "card";
        card.dataset.id = product.id;

        if (featured) {
            const badge = document.createElement("span");
            badge.className = "card__badge";
            badge.textContent = "Рекомендуємо";
            card.append(badge);
        } else if (product.package.eco) {
            const badge = document.createElement("span");
            badge.className = "card__badge card__badge--eco";
            badge.textContent = "Еко";
            card.append(badge);
        }

        const img = document.createElement("img");
        img.className = "card__img";
        img.src = IMAGES[product.name] ?? "";
        img.alt = "Фото: " + product.name;
        img.loading = "lazy";
        card.append(img);

        const body = document.createElement("div");
        body.className = "card__body";

        const title = document.createElement("h3");
        title.className = "card__title";
        title.textContent = product.name;

        const meta = document.createElement("p");
        meta.className = "card__meta";
        meta.textContent = `${product.category} · ${product.package.weight_g} г · ${product.package.material}`;

        const nutri = document.createElement("p");
        nutri.className = "card__nutri";
        nutri.textContent = `${product.nutrition.cal} ккал · білок ${product.nutrition.protein_g} г`;

        body.append(title, meta, nutri);

        const allerg = document.createElement("p");
        allerg.className = "card__allergens";
        if (product.allergens.length > 0) {
            product.allergens.forEach((name) => {
                const tag = document.createElement("span");
                tag.className = "badge-allergen";
                tag.textContent = name;
                allerg.append(tag);
            });
        } else {
            allerg.textContent = "без поширених алергенів";
            allerg.classList.add("card__allergens--none");
        }
        body.append(allerg);
        card.append(body);

        const actions = document.createElement("div");
        actions.className = "card__actions";
        const order = document.createElement("button");
        order.className = "card__action card__order";
        order.type = "button";
        order.textContent = "Замовити";
        const more = document.createElement("button");
        more.className = "card__more";
        more.type = "button";
        more.textContent = "Швидкий перегляд";
        actions.append(order, more);
        card.append(actions);

        return card;
    }

    // Малює добірку. DocumentFragment + replaceChildren — одна вставка в DOM.
    function renderCards(items) {
        const frag = document.createDocumentFragment();
        items.forEach((p) => frag.append(cardNode(p)));
        cardsBox.replaceChildren(frag);
        if (emptyBox !== null) {
            emptyBox.hidden = items.length !== 0;
        }
        if (countOut !== null) {
            countOut.textContent = `Показано: ${items.length} із ${products.length}`;
        }
    }

    // Пошук за назвою/складом + виключення алергенів.
    function applyFilters() {
        const query = (searchInput?.value ?? "").trim().toLowerCase();
        const excluded = allergenBoxes.filter((b) => b.checked).map((b) => b.value);
        const list = products.filter((p) => {
            const haystack = [p.name, ...p.ingredients].join(" ").toLowerCase();
            if (query !== "" && !haystack.includes(query)) {
                return false;
            }
            if (excluded.some((a) => p.allergens.includes(a))) {
                return false;
            }
            return true;
        });
        renderCards(list);
    }

    // Відкриває діалог «швидкого перегляду» з даних продукту.
    function openDetails(id) {
        const product = products.find((p) => p.id === id);
        if (product === undefined || dialog === null) {
            return;
        }
        dialogTitle.textContent = product.name;
        dialogBody.textContent = [
            `Відділ: ${product.category} (${categoryOf(product)}).`,
            `Склад: ${product.ingredients.join(", ")}.`,
            `Харчова цінність на 100 г: ${product.nutrition.cal} ккал, білки ${product.nutrition.protein_g} г, жири ${product.nutrition.fat_g} г, вуглеводи ${product.nutrition.carbs_g} г.`,
            `Паковання: ${product.package.weight_g} г, ${product.package.material}${product.package.eco ? " (еко)" : ""}.`,
            product.allergens.length > 0
                ? `Алергени: ${product.allergens.join(", ")}.`
                : "Без поширених алергенів.",
        ].join("\n");
        dialog.showModal();
    }

    // Делегування: один слухач на контейнері карток.
    cardsBox.addEventListener("click", (event) => {
        const card = event.target.closest(".card");
        if (card === null) {
            return;
        }
        const id = Number(card.dataset.id);
        if (event.target.closest(".card__order") !== null) {
            const product = products.find((p) => p.id === id);
            showToast(`«${product.name}» додано в кошик`);
            return;
        }
        openDetails(id);
    });

    if (closeBtn !== null) {
        closeBtn.addEventListener("click", () => dialog.close());
    }

    searchInput?.addEventListener("input", applyFilters);
    allergenBoxes.forEach((box) => box.addEventListener("change", applyFilters));

    // id у файлі немає — присвоюємо за позицією.
    const withIds = (data) => data.map((p, i) => ({ ...p, id: i + 1 }));

    // Показує блок помилки з людським текстом (а не лише console.error) —
    // користувач консолі не відкриває, для нього порожня сторінка = «зламалось».
    function showLoadError(error) {
        if (loadError === null) {
            return;
        }
        loadError.textContent = "Не вдалося завантажити каталог. Перевірте з'єднання і "
            + "оновіть сторінку. Технічні подробиці: " + error.message;
        loadError.hidden = false;
    }

    // Запуск: спінер перед запитом, дані, обробка помилки.
    async function init() {
        if (loader !== null) {
            loader.hidden = false;      // показуємо спінер ПЕРЕД запитом
        }
        try {
            products = withIds(await loadData());
            applyFilters();
        } catch (error) {
            showLoadError(error);
        } finally {
            // finally — бо спінер треба сховати і після успіху, і після помилки;
            // у кінці try він не виконався б при винятку, і спінер крутився б вічно
            if (loader !== null) {
                loader.hidden = true;
            }
        }
    }

    init();
}


// === Валідація форми підписки (LR9) ===
const subscribeForm = document.querySelector(".form-grid");
if (subscribeForm !== null) {
    const status = document.getElementById("form-status");

    const freqLabels = { weekly: "щотижня", biweekly: "раз на два тижні", monthly: "щомісяця" };
    const allergenLabels = { nuts: "горіхи", gluten: "глютен", lactose: "лактоза" };

    const messages = {
        fullname: "Вкажіть прізвище та ім'я (щонайменше 2 символи).",
        email: "Введіть коректну електронну пошту, напр. olena@example.com.",
        phone: "Телефон у форматі +380XXXXXXXXX (+ і 12 цифр).",
        delivery_date: "Оберіть дату доставки в межах навчального року.",
        address: "Адреса доставки — щонайменше 10 символів.",
        box_type: "Оберіть тип боксу.",
        persons: "Кількість осіб — від 1 до 5.",
        product_code: "Код у форматі HF-0000-UA.",
        agree: "Потрібна згода з умовами підписки.",
    };

    const today = new Date().toISOString().slice(0, 10);

    function runCustomChecks() {
        const nameField = subscribeForm.elements.fullname;
        nameField.setCustomValidity(
            nameField.value.trim().split(/\s+/).length < 2
                ? "Вкажіть і прізвище, і ім'я через пробіл."
                : ""
        );
        const dateField = subscribeForm.elements.delivery_date;
        dateField.setCustomValidity(
            dateField.value !== "" && dateField.value < today
                ? "Дата доставки не може бути в минулому."
                : ""
        );
    }

    function setError(field, text) {
        let box = field.parentElement.querySelector(".field-error");
        if (text === "") {
            field.removeAttribute("aria-invalid");
            if (box !== null) {
                box.remove();
            }
            return;
        }
        if (box === null) {
            box = document.createElement("span");
            box.className = "field-error";
            field.parentElement.append(box);
        }
        field.setAttribute("aria-invalid", "true");
        box.textContent = text;
    }

    function validateField(field) {
        if (field.validity.valid) {
            setError(field, "");
            return true;
        }
        setError(field, messages[field.name] ?? field.validationMessage);
        return false;
    }

    subscribeForm.addEventListener("input", (event) => {
        const field = event.target;
        if (field.name === "fullname" || field.name === "delivery_date") {
            field.setCustomValidity("");
        }
        if (field.willValidate && field.validity.valid) {
            setError(field, "");
        }
    });

    function buildReceipt() {
        const el = subscribeForm.elements;
        const persons = Number(el.persons.value);                       // Number()
        const agreed = el.agree.checked;                                // .checked
        const freqChecked = subscribeForm.querySelector('input[name="box_frequency"]:checked');
        const freq = freqChecked === null ? "не вказано" : freqLabels[freqChecked.value];
        const excluded = [...subscribeForm.querySelectorAll('input[name="exclude_allergens"]')]
            .filter((box) => box.checked)                               // .checked
            .map((box) => allergenLabels[box.value]);

        const receipt = document.createElement("div");
        receipt.className = "receipt";
        const heading = document.createElement("h3");
        heading.textContent = "Квитанція підписки";
        receipt.append(heading);

        const dl = document.createElement("dl");
        const row = (term, desc) => {
            const dt = document.createElement("dt");
            dt.textContent = term;
            const dd = document.createElement("dd");
            dd.textContent = desc;
            dl.append(dt, dd);
        };
        row("Отримувач", el.fullname.value.trim());
        row("Пошта", el.email.value);
        row("Телефон", el.phone.value);
        row("Перша доставка", el.delivery_date.value);
        row("Адреса", el.address.value.trim());
        row("Тип боксу", el.box_type.selectedOptions[0].textContent);
        row("Осіб у родині", String(persons));
        row("Періодичність", freq);
        row("Виключити алергени", excluded.length > 0 ? excluded.join(", ") : "немає");
        row("Код продукту", el.product_code.value);
        row("Згода з умовами", agreed ? "так" : "ні");
        receipt.append(dl);
        return receipt;
    }

    subscribeForm.addEventListener("submit", (event) => {
        event.preventDefault();
        runCustomChecks();

        let firstInvalid = null;
        for (const field of subscribeForm.elements) {
            if (!field.willValidate) {
                continue;
            }
            if (!validateField(field) && firstInvalid === null) {
                firstInvalid = field;
            }
        }

        if (firstInvalid !== null) {
            if (status !== null) {
                status.replaceChildren("Перевірте підсвічені поля — форму не надіслано.");
                status.className = "form-status form-status--error";
            }
            showToast("Перевірте форму — є помилки");
            firstInvalid.focus();
            return;
        }

        if (status !== null) {
            status.replaceChildren(buildReceipt());
            status.className = "form-status form-status--ok";
            status.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        showToast("Підписку оформлено ✓");
        subscribeForm.reset();
    });
}
