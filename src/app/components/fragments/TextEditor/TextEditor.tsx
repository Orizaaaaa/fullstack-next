/* Imports */
'use client'
import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { createArticle, getArticles } from '@/lib/firebase/firestore';
import InputForm from '../../elements/InputForm';
import { useRouter } from 'next/navigation';

/* Using dynamic import of Jodit component as it can't render in server side */
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const TextEditor = ({ desc }: any) => {
    const [content, setContent] = useState(desc);
    const [title, setTitle] = useState('');
    const router = useRouter();
    // Declare using state

    /* The most important point */
    const config: any = useMemo(
        () => ({
            /* Custom image uploader button configuration to accept image and convert it to base64 format */
            uploader: {
                insertImageAsBase64URI: true,
                imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'] // this line is not much important, use if you only strictly want to allow some specific image format
            },
        }),
        []
    );

    /* Function to handle the changes in the editor */
    const handleChange = (value: any) => {
        setContent(value);
    };

    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
    };

    //handle submit article
    const handleCreateArticle = async () => {
        const articleData = {
            title: title,
            timestamp: new Date(),
            content, // Ini harus berupa objek, bukan string HTML
        };

        const docId = await createArticle(articleData);
        setContent('');
        setTitle('');
        router.push(`/articles`);
        console.log("Article created with ID:", docId);
    };

    return (
        <>
            {/* Below is a basic html page and we use Tailwind css to style */}
            <Head>
                <title>Jodit Rich Text Editor on the Web | Soubhagyajit</title>
                <meta name='author' content='Soubhagyajit Borah' />
            </Head>
            <main>
                <div className="h-screen flex items-center flex-col">
                    <div className="h-full">
                        {/* This is the main initialization of the Jodit editor */}
                        <InputForm htmlFor="title" placeholder='Masukan judul artikel' type="text" onChange={handleTitleChange} value={title} />
                        <JoditEditor
                            value={content}         // This is important
                            config={config}         // Only use when you declare some custom configs
                            onChange={handleChange} // Handle the changes
                            className="w-full h-[70%] text-black bg-white"
                        />
                        <style>
                            {`.jodit-wysiwyg{height:300px !important}`}
                        </style>
                    </div>

                    <button onClick={handleCreateArticle} className='bg-blue-500 text-white px-3 py-2 rounded-md my-2'>
                        Buat artikel
                    </button>

                    <div className="my-10 h-full w-full">
                        Preview:
                        <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    </div>
                </div>

            </main>
        </>
    );
}

export default TextEditor;
