'use client'
import InputForm from '@/app/components/elements/InputForm';
import { getDetailArticle, updateArticle } from '@/lib/firebase/firestore';
import JoditEditor from 'jodit-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'


const EditArticle = () => {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const { id_article }: any = useParams();


    useEffect(() => {
        getDetailArticle(id_article).then((data) => {
            setContent(data.content)
            setTitle(data.title)
        })
    }, []);


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
    const handleEditArticle = async () => {
        const articleData = {
            title: title,
            content, // Ini harus berupa objek, bukan string HTML
        };

        updateArticle(id_article, articleData);
        router.push(`/articles`);
    };

    return (
        <div className="container mx-auto">
            <main>
                <div className="h-screen flex items-center flex-col">
                    <div className="h-full">
                        {/* This is the main initialization of the Jodit editor */}
                        <InputForm htmlFor="title" placeholder='Masukan judul artikel' type="text" onChange={handleTitleChange} value={title} />
                        <JoditEditor
                            value={content}
                            config={config}
                            onChange={handleChange}
                            className="w-full h-[70%] text-black bg-white"
                        />
                        <style>
                            {`.jodit-wysiwyg{height:300px !important}`}
                        </style>
                    </div>

                    <button onClick={handleEditArticle} className='bg-blue-500 text-white px-3 py-2 rounded-md my-2'>
                        Edit Article
                    </button>

                    <div className="my-10 h-full w-full">
                        Preview:
                        <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    </div>
                </div>

            </main>
        </div>

    )
}

export default EditArticle