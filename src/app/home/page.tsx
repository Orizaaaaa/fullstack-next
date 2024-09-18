'use client'
import React, { useEffect, useState } from 'react'
import InputForm from '../components/elements/InputForm'
import { createItem, deleteImage, deleteItem, getItems, updateItem, uploadImage } from '@/lib/firebase/firestore'
import { Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react'
import Link from 'next/link'


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
        image: null as File | null,
    })


    useEffect(() => {
        getItems()
            .then((res: any) => setData(res))
    }, []);


    // action change
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

    const handleFileManager = (fileName: string) => {
        //kalo ada 2 sama update harus tambahkan di else image-input-update
        if (fileName === 'add') {
            const fileInput = document.getElementById("image-input-add") as HTMLInputElement | null;
            fileInput ? fileInput.click() : null;
        } else {
            console.log('error');

        }
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, InputSelect: string) => {
        if (InputSelect === 'add') {
            const selectedImage = e.target.files?.[0];
            setForm({ ...form, image: selectedImage || null });
        } else {
            console.log('error');

        }
    };


    //create
    const handleCreate = async (e: any) => {
        e.preventDefault();

        try {
            const url = await uploadImage(form.image as File);
            await createItem({ ...form, image: url });
            setForm({
                name: '',
                nim: '',
                email: '',
                prodi: '',
                jenis_kelamin: '',
                image: null as File | null,
            });

            getItems()
                .then((res: any) => setData(res))
        } catch (error: any) {
            console.error("Error saat menambahkan item:", error.message); // Logging error
            alert(error.message); // Tampilkan error ke pengguna
        }
    };


    //delete dengan image yang ada di firebase storage
    const handleDelete = async (id: string, imagePath: string) => {
        try {
            await deleteItem(id); // Hapus item dari Firestore
            await deleteImage(imagePath); // Hapus gambar dari Firebase Storage
            getItems().then((res: any) => setData(res)); // Ambil data terbaru
        } catch (error) {
            console.error("Error saat menghapus item dan gambar:", error);
        }
    };


    //update
    const [formUpdate, setFormUpdate] = useState({
        name: '',
        nim: '',
        email: '',
        prodi: '',
        jenis_kelamin: '',
        imageURL: '',
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

                    {/* image */}
                    <div className="images ">
                        {form.image && form.image instanceof Blob ? (
                            <img className="h-[170px] md:h-[300px] w-auto mx-auto rounded-md" src={URL.createObjectURL(form.image)} />
                        ) : (
                            <div className="images border-dashed border-2 border-black rounded-md h-[200px] bg-gray-300">
                                <button className="flex-col justify-center items-center h-full w-full " type="button" onClick={() => handleFileManager('add')} >
                                    <img className="w-20 h-20 mx-auto" src='https://cdn-icons-png.flaticon.com/512/2956/2956744.png' />
                                    <p>*Masukan foto mahasiswa</p>
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            id="image-input-add"
                            onChange={(e) => handleImageChange(e, 'add')}
                        />
                        <div className="flex justify-center gap-3 mt-3">
                            <button className={`border-2 border-primary  text-primary px-4 py-2 rounded-md ${form.image === null ? 'hidden' : ''}`} type="button" onClick={() => handleFileManager('add')} >Ubah Gambar</button>
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
                        <th className='text-left' >Foto</th>
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
                            <td><img className='w-[50px] h-[50px] border-none rounded-full' src={item.image} alt="" /></td>
                            <td> <Link href={`/home/${item.id}`}>{item.name}</Link> </td>
                            <td>{item.nim}</td>
                            <td>{item.email}</td>
                            <td>{item.prodi}</td>
                            <td>{item.jenis_kelamin}</td>
                            <td className='flex items-center  gap-2' >
                                <button className='bg-blue-500 text-white px-3 py-2 rounded-md' onClick={() => handleOpenModal(item)} >Edit</button>
                                <button className='bg-red-500 text-white px-3 py-2 rounded-md' onClick={() => handleDelete(item.id, item.image)} >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
                <ModalContent>
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

                </ModalContent>
            </Modal>
        </div>
    )
}

export default Home