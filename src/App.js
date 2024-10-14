import React, {useState} from 'react';
import Route from './components/Route';
import Header from './components/Header';
import Home from './components/Home';
import Wikisearch from "./components/Wikisearch";
import Toggle from "./components/Toggle";
import { MDBRow, MDBFooter } from 'mdb-react-ui-kit';
import {ThemeProvider} from "styled-components";
import {GlobalStyles, lightTheme, darkTheme} from "./components/global";

export default () => {

    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        // if the theme is not light, then set it to dark
        if (theme === 'light') {
            setTheme('dark');
            // otherwise, it should be light
        } else {
            setTheme('light');
        }
    }
  return (
      <>
          <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
              <div className="bg" style={{ backgroundImage: "url(/bolang-bg-city.png)" }}>
                  <MDBRow className="g-0">
                      <Header />
                      <GlobalStyles />
                      <Toggle theme={theme} toggleTheme={toggleTheme} />
                  </MDBRow>
                  <Route path="/">
                      <Home/>
                  </Route>
                  <Route path="/wikisearch">
                      <Wikisearch/>
                  </Route>
              </div>
          </ThemeProvider>
          <MDBFooter className='bg-dark text-white text-center text-lg-left'>
              <div className='text-center p-3' >
                  &copy; {new Date().getFullYear()} Copyright: NL
              </div>
          </MDBFooter>
      </>
  );
};
