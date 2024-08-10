import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createClient } from '@supabase/supabase-js';

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function syncUserAuth() {
    try {
        const { getUser, getIdToken } = getKindeServerSession();
        const kindeUser = await getUser();
        const kindeToken = await getIdToken();

        if (!kindeUser || !kindeToken) {
            console.log("No Kinde user or token found");
            throw new Error('ユーザーが認証されていません');
        }

        // KindeIdTokenを文字列に変換
        const token = kindeToken.toString();

        console.log("Kinde user:", kindeUser);

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error("Supabase session error:", error);
            throw new Error(`Supabaseセッションエラー: ${error.message}`);
        }

        if (!session) {
            console.log("No Supabase session, attempting to sign in");
            const { data, error: signInError } = await supabase.auth.signInWithIdToken({
                provider: 'kinde',
                token: token,
            });
            
            if (signInError) {
                console.error("Supabase sign in error:", signInError);
                console.error("Error details:", JSON.stringify(signInError, null, 2));
                throw new Error(`Supabaseサインインエラー: ${signInError.message}`);
            }

            console.log("Supabase sign in successful:", data);
        } else {
            console.log("Existing Supabase session:", session);
        }

        return kindeUser;
    } catch (error) {
        console.error("Sync user auth error:", error);
        if (error instanceof Error) {
            console.error("Error stack:", error.stack);
        }
        throw error;
    }
}
