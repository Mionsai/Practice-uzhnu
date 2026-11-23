"use strict";

// Дані варіанта 9 «Продукти здорового харчування» — ті самі 10 позицій, що
// у variant09.json, тут вбудовані масивом об'єктів. Читання з файла через
// fetch і збереження стану в localStorage — тема LR10, у LR9 дані статичні.
// id додано для пошуку картки по кліку; image — ім'я файлу в images/.
const products = [
    {
        id: 1,
        name: "Гранола медова",
        category: "сніданок",
        ingredients: ["вівсянка", "мед", "мигдаль", "родзинки", "олія"],
        nutrition: { cal: 410, fat_g: 12, carbs_g: 60, protein_g: 8 },
        allergens: ["горіхи", "глютен"],
        package: { weight_g: 350, material: "картон", eco: true },
        image: "images/granola.jpg",
        alt: "Медова гранола з мигдалем і родзинками в мисці",
    },
    {
        id: 2,
        name: "Йогурт натуральний",
        category: "молочні продукти",
        ingredients: ["молоко", "бактерії"],
        nutrition: { cal: 90, fat_g: 3, carbs_g: 7, protein_g: 5 },
        allergens: ["лактоза"],
        package: { weight_g: 250, material: "пластик", eco: false },
        image: "images/yogurt.jpg",
        alt: "Натуральний білий йогурт у скляній баночці з ложкою",
    },
    {
        id: 3,
        name: "Хумус класичний",
        category: "соуси",
        ingredients: ["нут", "олія", "кунжут", "часник", "перець"],
        nutrition: { cal: 166, fat_g: 9, carbs_g: 14, protein_g: 7 },
        allergens: ["кунжут"],
        package: { weight_g: 200, material: "скло", eco: true },
        image: "images/hummus.jpg",
        alt: "Хумус класичний у скляній банці з оливковою олією зверху",
    },
    {
        id: 4,
        name: "Фалафель",
        category: "веганське",
        ingredients: ["нут", "часник", "олія", "зелень"],
        nutrition: { cal: 330, fat_g: 15, carbs_g: 33, protein_g: 13 },
        allergens: [],
        package: { weight_g: 300, material: "картон", eco: true },
        image: "images/falafel.jpg",
        alt: "Золотисті кульки фалафелю із зеленню на тарілці",
    },
    {
        id: 5,
        name: "Сир твердий «Гауда»",
        category: "молочні продукти",
        ingredients: ["молоко", "сіль", "ферменти"],
        nutrition: { cal: 356, fat_g: 27, carbs_g: 2, protein_g: 25 },
        allergens: ["лактоза"],
        package: { weight_g: 500, material: "пластик", eco: false },
        image: "images/gouda.jpg",
        alt: "Шматок і скибки твердого сиру «Гауда» на дошці",
    },
    {
        id: 6,
        name: "Арахісова паста",
        category: "намазки",
        ingredients: ["арахіс", "сіль"],
        nutrition: { cal: 589, fat_g: 50, carbs_g: 16, protein_g: 25 },
        allergens: ["арахіс"],
        package: { weight_g: 300, material: "скло", eco: true },
        image: "images/peanut-butter.jpg",
        alt: "Арахісова паста у відкритій скляній банці з горішками поруч",
    },
    {
        id: 7,
        name: "Енергетичний батончик шоколадний",
        category: "перекус",
        ingredients: ["вівсянка", "шоколад", "горіхи", "мед"],
        nutrition: { cal: 220, fat_g: 9, carbs_g: 28, protein_g: 6 },
        allergens: ["горіхи", "глютен"],
        package: { weight_g: 50, material: "фольга", eco: false },
        image: "images/energy-bar.jpg",
        alt: "Шоколадно-вівсяний батончик з горіхами, частково розгорнутий",
    },
    {
        id: 8,
        name: "Імбирний чай",
        category: "напої",
        ingredients: ["імбир", "лимон", "мед"],
        nutrition: { cal: 20, fat_g: 0, carbs_g: 5, protein_g: 0 },
        allergens: [],
        package: { weight_g: 250, material: "скло", eco: true },
        image: "images/ginger-tea.jpg",
        alt: "Склянка імбирного чаю з лимоном і коренем імбиру поруч",
    },
    {
        id: 9,
        name: "Салат кіноа",
        category: "готові страви",
        ingredients: ["кіноа", "огірки", "помідори", "зелень", "олія"],
        nutrition: { cal: 150, fat_g: 5, carbs_g: 22, protein_g: 6 },
        allergens: [],
        package: { weight_g: 300, material: "бамбук", eco: true },
        image: "images/quinoa-salad.jpg",
        alt: "Свіжий салат із кіноа, огірків, помідорів і зелені в мисці",
        featured: true,                             // «Рекомендуємо»: виводиться першою (order:-1)
    },
    {
        id: 10,
        name: "Кокосове печиво",
        category: "випічка",
        ingredients: ["кокос", "борошно", "яйця", "цукор"],
        nutrition: { cal: 310, fat_g: 18, carbs_g: 34, protein_g: 4 },
        allergens: ["яйця", "глютен"],
        package: { weight_g: 200, material: "картон", eco: true },
        image: "images/coconut-cookies.jpg",
        alt: "Домашнє кокосове печиво із золотистими краями на тарілці",
    },
];


