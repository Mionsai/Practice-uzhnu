"use strict";

// === Дані ===
// До LR10 масив був зашитий у код; тепер він приїжджає з data.json через fetch
// (функція loadData). let, а не const, бо значення присвоюється вже після
// завантаження. Ім'я `products` лишилося тим самим, що в LR8/LR9, тож решта
// коду правок не потребує.
let products = [];

// data.json змінювати не можна, тож те, чого в ньому немає, прив'язуємо до
// назви тут: фото товару й ознаку «рекомендований» (бонус-картка з LR6).
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

// Людські підписи для ключів даних (і простих полів, і вкладених об'єктів).
// Невідомий ключ показуємо як є.
const LABELS = {
    name: "Назва", category: "Категорія",
    nutrition: "Харчова цінність (на 100 г)", package: "Паковання",
    ingredients: "Склад", allergens: "Алергени",
    cal: "Калорійність, ккал", fat_g: "Жири, г", carbs_g: "Вуглеводи, г",
    protein_g: "Білки, г", weight_g: "Вага, г", material: "Матеріал", eco: "Еко-паковання",
};
const labelOf = (key) => LABELS[key] ?? key;

// Форматування значень: числа — з розділювачами розрядів української локалі,
// логічні — «так/ні», решта — як є.
function formatValue(value) {
    if (typeof value === "number") {
        return Number.isInteger(value) ? value.toLocaleString("uk-UA") : value.toFixed(1);
    }
    if (typeof value === "boolean") {
        return value ? "так" : "ні";
    }
    return String(value);
}


// === Довідкові функції (з LR8/LR9, лишилися в ужитку) ===

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


// === localStorage: обране (LR10) ===

