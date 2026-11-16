"use strict";

// Дані варіанта «Продукти здорового харчування».
// const тримає саме посилання на масив, а не його вміст — тому push,
// який міняє вміст, працює; заборонено лише переприсвоїти сам products.
// З LR9 кожен запис додатково несе поля для картки (image, code, weight,
// group) і склад (ingredients) — за ним шукаємо поряд із назвою.
const products = [
    {
        id: 1,
        title: "Вівсяні пластівці",
        calories: 362,                              // ккал на 100 г
        protein: 13,                                // г білка на 100 г
        category: "крупи",
        group: "Крупи та пластівці",               // як підписано у картці/розділі
        origin: { country: "Україна", producer: "Органік Лан" },
        allergens: ["глютен"],
        ingredients: ["вівсяні пластівці"],
        tags: ["цільнозернове", "сніданок"],
        image: "images/oat.jpg",
        alt: "Вівсяні пластівці в паперовому пакеті та дерев'яній мисці",
        code: "HF-9321-UA",
        weight: 400,                                // г, вага паковання
        eco: true,
    },
    {
        id: 2,
        title: "Мікс горіхів",
        calories: 607,
        protein: 20,
        category: "горіхи",
        group: "Горіхи та сухофрукти",
        origin: { country: "Україна", producer: "Горіховий двір" },
        allergens: ["горіхи"],
        ingredients: ["мигдаль", "волоський горіх", "фініки"],
        tags: ["перекус", "омега-3"],
        image: "images/nuts.jpg",
        alt: "Суміш мигдалю, волоських горіхів і фініків у мисці",
        code: "HF-1342-UA",
        weight: 250,
    },
    {
        id: 3,
        title: "Гречка зелена",
        calories: 343,
        protein: 13,
        category: "крупи",
        group: "Крупи та пластівці",
        origin: { country: "Україна", producer: "Сварог" },
        allergens: [],                              // без поширених алергенів
        ingredients: ["гречка зелена"],
        tags: ["безглютенове", "залізо"],
        image: "images/buckwheat.jpg",
        alt: "Необроблена гречана крупа в мисці",
        code: "HF-5567-UA",
        weight: 900,
    },
    {
        id: 4,
        title: "Хумус класичний",
        calories: 166,
        protein: 8,
        category: "пасти та спреди",
        group: "Соуси та пасти",
        origin: { country: "Україна", producer: "EcoFood" },
        allergens: ["кунжут"],
        ingredients: ["нут", "тахіні", "оливкова олія", "часник", "лимонний сік", "сіль"],
        tags: ["веганське", "закуска"],
        image: "images/hummus.jpg",
        alt: "Хумус класичний у скляній банці з оливковою олією зверху",
        code: "HF-8824-UA",
        weight: 350,
        eco: true,
    },
    {
        id: 5,
        title: "Кіноа органічна",
        calories: 368,
        protein: 14,
        category: "крупи",
        group: "Крупи та пластівці",
        origin: { country: "Перу", producer: "Andes Harvest" },
        allergens: [],
        ingredients: ["кіноа"],
        tags: ["безглютенове", "повноцінний білок", "залізо"],
        image: "images/quinoa.jpg",
        alt: "Біла кіноа у мисці",
        code: "HF-3312-UA",
        weight: 400,
    },
    {
        id: 6,
        title: "Курага сушена",
        calories: 241,
        protein: 3.4,
        category: "сухофрукти",
        group: "Горіхи та сухофрукти",
        origin: { country: "Туреччина", producer: "Anatolia" },
        allergens: ["діоксид сірки"],
        ingredients: ["курага", "діоксид сірки"],
        tags: ["калій", "перекус"],
        image: "images/dried-apricots.jpg",
        alt: "Сушена курага в дерев'яній мисці",
        code: "HF-4456-UA",
        weight: 300,
    },
    {
        id: 7,
        title: "Мигдаль несмажений",
        calories: 579,
        protein: 21,
        category: "горіхи",
        group: "Горіхи та сухофрукти",
        origin: { country: "Іспанія", producer: "Valencia Nuts" },
        allergens: ["горіхи"],
        ingredients: ["мигдаль"],
        tags: ["вітамін E", "кето"],
        image: "images/almonds.jpg",
        alt: "Мигдаль несмажений у мисці",
        code: "HF-6678-UA",
        weight: 300,
    },
    {
        id: 8,
        title: "Насіння чіа",
        calories: 486,
        protein: 17,
        category: "насіння",
        group: "Горіхи та сухофрукти",
        origin: { country: "Мексика", producer: "Maya Fields" },
        allergens: [],
        ingredients: ["насіння чіа"],
        tags: ["омега-3", "клітковина", "суперфуд"],
        image: "images/chia-seeds.jpg",
        alt: "Насіння чіа в скляній банці",
        code: "HF-7789-UA",
        weight: 200,
    },
    {
        id: 9,
        title: "Паста тахіні",
        calories: 595,
        protein: 17,
        category: "пасти та спреди",
        group: "Соуси та пасти",
        origin: { country: "Україна", producer: "EcoFood" },
        allergens: ["кунжут"],
        ingredients: ["кунжут"],
        tags: ["веганське", "джерело кальцію"],
        image: "images/tahini.jpg",
        alt: "Паста тахіні зі свіжого кунжуту",
        code: "HF-2245-UA",
        weight: 300,
        featured: true,
    },
];


