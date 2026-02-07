'use client'
import { Search, ShoppingBag, ShoppingCart, Package, Menu, X, Shield, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const cartCount = useSelector(state => state.cart.total);

    // Fix hydration issue
    useEffect(() => {
        setMounted(true);
    }, []);

    // Check if user is admin
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (user) {
                try {
                    const response = await fetch('/api/admin/is-admin');
                    if (response.ok) {
                        const data = await response.json();
                        setIsAdmin(data.isAdmin);
                    } else {
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error('Error checking admin status:', error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
        };
        checkAdminStatus();
    }, [user]);

    // Check if user is a seller
    useEffect(() => {
        const checkSellerStatus = async () => {
            if (user) {
                try {
                    const response = await fetch('/api/store/is-seller');
                    if (response.ok) {
                        const data = await response.json();
                        setIsSeller(data.isSeller);
                    } else {
                        setIsSeller(false);
                    }
                } catch (error) {
                    console.error('Error checking seller status:', error);
                    setIsSeller(false);
                }
            } else {
                setIsSeller(false);
            }
        };
        checkSellerStatus();
    }, [user]);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [router]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/shop?search=${search}`);
    };

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <Protect plan='plus'>
                             <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                        </Protect>
                       
                    </Link>

                    {/* Mobile Menu Button and User Button */}
                    <div className="flex items-center gap-3 sm:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        {mounted && (
                            <>
                                {user ? (
                                    <UserButton>
                                        <UserButton.MenuItems>
                                            <UserButton.Action 
                                                labelIcon={<ShoppingCart size={16} />} 
                                                label="Cart" 
                                                onClick={() => router.push("/cart")}
                                            />
                                            <UserButton.Action 
                                                labelIcon={<Package size={16} />} 
                                                label="My Orders" 
                                                onClick={() => router.push("/orders")}
                                            />
                                            {isSeller && (
                                                <UserButton.Action 
                                                    labelIcon={<Store size={16} />} 
                                                    label="My Store" 
                                                    onClick={() => router.push("/store")}
                                                />
                                            )}
                                            {isAdmin && (
                                                <UserButton.Action 
                                                    labelIcon={<Shield size={16} />} 
                                                    label="Admin Dashboard" 
                                                    onClick={() => router.push("/admin")}
                                                />
                                            )}
                                        </UserButton.MenuItems>
                                    </UserButton>
                                ) : (
                                    <button 
                                        onClick={openSignIn} 
                                        className="px-5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
                                    >
                                        Login
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input 
                                className="w-full bg-transparent outline-none placeholder-slate-600" 
                                type="text" 
                                placeholder="Search products" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                required 
                            />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        </Link>
                        
                        {mounted && (
                            <>
                                {!user ? (
                                    <button 
                                        onClick={openSignIn} 
                                        className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
                                    >
                                        Login
                                    </button>
                                ) : (
                                    <UserButton>
                                        <UserButton.MenuItems>
                                            <UserButton.Action 
                                                labelIcon={<Package size={16} />} 
                                                label="My Orders" 
                                                onClick={() => router.push("/orders")}
                                            />
                                            {isSeller && (
                                                <UserButton.Action 
                                                    labelIcon={<Store size={16} />} 
                                                    label="My Store" 
                                                    onClick={() => router.push("/store")}
                                                />
                                            )}
                                            {isAdmin && (
                                                <UserButton.Action 
                                                    labelIcon={<Shield size={16} />} 
                                                    label="Admin Dashboard" 
                                                    onClick={() => router.push("/admin")}
                                                />
                                            )}
                                        </UserButton.MenuItems>
                                    </UserButton>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Mobile Menu Panel */}
                <div 
                    className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out sm:hidden ${
                        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    aria-label="Mobile navigation"
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold text-slate-700">Menu</h2>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                aria-label="Close menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <form onSubmit={handleSearch} className="flex items-center text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full mb-6">
                                <Search size={18} className="text-slate-600" />
                                <input 
                                    className="w-full bg-transparent outline-none placeholder-slate-600" 
                                    type="text" 
                                    placeholder="Search products" 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)} 
                                    required 
                                />
                            </form>

                            <nav className="flex flex-col gap-1">
                                <Link 
                                    href="/" 
                                    className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link 
                                    href="/shop" 
                                    className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Shop
                                </Link>
                                <Link 
                                    href="/about" 
                                    className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <Link 
                                    href="/contact" 
                                    className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Contact
                                </Link>
                                <Link 
                                    href="/cart" 
                                    className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition flex items-center justify-between"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="flex items-center gap-2">
                                        <ShoppingCart size={18} />
                                        Cart
                                    </span>
                                    <span className="text-xs text-white bg-slate-600 size-5 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                </Link>
                                {mounted && user && (
                                    <Link 
                                        href="/orders" 
                                        className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition flex items-center gap-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Package size={18} />
                                        My Orders
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    );
};

export default Navbar;