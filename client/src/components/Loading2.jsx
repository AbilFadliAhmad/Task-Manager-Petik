import React, { useEffect } from 'react';

const Loading2 = () => {
  const [condition, setCondition] = React.useState(false)

  useEffect(() => {
    setInterval(() => {
      setCondition(!condition);
    }, 5000);
  }, [condition]);
  return (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="flex flex-col gap-4 leading-[10px]">
        <div className="place-self-center border-4 border-t-[#1ccd1c] border-gray-800 rounded-full w-16 h-16 animate-spin"></div>
        <h1 className="place-self-center font-bold">{condition ? 'Jika Loading terus' : 'Tunggu Sebentar'}</h1>
        <h1 className="place-self-center font-bold">{condition ? 'Coba keluar lalu Login Kembali' : 'Sedang Memuat'}</h1>
      </div>
    </div>
  );
};

export default Loading2;
