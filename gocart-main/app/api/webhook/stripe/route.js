import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Get the order IDs from metadata
        const orderIdsString = session.metadata.orderIds;
        const userId = session.metadata.userId;

        if (!orderIdsString || !userId) {
            console.error("Missing metadata in session");
            return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        const orderIds = orderIdsString.split(',');

        try {
            // Update all orders to mark them as paid
            await prisma.order.updateMany({
                where: {
                    id: { in: orderIds },
                    userId: userId
                },
                data: {
                    isPaid: true
                }
            });

            // Clear the user's cart
            await prisma.user.update({
                where: { id: userId },
                data: { cart: {} }
            });

            console.log(`Orders ${orderIdsString} marked as paid for user ${userId}`);
        } catch (error) {
            console.error("Error updating orders:", error);
            return NextResponse.json({ error: "Database Error" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
