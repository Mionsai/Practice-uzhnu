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
