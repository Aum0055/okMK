import { NextApiRequest } from "next";
import { NextRequest } from "next/server";


export async function POST(request: NextApiRequest) {
  // console.log('request',request.headers["accept"]);
  
  return Response.json({ data: 'sss' })

}