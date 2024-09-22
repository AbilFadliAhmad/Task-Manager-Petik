import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const Footer = ({jumlahHalaman, halaman}) => {



    const tambahkanHalaman = async()=>{
        halaman = halaman + 1;
        const params = new URLSearchParams(window.location.search);
        if(params.has('halaman')){
            params.set('halaman', halaman)
        } else {
            params.append('halaman', halaman)
        }
        window.location.search = params.toString();
    }


    const kurangiHalaman = ()=>{
        halaman = halaman - 1;
        const params = new URLSearchParams(window.location.search);
        if(params.has('halaman')){
            params.set('halaman', halaman)
        } else {
            params.append('halaman', halaman)
        }
        window.location.search = params.toString();
    }

  return (
        <div className='flex justify-between mx-2 mt-4'>
            <div onClick={kurangiHalaman} className={`flex gap-2 items-center cursor-pointer hover:text-[#326cd1]    ${halaman == 1 ? 'invisible' : ''}`}>
              <FaArrowLeft className='text-lg' />
              <span  className='text-xl'>Sebelumnya</span>
            </div>
            <div onClick={tambahkanHalaman} className={`flex gap-2 items-center cursor-pointer hover:text-[#326cd1] ${halaman + 1 > jumlahHalaman ? 'invisible' : ''}`}>
              <span className='text-xl'>Selanjutnya</span>
              <FaArrowRight className='text-lg' />
            </div>
        </div>
  )
}

export default Footer