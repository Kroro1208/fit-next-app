import type { CustomProvider } from "@/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createClient, type Provider } from '@supabase/supabase-js';

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function syncUserAuth() {
    try {
        const { getUser } = getKindeServerSession();
        const kindeUser = await getUser();

        if (!kindeUser) {
            console.log("No Kinde user found");
            throw new Error('ユーザーが認証されていません');
        }

        console.log("Kinde user:", kindeUser);

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error("Supabase session error:", error);
            throw new Error(`Supabaseセッションエラー: ${error.message}`);
        }

        if (!session) {
            console.log("No Supabase session, attempting to sign in");
            const { data, error: signInError } = await supabase.auth.signInWithOAuth({
                // TypeScriptのエラーを回避するためにasを使用
                provider: 'kinde' as Provider & CustomProvider,
                options: {
                    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
                    scopes: '',  // 必要に応じてスコープを追加
                    queryParams: {},  // 必要に応じてクエリパラメータを追加
                    skipBrowserRedirect: Boolean(process.env.SKIP_BROWSER_REDIRECT)
                }
            });
            
            if (signInError) {
                console.error("Supabase sign in error:", signInError);
                throw new Error(`Supabaseサインインエラー: ${signInError.message}`);
            }

            if (data && 'url' in data) {
                console.log("Auth URL:", data.url);
                // ここでリダイレクトを行う。例えば:
                // window.location.href = data.url;
            } else {
                console.log("Supabase sign in initiated, but no URL returned");
            }
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