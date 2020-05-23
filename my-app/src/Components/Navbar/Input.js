import React from 'react'
import './styles/Input.css'
function Input() {
    return (
        <div>
            <input type="search" className="form-control Input shadow-none" aria-describedby="searchHelp" placeholder="Recherche" />
        </div>
    )
}
export default Input;