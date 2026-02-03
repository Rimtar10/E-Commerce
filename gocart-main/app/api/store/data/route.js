import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

//get store info 


export async function GET(request){
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username').toLocaleLowerCase();

        if(!username){
            return NextResponse.json({error:"username is required"}, {status:400});
        }

        const store = await prisma.store.findUnique({
            where: { username, isActive: true},
            include: {
                Product: {include: {rating: true}}
            }
        })

        if (!store){
            return NextResponse.json({error:"store not found"}, {status:400});

        }

        return NextResponse.json({store});



    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}