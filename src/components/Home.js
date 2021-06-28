import React, {useState, useEffect} from 'react';
import VirtualizedCheckbox from 'react-virtualized-checkbox';
import RenderedResults from './RenderedResults'

import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBBtn,
    MDBInput,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBIcon
} from 'mdb-react-ui-kit';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const Home = () => {

    // search bar main components
    const [term, setTerm] = useState('head of cse');
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [results, setResults] = useState([]);
    const [loaded, setLoaded] = useState(true);

    // retrieve results from query in searching bar
    useEffect(()=>{
        const timerId=setTimeout(()=>{
            if(term) {
                setDebouncedTerm(term);
            }
        }, 200);
        return () => {
            clearTimeout(timerId);
        };
    }, [term]);

    const search=async()=>{
        const {data} = await axios.get('http://143.89.130.177/search',{
            // const {data} = await axios.get('http://localhost:8888/search',{
            mode: 'no-cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            params: {
                id: uuidv4(),
                queryString: debouncedTerm
            }
        });
        setResults(data);
        setLoaded(true);
    };

    // indexed data run once
    const [indexed, setIndexed] = useState([]);
    useEffect(()=>{
        const searchIndexed=async()=> {
            await axios.get('http://143.89.130.177/indexed', {
                // const {data} = await axios.get('http://localhost:8888/indexed',{
                mode: 'no-cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                setIndexed(response.data);
            });
        };
        const timer = setTimeout(() => {
            searchIndexed();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    // posting irrelevant query to API for weighting changes
    const relevantSad = () => {
        let listUrls = [];
        let count = 0;
        results.map(result=>{
            if(count<5) {
                listUrls.push(result.url);
                count++;
            }
            else{
                return;
            }
        });

        const searchIrrelevant=async()=>{
            await axios.post('http://143.89.130.177/irrelevance',{
                query: debouncedTerm,
                urls: listUrls
            });
        };
        searchIrrelevant();
    };

    // returning searched results lazy
    // const RenderedResults = React.lazy(()=>import('./RenderedResults'))

    // handle checkbox input
    let allTerm = [];
    let allTermIndex = [];
    const handleChecked = (props) => {
        const checkedValue = props.label;
        let checkedValueRef = 0;
        if(props.checked) {
            allTerm.push(checkedValue);
            allTermIndex.push(checkedValueRef);
            checkedValueRef++;
        }
        else if(!props.checked && allTerm.includes(checkedValue)){
            allTerm = allTerm.filter(item => item !==checkedValue);
            allTermIndex = allTermIndex.filter(item => item !==checkedValueRef);
        }
    };

    // retrieve all stemmed keywords returning checkbox
    const [basicModal, setBasicModal] = useState(false);
    const IndexedResults =  () => {
        let keyName = ['label', 'id', 'checked'];
        let items = [];
        for (let i=0; i<indexed.length;i++){
            let obj = {};
            obj[keyName[0]] = indexed[i];
            obj[keyName[1]] = "flexCheck_"+i;
            obj[keyName[2]] = false;
            items.push(obj);
        }
        return (
            // <MDBCheckbox name={stem} value={stem} id={"flexCheck_"+index} label={stem} onBlur={handleChecked}/>
            <VirtualizedCheckbox
                items={items}
                onChange={item=>handleChecked(item)}
                hasOkButton={false}
                hasCancelButton={false}
                rowHeight={40}
                height={310}
            />
        );
    };

    // returning selected query and insert into search bar
    const submitSelectedQuery = () => {
        let finQuery="";
        for(let i=0; i<allTerm.length; i++) {
            finQuery=i===0?allTerm[i]:finQuery + " " + allTerm[i];
        }
        // for(let i=0; i<allTermIndex.length; i++) {
        //     document.querySelector('#'+allTermIndex[i]).checked=false;
        // }
        setTerm(finQuery);
        setBasicModal(!basicModal);
    };

    const [isTyping, setIsTyping] = useState(false);

    return(
        <div className="home" style={{marginTop: "150px"}}>
            <MDBContainer className="justify-content-center align-items-center">
                <MDBRow className="mt-5">
                    <MDBCol md="10" lg="8" xl="7" className="mx-auto mb-5">
                        <MDBCard className="mask-custom">
                            <MDBCardHeader className="bg-transparent">
                                <div className="input-group input-group-lg">
                                    <form id="searchForm" className="d-flex align-items-center flex-nowrap">
                                        <MDBInput label='Search' id='form1' type='text' size='lg' value={term} onChange={e=> {
                                            setTerm(e.target.value); setIsTyping(true);
                                        }}/>
                                        <MDBBtn type="submit" onClick={e=> {
                                            e.preventDefault(); setResults([]); setLoaded(false); setIsTyping(false); search();
                                        }}>
                                            <MDBIcon fas icon='search'></MDBIcon>
                                        </MDBBtn>
                                    </form>
                                </div>
                            </MDBCardHeader>
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol md="4" className="d-flex col-md-4 align-items-center">
                                        <MDBBtn rounded color='link' href="https://google.com" rel="noopener noreferrer" target="_blank" size='lg' onClick={()=>relevantSad(results)}>Not satisfied?</MDBBtn>
                                    </MDBCol>
                                    <MDBCol sm="12" md="6" className="px-0">
                                        <div className="d-flex justify-content-md-end">
                                            <MDBBtn rounded color='red' onClick={() => setBasicModal(!basicModal)} size='lg' toggle>Keyword Dictionary</MDBBtn>
                                            <MDBModal tabIndex='-1' show={basicModal} getOpenState={(e) => setBasicModal(e)}>
                                                <MDBModalDialog centered className="modal-dialog" size="lg">
                                                    <MDBModalContent>
                                                        <MDBModalHeader>
                                                            <MDBModalTitle>Select Keywords</MDBModalTitle>
                                                            <MDBBtn className='btn-close' color='none' onClick={() => setBasicModal(!basicModal)}></MDBBtn>
                                                        </MDBModalHeader>
                                                        <MDBModalBody>
                                                            <IndexedResults />
                                                        </MDBModalBody>
                                                        <MDBModalFooter>
                                                            <MDBBtn color='danger' onClick={() => setBasicModal(!basicModal)}>
                                                                Close
                                                            </MDBBtn>
                                                            <MDBBtn color='success' onClick={submitSelectedQuery}>Submit query</MDBBtn>
                                                        </MDBModalFooter>
                                                    </MDBModalContent>
                                                </MDBModalDialog>
                                            </MDBModal>
                                        </div>
                                    </MDBCol>
                                    <MDBCol sm="12" md="1" className="pe-0">
                                        <div className="d-flex justify-content-md-start">
                                            <MDBBtn rounded color='danger' size='lg' type="reset" data-mdb-ripple-color="dark" onClick={()=>setTerm("")}>
                                                <MDBIcon fas icon='backspace'></MDBIcon>
                                            </MDBBtn>
                                        </div>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                        {isTyping===true?<h2> Waiting for your query...⌛ </h2>:
                            (loaded===false?<h2> Please wait 🙏 </h2>:
                            <RenderedResults retrieved={results} term={debouncedTerm}/>
                        )}
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
};

export default Home;