// === Допоміжна функція виводу ===

// Записує текст у елемент за id. Масив рядків склеює переносами.
const show = (id, value) => {
    const box = document.getElementById(id);
    if (box === null) {
        console.error("Немає елемента з id:", id);
        return;
    }
    box.textContent = Array.isArray(value) ? value.join("\n") : value;
};


// === Обробка даних (LR8, переюзається каталогом LR9) ===

// Приймає масив продуктів, повертає масив рядків «№. назва — категорія, ккал».
function numberedList(items) {
    const lines = [];
    for (let i = 0; i < items.length; i++) {
        const p = items[i];
        lines.push(`${i + 1}. ${p.name} — ${p.category}, ${p.nutrition.cal} ккал`);
    }
    return lines;
}

// Приймає продукт, повертає назву відділу за його категорією.
function categoryOf(product) {
    switch (product.category) {
        case "молочні продукти":
            return "Молочне";
        case "соуси":
        case "намазки":                 // навмисне групування: один відділ
            return "Соуси та намазки";
        case "напої":
            return "Напої";
        case "веганське":
        case "готові страви":
            return "Готові страви";
        default:                        // сніданок, перекус, випічка
            return "Сніданки та снеки";
    }
}

// Повертає продукти рівно заданої категорії (строге порівняння).
const filterByCategory = (items, value) => items.filter((p) => p.category === value);

// Повертає продукти з калорійністю не вище порогу.
const filterByCalorieUpTo = (items, maxCalories) => items.filter((p) => p.nutrition.cal <= maxCalories);

// Варіант: повертає продукти, що НЕ містять заданого алергену.
const filterWithoutAllergen = (items, allergen) => items.filter((p) => !p.allergens.includes(allergen));

// Сортує копію за калорійністю (зростання) — оригінал не чіпає.
const sortByCalories = (items) => [...items].sort((a, b) => a.nutrition.cal - b.nutrition.cal);

// Сортує копію за назвою в українській абетці.
const sortByName = (items) => [...items].sort((a, b) => a.name.localeCompare(b.name, "uk"));

// Приймає масив продуктів, повертає об'єкт зі статистикою добірки.
function statsForItems(items) {
    // Явне початкове 0 — щоб сума стартувала з числа, а не з об'єкта продукту.
    const total = items.reduce((sum, p) => sum + p.nutrition.cal, 0);
    // Явний seed items[0] — так само, як 0 для суми. Без нього reduce тихо
    // бере перший елемент за початковий; із seed старт видно в коді.
    const max = items.reduce((best, p) => (p.nutrition.protein_g > best.nutrition.protein_g ? p : best), items[0]);
    return {
        count: items.length,
        total,
        average: (total / items.length).toFixed(1),
        max,
        categories: new Set(items.map((p) => p.category)).size,
    };
}


// === Спливне повідомлення (§9) ===

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


// === Меню (§7): кнопка-гамбургер замість <details>, керована з JS ===
const burger = document.getElementById("burger");
const navList = document.getElementById("navList");
if (burger !== null && navList !== null) {
    // Єдина точка правди про стан меню: тримає aria-expanded і hidden
    // синхронними, щоб скрінрідер і око бачили те саме.
    const setMenu = (open) => {
        burger.setAttribute("aria-expanded", String(open));
        navList.hidden = !open;
    };

    // На широкому екрані меню — завжди відкритий рядок, на телефоні стартує
    // згорнутим. matchMedia тримає стан правильним і після зміни ширини
    // (саме на цьому LR7 на <details> ламався при ресайзі).
    const wide = window.matchMedia("(min-width: 768px)");
    const syncToWidth = () => setMenu(wide.matches);
    syncToWidth();
    wide.addEventListener("change", syncToWidth);

    burger.addEventListener("click", () => {
        setMenu(burger.getAttribute("aria-expanded") !== "true");
    });

    // Escape згортає меню…
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenu(false);
        }
    });

    // …і клік поза навігацією теж, але лише коли меню згорнуте в гамбургер
    // (на вузькому екрані); на широкому список завжди відкритий.
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

    // Стартова тема — із системного налаштування користувача. Збереження
    // вибору між сеансами лишаємо на LR10 (localStorage).
    applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);

    themeBtn.addEventListener("click", () => applyTheme(!isDark()));
}


