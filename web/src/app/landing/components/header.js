import React, { useState } from 'react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="flex h-20 justify-between items-center p-5 bg-black backdrop-filter backdrop-blur-sm bg-opacity-10 border-b text-white border-gray-900 shadow-md">
            <div className="text-2xl font-bold">
                BIDE
            </div>

            <nav className="hidden md:flex space-x-2 px-10 py-1 border-2 border-gray-500 rounded-full">
                <ul className="flex space-x-4">
                    <li><a href="#home" className="hover:text-blue-500">Home</a></li>
                    <li><a href="#about" className="hover:text-blue-500">About</a></li>
                </ul>
            </nav>

            <div>
                <a href="/login" className="hidden md:flex px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Get Started</a>
            </div>

            <div className="md:hidden z-40">
                <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>

            <div className={`${isOpen ? 'block' : 'hidden'} z-[2] md:hidden absolute top-0 left-0 w-full h-screen bg-[#050505] bg-opacity-80`}>
                <nav className="flex flex-col items-center justify-center h-full space-y-5 text-center">
                    <ul className="flex flex-col space-y-4">
                        <li><a href="#home" className="hover:text-blue-500">Home</a></li>
                        <li><a href="#about" className="hover:text-blue-500">About</a></li>
                    </ul>
                    <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Get Started</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;