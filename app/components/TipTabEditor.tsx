"use client";
import { Button } from '@/components/ui/button';
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';

import React from 'react'

export const Menubar = ({editor}: {editor: Editor | null }) => {
    if(!editor) {
        return null;
    }
    return (
        <div className='flex flex-wrap gap-5 mt-5'>
            <Button type="button"
                variant={editor.isActive('heading', {level: 1}) ? 'default': 'secondary'}
                onClick={()=> editor.chain().focus().toggleHeading({level: 1}).run()}>
                H1
            </Button>
            <Button type="button"
                variant={editor.isActive('heading', {level: 2}) ? 'default': 'secondary'}
                onClick={()=> editor.chain().focus().toggleHeading({level: 2}).run()}>
                H2
            </Button>
            <Button type="button"
                variant={editor.isActive('heading', {level: 3}) ? 'default': 'secondary'}
                onClick={()=> editor.chain().focus().toggleHeading({level: 3}).run()}>
                H3
            </Button>
            <Button type="button"
                variant={editor.isActive('bold') ? 'default': 'secondary'}
                onClick={()=> editor.chain().focus().toggleBold().run()}>
                Bold
            </Button>
            <Button type="button"
                variant={editor.isActive('italic') ? 'default': 'secondary'}
                onClick={()=> editor.chain().focus().toggleItalic().run()}>
                Italic
            </Button>
            <Button type="button"
                variant={editor.isActive('strike') ? 'default': 'secondary'}
                onClick={()=> editor.chain().focus().toggleStrike().run()}>
                Strike
            </Button>
        </div>
    );
};

export function TipTapEditor() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Hello World</p>',
        editorProps: {
            attributes: {
                class: 'prose'
            }
        }
    });
    return (
        <div>
            <Menubar editor={editor}/>
            <EditorContent editor={editor} className='rounded-lg p-2 border min-h-[150px] mt-2'/>
        </div>
    )
}


