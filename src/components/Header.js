import React, {useState} from 'react';
import { MDBNavbar, MDBNavbarBrand ,MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBIcon} from 'mdb-react-ui-kit';
import { BrowserRouter as Router } from 'react-router-dom';
import Link from './Link';

export default function Header() {
    const [showNav, setShowNav] = useState(false);

    return(
        <div>
            <Router>
                <header>
                  {/*<MDBNavbar expand='lg' light bgColor='light' scrolling>*/}
                  <MDBNavbar scrolling light expand='md' fixed="top">
                      <MDBNavbarBrand href="/">
                          <img
                              src='/bolang.png'
                              height='70'
                              alt='Bolang Explorer'
                          />
                          Brought by ANJAS
                          {/*<strong className="white-text">The Search Engine</strong>*/}
                      </MDBNavbarBrand>
                      <MDBNavbarToggler
                          aria-expanded='false'
                          aria-label='Toggle navigation'
                          onClick={() => setShowNav(!showNav)}
                      ><MDBIcon icon='bars' fas />
                      </MDBNavbarToggler>
                      <MDBCollapse navbar show={showNav}>
                          <MDBNavbarNav left>
                              <Link href="/">
                                  Home
                              </Link>
                              <Link href="/wikisearch">
                                  Search on Wikipedia
                              </Link>
                          </MDBNavbarNav>
                      </MDBCollapse>

                  </MDBNavbar>
                </header>
            </Router>
        </div>
    );
}