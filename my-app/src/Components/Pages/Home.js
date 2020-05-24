import React from 'react'
import useWindowSize from '../useWindowSize/useWindowSize';
import Navbar from '../Navbar/Navbar';
import BottomNavbar from '../Navbar/BottomNavbar';
import LeftSide from '../FirstPageComponents/LeftSide';


function Home() {
    const [width, height] = useWindowSize();
    let navbar,leftside;
    if (width<1200) {
        navbar = <BottomNavbar />;
        leftside=null
    } else {
        navbar = <Navbar />;
        leftside=<LeftSide/>
    }
    return (
        <div>
            {navbar}
            {leftside}
            
        </div>
    )
}
export default Home;