// === Допоміжні функції ===

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

// Приймає масив продуктів, повертає масив готових рядків «№. назва — …».
function numberedList(items) {
    const lines = [];
    for (let i = 0; i < items.length; i++) {
        const p = items[i];
        lines.push(`${i + 1}. ${p.title} — ${p.category}, ${p.calories} ккал (${p.origin.country}, ${p.origin.producer})`);
    }
    return lines;
}

// Приймає продукт, повертає назву відділу каталогу за його категорією.
function categoryOf(product) {
    switch (product.category) {
        case "горіхи":
        case "насіння":                 // навмисне групування: один відділ
            return "Горіхи та насіння";
        case "крупи":
            return "Крупи та каші";
        case "сухофрукти":
            return "Сухофрукти";
        default:                        // сюди падають «пасти та спреди» тощо
            return "Інші продукти";
    }
}

// Повертає продукти рівно заданої категорії (строге порівняння).
const filterByCategory = (items, value) => items.filter((p) => p.category === value);

// Повертає продукти з калорійністю не вище порогу.
const filterByCalorieUpTo = (items, maxCalories) => items.filter((p) => p.calories <= maxCalories);

// Варіант: повертає продукти, що НЕ містять заданого алергену.
const filterWithoutAllergen = (items, allergen) => items.filter((p) => !p.allergens.includes(allergen));

// Сортує копію за калорійністю (зростання) — оригінал не чіпає.
const sortByCalories = (items) => [...items].sort((a, b) => a.calories - b.calories);

// Сортує копію за назвою в українській абетці.
const sortByName = (items) => [...items].sort((a, b) => a.title.localeCompare(b.title, "uk"));

// Приймає масив продуктів, повертає об'єкт зі статистикою добірки.
function statsForItems(items) {
    // Початкове 0 — щоб сума стартувала з числа; без нього перший продукт
    // став би акумулятором і до калорій додався б цілий об'єкт.
    const total = items.reduce((sum, p) => sum + p.calories, 0);
    // max через reduce: тримаємо найбілковіший запис, порівнюючи з поточним.
    const max = items.reduce((best, p) => (p.protein > best.protein ? p : best));
    return {
        count: items.length,
        total,
        average: (total / items.length).toFixed(1),
        max,
        categories: new Set(items.map((p) => p.category)).size,
    };
}


// === Демонстрація роботи (LR8) ===
// Запускаємо лише там, де є блок виводу, тобто на catalog.html. На form.html
// цих id немає, і без перевірки show() сипав би console.error.
if (document.getElementById("out-count") !== null) {
    show("out-count", `Продуктів у каталозі: ${products.length}`);
    show("out-numbered", numberedList(products));

    // «назва → відділ» для кожного продукту
    show("out-categories", products.map((p) => `${p.title} → ${categoryOf(p)}`));

    // Порожній або ні — тернар вирішує, що показати
    const asList = (list) => list.length > 0
        ? list.map((p) => " • " + p.title).join("\n")
        : "нічого не знайдено";

    const crops = filterByCategory(products, "крупи");
    const lowCal = filterByCalorieUpTo(products, 350);
    const noNuts = filterWithoutAllergen(products, "горіхи");
    const none = filterByCategory(products, "напої");        // свідомо порожній результат

    show("out-filter", [
        `Категорія «крупи» (${crops.length}):`,
        asList(crops),
        `До 350 ккал (${lowCal.length}):`,
        asList(lowCal),
        `Без алергену «горіхи» (${noNuts.length}):`,
        asList(noNuts),
        `Категорія «напої» (${none.length}):`,
        asList(none),
    ]);

    show("out-sorted", [
        "За калорійністю (зростання):",
        sortByCalories(products).map((p) => ` • ${p.title} — ${p.calories} ккал`).join("\n"),
        "За назвою (українська абетка):",
        sortByName(products).map((p) => " • " + p.title).join("\n"),
        "Вихідний порядок (не зіпсований сортуванням):",
        products.map((p) => " • " + p.title).join("\n"),
    ]);

    // Статистика: виводимо поля об'єкта окремими рядками, а не сам об'єкт
    const stats = statsForItems(products);
    show("out-stats", [
        `Усього продуктів: ${stats.count}`,
        `Сумарна калорійність: ${stats.total} ккал`,
        `Середня калорійність: ${stats.average} ккал`,
        `Найбільш білковий: ${stats.max.title} (${stats.max.protein} г білка на 100 г)`,
        `Різних категорій: ${stats.categories}`,
    ]);
}


