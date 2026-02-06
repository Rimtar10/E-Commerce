import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { openai } from "@/configs/openai";

async function main (base64Image, mimeType) {
     const messages = [
        {
            "role": "system",
            "content": `you are a product listing assistant for an ecommerce store.
            your job is to analyse an image of a product and generate structured data.
            respond only with raw json (no code, no markdown, no explanations).
            this json must strictly follow this format:
            {
                "name": string, // a short name for the product
                "description": string, // marketing friendly description of the product

            }
            `
        },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "analyse this image and return name + description.",
        },
        {
          "type": "image_url",
          "image_url": {
            "url": `data:${mimeType};base64,${base64Image}`
          },
        },
      ],
    }
  ];

  const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages,
    });

    const raw = response.choices[0].message.content;
    
    const clean =  raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
        parsed = JSON.parse(clean);
    } catch (error) {
        throw new Error("ai did not return valid JSON")
    }

    return parsed;



}

export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const isSeller = await authSeller(userId);
        
        if(!isSeller){
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }

        const {base64Image, mimeType} = await request.json();
        const result = await main(base64Image, mimeType);   
        return NextResponse.json({...result});

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}