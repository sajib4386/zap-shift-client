import React from 'react'
import Logo from '../Logo/Logo'
import { Outlet } from 'react-router'
import authImg from "../../assets/authImage.png"

const AuthLayout = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <Logo></Logo>
            <div className='flex justify-between items-center w-full h-screen'>
                <div>
                    <Outlet></Outlet>
                </div>
                <div>
                    <img src={authImg} alt="" />
                </div>
            </div>
        </div>
    )
}

export default AuthLayout