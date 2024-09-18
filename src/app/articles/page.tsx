'use client'
import { getArticles } from '@/lib/firebase/firestore'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaRegNewspaper } from 'react-icons/fa'


const Articles = () => {
    const [articles, setArticles] = useState<{ id: string, title: string }[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getArticles();
                setArticles(data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="container mx-auto">
            <h1 className='m-4 text-center font-bold'>DAFTAR ARTIKEL</h1>

            <div className="grid grid-cols-4 gap-3">
                {articles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.id}`} className="card shadow-2xl p-2 gap-2 flex items-center">
                        <FaRegNewspaper size={23} />
                        <p>{article.title}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Articles;
