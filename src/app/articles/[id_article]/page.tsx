'use client'
import { getDetailArticle } from '@/lib/firebase/firestore';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const DetailArticle = () => {
    const [article, setArticle] = useState<any>({});
    const { id_article }: any = useParams();
    useEffect(() => {
        getDetailArticle(id_article).then((data) => {
            setArticle(data)
        })
    }, []);
    console.log(article);

    return (
        <div className="container mx-auto">
            <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
        </div>
    )
}

export default DetailArticle