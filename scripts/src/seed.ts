import { db } from "@workspace/db";
import { productsTable, blogPostsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const GOLD_IMG = "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&q=80";
const GOLD_COIN_IMG = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80";
const SILVER_IMG = "https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=600&q=80";
const SILVER_COIN_IMG = "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80";
const PLATINUM_IMG = "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=600&q=80";
const COPPER_IMG = "https://images.unsplash.com/photo-1599707254554-027aeb4deacd?w=600&q=80";
const GOLD_BAR_IMG = "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?w=600&q=80";
const SILVER_BAR_IMG = "https://images.unsplash.com/photo-1637073849667-6b8a8a1bf073?w=600&q=80";

const products = [
  // Gold Coins
  {
    slug: "2026-american-gold-eagle-1oz",
    name: "2026 American Gold Eagle 1 oz",
    year: 2026,
    mint: "United States Mint",
    metalType: "gold",
    purity: ".9167",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "4735.48",
    premiumPct: "4.90",
    premiumAmt: "231.84",
    price: "4967.32",
    msrp: "5100.00",
    inStock: true,
    stockQty: 48,
    lowStockThreshold: 10,
    isOnSale: false,
    isFeatured: true,
    isNew: true,
    isIRAEligible: true,
    isNumismatic: false,
    images: [GOLD_COIN_IMG, GOLD_IMG],
    category: "Gold Coins",
    shortDescription: "The iconic American Gold Eagle, struck by the US Mint in 22-karat gold. The most trusted gold coin in America.",
    description: "The American Gold Eagle is the official gold bullion coin of the United States, produced by the US Mint since 1986. Struck from 22-karat gold (.9167 fine), each 1 oz coin contains a full troy ounce of gold. The obverse features Augustus Saint-Gaudens' iconic Lady Liberty design, while the reverse depicts a family of eagles by Miley Busiek-Frost.",
    rating: "4.9",
    reviewCount: 2847,
    specifications: { diameter: "32.70 mm", thickness: "2.87 mm", edgeType: "Reeded", designer: "Augustus Saint-Gaudens / Miley Busiek-Frost", obverse: "Lady Liberty with torch and olive branch", reverse: "Male eagle carrying an olive branch to nest" },
    grades: ["BU", "MS-69", "MS-70"],
    isIRAEligibleValue: true,
    assayCertificate: false,
    relatedProductIds: ["2026-american-gold-buffalo-1oz", "2026-gold-maple-leaf-1oz", "2026-american-gold-eagle-half-oz"],
  },
  {
    slug: "2026-american-gold-buffalo-1oz",
    name: "2026 American Gold Buffalo 1 oz",
    year: 2026,
    mint: "United States Mint",
    metalType: "gold",
    purity: ".9999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "4735.48",
    premiumPct: "4.20",
    premiumAmt: "198.89",
    price: "4934.37",
    msrp: "5050.00",
    inStock: true,
    stockQty: 35,
    isFeatured: true,
    isNew: true,
    isIRAEligible: true,
    images: [GOLD_COIN_IMG, GOLD_BAR_IMG],
    category: "Gold Coins",
    shortDescription: "America's first 24-karat gold coin. Pure .9999 fine gold with the classic Buffalo nickel design.",
    description: "The American Gold Buffalo is the United States' first 24-karat gold coin, introduced in 2006. Struck from .9999 fine gold, it bears James Earle Fraser's iconic Buffalo nickel design — one of the most beloved American coin designs ever created. IRA-eligible due to its .9999 purity.",
    rating: "4.9",
    reviewCount: 1923,
    specifications: { diameter: "32.69 mm", thickness: "3.00 mm", edgeType: "Reeded", designer: "James Earle Fraser", obverse: "Native American portrait", reverse: "American bison (Black Diamond)" },
    grades: ["BU", "MS-69", "MS-70"],
    isIRAEligible: true,
    assayCertificate: false,
    relatedProductIds: ["2026-american-gold-eagle-1oz", "2026-gold-maple-leaf-1oz"],
  },
  {
    slug: "2026-gold-maple-leaf-1oz",
    name: "2026 Gold Maple Leaf 1 oz",
    year: 2026,
    mint: "Royal Canadian Mint",
    metalType: "gold",
    purity: ".9999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "4735.48",
    premiumPct: "3.80",
    premiumAmt: "179.95",
    price: "4915.43",
    inStock: true,
    stockQty: 72,
    isFeatured: true,
    isNew: true,
    isIRAEligible: true,
    images: [GOLD_COIN_IMG, GOLD_IMG],
    category: "Gold Coins",
    shortDescription: "Canada's iconic .9999 fine gold coin. Radial lines and maple leaf design with anti-counterfeiting laser mark.",
    rating: "4.8",
    reviewCount: 1456,
    specifications: { diameter: "30.00 mm", thickness: "2.87 mm", edgeType: "Serrated", designer: "Walter Ott / Arnold Machin", obverse: "Queen Elizabeth II portrait", reverse: "Maple leaf with radial lines" },
    grades: ["BU"],
    assayCertificate: false,
    relatedProductIds: ["2026-american-gold-buffalo-1oz", "2026-gold-britannia-1oz"],
  },
  {
    slug: "2026-gold-britannia-1oz",
    name: "2026 Gold Britannia 1 oz",
    year: 2026,
    mint: "Royal Mint",
    metalType: "gold",
    purity: ".9999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "4735.48",
    premiumPct: "4.10",
    premiumAmt: "194.15",
    price: "4929.63",
    inStock: true,
    stockQty: 28,
    isNew: true,
    isIRAEligible: true,
    images: [GOLD_COIN_IMG],
    category: "Gold Coins",
    shortDescription: "Great Britain's premier gold coin. 24-karat fine gold featuring the timeless Britannia design.",
    rating: "4.8",
    reviewCount: 743,
    specifications: { diameter: "32.69 mm", thickness: "2.80 mm", edgeType: "Reeded", designer: "Philip Nathan", obverse: "King Charles III portrait", reverse: "Britannia standing with trident and shield" },
    relatedProductIds: ["2026-gold-maple-leaf-1oz", "2026-american-gold-eagle-1oz"],
  },
  {
    slug: "2026-south-african-krugerrand-1oz",
    name: "2026 South African Krugerrand 1 oz",
    year: 2026,
    mint: "South African Mint",
    metalType: "gold",
    purity: ".9167",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "4735.48",
    premiumPct: "3.50",
    premiumAmt: "165.74",
    price: "4901.22",
    inStock: true,
    stockQty: 55,
    isFeatured: true,
    images: [GOLD_COIN_IMG, GOLD_IMG],
    category: "Gold Coins",
    shortDescription: "The world's first modern gold bullion coin. Minted since 1967, the Krugerrand is recognized globally.",
    rating: "4.8",
    reviewCount: 2134,
    relatedProductIds: ["2026-american-gold-eagle-1oz", "2026-australian-kangaroo-1oz"],
  },
  {
    slug: "2026-australian-kangaroo-1oz",
    name: "2026 Australian Gold Kangaroo 1 oz",
    year: 2026,
    mint: "Perth Mint",
    metalType: "gold",
    purity: ".9999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "4735.48",
    premiumPct: "3.90",
    premiumAmt: "184.68",
    price: "4920.16",
    inStock: true,
    stockQty: 41,
    isNew: true,
    isIRAEligible: true,
    images: [GOLD_COIN_IMG],
    category: "Gold Coins",
    shortDescription: "Australia's iconic Perth Mint gold coin featuring a new kangaroo design each year. .9999 fine gold.",
    rating: "4.9",
    reviewCount: 987,
    relatedProductIds: ["2026-gold-maple-leaf-1oz", "2026-austrian-philharmonic-1oz"],
  },
  {
    slug: "2026-austrian-philharmonic-1oz",
    name: "2026 Austrian Philharmonic 1 oz Gold",
    year: 2026,
    mint: "Austrian Mint",
    metalType: "gold",
    purity: ".9999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "4735.48",
    premiumPct: "3.70",
    premiumAmt: "175.21",
    price: "4910.69",
    inStock: true,
    stockQty: 33,
    isIRAEligible: true,
    images: [GOLD_COIN_IMG],
    category: "Gold Coins",
    shortDescription: "Europe's best-selling gold coin. The Vienna Philharmonic features musical instruments in .9999 fine gold.",
    rating: "4.8",
    reviewCount: 812,
    relatedProductIds: ["2026-gold-maple-leaf-1oz", "2026-gold-britannia-1oz"],
  },
  {
    slug: "2026-american-gold-eagle-half-oz",
    name: "2026 American Gold Eagle 1/2 oz",
    year: 2026,
    mint: "United States Mint",
    metalType: "gold",
    purity: ".9167",
    weight: "0.5",
    weightUnit: "oz",
    spotPrice: "2367.74",
    premiumPct: "6.50",
    premiumAmt: "153.90",
    price: "2521.64",
    inStock: true,
    stockQty: 62,
    images: [GOLD_COIN_IMG],
    category: "Fractional Gold",
    shortDescription: "The half-ounce American Gold Eagle — perfect for those who want gold exposure with a lower entry point.",
    rating: "4.8",
    reviewCount: 445,
    relatedProductIds: ["2026-american-gold-eagle-1oz", "2026-american-gold-eagle-quarter-oz"],
  },
  {
    slug: "2026-american-gold-eagle-quarter-oz",
    name: "2026 American Gold Eagle 1/4 oz",
    year: 2026,
    mint: "United States Mint",
    metalType: "gold",
    purity: ".9167",
    weight: "0.25",
    weightUnit: "oz",
    spotPrice: "1183.87",
    premiumPct: "7.20",
    premiumAmt: "85.24",
    price: "1269.11",
    inStock: true,
    stockQty: 89,
    images: [GOLD_COIN_IMG],
    category: "Fractional Gold",
    shortDescription: "Quarter-ounce Gold Eagle — accessible gold investing with the prestige of the US Mint.",
    rating: "4.8",
    reviewCount: 334,
    relatedProductIds: ["2026-american-gold-eagle-1oz", "2026-american-gold-eagle-tenth-oz"],
  },
  {
    slug: "2026-american-gold-eagle-tenth-oz",
    name: "2026 American Gold Eagle 1/10 oz",
    year: 2026,
    mint: "United States Mint",
    metalType: "gold",
    purity: ".9167",
    weight: "0.1",
    weightUnit: "oz",
    spotPrice: "473.55",
    premiumPct: "9.50",
    premiumAmt: "44.99",
    price: "518.54",
    inStock: true,
    stockQty: 127,
    isFeatured: true,
    images: [GOLD_COIN_IMG],
    category: "Fractional Gold",
    shortDescription: "The most affordable Gold Eagle. Perfect for new investors or gifts. 1/10 oz of genuine US Mint gold.",
    rating: "4.9",
    reviewCount: 1283,
    isOnSale: true,
    saleLabel: "BEST VALUE",
    relatedProductIds: ["2026-american-gold-eagle-1oz", "1g-pamp-suisse-gold-bar"],
  },
  // Gold Bars
  {
    slug: "1-oz-valcambi-gold-bar",
    name: "1 oz Valcambi Gold Bar",
    year: 2026,
    mint: "Valcambi Suisse",
    metalType: "gold",
    purity: ".9999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "4735.48",
    premiumPct: "2.50",
    premiumAmt: "118.39",
    price: "4853.87",
    inStock: true,
    stockQty: 85,
    isFeatured: true,
    isIRAEligible: true,
    images: [GOLD_BAR_IMG, GOLD_IMG],
    category: "Gold Bars",
    shortDescription: "Swiss-made .9999 fine gold bar from Valcambi, one of the world's most respected refineries. Assay card included.",
    rating: "4.9",
    reviewCount: 1847,
    assayCertificate: true,
    specifications: { designer: "Valcambi SA", obverse: "Valcambi logo, weight, purity", reverse: "Serial number, assay certificate" },
    relatedProductIds: ["1-oz-perth-mint-gold-bar", "10-oz-valcambi-gold-bar"],
  },
  {
    slug: "1-oz-perth-mint-gold-bar",
    name: "1 oz Perth Mint Gold Bar",
    year: 2026,
    mint: "Perth Mint",
    metalType: "gold",
    purity: ".9999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "4735.48",
    premiumPct: "2.60",
    premiumAmt: "123.12",
    price: "4858.60",
    inStock: true,
    stockQty: 67,
    isIRAEligible: true,
    images: [GOLD_BAR_IMG],
    category: "Gold Bars",
    shortDescription: "The Australian government's Perth Mint gold bar — fully backed and hallmarked with serial number.",
    rating: "4.8",
    reviewCount: 924,
    assayCertificate: true,
    relatedProductIds: ["1-oz-valcambi-gold-bar", "10-oz-pamp-suisse-gold-bar"],
  },
  {
    slug: "1g-pamp-suisse-gold-bar",
    name: "1 g PAMP Suisse Gold Bar",
    mint: "PAMP Suisse",
    metalType: "gold",
    purity: ".9999",
    weight: "1",
    weightUnit: "g",
    spotPrice: "152.32",
    premiumPct: "22.00",
    premiumAmt: "33.51",
    price: "185.83",
    inStock: true,
    stockQty: 250,
    isFeatured: true,
    isNew: true,
    images: [GOLD_BAR_IMG],
    category: "Gram Gold Bars",
    shortDescription: "Swiss PAMP Suisse Lady Fortuna 1 gram gold bar in an assay card. The world's most gifted gold bar.",
    rating: "4.9",
    reviewCount: 3421,
    assayCertificate: true,
    isOnSale: false,
    relatedProductIds: ["5g-pamp-suisse-gold-bar", "10g-pamp-suisse-gold-bar"],
  },
  {
    slug: "5g-pamp-suisse-gold-bar",
    name: "5 g PAMP Suisse Gold Bar",
    mint: "PAMP Suisse",
    metalType: "gold",
    purity: ".9999",
    weight: "5",
    weightUnit: "g",
    spotPrice: "761.60",
    premiumPct: "15.00",
    premiumAmt: "114.24",
    price: "875.84",
    inStock: true,
    stockQty: 180,
    images: [GOLD_BAR_IMG],
    category: "Gram Gold Bars",
    shortDescription: "PAMP Suisse Lady Fortuna 5 gram gold bar. Perfect for portfolio diversification at an accessible price point.",
    rating: "4.8",
    reviewCount: 892,
    assayCertificate: true,
    relatedProductIds: ["1g-pamp-suisse-gold-bar", "10g-pamp-suisse-gold-bar"],
  },
  {
    slug: "10g-pamp-suisse-gold-bar",
    name: "10 g PAMP Suisse Gold Bar",
    mint: "PAMP Suisse",
    metalType: "gold",
    purity: ".9999",
    weight: "10",
    weightUnit: "g",
    spotPrice: "1523.20",
    premiumPct: "10.00",
    premiumAmt: "152.32",
    price: "1675.52",
    inStock: true,
    stockQty: 144,
    images: [GOLD_BAR_IMG],
    category: "Gram Gold Bars",
    shortDescription: "PAMP Suisse 10 gram gold bar — the perfect balance of value and accessibility.",
    rating: "4.8",
    reviewCount: 671,
    assayCertificate: true,
    relatedProductIds: ["5g-pamp-suisse-gold-bar", "1-oz-valcambi-gold-bar"],
  },
  {
    slug: "10-oz-valcambi-gold-bar",
    name: "10 oz Valcambi Gold Bar",
    mint: "Valcambi Suisse",
    metalType: "gold",
    purity: ".9999",
    weight: "10",
    weightUnit: "oz",
    spotPrice: "47354.80",
    premiumPct: "1.80",
    premiumAmt: "852.39",
    price: "48207.19",
    inStock: true,
    stockQty: 14,
    isIRAEligible: true,
    images: [GOLD_BAR_IMG],
    category: "Gold Bars",
    shortDescription: "10 troy oz Valcambi gold bar — serious wealth storage at the lowest possible premium per ounce.",
    rating: "4.9",
    reviewCount: 287,
    assayCertificate: true,
    relatedProductIds: ["1-oz-valcambi-gold-bar", "kilo-gold-bar-pamp-suisse"],
  },
  {
    slug: "10-oz-pamp-suisse-gold-bar",
    name: "10 oz PAMP Suisse Gold Bar",
    mint: "PAMP Suisse",
    metalType: "gold",
    purity: ".9999",
    weight: "10",
    weightUnit: "oz",
    spotPrice: "47354.80",
    premiumPct: "1.85",
    premiumAmt: "876.06",
    price: "48230.86",
    inStock: true,
    stockQty: 9,
    isIRAEligible: true,
    isOnSale: true,
    saleLabel: "VAULT SPECIAL",
    images: [GOLD_BAR_IMG],
    category: "Gold Bars",
    shortDescription: "Premium PAMP Suisse 10 oz gold bar with Lady Fortuna design. Comes with assay card.",
    rating: "4.9",
    reviewCount: 198,
    assayCertificate: true,
    relatedProductIds: ["10-oz-valcambi-gold-bar", "kilo-gold-bar-pamp-suisse"],
  },
  {
    slug: "kilo-gold-bar-pamp-suisse",
    name: "1 kg PAMP Suisse Gold Bar (32.15 oz)",
    mint: "PAMP Suisse",
    metalType: "gold",
    purity: ".9999",
    weight: "32.15",
    weightUnit: "oz",
    spotPrice: "152244.69",
    premiumPct: "1.20",
    premiumAmt: "1826.94",
    price: "154071.63",
    inStock: true,
    stockQty: 4,
    isIRAEligible: true,
    images: [GOLD_BAR_IMG],
    category: "Kilo Gold Bars",
    shortDescription: "The ultimate wealth storage asset — 1 kilogram of .9999 fine gold from the world's premier refinery.",
    rating: "5.0",
    reviewCount: 87,
    assayCertificate: true,
    relatedProductIds: ["10-oz-valcambi-gold-bar", "1-oz-valcambi-gold-bar"],
  },
  // Silver Coins
  {
    slug: "2026-american-silver-eagle-1oz",
    name: "2026 American Silver Eagle 1 oz",
    year: 2026,
    mint: "United States Mint",
    metalType: "silver",
    purity: ".999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "76.42",
    premiumPct: "22.00",
    premiumAmt: "16.81",
    price: "93.23",
    inStock: true,
    stockQty: 847,
    isFeatured: true,
    isNew: true,
    isIRAEligible: true,
    images: [SILVER_COIN_IMG, SILVER_IMG],
    category: "Silver Coins",
    shortDescription: "America's official silver bullion coin. The most recognized and widely traded silver coin in the world.",
    description: "The American Silver Eagle is the official silver bullion coin of the United States, produced annually by the US Mint since 1986. Each coin contains exactly one troy ounce of .999 fine silver and is backed by the US government for weight and purity.",
    rating: "4.9",
    reviewCount: 8234,
    specifications: { diameter: "40.60 mm", thickness: "2.98 mm", edgeType: "Reeded", designer: "Adolph A. Weinman / Emily Damstra", obverse: "Walking Liberty", reverse: "Heraldic eagle with shield" },
    grades: ["BU", "MS-69", "MS-70"],
    assayCertificate: false,
    relatedProductIds: ["2026-silver-maple-leaf-1oz", "2026-silver-britannia-1oz", "tube-american-silver-eagles-20"],
  },
  {
    slug: "tube-american-silver-eagles-20",
    name: "2026 American Silver Eagles (20 Coin Roll)",
    year: 2026,
    mint: "United States Mint",
    metalType: "silver",
    purity: ".999",
    weight: "20",
    weightUnit: "oz",
    spotPrice: "1528.40",
    premiumPct: "20.00",
    premiumAmt: "305.68",
    price: "1834.08",
    inStock: true,
    stockQty: 124,
    isFeatured: true,
    isOnSale: true,
    saleLabel: "BEST VALUE",
    images: [SILVER_COIN_IMG],
    category: "Silver Coins",
    shortDescription: "Factory-sealed roll of 20 American Silver Eagles directly from the US Mint. Best value per coin.",
    rating: "4.9",
    reviewCount: 3421,
    relatedProductIds: ["2026-american-silver-eagle-1oz", "monster-box-500-american-silver-eagles"],
  },
  {
    slug: "2026-silver-maple-leaf-1oz",
    name: "2026 Silver Maple Leaf 1 oz",
    year: 2026,
    mint: "Royal Canadian Mint",
    metalType: "silver",
    purity: ".9999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "76.42",
    premiumPct: "18.00",
    premiumAmt: "13.76",
    price: "90.18",
    inStock: true,
    stockQty: 612,
    isNew: true,
    isIRAEligible: true,
    images: [SILVER_COIN_IMG],
    category: "Silver Coins",
    shortDescription: "Canada's iconic .9999 fine silver coin. The purest silver coin from a major government mint.",
    rating: "4.8",
    reviewCount: 3892,
    relatedProductIds: ["2026-american-silver-eagle-1oz", "2026-silver-britannia-1oz"],
  },
  {
    slug: "2026-silver-britannia-1oz",
    name: "2026 Silver Britannia 1 oz",
    year: 2026,
    mint: "Royal Mint",
    metalType: "silver",
    purity: ".999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "76.42",
    premiumPct: "19.50",
    premiumAmt: "14.90",
    price: "91.32",
    inStock: true,
    stockQty: 389,
    images: [SILVER_COIN_IMG],
    category: "Silver Coins",
    shortDescription: "Great Britain's premium silver bullion coin featuring the iconic Britannia. Legal tender backed by the Crown.",
    rating: "4.8",
    reviewCount: 1567,
    relatedProductIds: ["2026-silver-maple-leaf-1oz", "2026-american-silver-eagle-1oz"],
  },
  {
    slug: "2026-silver-krugerrand-1oz",
    name: "2026 Silver Krugerrand 1 oz",
    year: 2026,
    mint: "South African Mint",
    metalType: "silver",
    purity: ".999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "76.42",
    premiumPct: "21.00",
    premiumAmt: "16.05",
    price: "92.47",
    inStock: true,
    stockQty: 245,
    images: [SILVER_COIN_IMG],
    category: "Silver Coins",
    shortDescription: "The silver version of the world's most famous bullion coin. Features the iconic Springbok antelope design.",
    rating: "4.8",
    reviewCount: 892,
    relatedProductIds: ["2026-american-silver-eagle-1oz", "2026-silver-maple-leaf-1oz"],
  },
  {
    slug: "2026-chinese-silver-panda-30g",
    name: "2026 Chinese Silver Panda 30 g",
    year: 2026,
    mint: "China Mint",
    metalType: "silver",
    purity: ".999",
    weight: "30",
    weightUnit: "g",
    spotPrice: "73.63",
    premiumPct: "28.00",
    premiumAmt: "20.62",
    price: "94.25",
    inStock: true,
    stockQty: 167,
    isNew: true,
    images: [SILVER_COIN_IMG],
    category: "Silver Coins",
    shortDescription: "China's beloved panda coin with a unique design each year. Highly collectible .999 fine silver.",
    rating: "4.9",
    reviewCount: 678,
    relatedProductIds: ["2026-silver-maple-leaf-1oz", "2026-american-silver-eagle-1oz"],
  },
  // Silver Bars
  {
    slug: "10-oz-silver-bar-sunshine-mint",
    name: "10 oz Silver Bar — Sunshine Mint",
    mint: "Sunshine Mint",
    metalType: "silver",
    purity: ".999",
    weight: "10",
    weightUnit: "oz",
    spotPrice: "764.20",
    premiumPct: "8.00",
    premiumAmt: "61.14",
    price: "825.34",
    inStock: true,
    stockQty: 234,
    isFeatured: true,
    isIRAEligible: true,
    images: [SILVER_BAR_IMG, SILVER_IMG],
    category: "Silver Bars",
    shortDescription: "10 troy oz .999 fine silver bar from Sunshine Mint. Lowest premium per ounce on silver bars.",
    rating: "4.8",
    reviewCount: 2341,
    assayCertificate: false,
    relatedProductIds: ["100-oz-silver-bar-sunshine-mint", "kilo-silver-bar"],
  },
  {
    slug: "100-oz-silver-bar-sunshine-mint",
    name: "100 oz Silver Bar — Sunshine Mint",
    mint: "Sunshine Mint",
    metalType: "silver",
    purity: ".999",
    weight: "100",
    weightUnit: "oz",
    spotPrice: "7642.00",
    premiumPct: "4.50",
    premiumAmt: "343.89",
    price: "7985.89",
    inStock: true,
    stockQty: 38,
    isIRAEligible: true,
    images: [SILVER_BAR_IMG],
    category: "Silver Bars",
    shortDescription: "100 troy ounces of .999 fine silver. Optimal for serious silver stackers looking for lowest premiums.",
    rating: "4.9",
    reviewCount: 876,
    assayCertificate: false,
    relatedProductIds: ["10-oz-silver-bar-sunshine-mint", "kilo-silver-bar"],
  },
  {
    slug: "kilo-silver-bar",
    name: "1 kg Silver Bar — PAMP Suisse",
    mint: "PAMP Suisse",
    metalType: "silver",
    purity: ".999",
    weight: "32.15",
    weightUnit: "oz",
    spotPrice: "2457.30",
    premiumPct: "6.00",
    premiumAmt: "147.44",
    price: "2604.74",
    inStock: true,
    stockQty: 52,
    isIRAEligible: true,
    images: [SILVER_BAR_IMG],
    category: "Silver Bars",
    shortDescription: "1 kilogram PAMP Suisse silver bar. Premium Swiss quality at competitive pricing for the serious stacker.",
    rating: "4.8",
    reviewCount: 445,
    assayCertificate: true,
    relatedProductIds: ["100-oz-silver-bar-sunshine-mint", "10-oz-silver-bar-sunshine-mint"],
  },
  // Junk Silver
  {
    slug: "90-percent-silver-bag-100-face",
    name: "90% Silver $100 Face Value Bag — Mixed Coins",
    metalType: "silver",
    purity: ".900",
    weight: "71.5",
    weightUnit: "oz",
    spotPrice: "5464.03",
    premiumPct: "3.20",
    premiumAmt: "174.85",
    price: "5638.88",
    inStock: true,
    stockQty: 23,
    isFeatured: true,
    isOnSale: true,
    saleLabel: "DEAL",
    images: [SILVER_COIN_IMG],
    category: "Junk Silver",
    shortDescription: "$100 face value bag of pre-1965 US 90% silver coins. Dimes, quarters, and half-dollars included.",
    description: "Constitutional silver — pre-1965 US coins containing 90% silver. These bags contain a mix of dimes, quarters, and half-dollars. Each $100 face value contains approximately 71.5 troy ounces of actual silver content.",
    rating: "4.8",
    reviewCount: 1234,
    relatedProductIds: ["90-percent-silver-bag-10-face", "2026-american-silver-eagle-1oz"],
  },
  {
    slug: "90-percent-silver-bag-10-face",
    name: "90% Silver $10 Face Value Bag",
    metalType: "silver",
    purity: ".900",
    weight: "7.15",
    weightUnit: "oz",
    spotPrice: "546.40",
    premiumPct: "4.50",
    premiumAmt: "24.59",
    price: "570.99",
    inStock: true,
    stockQty: 156,
    images: [SILVER_COIN_IMG],
    category: "Junk Silver",
    shortDescription: "$10 face value bag of pre-1965 90% silver coins. Perfect for barter prep or silver stacking.",
    rating: "4.7",
    reviewCount: 678,
    relatedProductIds: ["90-percent-silver-bag-100-face", "2026-american-silver-eagle-1oz"],
  },
  // Monster Box
  {
    slug: "monster-box-500-american-silver-eagles",
    name: "2026 Monster Box — 500 American Silver Eagles",
    year: 2026,
    mint: "United States Mint",
    metalType: "silver",
    purity: ".999",
    weight: "500",
    weightUnit: "oz",
    spotPrice: "38210.00",
    premiumPct: "18.00",
    premiumAmt: "6877.80",
    price: "45087.80",
    inStock: true,
    stockQty: 8,
    isFeatured: true,
    isIRAEligible: true,
    images: [SILVER_COIN_IMG, SILVER_IMG],
    category: "Monster Box",
    shortDescription: "Official US Mint sealed box of 500 American Silver Eagles (25 rolls of 20). Direct from the mint, never opened.",
    rating: "5.0",
    reviewCount: 342,
    assayCertificate: false,
    relatedProductIds: ["tube-american-silver-eagles-20", "2026-american-silver-eagle-1oz"],
  },
  // Silver Rounds
  {
    slug: "buffalo-silver-round-1oz",
    name: "1 oz Silver Buffalo Round",
    metalType: "silver",
    purity: ".999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "76.42",
    premiumPct: "12.00",
    premiumAmt: "9.17",
    price: "85.59",
    inStock: true,
    stockQty: 892,
    isFeatured: true,
    isOnSale: true,
    saleLabel: "BEST VALUE",
    images: [SILVER_COIN_IMG],
    category: "Silver Rounds",
    shortDescription: "Classic Buffalo design silver round. Lowest premium silver round available. .999 fine silver.",
    rating: "4.7",
    reviewCount: 4521,
    relatedProductIds: ["morgan-silver-round-1oz", "2026-american-silver-eagle-1oz"],
  },
  {
    slug: "morgan-silver-round-1oz",
    name: "1 oz Silver Morgan Dollar Design Round",
    metalType: "silver",
    purity: ".999",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "76.42",
    premiumPct: "13.00",
    premiumAmt: "9.93",
    price: "86.35",
    inStock: true,
    stockQty: 673,
    images: [SILVER_COIN_IMG],
    category: "Silver Rounds",
    shortDescription: "Classic Morgan Dollar design struck in .999 fine silver. A beloved collector design at bullion pricing.",
    rating: "4.7",
    reviewCount: 2198,
    relatedProductIds: ["buffalo-silver-round-1oz", "2026-american-silver-eagle-1oz"],
  },
  // Platinum
  {
    slug: "2026-american-platinum-eagle-1oz",
    name: "2026 American Platinum Eagle 1 oz",
    year: 2026,
    mint: "United States Mint",
    metalType: "platinum",
    purity: ".9995",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "2029.30",
    premiumPct: "8.50",
    premiumAmt: "172.49",
    price: "2201.79",
    inStock: true,
    stockQty: 28,
    isFeatured: true,
    isNew: true,
    isIRAEligible: true,
    images: [PLATINUM_IMG],
    category: "Platinum Coins",
    shortDescription: "The only platinum bullion coin produced by the US Mint. .9995 fine platinum, legal tender coin.",
    rating: "4.9",
    reviewCount: 456,
    specifications: { diameter: "32.70 mm", designer: "John Mercanti", obverse: "Statue of Liberty", reverse: "Eagle in flight" },
    relatedProductIds: ["1-oz-platinum-bar-pamp-suisse", "2026-american-palladium-eagle-1oz"],
  },
  {
    slug: "1-oz-platinum-bar-pamp-suisse",
    name: "1 oz PAMP Suisse Platinum Bar",
    mint: "PAMP Suisse",
    metalType: "platinum",
    purity: ".9995",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "2029.30",
    premiumPct: "5.50",
    premiumAmt: "111.61",
    price: "2140.91",
    inStock: true,
    stockQty: 19,
    isIRAEligible: true,
    images: [PLATINUM_IMG],
    category: "Platinum Bars",
    shortDescription: "Swiss-refined .9995 fine platinum bar from PAMP Suisse. Assay card included. IRA eligible.",
    rating: "4.8",
    reviewCount: 234,
    assayCertificate: true,
    relatedProductIds: ["2026-american-platinum-eagle-1oz"],
  },
  // Palladium
  {
    slug: "2026-american-palladium-eagle-1oz",
    name: "2026 American Palladium Eagle 1 oz",
    year: 2026,
    mint: "United States Mint",
    metalType: "palladium",
    purity: ".9995",
    weight: "1",
    weightUnit: "oz",
    spotPrice: "1524.44",
    premiumPct: "12.00",
    premiumAmt: "182.93",
    price: "1707.37",
    inStock: true,
    stockQty: 18,
    isNew: true,
    isIRAEligible: true,
    images: [PLATINUM_IMG],
    category: "Palladium Coins",
    shortDescription: "The US Mint's palladium coin — one of the rarest and most exclusive American bullion coins ever produced.",
    rating: "4.9",
    reviewCount: 198,
    relatedProductIds: ["2026-american-platinum-eagle-1oz"],
  },
  // Copper
  {
    slug: "1-oz-copper-buffalo-round",
    name: "1 oz Copper Buffalo Round",
    metalType: "copper",
    purity: ".999",
    weight: "1",
    weightUnit: "oz",
    price: "2.89",
    inStock: true,
    stockQty: 2400,
    isFeatured: true,
    images: [COPPER_IMG],
    category: "Copper Rounds",
    shortDescription: "Classic Buffalo design in .999 pure copper. A fun and affordable way to start stacking metals.",
    rating: "4.6",
    reviewCount: 3421,
    relatedProductIds: ["1-oz-copper-indian-head-round"],
  },
  {
    slug: "1-oz-copper-indian-head-round",
    name: "1 oz Copper Indian Head Round",
    metalType: "copper",
    purity: ".999",
    weight: "1",
    weightUnit: "oz",
    price: "2.89",
    inStock: true,
    stockQty: 1850,
    images: [COPPER_IMG],
    category: "Copper Rounds",
    shortDescription: "Classic Indian Head / Buffalo nickel design in pure copper. Great for gifts and new stackers.",
    rating: "4.6",
    reviewCount: 2187,
    relatedProductIds: ["1-oz-copper-buffalo-round"],
  },
  // Goldbacks
  {
    slug: "nevada-goldback-50",
    name: "Nevada 50 Goldback — Voluntas",
    metalType: "gold",
    purity: ".9999",
    weight: "0.05",
    weightUnit: "oz",
    spotPrice: "236.77",
    premiumPct: "35.00",
    premiumAmt: "82.87",
    price: "319.64",
    inStock: true,
    stockQty: 89,
    isNew: true,
    images: [GOLD_IMG],
    category: "Goldbacks",
    shortDescription: "50 Goldback Nevada note containing 1/20 troy oz of 24-karat gold. Legal spendable currency in select states.",
    rating: "4.7",
    reviewCount: 234,
    relatedProductIds: ["nevada-goldback-25", "wyoming-goldback-50"],
  },
  {
    slug: "nevada-goldback-25",
    name: "Nevada 25 Goldback — Libertas",
    metalType: "gold",
    purity: ".9999",
    weight: "0.025",
    weightUnit: "oz",
    spotPrice: "118.39",
    premiumPct: "40.00",
    premiumAmt: "47.35",
    price: "165.74",
    inStock: true,
    stockQty: 134,
    images: [GOLD_IMG],
    category: "Goldbacks",
    shortDescription: "25 Goldback Nevada note with 1/40 oz of 24-karat gold. Spendable gold currency in an artistic format.",
    rating: "4.7",
    reviewCount: 178,
    relatedProductIds: ["nevada-goldback-50"],
  },
  {
    slug: "wyoming-goldback-50",
    name: "Wyoming 50 Goldback — Industria",
    metalType: "gold",
    purity: ".9999",
    weight: "0.05",
    weightUnit: "oz",
    spotPrice: "236.77",
    premiumPct: "36.00",
    premiumAmt: "85.24",
    price: "322.01",
    inStock: true,
    stockQty: 67,
    isNew: true,
    images: [GOLD_IMG],
    category: "Goldbacks",
    shortDescription: "Wyoming 50 Goldback featuring state-themed artwork. 1/20 oz of 24-karat gold in a beautiful banknote format.",
    rating: "4.8",
    reviewCount: 145,
    relatedProductIds: ["nevada-goldback-50", "nevada-goldback-25"],
  },
];

const blogPosts = [
  {
    slug: "gold-price-forecast-2026",
    title: "Gold Price Forecast 2026: What Analysts Are Saying",
    excerpt: "Major financial institutions and precious metals analysts weigh in on where gold is headed in 2026, with price targets ranging from $4,500 to $6,000 per ounce.",
    content: `# Gold Price Forecast 2026: What Analysts Are Saying

The gold market has been on an extraordinary run, and analysts across Wall Street and the precious metals industry are weighing in on what comes next. With gold trading above $4,700 per ounce in early 2026, the question on every investor's mind is: how much higher can it go?

## The Bull Case for Gold in 2026

Goldman Sachs recently raised its 12-month gold price target to $5,200 per ounce, citing three key drivers: continued central bank buying, persistent inflation concerns, and geopolitical uncertainty. "We see structural demand from central banks continuing to support prices," their commodities team wrote in a recent note.

Bank of America's precious metals team is even more bullish, projecting gold could reach $6,000 by year-end if the Federal Reserve cuts rates more aggressively than expected. "Gold thrives in a lower real yield environment," their analysts note.

## Central Bank Buying Remains the Key Driver

Central banks purchased over 1,000 tonnes of gold in 2025, the third consecutive year of record buying. China, Poland, Turkey, and India have all been aggressive buyers, seeking to diversify away from US dollar reserves. This structural demand floor is something bulls point to as a key differentiator from previous gold rallies.

## What the Bears Are Saying

Not everyone is as optimistic. JPMorgan's commodities desk points to the possibility of a stronger dollar and slowing inflation as potential headwinds. "Gold at these levels has priced in a lot of the positive news," they caution.

## How to Position Your Portfolio

For investors looking to capitalize on gold's potential upside, physical bullion remains the most direct exposure. Gold ETFs and mining stocks offer leverage but also carry additional risks. Most financial advisors suggest allocating 5-15% of a portfolio to precious metals as a hedge.

*Disclaimer: This article is for informational purposes only and does not constitute investment advice.*`,
    author: "Marcus T. Wellington, Senior Market Analyst",
    category: "Market Analysis",
    tags: ["gold", "forecast", "investment", "market analysis"],
    readTime: 6,
    image: GOLD_BAR_IMG,
  },
  {
    slug: "american-silver-eagle-vs-canadian-maple-leaf",
    title: "American Silver Eagle vs Canadian Maple Leaf: Which Should You Buy?",
    excerpt: "Two of the world's most popular silver coins go head-to-head. We compare purity, premiums, liquidity, and collectibility to help you decide.",
    content: `# American Silver Eagle vs Canadian Maple Leaf: Which Should You Buy?

When it comes to buying silver coins, two names dominate the market: the American Silver Eagle and the Canadian Silver Maple Leaf. Both are government-minted, both are beloved by investors and collectors, but they have meaningful differences that may matter to your investment strategy.

## Purity: Maple Leaf Wins (Slightly)

The Canadian Silver Maple Leaf is struck in .9999 fine silver — four nines pure, the highest purity available in a major government coin. The American Silver Eagle contains .999 fine silver — three nines pure. In practice, this difference is minimal, but the Maple Leaf's purity claim is unmatched.

## Design: Eagle Gets More Votes

The Walking Liberty design on the obverse of the American Silver Eagle, originally created by Adolph A. Weinman in 1916, is widely considered one of the most beautiful coin designs in American history. The 2021 redesign of the reverse maintained this heritage. The Maple Leaf's design is elegant but simpler.

## Premiums: Maple Leaf Often Wins

Canadian Silver Maple Leafs typically carry slightly lower premiums over spot than American Silver Eagles. This is because Canadian Mint production costs are lower and the coin is not required to be struck from domestically mined silver (as Eagle production requires by law).

## Liquidity: Eagle is King in the US

If you're buying silver in the United States, the American Silver Eagle is universally recognized. Every coin shop, pawn shop, and precious metals dealer will immediately identify and accept Eagles at fair prices. Maple Leafs are nearly as liquid but slightly less familiar to some smaller dealers.

## The Verdict

For US investors primarily: **American Silver Eagle** — better domestic liquidity and iconic status.
For international buyers or those prioritizing purity: **Canadian Silver Maple Leaf** — slightly higher purity and often lower premiums.

For the best portfolio, many investors hold both.`,
    author: "Sarah K. Forsythe, Precious Metals Specialist",
    category: "Buying Guide",
    tags: ["silver", "silver eagles", "maple leaf", "comparison", "buying guide"],
    readTime: 7,
    image: SILVER_COIN_IMG,
  },
  {
    slug: "how-to-store-gold-and-silver-at-home",
    title: "How to Store Gold and Silver at Home Safely",
    excerpt: "Proper storage is critical to protecting your precious metals investment. Learn professional-grade strategies for securing gold and silver at home.",
    content: `# How to Store Gold and Silver at Home Safely

You've made the smart decision to invest in physical precious metals. Now comes a critical question: where do you keep them? Home storage offers direct access and control, but requires proper security measures to protect your investment.

## The Three Threats to Your Metals

Before choosing a storage solution, understand what you're protecting against:
1. **Theft** — The most common threat. Burglars specifically target precious metals.
2. **Fire** — A house fire can reach 1,100°F, hot enough to melt silver coins.
3. **Loss** — Poorly documented collections sometimes simply "disappear" when estates are settled.

## Home Safe Options

### Budget: Bolted Floor Safe ($200-$800)
A basic floor safe bolted to the concrete sub-floor offers solid protection against opportunistic theft. Look for safes rated UL-listed for residential security with a concrete anchor. Limitation: most are not fire-rated.

### Mid-Range: Heavy Fireproof Safe ($800-$3,000)
Combination fire and security safes provide both protection types. Look for at least 30-minute fire rating at 1,200°F and a minimum 500 lb weight (harder to carry away). The Liberty Safe Colonial series and Fort Knox Defender are excellent options.

### Premium: In-Ground Vault Safe ($3,000-$10,000)
Built into a concrete floor during construction or renovation, these are nearly impossible to remove and offer the highest security. Brands like Brown Safe and American Security lead this category.

## Best Practices

- **Don't tell anyone** — Not friends, not family. Loose lips sink ships (and empty safes).
- **Keep an inventory** — Document your holdings with photos and serial numbers, stored separately (or in cloud storage).
- **Consider a decoy safe** — A small, visible safe with minimal contents may satisfy a burglar. Your main safe stays hidden.
- **Insure your metals** — Standard homeowner's insurance has very low limits for precious metals (often $1,000-$2,500). Specialty precious metals insurance from companies like Collectibles International covers full market value.

## Alternatives to Home Storage

Consider our secure storage partners for holdings above $25,000. Insured vault storage costs roughly 0.1-0.15% annually and provides bank-grade security without the home risk.`,
    author: "David R. Blackthorne, Security Consultant",
    category: "Storage Guide",
    tags: ["storage", "security", "home storage", "safe", "precious metals"],
    readTime: 8,
    image: GOLD_BAR_IMG,
  },
  {
    slug: "what-is-junk-silver-and-why-preppers-love-it",
    title: "What is Junk Silver and Why Preppers Love It",
    excerpt: "Constitutional silver — pre-1965 US coins with 90% silver content — offers unique advantages for survivalists and value-focused investors alike.",
    content: `# What is Junk Silver and Why Preppers Love It

Despite its unflattering name, "junk silver" is anything but junk. Constitutional silver — as it's formally known — refers to pre-1965 US coins that contain 90% silver. These coins (dimes, quarters, half-dollars, and some dollars) were produced before the US government removed silver from circulating coinage.

## What Qualifies as Junk Silver?

The following coins are considered constitutional/junk silver:
- **Mercury Dimes** (pre-1965): 90% silver, $0.10 face
- **Roosevelt Dimes** (1946-1964): 90% silver, $0.10 face
- **Washington Quarters** (1932-1964): 90% silver, $0.25 face
- **Standing Liberty Quarters** (pre-1930): 90% silver
- **Franklin Half-Dollars** (1948-1963): 90% silver, $0.50 face
- **Kennedy Half-Dollars** (1964): 90% silver, $0.50 face
- **Morgan Dollars** (1878-1921): 90% silver, $1.00 face
- **Peace Dollars** (1921-1935): 90% silver, $1.00 face

## The Math: How Much Silver Is in a Bag?

A $1 face value of pre-1965 90% silver coins contains approximately 0.715 troy ounces of silver. Therefore:
- $10 face value = ~7.15 troy oz silver
- $100 face value = ~71.5 troy oz silver
- $1,000 face value = ~715 troy oz silver

## Why Preppers and Survivalists Love It

**Divisibility** — Unlike a 1 oz gold coin worth nearly $5,000, a silver dime is worth about $5. In a barter economy, small denominations matter enormously.

**Recognizability** — Every American knows what a dime looks like. No one needs to verify a coin they grew up with. Junk silver is instantly verifiable without any special equipment.

**Historical precedent** — These coins circulated as money within living memory. In a severe economic disruption, their monetary character would be widely understood.

**Low premiums** — Junk silver often carries lower premiums over spot than modern bullion coins, making it cost-effective to accumulate.

## The Investment Case (Beyond Prepping)

Constitutional silver is also a legitimate investment vehicle for conventional investors. Its low premiums make it an efficient way to hold physical silver, and its historical numismatic appeal provides some floor support beyond pure melt value.`,
    author: "James A. MacReady, Precious Metals Educator",
    category: "Investor Education",
    tags: ["junk silver", "constitutional silver", "prepper", "silver investing", "90% silver"],
    readTime: 7,
    image: SILVER_COIN_IMG,
  },
  {
    slug: "gold-ira-vs-401k-which-is-better-for-retirement",
    title: "Gold IRA vs 401k: Which is Better for Retirement?",
    excerpt: "Should you move your retirement savings into a Gold IRA? We break down the pros, cons, fees, and scenarios where each option makes sense.",
    content: `# Gold IRA vs 401k: Which is Better for Retirement?

With gold trading above $4,700 per ounce and stock market volatility at multi-year highs, many Americans are asking whether their 401k is truly safe. The Gold IRA has emerged as a popular alternative — but is it right for you?

## What is a Gold IRA?

A Gold IRA (Individual Retirement Account) is a self-directed IRA that allows you to hold physical precious metals instead of (or in addition to) traditional securities. The IRS permits gold, silver, platinum, and palladium bullion and coins meeting specific purity requirements.

**IRS-approved metals include:**
- Gold: .995+ purity (American Gold Eagles at .9167 are grandfathered)
- Silver: .999+ purity
- Platinum: .9995+ purity
- Palladium: .9995+ purity

## The Case FOR a Gold IRA

**Inflation protection** — Gold has maintained purchasing power over centuries while fiat currencies erode. A gold allocation preserves wealth in inflationary environments.

**Portfolio diversification** — Gold has low or negative correlation with stocks and bonds, meaning it often rises when other assets fall.

**Tangible asset** — Unlike stocks or bonds, physical gold cannot go bankrupt, default, or dilute to zero.

**Tax advantages** — Traditional Gold IRAs offer the same tax-deferred growth as conventional IRAs.

## The Case AGAINST a Gold IRA

**Higher fees** — Gold IRAs require custodians and secure storage facilities. Annual fees of $200-$500 are typical, versus near-zero for many 401k plans.

**No income generation** — Gold pays no dividends or interest. A 401k invested in dividend stocks or bond funds generates income; gold's return is purely price appreciation.

**Contribution limits** — Both traditional and Roth IRA limits apply ($7,000/year in 2026, or $8,000 if over 50). A 401k allows $23,500/year.

## The Verdict

Most financial advisors recommend a **diversified approach**: maintain your primary retirement savings in a well-diversified 401k, while allocating 5-20% to a Gold IRA for inflation protection and portfolio insurance.

Contact our IRA specialists at 1-800-GOLD-NOW to discuss your specific situation and get a free portfolio analysis.`,
    author: "Patricia M. Goldstein, CFP",
    category: "Retirement Planning",
    tags: ["gold IRA", "401k", "retirement", "investing", "IRA"],
    readTime: 9,
    image: GOLD_BAR_IMG,
  },
];

async function seed() {
  console.log("Seeding products...");
  
  // Clear existing data
  await db.execute(sql`TRUNCATE TABLE products RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE blog_posts RESTART IDENTITY CASCADE`);
  
  // Insert products
  for (const product of products) {
    await db.insert(productsTable).values({
      slug: product.slug,
      name: product.name,
      year: product.year,
      mint: product.mint,
      metalType: product.metalType,
      purity: product.purity,
      weight: String(product.weight),
      weightUnit: product.weightUnit as "oz" | "g" | "kg" | "lb",
      spotPrice: product.spotPrice ? String(product.spotPrice) : null,
      premiumPct: product.premiumPct ? String(product.premiumPct) : null,
      premiumAmt: product.premiumAmt ? String(product.premiumAmt) : null,
      price: String(product.price),
      msrp: product.msrp ? String(product.msrp) : null,
      inStock: product.inStock ?? true,
      stockQty: product.stockQty ?? 100,
      isOnSale: product.isOnSale ?? false,
      saleLabel: product.saleLabel,
      isFeatured: product.isFeatured ?? false,
      isNew: product.isNew ?? false,
      isIRAEligible: product.isIRAEligible ?? false,
      isNumismatic: product.isNumismatic ?? false,
      isPreOrder: product.isPreOrder ?? false,
      images: product.images,
      shortDescription: product.shortDescription,
      description: product.description,
      category: product.category,
      rating: product.rating ? String(product.rating) : "4.8",
      reviewCount: product.reviewCount ?? 0,
      specifications: product.specifications,
      grades: product.grades,
      assayCertificate: product.assayCertificate ?? false,
      relatedProductIds: product.relatedProductIds ?? [],
    });
  }
  
  console.log(`Inserted ${products.length} products`);
  
  // Insert blog posts
  for (const post of blogPosts) {
    await db.insert(blogPostsTable).values({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      tags: post.tags,
      readTime: post.readTime,
      image: post.image,
    });
  }
  
  console.log(`Inserted ${blogPosts.length} blog posts`);
  console.log("Seed complete!");
}

seed().catch(console.error);
