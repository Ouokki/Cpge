import React from 'react';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import useWindowSize from '../useWindowSize/useWindowSize';
import Navbar from '../Navbar/Navbar';
import BottomNavbar from '../Navbar/BottomNavbar';
import './main.css'
function Main() {
    const [width, height] = useWindowSize();
    let sides,navbar;
    if (width>=1200) {
        navbar = <Navbar />;
        sides = <div className="row">
                    <div className="col-5">
                        <LeftSide />
                    </div>
                    <div className="right border-left border-right">
                        <RightSide />
                    </div>
                </div>
    } else {
        navbar = <BottomNavbar />;
        sides = <div className="row">
                    <div className="right-resized border-left border-right">
                        <RightSide />
                    </div>
                </div>
    
    }
    return (
        <div>
            {navbar}
            <div className="container">
                {sides}
            </div>
        </div>
        
        
    )
}

export default  Main;