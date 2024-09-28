import Link from 'next/link'
import React from 'react'

function ForbiddenCard() {
  return (
    <section className='flex justify-center gap-4 flex-col bg-[#1b1b1b] p-10  rounded-xl m-4'>
        <h2 className='text-2xl font-semibold cursor-pointer'>403</h2>
        <div className='gap-2'>
            <h2 className='text-5xl font-semibold cursor-pointer'>THIS ROOM IS</h2>
            <h2 className='text-[#A086FF] text-5xl font-semibold cursor-pointer'>PRIVATE</h2>
        </div>
        <div>
            <p className='text-xl text-[#918f8f] cursor-pointer'>Sorry, but you are not in the whitelist.</p>
            <p className='pt-7 text-lg text-[#918f8f] cursor-pointer'>If you have invitation to this room and see this, contact the room owner.</p>
        </div>
        <Link className='mt-4 border-2 cursor-pointer hover:text-lg h-12 duration-150 border-[#91864c] py-2 px-1 rounded-lg flex justify-center items-center' href={'https://im3.live/'}>
            <button>
                <span className='font-bold'>
                Return to im3
                </span> 
            </button>
        </Link>
    </section>
  )
}

export default ForbiddenCard