// === Каталог (§9): рендер карток, пошук, фільтр, делегування ===
const cardsBox = document.querySelector(".cards");
if (cardsBox !== null) {
    const searchInput = document.getElementById("search");
    const allergenBoxes = [...document.querySelectorAll('input[name="exclude"]')];
    const countOut = document.getElementById("catalog-count");
    const emptyBox = document.getElementById("empty");

    const dialog = document.getElementById("details");
    const dialogTitle = document.getElementById("details-title");
    const dialogBody = document.getElementById("details-body");
    const closeBtn = document.getElementById("closeDetails");

    // Будує один DOM-вузол картки з даних продукту. Текст скрізь кладемо
    // через textContent — тоді назва чи склад потрапляють на сторінку як
    // звичайний текст, а не як розмітка.
    function cardNode(product) {
        const card = document.createElement("article");
        // card--featured (order:-1) виводить рекомендовану картку першою в сітці,
        // не чіпаючи порядок у DOM (бонус LR6, повернутий у §9)
        card.className = product.featured ? "card card--featured" : "card";
        card.dataset.id = product.id;              // за ним знайдемо продукт у кліку

        // бейдж: у рекомендованої — «Рекомендуємо», інакше «Еко» для еко-паковання
        if (product.featured) {
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
        img.src = product.image;
        img.alt = product.alt;
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

        // Алергени — окремими червоними мітками; якщо їх немає, рядок не додаємо.
        if (product.allergens.length > 0) {
            const allerg = document.createElement("p");
            allerg.className = "card__allergens";
            product.allergens.forEach((name) => {
                const tag = document.createElement("span");
                tag.className = "badge-allergen";
                tag.textContent = name;
                allerg.append(tag);
            });
            body.append(allerg);
        }

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

    // Малює передану добірку. replaceChildren приймає DocumentFragment і
    // одним рухом замінює весь вміст контейнера — коротше й чистіше, ніж
    // спочатку вручну чистити, а потім додавати.
    function render(items) {
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

    // Зводить разом пошук і виключення алергенів — одне джерело істини
    // про те, які картки видно.
    function visibleProducts() {
        const query = (searchInput?.value ?? "").trim().toLowerCase();
        const excluded = allergenBoxes.filter((b) => b.checked).map((b) => b.value);

        return products.filter((p) => {
            // пошук за назвою АБО будь-яким інгредієнтом складу
            const haystack = [p.name, ...p.ingredients].join(" ").toLowerCase();
            const matchesQuery = query === "" || haystack.includes(query);
            // лишаємо продукт, лише якщо він не містить жодного виключеного алергену
            const hasExcluded = p.allergens.some((a) => excluded.includes(a));
            return matchesQuery && !hasExcluded;
        });
    }

    const update = () => render(visibleProducts());

    // Відкриває діалог «швидкого перегляду», заповнюючи його з даних продукту.
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

    // Делегування: один слухач на всьому контейнері обслуговує будь-яку
    // картку, зокрема й ті, що зʼявляться після перемальовування. «Замовити»
    // кидає тост у кошик, решта картки відкриває швидкий перегляд.
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

    // Пошук реагує на кожне введення, чекбокси — на зміну стану.
    searchInput?.addEventListener("input", update);
    allergenBoxes.forEach((box) => box.addEventListener("change", update));

    // Перший малюнок каталогу з даних. console.time показує вартість рендера:
    // replaceChildren + DocumentFragment роблять одну вставку в DOM, тож
    // браузер перераховує верстку раз (бонус — пояснення й замір у README).
    console.time("Рендер каталогу");
    update();
    console.timeEnd("Рендер каталогу");
}


// === Валідація форми підписки (§9) ===
// novalidate стоїть атрибутом у form.html, тож нативні підказки вимкнені й
// перевірку веде цей код — через Constraint Validation API плюс власні
// правила (setCustomValidity).
const subscribeForm = document.querySelector(".form-grid");
if (subscribeForm !== null) {
    const status = document.getElementById("form-status");

    const freqLabels = {
        weekly: "щотижня",
        biweekly: "раз на два тижні",
        monthly: "щомісяця",
    };
    const allergenLabels = {
        nuts: "горіхи",
        gluten: "глютен",
        lactose: "лактоза",
    };

    // Людяніші повідомлення під конкретні поля; якщо тут немає — беремо
    // стандартний текст браузера (validationMessage).
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

    // Власні перевірки поверх HTML-атрибутів: прізвище+ім'я двома словами
    // і дата доставки не в минулому. setCustomValidity("") знімає помилку,
    // непорожній текст робить поле невалідним для checkValidity().
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

    // Показує або ховає повідомлення про помилку під полем.
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

    // Поки користувач править поле — знімаємо власну помилку й ховаємо текст,
    // щойно значення стало валідним.
    subscribeForm.addEventListener("input", (event) => {
        const field = event.target;
        if (field.name === "fullname" || field.name === "delivery_date") {
            field.setCustomValidity("");
        }
        if (field.willValidate && field.validity.valid) {
            setError(field, "");
        }
    });

    // Збирає квитанцію окремими вузлами через createElement — не текстовим
    // рядком. Повертає готовий <div>, який кладемо у #form-status.
    function buildReceipt() {
        const el = subscribeForm.elements;

        // значення різних типів читаємо явно
        const persons = Number(el.persons.value);                 // Number()
        const agreed = el.agree.checked;                          // .checked
        const freqChecked = subscribeForm.querySelector('input[name="box_frequency"]:checked');
        const freq = freqChecked === null ? "не вказано" : freqLabels[freqChecked.value];
        const excluded = [...subscribeForm.querySelectorAll('input[name="exclude_allergens"]')]
            .filter((box) => box.checked)                         // .checked
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
        event.preventDefault();         // бекенду немає — обробляємо самі
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

        // Усе валідне: показуємо квитанцію (окремими вузлами) і чистимо форму.
        if (status !== null) {
            status.replaceChildren(buildReceipt());
            status.className = "form-status form-status--ok";
            status.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        showToast("Підписку оформлено ✓");
        subscribeForm.reset();
    });
}


// === Демонстрація роботи (LR8) ===
// Стоїть у кінці файла — після оголошення всіх функцій. Працює лише там, де є
// блок виводу (catalog.html); на інших сторінках цих id немає.
if (document.getElementById("out-count") !== null) {
    show("out-count", `Продуктів у каталозі: ${products.length}`);
    show("out-numbered", numberedList(products));

    // «назва → відділ» для кожного продукту
    show("out-categories", products.map((p) => `${p.name} → ${categoryOf(p)}`));

    // Порожній або ні — тернар вирішує, що показати
    const asList = (list) => list.length > 0
        ? list.map((p) => " • " + p.name).join("\n")
        : "нічого не знайдено";

    const dairy = filterByCategory(products, "молочні продукти");
    const lowCal = filterByCalorieUpTo(products, 200);
    const noGluten = filterWithoutAllergen(products, "глютен");
    const none = filterByCategory(products, "десерти");      // свідомо порожній результат

    show("out-filter", [
        `Категорія «молочні продукти» (${dairy.length}):`,
        asList(dairy),
        `До 200 ккал (${lowCal.length}):`,
        asList(lowCal),
        `Без алергену «глютен» (${noGluten.length}):`,
        asList(noGluten),
        `Категорія «десерти» (${none.length}):`,
        asList(none),
    ]);

    show("out-sorted", [
        "За калорійністю (зростання):",
        sortByCalories(products).map((p) => ` • ${p.name} — ${p.nutrition.cal} ккал`).join("\n"),
        "За назвою (українська абетка):",
        sortByName(products).map((p) => " • " + p.name).join("\n"),
        "Вихідний порядок (не зіпсований сортуванням):",
        products.map((p) => " • " + p.name).join("\n"),
    ]);

    const stats = statsForItems(products);
    show("out-stats", [
        `Усього продуктів: ${stats.count}`,
        `Сумарна калорійність: ${stats.total} ккал`,
        `Середня калорійність: ${stats.average} ккал`,
        `Найбільш білковий: ${stats.max.name} (${stats.max.nutrition.protein_g} г білка на 100 г)`,
        `Різних категорій: ${stats.categories}`,
    ]);
}
