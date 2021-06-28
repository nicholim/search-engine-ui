import React from 'react';
import {MDBNavbarLink} from 'mdb-react-ui-kit';

const Link=({href, children})=>{
    const onClick=(event)=>{
        if(event.metaKey||event.ctrlKey){
            return;
        }

        event.preventDefault();
        window.history.pushState({}, '', href);

        const navEvent=new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
    };

    function checkHome() {
        if (href === "/") {
            return <MDBNavbarLink active aria-current='page' onClick={onClick} href={href}>{children}</MDBNavbarLink>;
        }
        return <MDBNavbarLink onClick={onClick} href={href}>{children}</MDBNavbarLink>;
    }

    return (
        checkHome()
    );
};

export default Link;