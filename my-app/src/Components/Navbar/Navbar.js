import React from 'react';
import './styles/Navbar.css'
import Input from './Input';
import LoginButton from './Buttons/LoginButton';
import RegistButton from './Buttons/RegistButton';
function Navbar() {
    
  return (
           <nav className="navbar navbar-expand-lg navbar-transparent bg-transparent border">
                <div className="container">
                    <a className="navbar-brand" href="#">CPGE XXXX----</a>
                    <div className="row">
                        <Input />
                    </div>
                    <div className="row btn-custom">
                        <LoginButton />
                        <RegistButton />
                    </div>
                </div>
            </nav>
           
       
        
  );
}

export default Navbar;