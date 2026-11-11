"use strict";

// Тимчасово: перевірка, що скрипт підключився (прибрати в кінці роботи).
console.log("app.js підключено");

// Дані варіанта «Продукти здорового харчування».
// const тримає саме посилання на масив, а не його вміст — тому push,
// який міняє вміст, працює; заборонено лише переприсвоїти сам products.
const products = [
    {
        id: 1,
        title: "Мигдаль",
        calories: 579,                              // ккал на 100 г
        protein: 21,                                // г білка на 100 г
        category: "горіхи",
        origin: { country: "Іспанія", producer: "Valencia Nuts" },
        allergens: ["горіхи"],
        tags: ["вітамін E", "перекус", "кето"],
    },
    {
        id: 2,
        title: "Гречка",
        calories: 343,
        protein: 13,
        category: "крупи",
        origin: { country: "Україна", producer: "Сварог" },
        allergens: [],                              // без поширених алергенів
        tags: ["безглютенове", "залізо"],
    },
    {
        id: 3,
        title: "Насіння чіа",
        calories: 486,
        protein: 17,
        category: "насіння",
        origin: { country: "Мексика", producer: "Maya Fields" },
        allergens: [],
        tags: ["омега-3", "клітковина", "суперфуд"],
    },
    {
        id: 4,
        title: "Курага",
        calories: 241,
        protein: 3.4,
        category: "сухофрукти",
        origin: { country: "Туреччина", producer: "Anatolia" },
        allergens: ["діоксид сірки"],
        tags: ["калій", "перекус"],
    },
    {
        id: 5,
        title: "Хумус",
        calories: 166,
        protein: 8,
        category: "пасти та спреди",
        origin: { country: "Україна", producer: "EcoFood" },
        allergens: ["кунжут"],
        tags: ["веганське", "закуска"],
    },
    {
        id: 6,
        title: "Кіноа",
        calories: 368,
        protein: 14,
        category: "крупи",
        origin: { country: "Перу", producer: "Andes Harvest" },
        allergens: [],
        tags: ["безглютенове", "повноцінний білок", "залізо"],
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


// === Обробка даних ===

// Приймає масив продуктів, повертає масив готових рядків «№. назва — …».
function numberedList(items) {
    const lines = [];
    for (let i = 0; i < items.length; i++) {
        const p = items[i];
        lines.push(`${i + 1}. ${p.title} — ${p.category}, ${p.calories} ккал (${p.origin.country}, ${p.origin.producer})`);
    }
    return lines;
}


// === Вивід на сторінку ===

show("out-count", `Продуктів у каталозі: ${products.length}`);
show("out-numbered", numberedList(products));
