import prisma from "@/lib/prisma"
import { PaymentMethod } from "@prisma/client"
import { NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import Stripe from "stripe"
import { metadata } from "@/app/layout"


export async function POST(request){
    try {
        const {userId, has} = getAuth(request)
        if(!userId){
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        const {addressId, items, couponCode, paymentMethod} = await request.json()

        //check if all fields are present
        if(!addressId || !items || !paymentMethod || !Array.isArray(items) || items.length === 0){
            return NextResponse.json({message: "All fields are required"}, {status: 400})
        }

        let coupon = null
        if(couponCode){
            coupon = await prisma.coupon.findUnique({
            where: {code: couponCode.toUpperCase()}
        })
        if(!coupon){return NextResponse.json({error: "Coupon not found or expired"}, {status: 404})}

        }

        //check if coupon is valid for the user
            
        if(couponCode && coupon.forNewUser){
            const userorders = await prisma.order.findMany({
                where: {userId}
            })
            if(userorders.length > 0){
                return NextResponse.json({error: "Coupon valid for new users only"}, {status: 400})
            }
        }
        
        const isPlusMember = has({plan: 'plus'})

        if(couponCode && coupon.forMember){
            if(!isPlusMember){
                return NextResponse.json({error: "Coupon valid for plus members only"}, {status: 400})
            }
        }

        //group orders bu storedId using map
        const ordersBystore = new Map()

        for(const item of items){
            const product = await prisma.product.findUnique({
                where: {id: item.id}
            })
            const storeId = product.storeId
            if(!ordersBystore.has(storeId)){
                ordersBystore.set(storeId, [])
            }
            ordersBystore.get(storeId).push({...item, price: product.price})
        }

        let productIds= []
        let orderIds = []
        let fullAmount = 0

        let isShippingFeeAdded = false
        for(const [storeId, selleritems] of ordersBystore.entries()){
           let total = selleritems.reduce((acc, item) => acc + item.price * item.quantity, 0)
           if(couponCode){
            total -= (total * coupon.discount) / 100
           }
           if(!isPlusMember && !isShippingFeeAdded){
            total += 5
            isShippingFeeAdded = true
           }

           fullAmount += parseFloat(total.toFixed(2))

           const order = await prisma.order.create({
            data: {
                userId,
                storeId,
                addressId,
                total: parseFloat(total.toFixed(2)),
                paymentMethod,
                isCouponUsed: couponCode ? true : false,
                coupon: coupon?  coupon : {},
                orderItems:{
                    create: selleritems.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
           })
           orderIds.push(order.id)
        }

        if(paymentMethod === PaymentMethod.STRIPE){
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
            const origin = request.headers.get("origin")
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Order',

                        },
                        unit_amount: Math.round(fullAmount * 100),
                    },
                    quantity: 1,
                }],
                expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
                mode: 'payment',
                success_url: `${origin}/orders?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/cart`,
                metadata:{
                    orderIds: orderIds.join(','),
                    userId,
                    appId: 'gocart'
                }
            })
            return NextResponse.json({session: session})
        }

        //clear cart
        await prisma.user.update({
            where: {id: userId},
            data: {
                cart: {}
            }
        })

        return NextResponse.json({message: "Order placed successfully", orderIds, fullAmount})

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
}

//get all orders for a user
export async function GET(request){
    try {
        const {userId, has} = getAuth(request)
        const orders = await prisma.order.findMany({
            where: {userId, OR : [
                {paymentMethod: "COD"},
                {AND: [{paymentMethod: "STRIPE"}, {isPaid: true}]}
            ]},
            include: {
                orderItems: {
                    include: {product: true}
                },
                address: true
            },
            orderBy: {createdAt: "desc"}
        })

        return NextResponse.json({orders})

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.message}, {status: 400})
    }
}