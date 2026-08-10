import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
    {
        name: "Dymatize Iso100 Hydrolyzed-2.3KG.-71Serv. strawberry",
        description:
            "Dymatize ISO100 Hydrolyzed Whey Protein Isolate is one of the world's fastest absorbing proteins. It helps support muscle recovery, lean muscle growth and post-workout performance.",
        price: 5550,
        oldPrice: 6800,
        category: "Protein",
        stock: 20,
        featured: true,
        rating: 4,
        reviewsCount: 0
    },

    {
        name: "Big Ramy Labs Red Rex Creatine -60Serv.-300G. -No Flavor",
        description:
            "Red Rex Creatine Monohydrate helps increase strength, power and muscle performance during high-intensity workouts.",
        price: 950,
        oldPrice: 1100,
        category: "Creatine",
        stock: 20,
        featured: true,
        rating: 4,
        reviewsCount: 0
    },

    {
        name: "Optimum Nutrition, Gold Standard® 100% Whey, Strawberry Banana, 5 lb",
        description:
            "Gold Standard 100% Whey is one of the world's best-selling protein powders, delivering premium whey protein for muscle growth and recovery.",
        price: 5400,
        oldPrice: 6500,
        category: "Protein",
        stock: 20,
        featured: true,
        rating: 5,
        reviewsCount: 0
    },

    {
        name: "Alpha Man Multi-Vitamin + Testosterone Support Muscleseed 60 Tablet",
        description:
            "Daily multivitamin formula designed to support overall health, energy production and natural testosterone levels.",
        price: 525,
        oldPrice: 635,
        category: "Vitamins",
        stock: 20,
        featured: true,
        rating: 5,
        reviewsCount: 0
    },

    {
        name: "Optimum Nutrition Serious Mass-16Serv.-5.4KG",
        description:
            "Serious Mass is a high-calorie weight gainer designed to help athletes and hard gainers increase muscle size and body weight.",
        price: 5850,
        oldPrice: 7200,
        category: "Mass Gainer",
        stock: 20,
        featured: true,
        rating: 5,
        reviewsCount: 0
    },

    {
        name: "DY Nutrition Monohydrate Creatine 60 Servings",
        description:
            "Premium creatine monohydrate formula to increase strength, endurance and workout performance.",
        price: 1450,
        oldPrice: 1890,
        category: "Creatine",
        stock: 20,
        featured: true,
        rating: 4,
        reviewsCount: 0
    },

    {
        name: "Cellucor C4 Ultimate Pre Workout Powder ICY Blue Razz",
        description:
            "C4 Ultimate is an advanced pre-workout formula designed to increase focus, energy and workout intensity.",
        price: 1150,
        oldPrice: 1600,
        category: "Pre Workout",
        stock: 20,
        featured: true,
        rating: 4,
        reviewsCount: 0
    },

    {
        name: "Muscleseeds Ultra Seed Mass Gainer-15Serv.-2.250G",
        description:
            "Ultra Seed Mass Gainer provides high calories, quality protein and carbohydrates to support healthy weight gain and muscle growth.",
        price: 990,
        oldPrice: 1300,
        category: "Mass Gainer",
        stock: 20,
        featured: true,
        rating: 5,
        reviewsCount: 0
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        const count = await Product.countDocuments();

        if (count > 0) {
            console.log(`Database already contains ${count} products.`);
            process.exit(0);
        }

        const createdProducts = await Product.insertMany(products);

        console.log(`${createdProducts.length} products inserted successfully.`);

        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

seedProducts();