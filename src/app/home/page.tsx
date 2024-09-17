'use client'
import React, { useEffect, useState } from 'react'
import InputForm from '../components/elements/InputForm'
import { createItem, deleteItem, getItems, updateItem } from '@/lib/firebase/firestore'
import { Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react'


const Home = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [idUser, setIdUser] = useState('')
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

            setFormUpdate({
                ...formUpdate,
                [name]: value ? parseInt(value, 10) : '',
            })

        } else {
            setForm({
                ...form,
                [name]: value,
            });

            setFormUpdate({
                ...formUpdate,
                [name]: value,
            });
        }
    };


    //create
    const handleCreate = async (e: any) => {
        e.preventDefault();

        try {
            await createItem(form);
            setForm({
                name: '',
                nim: '',
                email: '',
                prodi: '',
                jenis_kelamin: '',
            });

            getItems()
                .then((res: any) => setData(res))
        } catch (error: any) {
            console.error("Error saat menambahkan item:", error.message); // Logging error
            alert(error.message); // Tampilkan error ke pengguna
        }
    };


    //delete
    const handleDelete = async (id: string) => {
        await deleteItem(id);
        getItems()
            .then((res: any) => setData(res))
    }


    //update
    const [formUpdate, setFormUpdate] = useState({
        name: '',
        nim: '',
        email: '',
        prodi: '',
        jenis_kelamin: '',
    })

    const handleChangeUpdate = (e: any) => {
        const { name, value } = e.target;
        if (name === 'nim') {

            setFormUpdate({
                ...formUpdate,
                [name]: value ? parseInt(value, 10) : '',
            })

        } else {
            setFormUpdate({
                ...formUpdate,
                [name]: value,
            });
        }
    }

    const handleOpenModal = (item: any) => {
        onOpen()
        setFormUpdate(item)
        setIdUser(item.id)
    }

    const handleUpdate = async (e: any) => {
        e.preventDefault();
        await updateItem(idUser, formUpdate)
        onClose()
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
                                <button className='bg-blue-500 text-white px-3 py-2 rounded-md' onClick={() => handleOpenModal(item)} >Edit</button>
                                <button className='bg-red-500 text-white px-3 py-2 rounded-md' onClick={() => handleDelete(item.id)} >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className='p-5' >
                                <form onSubmit={handleUpdate}>
                                    <InputForm type='text' onChange={handleChangeUpdate} value={formUpdate.name} htmlFor="name" title="Name" placeholder="Masukkan Nama" />
                                    <InputForm type='number' onChange={handleChangeUpdate} value={formUpdate.nim} htmlFor="nim" title="NIM" placeholder="Masukkan Nim" />
                                    <div className="flex w-full gap-2">
                                        <InputForm type='email' onChange={handleChangeUpdate} value={formUpdate.email} htmlFor="email" title="Email" placeholder="Masukkan Email" />
                                        <InputForm type='text' onChange={handleChangeUpdate} value={formUpdate.prodi} htmlFor="prodi" title="Prodi" placeholder="Masukkan Prodi" />
                                    </div>
                                    <h1 className='my-2' >Jenis Kelamin</h1>
                                    <div className="flex gap-6">
                                        <div className="man">
                                            <h1>Laki - Laki</h1>
                                            <input type="radio" value={formUpdate.jenis_kelamin} onClick={() => setFormUpdate({ ...formUpdate, jenis_kelamin: 'laki-laki' })} name="jenis_kelamin" id="laki-laki" />
                                        </div>
                                        <div className="woman">
                                            <h1>Perempuan</h1>
                                            <input type="radio" value={formUpdate.jenis_kelamin} onClick={() => setFormUpdate({ ...formUpdate, jenis_kelamin: 'perempuan' })} name="jenis_kelamin" id="perempuan" />
                                        </div>

                                    </div>
                                    <div className="flex justify-end">
                                        <button type='submit' className='bg-blue-500 text-white px-3 py-2 rounded-md my-2  ' >Submit</button>
                                    </div>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Home