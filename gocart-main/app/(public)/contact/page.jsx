import { Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="text-center max-w-2xl mx-auto mb-14">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                    Get in Touch
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed">
                    Have a question, suggestion, or need help? We'd love to hear from you. Reach out through any of the channels below.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">

                <a href="mailto:rimtarhini10@gmail.com" className="flex items-start gap-4 p-6 border border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50/30 transition group">
                    <div className="size-11 flex-shrink-0 flex items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition">
                        <Mail size={20} />
                    </div>
                    <div>
                        <h3 className="text-slate-800 font-medium mb-1">Email Us</h3>
                        <p className="text-sm text-slate-500">rimtarhini10@gmail.com</p>
                        <p className="text-xs text-slate-400 mt-1">We'll get back to you within 24 hours</p>
                    </div>
                </a>

                <div className="flex items-start gap-4 p-6 border border-slate-200 rounded-xl">
                    <div className="size-11 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h3 className="text-slate-800 font-medium mb-1">Location</h3>
                        <p className="text-sm text-slate-500">Beirut, Lebanon</p>
                        <p className="text-xs text-slate-400 mt-1">Serving customers worldwide</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-6 border border-slate-200 rounded-xl">
                    <div className="size-11 flex-shrink-0 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h3 className="text-slate-800 font-medium mb-1">Business Hours</h3>
                        <p className="text-sm text-slate-500">Mon – Fri: 9:00 AM – 6:00 PM</p>
                        <p className="text-xs text-slate-400 mt-1">Weekend support available via email</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-6 border border-slate-200 rounded-xl">
                    <div className="size-11 flex-shrink-0 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h3 className="text-slate-800 font-medium mb-1">Customer Support</h3>
                        <p className="text-sm text-slate-500">Need help with an order or your store?</p>
                        <p className="text-xs text-slate-400 mt-1">Reach out via email, we're here to help</p>
                    </div>
                </div>
            </div>

            <div className="text-center bg-slate-50 rounded-2xl p-10">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Still have questions?</h2>
                <p className="text-slate-500 text-sm mb-6">Check out our FAQ on the About page for more answers.</p>
                <Link href="/about" className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition inline-block">
                    Visit About Page
                </Link>
            </div>
        </div>
    )
}
