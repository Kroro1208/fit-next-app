"use client";
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateUserProfile } from '../actions';

interface SettingsFormProps {
  userId: string | null;
  username: string | null;
  imageUrl: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? '更新中...' : '更新'}
    </Button>
  );
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const SettingsForm = ({ userId, username, imageUrl }: SettingsFormProps) => {
  const [state, formAction] = useFormState(updateUserProfile, {
    message: '',
    status: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(imageUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert('ファイルサイズが大きすぎます。5MB以下のファイルを選択してください。');
        event.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted');
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      await formAction(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      // エラーメッセージを表示するための状態を更新
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          ユーザー名
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          defaultValue={username || ''}
          placeholder="ユーザー名"
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          プロフィール画像
        </label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {previewImage && (
          <div className="mt-2">
            <Image
              src={previewImage}
              alt="Preview"
              width={100}
              height={100}
              className="rounded-full"
              priority
            />
          </div>
        )}
      </div>

      <SubmitButton />

      {state?.status === 'success' && (
        <p className="text-green-600">{state.message}</p>
      )}
      {state?.status === 'error' && (
        <p className="text-red-600">{state.message}</p>
      )}
    </form>
  );
};

export default SettingsForm;