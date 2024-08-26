import React from 'react'

function ParticipantBoxLazy() {
  return (
    <div className="flex w-full flex-col py-2.5 rounded-lg bg-[#111] gap-1 justify-start items-center text-sm animate-pulse my-4">
        <div className="flex flex-col w-full animate-pulse pt-3 px-3">
          <div className="flex justify-start items-start animate-pulse h-12">
            <section className="flex w-full items-center justify-between">
              <div className="bg-[#2b2b2b] h-2.5 w-1/12 rounded-sm"></div>
              <div className="bg-yellow-900 h-2.5 w-1/12 rounded-sm"></div>
            </section>
          </div>
          <div className='bg-[#2b2b2b] h-5 w-5/12 rounded-sm'></div>
      </div>
    </div>
  );
}

export default ParticipantBoxLazy;