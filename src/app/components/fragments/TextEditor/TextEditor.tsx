'use client'

/* Imports */
import React, { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

/* Using dynamic import of Jodit component as it can't render in server side*/
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });


const TextEditor = ({ desc }: any) => {
    const editor = useRef(null); //declared a null value 
    const [content, setContent] = useState(desc);
    //declare using state

    /* The most important point*/
    const config: any = useMemo( //  Using of useMemo while make custom configuration is strictly recomended 
        () => ({              //  if you don't use it the editor will lose focus every time when you make any change to the editor, even an addition of one character
            /* Custom image uploader button configuretion to accept image and convert it to base64 format */
            uploader: {
                insertImageAsBase64URI: true,
                imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'] // this line is not much important , use if you only strictly want to allow some specific image format
            },
        }),
        []
    );
    /* function to handle the changes in the editor */
    const handleChange = (value: any) => {
        setContent(value);
    };

    console.log(content);

    return (
        <>
            {/* Below is a basic html page and we use Tailwind css to style*/}
            <Head>
                <title>Jodit Rich Text Editor on the Web | Soubhagyajit</title>
                <meta name='author' content='Soubhagyajit Borah' />
            </Head>
            <main>
                <div className="h-screen  flex items-center flex-col">
                    <div className="h-full ">
                        {/* This is the main initialization of the Jodit editor */}
                        <JoditEditor
                            ref={editor}            //This is important
                            value={content}         //This is important
                            config={config}         //Only use when you declare some custom configs
                            onChange={handleChange} //handle the changes
                            className="w-full h-[70%] text-black bg-white"
                        />
                        <style>
                            {`.jodit-wysiwyg{height:300px !important}`}
                        </style>
                    </div>

                    <button className='bg-blue-500 text-white px-3 py-2 rounded-md my-2' >Buat artikel</button>

                    <div
                        className="my-10 h-full w-full"
                    >Preview:
                        <div dangerouslySetInnerHTML={{ __html: content }}></div>

                    </div>
                </div>
            </main>
        </>
    );
}


export default TextEditor