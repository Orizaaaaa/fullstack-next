'use client'
import React, { useEffect, useState } from 'react'
import InputForm from '../components/elements/InputForm'
import { createItem, deleteItem, getItems } from '@/lib/firebase/firestore'




const Home = () => {
    const [data, setData] = useState([])
    const [form, setForm] = useState({
        name: '',
        nim: '',
        email: '',
        prodi: '',
        jenis_kelamin: '',
    })


    useEffect(() => {
        getItems()
            .then((res: any) => setData(res))
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name === 'nim') {
            setForm({
                ...form,
                [name]: value ? parseInt(value, 10) : '', // Konversi ke number
            });
        } else {
            setForm({
                ...form,
                [name]: value,
            });
        }
    };

    const handleCreate = async (e: any) => {
        e.preventDefault();
        await createItem(form);
        setForm({
            name: '',
            nim: '',
            email: '',
            prodi: '',
            jenis_kelamin: '',
        })
        getItems()
            .then((res: any) => setData(res))
    }

    const handleDelete = async (id: string) => {
        await deleteItem(id);
        getItems()
            .then((res: any) => setData(res))
    }

    console.log(form);
    console.log(data);


    return (
        <div className="container mx-auto">
            {/* form */}
            <div className="flex flex-col justify-center m-4">
                <form onSubmit={handleCreate}>
                    <InputForm type='text' onChange={handleChange} value={form.name} htmlFor="name" title="Name" placeholder="Masukkan Nama" />
                    <InputForm type='number' onChange={handleChange} value={form.nim} htmlFor="nim" title="NIM" placeholder="Masukkan Nim" />
                    <div className="flex w-full gap-2">
                        <InputForm type='email' onChange={handleChange} value={form.email} htmlFor="email" title="Email" placeholder="Masukkan Email" />
                        <InputForm type='text' onChange={handleChange} value={form.prodi} htmlFor="prodi" title="Prodi" placeholder="Masukkan Prodi" />
                    </div>
                    <h1 className='my-2' >Jenis Kelamin</h1>
                    <div className="flex gap-6">
                        <div className="man">
                            <h1>Laki - Laki</h1>
                            <input type="radio" value={form.jenis_kelamin} onClick={() => setForm({ ...form, jenis_kelamin: 'laki-laki' })} name="jenis_kelamin" id="laki-laki" />
                        </div>
                        <div className="woman">
                            <h1>Perempuan</h1>
                            <input type="radio" value={form.jenis_kelamin} onClick={() => setForm({ ...form, jenis_kelamin: 'perempuan' })} name="jenis_kelamin" id="perempuan" />
                        </div>

                    </div>
                    <div className="flex justify-end">
                        <button type='submit' className='bg-blue-500 text-white px-3 py-2 rounded-md my-2  ' >Submit</button>
                    </div>
                </form>
            </div>

            {/* table */}
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className='text-left' >Nama</th>
                        <th className='text-left'>Nim</th>
                        <th className='text-left'>Email</th>
                        <th className='text-left'>Prodi</th>
                        <th className='text-left'>Jenis Kelamin</th>
                        <th className='text-left'>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item: any) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.nim}</td>
                            <td>{item.email}</td>
                            <td>{item.prodi}</td>
                            <td>{item.jenis_kelamin}</td>
                            <td className='flex gap-2' >
                                <button className='bg-blue-500 text-white px-3 py-2 rounded-md' >Edit</button>
                                <button className='bg-red-500 text-white px-3 py-2 rounded-md' onClick={() => handleDelete(item.id)} >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Home