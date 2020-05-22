import React from 'react';
import './Navbar.css'
import Input from './Input';
import LoginButton from './LoginButton';
import RegistButton from './RegistButton';
import useWindowSize from '../useWindowSize/useWindowSize';
function Navbar() {
    const [width, height] = useWindowSize();
  return (
       <div>
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
           <span>Window size: {width} x {height}</span>
       </div>
        
  );
}

export default Navbar;