'use client'
import { useState } from 'react'
import { Plus, Minus, ShoppingBag, Users, Sparkles, Store, CreditCard, Truck } from 'lucide-react'
import Link from 'next/link'

const faqs = [
    {
        question: "How do I create my own store on gocart?",
        answer: "Anyone can create their own store on gocart! Simply sign up, click on \"Create Store\" and fill in your store details. Once submitted, your store will be reviewed and approved by our admin team to ensure quality and trust across the platform. You'll be notified once your store is live and ready to start selling."
    },
    {
        question: "What is the Plus membership?",
        answer: "Plus membership is our premium plan that gives you exclusive perks. As a Plus member, you enjoy free shipping on all orders and access to exclusive discounts that are only available to members. It's the best way to save more while shopping on gocart."
    },
    {
        question: "How do coupons work on gocart?",
        answer: "We offer three types of coupons to give everyone a chance to save: coupons for new users only (a welcome treat for first-time shoppers), coupons for all users (available to everyone), and coupons for Plus members only (exclusive savings for our premium members). Keep an eye out for active coupons when checking out!"
    },
    {
        question: "How does the AI-powered product listing work?",
        answer: "Our platform is AI-powered to make selling easier than ever. When you have a store, simply upload a picture of your product and our AI will automatically generate a suitable product name and description for you. This saves you time and ensures your listings are professional and appealing to buyers."
    },
    {
        question: "What payment methods are available?",
        answer: "We offer flexible payment options to suit your needs. You can pay by card (credit or debit) for a seamless online checkout, or choose cash on delivery if you prefer to pay when your order arrives at your doorstep."
    },
    {
        question: "Can I track my orders?",
        answer: "Yes! Once you place an order, you can track its status in real time from your \"My Orders\" page. You'll be able to see every step of the process — from order placed, to processing, shipped, and delivered — so you always know where your order is."
    },
    {
        question: "Is there a review and rating system?",
        answer: "Absolutely! After receiving your order, you can rate and review the products you purchased. This helps other shoppers make informed decisions and helps sellers improve their offerings. Your feedback matters and keeps the gocart community thriving."
    },
    {
        question: "How does shipping work?",
        answer: "Standard shipping fees apply to all orders unless you're a Plus member, in which case you get free shipping on every order. We work to get your products delivered as quickly as possible, and you can always track your delivery status from your orders page."
    },
]

const highlights = [
    {
        icon: Store,
        title: "Multi-Vendor Marketplace",
        description: "Anyone can open their own store and start selling, it's your platform to grow your business.",
        accent: "#10b981"
    },
    {
        icon: Sparkles,
        title: "AI-Powered Listings",
        description: "Upload a photo and let our AI handle the rest, instant product names and descriptions.",
        accent: "#6366f1"
    },
    {
        icon: Users,
        title: "Plus Membership",
        description: "Unlock free shipping and exclusive discounts with our premium Plus plan.",
        accent: "#f59e0b"
    },
    {
        icon: CreditCard,
        title: "Flexible Payments",
        description: "Pay your way, by card online or cash on delivery, the choice is yours.",
        accent: "#ef4444"
    },
    {
        icon: Truck,
        title: "Order Tracking",
        description: "Stay in the loop with real-time order tracking from purchase to delivery.",
        accent: "#3b82f6"
    },
    {
        icon: ShoppingBag,
        title: "Everything You Need",
        description: "From electronics to fashion, find all kinds of products from trusted sellers.",
        accent: "#8b5cf6"
    },
]

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition"
            >
                <span className="text-slate-700 font-medium pr-4">{question}</span>
                <span className={`flex-shrink-0 size-8 flex items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-6 pb-5 text-slate-500 text-sm leading-relaxed">{answer}</p>
            </div>
        </div>
    )
}

export default function AboutPage() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                    About <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl">.</span>
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed">
                    gocart is a multi-vendor marketplace where you can shop for all kinds of products, from electronics and fashion to home essentials and more. But we're not just a place to buy. Anyone can create their own store, list products, and start selling to customers everywhere. Whether you're a shopper looking for the best deals or an entrepreneur ready to launch your brand, gocart is built for you.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                    <Link href="/shop" className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition">
                        Start Shopping
                    </Link>
                    <Link href="/create-store" className="px-8 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 rounded-full font-medium transition">
                        Create Your Store
                    </Link>
                </div>
            </div>

            <div className="mb-24">
                <h2 className="text-2xl font-semibold text-slate-800 text-center mb-3">Why gocart?</h2>
                <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Everything you need for a seamless shopping and selling experience, all in one place.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {highlights.map((item, index) => (
                        <div
                            key={index}
                            className="relative h-48 px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group"
                            style={{ backgroundColor: item.accent + '10', borderColor: item.accent + '30' }}
                        >
                            <h3 className="text-slate-800 font-medium">{item.title}</h3>
                            <p className="text-sm text-slate-600 mt-3">{item.description}</p>
                            <div
                                className="absolute -top-5 text-white size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition"
                                style={{ backgroundColor: item.accent }}
                            >
                                <item.icon size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold text-slate-800 text-center mb-3">Frequently Asked Questions</h2>
                <p className="text-slate-500 text-center mb-10">Got questions? We've got answers. Here's everything you need to know about gocart.</p>
                <div className="flex flex-col gap-3">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </div>
    )
}
