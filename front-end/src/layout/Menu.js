import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className='navbar navbar-dark align-items-start p-0'>
      <div className='container-fluid d-flex flex-column p-0'>
        <div className='d-flex justify-content-between align-items-center w-100 p-2'>
          <Link className='navbar-brand m-0' to='/'>
            <div className='sidebar-brand-text'>
              <span>Periodic Tables</span>
            </div>
          </Link>
          <div className='d-md-none'>
            {showMenu ? (
              <AiOutlineClose
                style={{ fontSize: '20px' }}
                className='cursor-pointer text-white'
                onClick={handleMenuToggle}
              />
            ) : (
              <GiHamburgerMenu
                style={{ fontSize: '25px' }}
                className='cursor-pointer text-white'
                onClick={handleMenuToggle}
              />
            )}
          </div>
        </div>
        <hr className='sidebar-divider my-0' />
        <ul
          className={`nav navbar-nav text-light ${
            showMenu ? 'd-block' : 'd-md-block d-none'
          }`}
          id='accordionSidebar'
        >
          <li className='nav-item'>
            <Link className='nav-link' to='/dashboard'>
              <span className='oi oi-dashboard' />
              &nbsp;Dashboard
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/search'>
              <span className='oi oi-magnifying-glass' />
              &nbsp;Search
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/reservations/new'>
              <span className='oi oi-plus' />
              &nbsp;New Reservation
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/tables/new'>
              <span className='oi oi-layers' />
              &nbsp;New Table
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Menu;
