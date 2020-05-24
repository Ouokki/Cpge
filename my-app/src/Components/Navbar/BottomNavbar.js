import React from 'react'
import './styles/Navbar.css'
import ButtomRegistButton from './Buttons/BottomLoginButton';
import ButtomLoginButton from './Buttons/BottomRegistButton';
function BottomNavbar() {
    return (
            <nav className="navbar fixed-bottom navbar-expand-lg navbar-transparent bg-transparent border-top">
                <div className="container">
                    
                    <div className="row btn-custom-bottom">
                        <ButtomRegistButton />
                        <ButtomLoginButton />
                    </div>
                    
                </div>
            </nav>
       
    )
}
export default BottomNavbar;