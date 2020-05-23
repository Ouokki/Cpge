import React from 'react'
import useWindowSize from '../useWindowSize/useWindowSize';
import Navbar from '../Navbar/Navbar';
import BottomNavbar from '../Navbar/BottomNavbar';


function Home() {
    const [width, height] = useWindowSize();
    let navbar;
    if (width<1200) {
        navbar = <BottomNavbar />;
    } else {
        navbar = <Navbar />;
    }
    return (
        <div>
            {navbar}
        </div>
    )
}
export default Home;