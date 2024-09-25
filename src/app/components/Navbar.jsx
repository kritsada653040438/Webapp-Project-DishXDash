"use client"
import React from 'react'
import Link from 'next/link'
import NextLogo from '../../../public/custom-logo.png'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

function Navbar({ session }) {
  const pathname = usePathname()

  const isActive = (path) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  const navItems = [
    { name: 'Discover', path: '/discover' },
    { name: 'Top Picks', path: '/top-picks' },
    { name: 'Quick Eats', path: '/quick-eats' },
    { name: 'Menu', path: '/menu' },
  ]

  return (
    <nav className='bg-white shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex-shrink-0 flex items-center'>
            <Link href="/">
              <Image src={NextLogo} width={150} height={150} alt='FatsFood-logo' className="brightness-1" />
            </Link>
          </div>
          <div className='flex items-center justify-center flex-1'>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-600 hover:text-black hover:border-b-2 hover:border-black'
                  } px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className='flex items-center'>
            {!session ? (
              <div className='flex space-x-4'>
                <Link 
                  href="/login" 
                  className={`${
                    isActive('/login')
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  } px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out`}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className={`${
                    isActive('/register')
                      ? 'bg-black text-white'
                      : 'bg-gray-800 text-white hover:bg-black'
                  } px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out`}
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className='flex space-x-4'>
                <Link 
                  href="/welcome" 
                  className={`${
                    isActive('/welcome')
                      ? 'bg-gray-200 text-black'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out`}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className='bg-gray-800 text-white hover:bg-black px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar