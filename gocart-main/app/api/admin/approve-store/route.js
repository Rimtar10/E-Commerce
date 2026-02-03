import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { auth } from "@clerk/nextjs/server";  // ✅ CHANGED: Import auth instead of getAuth
import { NextResponse } from "next/server";

// PATCH - approve seller (CHANGED from POST)
export async function PATCH(request) {  // ✅ CHANGED: POST → PATCH
    try {
        const { userId } = await auth();  // ✅ CHANGED: getAuth(request) → await auth()
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }

        const { storeId, status } = await request.json();

        if (status === 'approved') {
            await prisma.store.update({
                where: { id: storeId },
                data: { status: "approved", isActive: true }
            });
        }
        else if (status === 'rejected') {
            await prisma.store.update({
                where: { id: storeId },
                data: { status: "rejected" }
            });
        }

        return NextResponse.json({ message: `store has been ${status} successfully` });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

// GET - get all pending and rejected stores
export async function GET(request) {
    try {
        const { userId } = await auth();  // ✅ CHANGED: getAuth(request) → await auth()
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }

        const stores = await prisma.store.findMany({  // ✅ CHANGED: store → stores
            where: { status: { in: ['pending', 'rejected'] } },
            include: { user: true }
        })

        return NextResponse.json({ stores });  // ✅ CHANGED: {store} → {stores}

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}