"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Filter, Search, Truck, CreditCard, Heart } from "lucide-react";
import { products, categories, type Product } from "../data/products-data";

export function MerchandisePage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
        [],
    );

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === "all" || product.category === selectedCategory;
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }
            return [...prevCart, { product, quantity: 1 }];
        });
    };

    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
            {/* Hero Section */}
            <section className="bg-primary-deep/5 py-16 md:py-20">
                <div className="container-page">
                    <div className="text-center">
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                            Recro Merchandise
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                            Support our mission while expressing your commitment to mental health
                            and healing. Quality products that make a difference.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter and Search Section */}
            <section className="border-b border-border bg-surface py-8">
                <div className="container-page">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-muted-foreground" />
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.value)}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedCategory === category.value
                                            ? "bg-primary-deep text-white"
                                            : "bg-muted text-muted-foreground hover:bg-primary-soft"
                                            }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-full border border-border bg-background py-2 pl-10 pr-4 text-sm transition focus:border-primary-deep focus:outline-none focus:ring-1 focus:ring-primary-deep"
                            />
                        </div>

                        {/* Cart Icon */}
                        <div className="relative">
                            <button className="flex items-center gap-2 rounded-full bg-primary-deep px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-deep/90">
                                <ShoppingCart size={18} />
                                Cart
                                {cartItemsCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-deep">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="bg-background py-12 md:py-16">
                <div className="container-page">
                    {filteredProducts.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-lg text-muted-foreground">
                                No products found matching your search.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 text-sm text-muted-foreground">
                                Showing {filteredProducts.length} product
                                {filteredProducts.length !== 1 ? "s" : ""}
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-square overflow-hidden bg-muted">
                                            <Image
                                                src={`https://placehold.co/600x600/e8f5e9/2d6a4f?text=${encodeURIComponent(product.name)}`}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                            {!product.inStock && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                                    <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex flex-1 flex-col p-5">
                                            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-deep">
                                                {product.category}
                                            </div>
                                            <h3 className="mb-2 line-clamp-2 font-serif text-lg font-semibold leading-snug text-foreground">
                                                {product.name}
                                            </h3>
                                            <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                                                {product.description}
                                            </p>

                                            {/* Colors */}
                                            {product.colors && product.colors.length > 0 && (
                                                <div className="mb-3">
                                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                        Colors: {product.colors.join(", ")}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Sizes */}
                                            {product.sizes && product.sizes.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                        Sizes: {product.sizes.join(", ")}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Price and Add to Cart */}
                                            <div className="flex items-center justify-between border-t border-border pt-4">
                                                <div>
                                                    <span className="text-2xl font-bold text-foreground">
                                                        KES {product.price.toLocaleString()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    disabled={!product.inStock}
                                                    className="rounded-full bg-primary-deep px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-deep/90 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Info Section */}
            <section className="border-t border-border bg-surface py-12 md:py-16">
                <div className="container-page">
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
                                    <Truck className="text-primary-deep" size={24} />
                                </div>
                            </div>
                            <h3 className="mb-2 font-semibold text-foreground">
                                Free Shipping
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Free delivery on orders over KES 5,000
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
                                    <CreditCard className="text-primary-deep" size={24} />
                                </div>
                            </div>
                            <h3 className="mb-2 font-semibold text-foreground">
                                Secure Payment
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                M-Pesa and card payments accepted
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
                                    <Heart className="text-primary-deep" size={24} />
                                </div>
                            </div>
                            <h3 className="mb-2 font-semibold text-foreground">
                                Support Our Mission
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Proceeds support mental health programs
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
