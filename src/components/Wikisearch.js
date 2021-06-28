import React, {useState, useEffect} from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardHeader, MDBBtn, MDBInput, MDBCollapse } from 'mdb-react-ui-kit';
import axios from 'axios';

const Wikisearch = () => {
    const [term, setTerm] = useState('information retrieval');
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [results, setResults] = useState([]);

    const [activeIndex, setActiveIndex] = useState(1);

    useEffect(()=>{
        const timerId=setTimeout(()=>{
            if(term) {
                setDebouncedTerm(term);
            }
        }, 600);
        return () => {
            clearTimeout(timerId);
        };
    }, [term]);

    useEffect(()=>{
        const search=async()=>{
            const {data} = await axios.get('https://en.wikipedia.org/w/api.php',{
                params: {
                    action: 'query',
                    list: 'search',
                    origin: '*',
                    format: 'json',
                    srsearch: debouncedTerm,
                }
            });
            setResults(data.query.search);
        };
        search();
    }, [debouncedTerm]);

    const returnResults = results.map(result=>{
        const uniqueID = result.pageid;
        const accorShow = activeIndex===uniqueID?true:false
        return (
            <MDBCard>
                <div key={uniqueID} className="accordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button data-bs-toggle="collapse" data-bs-target={"#"+uniqueID} className={accorShow===true?"accordion-button":"accordion-button collapsed"} type="button" aria-controls={uniqueID} onClick={() => {
                                setActiveIndex(uniqueID);
                            }}>
                                {result.title}
                            </button>
                        </h2>
                        <MDBCollapse show={accorShow} style={{display: accorShow===true?"block":"none"}} className="accordion-collapse collapse show" id={uniqueID}>
                            <div className={accorShow===true?"accordion-body show":"accordion-body"}>
                                <span dangerouslySetInnerHTML={{__html: result.snippet}}></span>
                            </div>
                            <MDBBtn size ="sm" style={{display: 'block'}}  href={`https://en.wikipedia.org?curid=${uniqueID}`} target="_blank">Go</MDBBtn>
                        </MDBCollapse>
                    </div>
                </div>
            </MDBCard>
        );
    });

    return(
        <div className="home" style={{marginTop: "150px"}}>
            <MDBContainer className="justify-content-center align-items-center">
                <MDBRow className="mt-5">
                    <MDBCol md="10" lg="8" xl="7" className="mx-auto mb-5">
                        <MDBCard className="mask-custom">
                            <MDBCardHeader className="bg-transparent">
                                <div className="input-group input-group-lg">
                                    <form id="searchForm">
                                        <MDBInput label='Search' id='form1' type='text' size='lg' value={term} onChange={e=>setTerm(e.target.value)} />
                                    </form>
                                </div>
                                <div className="d-flex justify-content-md-end" style={{paddingBottom: "20px"}}>
                                    <MDBBtn rounded size='lg' color='danger' type="reset" data-mdb-ripple-color="dark" onClick={()=>setTerm("")}>Reset</MDBBtn>
                                </div>
                            </MDBCardHeader>
                        </MDBCard>
                        {returnResults}
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
};

export default Wikisearch;