// === Каталог: рендер, пошук, фільтр, делегування (LR9) ===
// Весь блок прив'язаний до контейнера карток; якщо його немає (інші
// сторінки) — нічого не чіпаємо.
const cardsBox = document.querySelector(".cards");
if (cardsBox !== null) {
    const searchInput = document.getElementById("search");
    const allergenBoxes = [...document.querySelectorAll('input[name="exclude"]')];
    const countOut = document.getElementById("catalog-count");

    const dialog = document.getElementById("details");
    const dialogTitle = document.getElementById("details-title");
    const dialogBody = document.getElementById("details-body");
    const closeBtn = document.getElementById("closeDetails");

    // Будує один DOM-вузол картки з даних продукту. Жодного innerHTML —
    // текст кладемо через textContent, тож дані не можуть «втекти» в розмітку.
    function cardNode(product) {
        const card = document.createElement("article");
        card.className = product.featured ? "card card--featured" : "card";
        card.dataset.id = product.id;              // за ним знайдемо продукт у кліку

        if (product.eco || product.featured) {
            const badge = document.createElement("span");
            badge.className = product.eco ? "card__badge card__badge--eco" : "card__badge";
            badge.textContent = product.eco ? "Еко" : "Рекомендуємо";
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
        title.textContent = product.title;

        const meta = document.createElement("p");
        meta.className = "card__meta";
        meta.textContent = `${product.group} · ${product.weight} г`;

        const code = document.createElement("p");
        code.className = "card__id";
        code.textContent = `Ідентифікатор: ${product.code}`;

        body.append(title, meta, code);
        card.append(body);

        const actions = document.createElement("div");
        actions.className = "card__actions";

        const order = document.createElement("a");
        order.className = "card__action";
        order.href = "#";
        order.textContent = "Замовити";

        const more = document.createElement("button");
        more.className = "card__more";
        more.type = "button";
        more.textContent = "Швидкий перегляд";

        actions.append(order, more);
        card.append(actions);

        return card;
    }

    // Малює передану добірку: чистить контейнер і складає картки наново.
    // DocumentFragment — щоб 9 вставок не смикали верстку по одній.
    function render(items) {
        cardsBox.textContent = "";
        if (items.length === 0) {
            const empty = document.createElement("p");
            empty.className = "cards__empty";
            empty.textContent = "За цими умовами нічого не знайдено.";
            cardsBox.append(empty);
        } else {
            const frag = document.createDocumentFragment();
            items.forEach((p) => frag.append(cardNode(p)));
            cardsBox.append(frag);
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
            const haystack = [p.title, ...p.ingredients].join(" ").toLowerCase();
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
        dialogTitle.textContent = product.title;
        dialogBody.textContent = [
            `Ідентифікатор: ${product.code}`,
            `Відділ: ${product.group} (${categoryOf(product)})`,
            `Склад: ${product.ingredients.join(", ")}.`,
            `Харчова цінність на 100 г: ${product.calories} ккал, білок ${product.protein} г.`,
            `Вага паковання: ${product.weight} г · походження: ${product.origin.country}, ${product.origin.producer}.`,
            product.allergens.length > 0
                ? `Алергени: ${product.allergens.join(", ")}.`
                : "Без поширених алергенів.",
        ].join("\n");
        dialog.showModal();
    }

    // Делегування: один слухач на всьому контейнері обслуговує будь-яку
    // картку, зокрема й ті, що з'являться після перемальовування. Клік по
    // посиланню «Замовити» лишаємо браузеру, решта картки відкриває перегляд.
    cardsBox.addEventListener("click", (event) => {
        if (event.target.closest(".card__action") !== null) {
            return;
        }
        const card = event.target.closest(".card");
        if (card === null) {
            return;
        }
        openDetails(Number(card.dataset.id));
    });

    if (closeBtn !== null) {
        closeBtn.addEventListener("click", () => dialog.close());
    }

    // Пошук реагує на кожне введення, чекбокси — на зміну стану.
    searchInput?.addEventListener("input", update);
    allergenBoxes.forEach((box) => box.addEventListener("change", update));

    // Перший малюнок: підміняємо статичні картки-фолбек тими самими, але
    // вже «живими». Без JS у розмітці лишаються статичні — сторінка робоча.
    update();
}
