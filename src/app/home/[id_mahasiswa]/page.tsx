'use client'

import { getItemDetail } from "@/lib/firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type UserData = {
    email: string;
    id: string;
    image: string;
    jenis_kelamin: string;
    name: string;
    nim: number;
    prodi: string;
};

const DetailMahasiswa = () => {
    const { id_mahasiswa }: any = useParams();
    const [data, setData] = useState<UserData>({
        email: "",
        id: "",
        image: "",
        jenis_kelamin: "",
        name: "",
        nim: 0,
        prodi: ""
    });

    useEffect(() => {
        getItemDetail(id_mahasiswa)
            .then((res) => setData(res));
    }, []);


    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center min-h-[100vh] " >
                <div className="card flex gap-3 shadow-2xl p-4 rounded-lg">

                    <div className="text">
                        <img className="w-[50px] h-[50px] rounded-full" src={data.image} alt="" />
                        <h1 className="my-1" >Nama : {data.name}</h1>
                        <h1 className="my-1">NIM: {data.nim}</h1>
                        <h1 className="my-1">Prodi: {data.prodi}</h1>
                        <h1 className="my-1">Jenis Kelamin: {data.jenis_kelamin}</h1>
                        <h1 className="my-1">Email: {data.email}</h1>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default DetailMahasiswa