"use client";
import { Button } from '@/components/ui/button';
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit';

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

export function TipTapEditor({setJsonString, jsonString}: {setJsonString: (json: string | null) => void, jsonString: string | null}) {
    const editor = useEditor({
      extensions: [StarterKit],
      content: jsonString ? JSON.parse(jsonString) : "Hello World",
      editorProps: {
        attributes: {
            class: 'custom-editor'
        }
      },
      onUpdate: ({editor}) => {
        const json = editor.getJSON();
        setJsonString(JSON.stringify(json));
      }
    });
    return (
        <div>
            <Menubar editor={editor}/>
            <EditorContent editor={editor} className='rounded-lg p-2 border min-h-[150px] mt-2'/>
            <style jsx global>{`
                .custom-editor {
                    font-size: 1rem;
                }
                .custom-editor h1 { font-size: 2em; font-weight: bold; }
                .custom-editor h2 { font-size: 1.5em; font-weight: bold; }
                .custom-editor h3 { font-size: 1.17em; font-weight: bold; }
            `}</style>
        </div>
    )
}


