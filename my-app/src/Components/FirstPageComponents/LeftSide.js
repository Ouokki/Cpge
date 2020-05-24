import React from 'react'
import './LeftSide.css'
function LeftSide() {
    return (
        <div className="container">
            <div className="side border">
                <div className="inside">
                            <form > 
                                <div className="form-label-group">
                                    <input  name ="email" type="text" id="inputEmail" className="form-control shadow-none" placeholder="Email address" required autoFocus/>
                                    <label htmlFor="inputEmail">Email address</label>
                                </div>
                                 <div className="form-label-group">
                                    <input  name="password" type="password" id="inputPassword" className="form-control shadow-none" placeholder="Password" required />
                                    <label htmlFor="inputPassword">Password</label>
                                </div>
                                <button className="btn login-side">Se connecter</button>
                                <p class="accountText">Dont have an account yet ?</p>
                                <button className="btn regist-side">S'inscrire</button>
                            </form>
                </div>
            </div>
        </div>
    )
}
export default LeftSide;