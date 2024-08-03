"use client";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SubmitButton from "./SubmitButton"
import { createComment } from "../actions";
import { useRef } from "react";

interface Props {
  postId: string;
}

const CommentForm = ({postId}: Props) => {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form action={async (formData) => {
      await createComment(formData);
      ref.current?.reset();
    }}
    className="mt-5" ref={ref}
    >
      <input type="hidden" name="postId" value={postId}/>
      <Label>コメントを残す</Label>
      <Textarea placeholder="あなたの意見を投稿"
      className="w-full mt-1 mb-2" name="comment"/>
      <SubmitButton text="コメントする" />
    </form>
  )
}

export default CommentForm
