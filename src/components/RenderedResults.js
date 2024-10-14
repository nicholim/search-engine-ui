import React, {useState} from 'react';
import {MDBBtn, MDBCard, MDBCol, MDBCollapse, MDBListGroup, MDBListGroupItem} from "mdb-react-ui-kit";
import axios from "axios";
import {v4 as uuidv4} from "uuid";

// returning searched results
const RenderedResults = (props) =>{
    const [activeIndex, setActiveIndex] = useState(1);

    // posting relevant query to API for weighting changes
    const relevantHappy = (link) => {
        const searchRelevant=async()=>{            
            await axios.post('/relevance',{
                id: uuidv4(),
                url: link,
                query: props.term
            });
        };
        searchRelevant();
    };

    const PrintAccordion = () => {
        return(
            props.retrieved.map(result => {
                const uniqueID = result.id;
                const accorShow = activeIndex === uniqueID ? true : false;

                return (
                    <MDBCard className="card-accor">
                        <div key={uniqueID} className="accordion">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button data-bs-toggle="collapse" data-bs-target={"#" + uniqueID}
                                            className={accorShow === true ? "accordion-button" : "accordion-button collapsed"}
                                            type="button" aria-controls={uniqueID} onClick={() => {
                                        setActiveIndex(uniqueID);
                                    }}>
                                        <MDBCol md="9" className="text-start">
                                            {result.pageTitle === "" ? "This page has no title" : result.pageTitle}
                                        </MDBCol>
                                        <MDBCol md="2">
                                            <div className="circle">{result.score.toFixed(3)}</div>
                                        </MDBCol>
                                    </button>
                                </h2>
                                <MDBCollapse show={accorShow} style={{display: accorShow === true ? "block" : "none"}}
                                             className="accordion-collapse collapse show" id={uniqueID}>
                                    <div className={accorShow === true ? "accordion-body show" : "accordion-body"}>
                                        <MDBBtn color="link" href={result.url} rel="noopener noreferrer" target="_blank"
                                                onClick={() => relevantHappy(result.url)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-link-45deg" viewBox="0 0 16 16">
                                                <path
                                                    d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                                <path
                                                    d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                            </svg>
                                            {result.url}
                                        </MDBBtn>
                                        <br/>
                                        <br/>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-calendar-check"
                                             viewBox="0 0 16 16">
                                            <path
                                                d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                            <path
                                                d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                        </svg>
                                        <span>      </span>{result.lastModifiedDate}
                                        <br/>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                             className="bi bi-aspect-ratio" viewBox="0 0 16 16">
                                            <path
                                                d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
                                            <path
                                                d="M2 4.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H3v2.5a.5.5 0 0 1-1 0v-3zm12 7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H13V8.5a.5.5 0 0 1 1 0v3z"/>
                                        </svg>
                                        <span>      </span>{result.pageSize} bytes
                                        <br/><br/>
                                        Keywords and Frequencies:
                                        <br/>
                                        {
                                            Object.entries(result.keywordToFreq).map(([key, freq]) => {
                                                return (
                                                    <>
                                                        <span className="badge rounded-pill bg-light text-dark">
                                                            {key} <span
                                                            className="badge bg-success rounded-pill">{freq}</span>
                                                        </span><span></span>
                                                    </>
                                                );
                                            })
                                        }
                                        <br/><br/>
                                        Parent Links:
                                        <MDBListGroup variant="flush">
                                            {
                                                result.parentUrls.map(parentUrl => {
                                                    return (
                                                        <MDBListGroupItem><a href={parentUrl} rel="noopener noreferrer"
                                                                             target="_blank">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16"
                                                                 fill="currentColor"
                                                                 className="bi bi-link-45deg" viewBox="0 0 16 16">
                                                                <path
                                                                    d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                                                <path
                                                                    d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                                            </svg>
                                                            <span></span>{parentUrl}</a></MDBListGroupItem>
                                                    );
                                                })
                                            }
                                        </MDBListGroup>
                                        <br/>
                                        Child Links:
                                        <MDBListGroup variant="flush">
                                            {
                                                result.childUrls.map(childUrl => {
                                                    return (
                                                        <MDBListGroupItem><a href={childUrl} rel="noopener noreferrer"
                                                                             target="_blank">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16"
                                                                 fill="currentColor"
                                                                 className="bi bi-link-45deg" viewBox="0 0 16 16">
                                                                <path
                                                                    d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                                                <path
                                                                    d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                                            </svg>
                                                            <span></span>{childUrl}</a></MDBListGroupItem>
                                                    );
                                                })
                                            }
                                        </MDBListGroup>
                                    </div>
                                </MDBCollapse>
                            </div>
                        </div>
                    </MDBCard>
                );
            })
        );
    };

    return (
        <>
            <h2>Found {props.retrieved.length} results!</h2>
            <PrintAccordion />
        </>
    );
}

export default RenderedResults;