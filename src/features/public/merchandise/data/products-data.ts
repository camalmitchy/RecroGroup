export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: "apparel" | "drinkware" | "accessories";
    image: string;
    colors?: string[];
    sizes?: string[];
    inStock: boolean;
};

export const products: Product[] = [
    // Apparel
    {
        id: "tshirt-logo-white",
        name: "Recro Logo T-Shirt - White",
        description: "Classic white cotton t-shirt with Recro Group logo",
        price: 1500,
        category: "apparel",
        image: "/assets/merchandise/tshirt-white.jpg",
        colors: ["White", "Black", "Green"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        inStock: true,
    },
    {
        id: "tshirt-logo-black",
        name: "Recro Logo T-Shirt - Black",
        description: "Premium black cotton t-shirt with Recro Group logo",
        price: 1500,
        category: "apparel",
        image: "/assets/merchandise/tshirt-black.jpg",
        colors: ["White", "Black", "Green"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        inStock: true,
    },
    {
        id: "tshirt-quote",
        name: "Healing Journey T-Shirt",
        description: "Inspirational quote t-shirt - 'Every journey begins with a single step'",
        price: 1800,
        category: "apparel",
        image: "/assets/merchandise/tshirt-quote.jpg",
        colors: ["Navy", "Gray", "White"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        inStock: true,
    },
    {
        id: "hoodie-logo",
        name: "Recro Comfort Hoodie",
        description: "Soft fleece hoodie with embroidered logo",
        price: 3500,
        category: "apparel",
        image: "/assets/merchandise/hoodie.jpg",
        colors: ["Black", "Navy", "Gray"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        inStock: true,
    },

    // Drinkware
    {
        id: "mug-ceramic-white",
        name: "Recro Ceramic Mug",
        description: "11oz ceramic mug with Recro Group logo",
        price: 800,
        category: "drinkware",
        image: "/assets/merchandise/mug-white.jpg",
        colors: ["White", "Black", "Green"],
        inStock: true,
    },
    {
        id: "mug-travel",
        name: "Stainless Steel Travel Mug",
        description: "Insulated 16oz travel mug - keeps drinks hot or cold",
        price: 1200,
        category: "drinkware",
        image: "/assets/merchandise/travel-mug.jpg",
        colors: ["Silver", "Black", "Green"],
        inStock: true,
    },
    {
        id: "water-bottle-sport",
        name: "Sports Water Bottle",
        description: "750ml BPA-free sports water bottle",
        price: 900,
        category: "drinkware",
        image: "/assets/merchandise/water-bottle.jpg",
        colors: ["Clear", "Blue", "Green", "Black"],
        inStock: true,
    },
    {
        id: "water-bottle-insulated",
        name: "Insulated Water Bottle",
        description: "1L insulated stainless steel water bottle",
        price: 1500,
        category: "drinkware",
        image: "/assets/merchandise/water-bottle-insulated.jpg",
        colors: ["Silver", "Black", "Green", "White"],
        inStock: true,
    },
    {
        id: "cup-set",
        name: "Recro Cup Set",
        description: "Set of 4 ceramic cups with Recro branding",
        price: 2000,
        category: "drinkware",
        image: "/assets/merchandise/cup-set.jpg",
        colors: ["Mixed"],
        inStock: true,
    },

    // Accessories
    {
        id: "backpack-classic",
        name: "Recro Backpack",
        description: "Durable canvas backpack with multiple compartments",
        price: 3000,
        category: "accessories",
        image: "/assets/merchandise/backpack.jpg",
        colors: ["Black", "Navy", "Gray"],
        inStock: true,
    },
    {
        id: "tote-bag",
        name: "Eco Tote Bag",
        description: "Sustainable cotton tote bag with Recro logo",
        price: 800,
        category: "accessories",
        image: "/assets/merchandise/tote-bag.jpg",
        colors: ["Natural", "Black", "Green"],
        inStock: true,
    },
    {
        id: "umbrella-compact",
        name: "Compact Umbrella",
        description: "Foldable umbrella with Recro Group branding",
        price: 1200,
        category: "accessories",
        image: "/assets/merchandise/umbrella.jpg",
        colors: ["Black", "Navy", "Green"],
        inStock: true,
    },
    {
        id: "notebook-journal",
        name: "Healing Journal",
        description: "Premium leather-bound journal with inspirational quotes",
        price: 1500,
        category: "accessories",
        image: "/assets/merchandise/journal.jpg",
        colors: ["Brown", "Black", "Green"],
        inStock: true,
    },
    {
        id: "cap-baseball",
        name: "Recro Baseball Cap",
        description: "Adjustable cotton baseball cap with embroidered logo",
        price: 1000,
        category: "accessories",
        image: "/assets/merchandise/cap.jpg",
        colors: ["Black", "Navy", "White", "Green"],
        inStock: true,
    },
    {
        id: "keychain",
        name: "Recro Keychain",
        description: "Metal keychain with Recro Group logo",
        price: 300,
        category: "accessories",
        image: "/assets/merchandise/keychain.jpg",
        colors: ["Silver", "Gold"],
        inStock: true,
    },
];

export const categories = [
    { id: "all", label: "All Products", value: "all" },
    { id: "apparel", label: "Apparel", value: "apparel" },
    { id: "drinkware", label: "Drinkware", value: "drinkware" },
    { id: "accessories", label: "Accessories", value: "accessories" },
];
