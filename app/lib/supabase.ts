import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

export async function uploadImage(file: File, userId: string) {
    console.log("uploadImage function called");
    console.log("User ID:", userId);
    console.log("File:", file.name, file.type, file.size);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    console.log("File path:", filePath);

    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.error('Session error:', sessionError);
            throw new Error(`セッションエラー: ${sessionError.message}`);
        }
        if (!session || !session.user) {
            throw new Error('ユーザーが認証されていません');
        }
        console.log("Session:", "Active");
        console.log("Auth user ID:", session.user.id);

        const { error: uploadError, data } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            console.error('Upload error details:', JSON.stringify(uploadError, null, 2));
            throw new Error(`アップロードエラー: ${uploadError.message}`);
        }

        console.log("File uploaded successfully");
        console.log("Upload data:", data);

        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        if (!urlData || !urlData.publicUrl) {
            console.error('Failed to get public URL');
            throw new Error('公開URLの取得に失敗しました');
        }

        console.log("Public URL retrieved:", urlData.publicUrl);
        return urlData.publicUrl;
    } catch (error) {
        console.error('Error in uploadImage:', error);
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
        }
        throw new Error(`画像アップロードエラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
}