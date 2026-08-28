import { authenticatedUser,ensureAuthTables } from "../../../../db/auth";import { activeEntitlements } from "../../../../db/store";
export async function GET(request:Request){await ensureAuthTables();const user=await authenticatedUser(request);if(!user)return Response.json({error:"AUTH_REQUIRED"},{status:401});return Response.json({entitlements:(await activeEntitlements(user.id)).results})}