// Читання захищене двічі: від відсутнього ключа (null) і від зіпсованого
// вмісту (хтось міг покласти в сховище невалідний рядок) — тоді JSON.parse
// кинув би виняток, і сторінка впала б.
function readFavorites() {
    try {
        const raw = localStorage.getItem("favorites");
        if (!raw) {
            return [];
        }
        const list = JSON.parse(raw);
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

// Масив id кладемо в сховище рядком через JSON.stringify — localStorage
// зберігає лише рядки, інакше туди потрапило б "[object Object]".
function writeFavorites(ids) {
    try {
        localStorage.setItem("favorites", JSON.stringify(ids));
    } catch {
        // приватний режим браузера може забороняти запис — не критично
    }
}

let favorites = readFavorites();
const isFavorite = (id) => favorites.includes(id);


// === Завантаження даних: fetch + async/await (LR10) ===

// Серце роботи. response.ok перевіряємо вручну, бо fetch НЕ кидає помилку на
// відповідь 404/500 — він відхиляє проміс лише на мережевому збої. Без цієї
// перевірки на 404 ми б спробували розібрати сторінку помилки як JSON і
// отримали б незрозумілий виняток уже на етапі .json().
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

// Бонус — порівняння стилів запису. Та сама логіка на ланцюжку then/catch;
// НЕ викликається (активна версія — async/await loadData вище). Різниця: тут
// кожен крок — окремий колбек, і легко забути return проміса з .json() (тоді
// наступний then отримає undefined); async/await читається як звичайний
// послідовний код, а статуси й мережу ловить один catch у виклику.
// function loadDataThen() {
//     return fetch("data.json")
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(`Сервер відповів статусом ${response.status}`);
//             }
//             return response.json();          // забути цей return — типова помилка
//         })
//         .then((data) => {
//             if (!Array.isArray(data) || data.length === 0) {
//                 throw new Error("Файл даних порожній або має неправильну структуру");
//             }
//             return data;
//         });
// }


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


// === Тема (§8 + пам'ять LR10) ===
const themeBtn = document.getElementById("themeToggle");
if (themeBtn !== null) {
    const root = document.documentElement;          // клас теми живе на <html>

    const isDark = () => root.classList.contains("dark-theme");

    const applyTheme = (dark) => {
        root.classList.toggle("dark-theme", dark);
        root.classList.toggle("light-theme", !dark);
        themeBtn.setAttribute("aria-pressed", String(dark));
    };

    // Спершу дивимось у сховище, і лише якщо там порожньо — у системну схему:
    // явний вибір користувача важливіший за налаштування ОС, тож він має пріоритет.
    let saved = null;
    try {
        saved = localStorage.getItem("theme");
    } catch {
        saved = null;
    }
    const startDark = saved !== null
        ? saved === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(startDark);

    themeBtn.addEventListener("click", () => {
        const next = !isDark();
        applyTheme(next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
            // сховище може бути недоступне — тема все одно перемкнеться
        }
    });
}


// === Каталог (LR10): завантаження, рендер, фільтри, модалка, обране ===
const cardsBox = document.querySelector(".cards");
if (cardsBox !== null) {
    const loader = document.querySelector(".loader");
    const loadError = document.getElementById("load-error");
    const countOut = document.getElementById("catalog-count");
    const emptyBox = document.getElementById("empty");

    const searchInput = document.getElementById("search");
    const categorySelect = document.getElementById("filter");
    const sortSelect = document.getElementById("sort");
    const favOnly = document.getElementById("fav-only");
    const resetBtn = document.getElementById("reset-filters");
    const cacheNote = document.getElementById("cache-note");
    const allergenBoxes = [...document.querySelectorAll('input[name="exclude"]')];

    // ключі бонусних завдань у localStorage (окрім favorites/theme)
    const FILTERS_KEY = "filters";
    const CACHE_KEY = "catalogCache";

    const dialog = document.getElementById("details");
    const dTitle = document.getElementById("d-title");
    const dMain = document.getElementById("d-main");
    const dObject = document.getElementById("d-object");
    const dList = document.getElementById("d-list");
    const dTable = document.getElementById("d-table");
    const dClose = document.getElementById("d-close");

    // --- Побудова картки з об'єкта даних (лише createElement + textContent) ---
    function cardNode(product) {
        const featured = product.name === FEATURED_NAME;

        const card = document.createElement("article");
        card.className = featured ? "card card--featured" : "card";
        card.dataset.id = product.id;

        // бейдж: у рекомендованої — «Рекомендуємо», інакше «Еко» для еко-паковання
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

        // кнопка-сердечко «обране» (localStorage)
        const fav = document.createElement("button");
        fav.type = "button";
        fav.className = isFavorite(product.id) ? "fav fav--on" : "fav";
        fav.textContent = isFavorite(product.id) ? "♥" : "♡";
        fav.setAttribute("aria-pressed", String(isFavorite(product.id)));
        fav.setAttribute("aria-label", isFavorite(product.id) ? "Прибрати з обраного" : "Додати до обраного");
        card.append(fav);

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
        meta.textContent = `${product.category} · ${formatValue(product.package.weight_g)} г · ${product.package.material}`;

        const nutri = document.createElement("p");
        nutri.className = "card__nutri";
        nutri.textContent = `${formatValue(product.nutrition.cal)} ккал · білок ${formatValue(product.nutrition.protein_g)} г`;

        body.append(title, meta, nutri);

        // алергени — червоними мітками; порожній масив (родзинка варіанта) —
        // осмислений текст, а не порожнє місце
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

    // Малює добірку. Картки спершу збираються у DocumentFragment і вставляються
    // одним replaceChildren — один перерахунок верстки замість десяти.
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

    // Одна точка істини про видимі картки: пошук + категорія + виключення
    // алергенів + «тільки обране», а потім сортування. Усі елементи керування
    // поєднуються, а не скидають одне одного.
    function applyFilters() {
        const query = (searchInput?.value ?? "").trim().toLowerCase();
        const category = categorySelect?.value ?? "";
        const excluded = allergenBoxes.filter((b) => b.checked).map((b) => b.value);
        const favFilter = favOnly?.checked ?? false;

        let list = products.filter((p) => {
            const haystack = [p.name, ...p.ingredients].join(" ").toLowerCase();
            if (query !== "" && !haystack.includes(query)) {
                return false;
            }
            if (category !== "" && p.category !== category) {
                return false;
            }
            if (excluded.some((a) => p.allergens.includes(a))) {
                return false;
            }
            if (favFilter && !isFavorite(p.id)) {
                return false;
            }
            return true;
        });

        if (sortSelect?.value === "name") {
            list = sortByName(list);
        } else if (sortSelect?.value === "cal") {
            list = sortByCalories(list);
        }
        renderCards(list);
        saveFilters();              // бонус: запам'ятати стан елементів керування
    }

    // Наповнює випадний список категорій значеннями з даних (а не руками в HTML).
    // Ідемпотентна: щоразу перебудовує опції, лишаючи «усі категорії» першою.
    function fillCategories() {
        if (categorySelect === null) {
            return;
        }
        const unique = [...new Set(products.map((p) => p.category))].sort((a, b) => a.localeCompare(b, "uk"));
        const options = [new Option("усі категорії", "")];
        unique.forEach((cat) => options.push(new Option(cat, cat)));
        categorySelect.replaceChildren(...options);
    }

    // === Бонус: стан фільтрів переживає перезавантаження ===

    // Зберігає пошук, категорію, сортування й «тільки обране» одним об'єктом.
    function saveFilters() {
        try {
            localStorage.setItem(FILTERS_KEY, JSON.stringify({
                q: searchInput?.value ?? "",
                category: categorySelect?.value ?? "",
                sort: sortSelect?.value ?? "",
                favOnly: favOnly?.checked ?? false,
            }));
        } catch {
            // сховище недоступне — не критично
        }
    }

    // Відновлює елементи керування зі сховища. Викликається ПІСЛЯ fillCategories:
    // поки опцій категорій немає, виставити collect\value було б нікуди.
    function restoreFilters() {
        let saved = null;
        try {
            const raw = localStorage.getItem(FILTERS_KEY);
            saved = raw ? JSON.parse(raw) : null;
        } catch {
            saved = null;
        }
        if (saved === null) {
            return;
        }
        if (searchInput) { searchInput.value = saved.q ?? ""; }
        if (categorySelect) { categorySelect.value = saved.category ?? ""; }
        if (sortSelect) { sortSelect.value = saved.sort ?? ""; }
        if (favOnly) { favOnly.checked = Boolean(saved.favOnly); }
    }

    // Кнопка «Скинути фільтри»: чистить і сховище, і поля.
    function resetFilters() {
        try {
            localStorage.removeItem(FILTERS_KEY);
        } catch {
            // ігноруємо
        }
        if (searchInput) { searchInput.value = ""; }
        if (categorySelect) { categorySelect.value = ""; }
        if (sortSelect) { sortSelect.value = ""; }
        if (favOnly) { favOnly.checked = false; }
        allergenBoxes.forEach((b) => { b.checked = false; });
        applyFilters();
    }

    // === Бонус: кеш даних у localStorage ===

    // Повертає {data, ts} з кешу або null (із захистом від зіпсованого вмісту).
    function readCache() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed.data) ? parsed : null;
        } catch {
            return null;
        }
    }

    // Зберігає копію даних із міткою часу.
    function writeCache(data) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
        } catch {
            // переповнене/недоступне сховище — кеш просто не збережеться
        }
    }

    // Показує рядок «дані з кешу від …» (ховається, коли приїхали свіжі).
    function showCacheNote(ts) {
        if (cacheNote === null) {
            return;
        }
        const when = new Date(ts).toLocaleString("uk-UA");
        cacheNote.textContent = `Показано дані з кешу від ${when}. Оновлюємо…`;
        cacheNote.hidden = false;
    }

    // --- Модалка: повна деталізація вкладених структур ---

    // <dl> з пар «підпис — значення» для простих полів.
    function pairsList(entries) {
        const dl = document.createElement("dl");
        dl.className = "detail-pairs";
        entries.forEach(([key, value]) => {
            const dt = document.createElement("dt");
            dt.textContent = labelOf(key);
            const dd = document.createElement("dd");
            dd.textContent = formatValue(value);
            dl.append(dt, dd);
        });
        return dl;
    }

    // Вкладений об'єкт -> секція із заголовком і таблицею «Показник/Значення»,
    // зібраною в коді (thead + tbody). Ключі перебираємо через Object.entries,
    // тож різний набір полів у різних записів обробиться сам.
    function objectSection(key, obj) {
        const section = document.createElement("section");
        const h = document.createElement("h3");
        h.textContent = labelOf(key);
        section.append(h);

        const wrap = document.createElement("div");
        wrap.className = "detail-table";               // overflow-x: auto проти скролу на 360px
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const htr = document.createElement("tr");
        ["Показник", "Значення"].forEach((t) => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = t;
            htr.append(th);
        });
        thead.append(htr);
        const tbody = document.createElement("tbody");
        Object.entries(obj).forEach(([k, v]) => {
            const tr = document.createElement("tr");
            const th = document.createElement("th");
            th.scope = "row";
            th.textContent = labelOf(k);
            const td = document.createElement("td");
            td.textContent = formatValue(v);
            tr.append(th, td);
            tbody.append(tr);
        });
        table.append(thead, tbody);
        wrap.append(table);
        section.append(wrap);
        return section;
    }

    // Масив рядків -> секція зі списком <ul>; порожній масив -> осмислений текст.
    function listSection(key, arr) {
        const section = document.createElement("section");
        const h = document.createElement("h3");
        h.textContent = labelOf(key);
        section.append(h);
        if (arr.length === 0) {
            const p = document.createElement("p");
            p.textContent = key === "allergens" ? "без поширених алергенів" : "список порожній";
            section.append(p);
        } else {
            const ul = document.createElement("ul");
            arr.forEach((item) => {
                const li = document.createElement("li");
                li.textContent = String(item);
                ul.append(li);
            });
            section.append(ul);
        }
        return section;
    }

    // Масив об'єктів -> таблиця (стовпці за ключами першого елемента).
    // У варіанті 9 таких полів немає, але шлях побудовано на випадок інших даних.
    function tableSection(key, arr) {
        const section = document.createElement("section");
        const h = document.createElement("h3");
        h.textContent = labelOf(key);
        section.append(h);
        const wrap = document.createElement("div");
        wrap.className = "detail-table";
        const table = document.createElement("table");
        const cols = Object.keys(arr[0]);
        const thead = document.createElement("thead");
        const htr = document.createElement("tr");
        cols.forEach((c) => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = labelOf(c);
            htr.append(th);
        });
        thead.append(htr);
        const tbody = document.createElement("tbody");
        arr.forEach((row) => {
            const tr = document.createElement("tr");
            cols.forEach((c) => {
                const td = document.createElement("td");
                td.textContent = formatValue(row[c]);
                tr.append(td);
            });
            tbody.append(tr);
        });
        table.append(thead, tbody);
        wrap.append(table);
        section.append(wrap);
        return section;
    }

    const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

    // Заповнює модалку з запису. Кожен контейнер чиститься через replaceChildren
    // на початку — інакше дані попередньої картки лишилися б і змішалися.
    function openDetails(id) {
        const product = products.find((p) => p.id === id);
        if (product === undefined || dialog === null) {
            return;
        }
        dTitle.textContent = product.name;

        const primitives = [];      // прості поля
        const objects = [];         // вкладені об'єкти
        const lists = [];           // масиви рядків
        const tables = [];          // масиви об'єктів

        Object.entries(product).forEach(([key, value]) => {
            if (key === "id") {
                return;             // службове поле — у деталізацію не виводимо
            }
            if (Array.isArray(value)) {
                if (value.length > 0 && isPlainObject(value[0])) {
                    tables.push([key, value]);
                } else {
                    lists.push([key, value]);
                }
            } else if (isPlainObject(value)) {
                objects.push([key, value]);
            } else {
                primitives.push([key, value]);
            }
        });

        dMain.replaceChildren(pairsList(primitives));
        dObject.replaceChildren(...objects.map(([k, v]) => objectSection(k, v)));
        dList.replaceChildren(...lists.map(([k, v]) => listSection(k, v)));
        dTable.replaceChildren(...tables.map(([k, v]) => tableSection(k, v)));

        dialog.showModal();
    }

    // --- Обране ---
    function toggleFavorite(id) {
        if (isFavorite(id)) {
            favorites = favorites.filter((f) => f !== id);
            showToast("Прибрано з обраного");
        } else {
            favorites = [...favorites, id];
            showToast("Додано до обраного");
        }
        writeFavorites(favorites);
        applyFilters();             // перемалювати: оновити сердечка й фільтр «тільки обране»
    }

    // --- Делегування: один слухач на весь контейнер карток ---
    cardsBox.addEventListener("click", (event) => {
        const card = event.target.closest(".card");
        if (card === null) {
            return;
        }
        const id = Number(card.dataset.id);
        // сердечко перемикає обране й НЕ відкриває модалку (ранній return)
        if (event.target.closest(".fav") !== null) {
            toggleFavorite(id);
            return;
        }
        // «Замовити» кидає тост у кошик
        if (event.target.closest(".card__order") !== null) {
            const product = products.find((p) => p.id === id);
            showToast(`«${product.name}» додано в кошик`);
            return;
        }
        openDetails(id);
    });

    if (dClose !== null) {
        dClose.addEventListener("click", () => dialog.close());
    }

    // елементи керування — усі через applyFilters
    searchInput?.addEventListener("input", applyFilters);
    categorySelect?.addEventListener("change", applyFilters);
    sortSelect?.addEventListener("change", applyFilters);
    favOnly?.addEventListener("change", applyFilters);
    allergenBoxes.forEach((box) => box.addEventListener("change", applyFilters));
    resetBtn?.addEventListener("click", resetFilters);       // бонус: скинути фільтри

    // Показує блок помилки з людським текстом (а не лише console.error).
    function showLoadError(error) {
        if (loadError === null) {
            return;
        }
        loadError.textContent = "Не вдалося завантажити каталог. Перевірте з'єднання і "
            + "оновіть сторінку. Технічні подробиці: " + error.message;
        loadError.hidden = false;
    }

    // id у файлі немає — присвоюємо за позицією, щоб картка й модалка могли
    // знаходити свій запис
    const withIds = (data) => data.map((p, i) => ({ ...p, id: i + 1 }));

    // --- Запуск: кеш -> миттєвий показ, потім свіжі дані з мережі ---
    async function init() {
        // Бонус-кеш: якщо є збережена копія — показуємо її одразу, без спінера,
        // а свіжі дані підвантажуємо у фоні.
        const cached = readCache();
        if (cached !== null) {
            products = withIds(cached.data);
            fillCategories();
            restoreFilters();
            applyFilters();
            showCacheNote(cached.ts);
        } else if (loader !== null) {
            loader.hidden = false;      // першого разу кешу немає — показуємо спінер
        }

        try {
            products = withIds(await loadData());
            writeCache(products.map(({ id, ...rest }) => rest)); // кешуємо без службового id
            fillCategories();
            restoreFilters();           // відновлюємо стан ПІСЛЯ завантаження даних
            applyFilters();             // і лише тоді фільтруємо — масив уже повний
            if (cacheNote !== null) {
                cacheNote.hidden = true; // свіжі дані приїхали — підказку про кеш ховаємо
            }
        } catch (error) {
            // якщо кеш уже показано — лишаємо його; інакше показуємо помилку
            if (cached === null) {
                showLoadError(error);
            }
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


// === Бонус: окрема сторінка статистики з реальним API (LR10) ===
// Той самий патерн, що й каталог: fetch + async/await, спінер, обробка помилок.
const statsApp = document.getElementById("stats-app");
if (statsApp !== null) {
    const out = document.getElementById("stats-out");
    const statsLoader = statsApp.querySelector(".loader");
    const statsError = document.getElementById("stats-error");
    const API_URL = "https://pokeapi.co/api/v2/pokemon/pikachu";

    async function loadStats() {
        if (statsLoader !== null) {
            statsLoader.hidden = false;
        }
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Сервер відповів статусом ${response.status}`);
            }
            const data = await response.json();
            const rows = [
                ["Назва", data.name],
                ["Номер у покедексі", data.id],
                ["Зріст", (data.height / 10).toFixed(1) + " м"],
                ["Вага", (data.weight / 10).toFixed(1) + " кг"],
                ["Базовий досвід", data.base_experience],
                ["Типи", data.types.map((t) => t.type.name).join(", ")],
            ];
            const frag = document.createDocumentFragment();
            rows.forEach(([key, value]) => {
                const dt = document.createElement("dt");
                dt.textContent = key;
                const dd = document.createElement("dd");
                dd.textContent = String(value);
                frag.append(dt, dd);
            });
            out.replaceChildren(frag);
        } catch (error) {
            if (statsError !== null) {
                statsError.textContent = "Не вдалося завантажити статистику: " + error.message;
                statsError.hidden = false;
            }
        } finally {
            if (statsLoader !== null) {
                statsLoader.hidden = true;
            }
        }
    }

    loadStats();
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

    // Власні перевірки поверх HTML-атрибутів через setCustomValidity.
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

    // Квитанція будується вузлами через createElement — не текстовим рядком.
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
