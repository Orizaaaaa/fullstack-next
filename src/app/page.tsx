'use client'
import Link from 'next/link'
import React from 'react'


const LandingPage = () => {

  return (
    <div className='container mx-auto ' >
      <div className="flex flex-col items-center justify-center min-h-[100vh] gap-3">
        <img className='w-32 border-none' src="https://maukuliah.ap-south-1.linodeobjects.com/logo/1701313060-enuc1snQTO.jpg" alt="" />

        <h1>Masuk ke pendataan mahasiswa</h1>
        <Link href='/home' className='bg-blue-500 text-white px-3 py-2 rounded-md' >Masuk halaman mahasiswa</Link>
        <Link href='/articles' className='bg-blue-500 text-white px-3 py-2 rounded-md' >Masuk halaman artikel</Link>
        <Link href='/create_articles' className='bg-blue-500 text-white px-3 py-2 rounded-md' >Buat artikel</Link>
      </div>
    </div>

  )
}

export default LandingPage