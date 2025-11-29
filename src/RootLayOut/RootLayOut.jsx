import React from 'react'
import { Outlet } from 'react-router'
import NavBar from '../Shared/NavBar/NavBar'
import Footer from '../Shared/Footer/Footer'

const RootLayOut = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <NavBar></NavBar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    )
}

export default RootLayOut