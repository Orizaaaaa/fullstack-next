'use client'
import { deleteArticle, getArticles } from '@/lib/firebase/firestore'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaRegNewspaper, FaTrashAlt } from 'react-icons/fa'


const Articles = () => {
    const [articles, setArticles] = useState<{ id: string, title: string }[]>([]);
    const fetchArticles = async () => {
        try {
            const data = await getArticles();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDeleteArticle = async (id: string) => {
        await deleteArticle(id)
        fetchArticles()
    };

    return (
        <div className="container mx-auto">
            <h1 className='m-4 text-center font-bold'>DAFTAR ARTIKEL</h1>

            <div className="grid grid-cols-4 gap-3">
                {articles.map((article) => (
                    <div key={article.id} className="card shadow-2xl rounded-lg p-2 gap-2 flex items-center justify-between">
                        <Link href={`/articles/${article.id}`} className=" flex p-2 gap-2 items-center">
                            <FaRegNewspaper size={23} />
                            <p>{article.title}</p>
                        </Link>

                        <div className="flex gap-2">
                            <Link href={`/articles/edit/${article.id}`}> <FaEdit color='blue' /> </Link>
                            <button onClick={() => handleDeleteArticle(article.id)}><FaTrashAlt color='red' /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Articles;
