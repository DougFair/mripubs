import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
import PapersDisplay from './PapersDisplay';
import moment from 'moment';
import DateInput from './DateInput'
import Abstracts from './Abstracts'
import Spinner from './Spinner'
import WelcomeBanner from './WelcomeBanner'
import {Route, Switch} from 'react-router-dom'

class App extends Component {
  state= {
    idlist: [],
    idlistInputedDate: [],
    papersList : [],
    papersListInputedDate : [],
    abstracts : [],
    dateMinus30: moment().subtract("30", "days").format("YYYY/MM/DD"),
    inputedDate1: "",
    inputedDate2: "",
    loading: false,
    institute: "Olivia Newton-John Cancer Research Institute",
    urlunencoded: "",
    dateinputError: false,
  }

  componentDidMount () {
    console.log("In Mount")
    this.setState({loading: true})
    let institute = this.state.institute
    const urlunencoded = `((${institute}[Affiliation]) AND ("`
    this.setState({urlunencoded})
    
    const dateParams = `${this.state.dateMinus30}"[Date - Entrez] : "3000"[Date - Entrez])`

    const urlEncoded = encodeURIComponent(urlunencoded)
    const dateParamsEncoded = encodeURIComponent(dateParams)
    const url =  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=1000&term=${urlEncoded}${dateParamsEncoded}`
    
    axios.get(url)
    .then(response => {
      this.setState({idlist: response.data.esearchresult.idlist, loading:false}, () => {
        this.addPapers(this.state.idlist)
        })
    })
  }

  
  addPapers = (idlist) => { 
    this.setState({loading: true})
    if (idlist) {
        let paperListString = idlist.toString();
        let paperList = []
      
          axios.get( `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&rettype=abstract&id=${paperListString}&api_key=9476810b14695bd14f228e63433facbf9c08`)
           .then(response => {
            this.setState({loading: false})
            idlist.forEach(id => {
              console.log("result" + JSON.stringify(response.data.result))

              let paperObj = {}
              let title = response.data.result[id].title
              let  journal = response.data.result[id].fulljournalname
              let  doi = response.data.result[id].elocationid
              let  authors = response.data.result[id].authors
              let  volume = response.data.result[id].volume
              let  pages = response.data.result[id].pages
              let  pubdate = response.data.result[id].pubdate
              let authorList = []
              authors.map((author, idx) =>
              idx > 0
                ? authorList.push(" " + author.name)
                : authorList.push(author.name)
              )
            paperObj.id = id;
            paperObj.title = title;
            paperObj.journal = journal;
            paperObj.authors = authorList.toString();
            paperObj.doi = doi;
            paperObj.volume = volume;
            paperObj.pages = pages;
            paperObj.pubdate = pubdate;
            paperList.push(paperObj);
            })       
          })
          .then(result => {
            paperList.length === this.state.idlist.length &&
            this.setState({ papersList: paperList })
          })
          .then(results => {
            this.state.papersList.length === this.state.idlist.length &&
            this.addAbstracts(this.state.idlist)
          })
      };
}

addPapersInputedDate = idlist => { 
  this.setState({loading: true})
  if (idlist) {
      let paperListString = idlist.toString();
      let paperList = []

        axios.get( `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&rettype=abstract&id=${paperListString}&api_key=9476810b14695bd14f228e63433facbf9c08`)
        .then(response => {
          this.setState({loading: false})
          idlist.forEach(id => {
            let paperObj = {}
            let title = response.data.result[id].title
            let  journal = response.data.result[id].fulljournalname
            let  doi = response.data.result[id].elocationid
            let  authors = response.data.result[id].authors
            let  volume = response.data.result[id].volume
            let  pages = response.data.result[id].pages
            let  pubdate = response.data.result[id].pubdate
            let authorList = []
            authors.map((author, idx) =>
            idx > 0
              ? authorList.push(" " + author.name)
              : authorList.push(author.name)
            )
          paperObj.id = id;
          paperObj.title = title;
          paperObj.journal = journal;
          paperObj.authors = authorList.toString();
          paperObj.volume = volume;
          paperObj.pages = pages;
          paperObj.pubdate = pubdate;
          paperObj.doi = doi;
          paperList.push(paperObj);
          }) 
        })
        .then(result => {
          paperList.length === this.state.idlistInputedDate.length &&
          this.setState({ papersListInputedDate: paperList });
        })
        .then(results => {
          this.state.papersListInputedDate.length === this.state.idlistInputedDate.length &&
          this.addAbstracts(this.state.idlistInputedDate)
        })
    };
}


addAbstracts = idlist => {
    let abstractList = [];
    let abstractObj = {};
    let idlistString = idlist.toString()
    axios.get(
       `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=text&rettype=abstract&id=${idlistString}&api_key=9476810b14695bd14f228e63433facbf9c08`
      )
      .then(response3 => {
        abstractObj.abstract = response3.data
        abstractList.push(abstractObj)
    })
    .then(results => {
      this.setState({abstracts: abstractList})
    })
}


dateInput = (date1, date2) => {
  if (date1 === "Error"){
    this.setState({dateInputError: true})
    return null
  } else {
  this.setState({inputedDate1:date1, inputedDate2:date2})
  
  const convertedDate1 = moment(date1, "YYYY-MM-DD").format("YYYY/MM/DD")
  let convertedDate2 = ""
  if (date2) {
  convertedDate2 = moment(date2, "YYYY-MM-DD").format("YYYY/MM/DD")
  }
  
  const dateParams = `${convertedDate1}"[Date - Entrez] : "3000"[Date - Entrez])`
  const dateParams2 = `${convertedDate1}"[Date - Entrez] : "${convertedDate2}"[Date - Entrez])`
  const urlEncoded = encodeURIComponent(this.state.urlunencoded)
  const dateParamsEncoded = encodeURIComponent(dateParams)
  const dateParamsEncoded2 = encodeURIComponent(dateParams2)
  let url = "";
  if (date2) { 
  url =  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=1000&term=${urlEncoded}${dateParamsEncoded2}`
  } else {
  url =  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=1000&term=${urlEncoded}${dateParamsEncoded}`
}
  axios.get(url)
  .then (response => 
    this.setState({idlistInputedDate: response.data.esearchresult.idlist}, () => {
      this.addPapersInputedDate(this.state.idlistInputedDate)
      }
  ) 
)}}

instituteSelect = (institute) => {
  this.setState({loading: true, institute: institute})
  const urlunencoded = `((${institute}[Affiliation]) AND ("`
  this.setState({urlunencoded})
  const dateParams = `${this.state.dateMinus30}"[Date - Entrez] : "3000"[Date - Entrez])`
  const urlEncoded = encodeURIComponent(urlunencoded)
  const dateParamsEncoded = encodeURIComponent(dateParams)
  const url =  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=1000&term=${urlEncoded}${dateParamsEncoded}`
  
  axios.get(url)
  .then(response => {
    this.setState({idlist: response.data.esearchresult.idlist, loading:false}, () => {
      this.addPapers(this.state.idlist)
      })
  })}


dateInputReset = () => this.setState({dateInputError:false})

  render() {
    let papersDisplay = ""
    let abstracts = ""
    let dateError = ""
    if (this.state.dateInputError) {
        dateError = 
        <div className="errorMessage">
          <h1>You must enter a start date!</h1>
          <form onSubmit={this.dateInputReset}>
            <button className="errorButton">Click to Re-enter Dates!</button>
          </form>
        </div>
  } else {
      papersDisplay =  <PapersDisplay 
      papersList = {this.state.papersList}
      papersListWeek = {this.state.papersListWeek}
      papersListInputedDate = {this.state.papersListInputedDate}
      inputedDate1 = {this.state.inputedDate1}
      inputedDate2 = {this.state.inputedDate2}
      /> 

      abstracts = <Abstracts 
      abstracts={this.state.abstracts}
      idlist={this.state.idlist}
    />

      if(this.state.loading) {
        papersDisplay = <Spinner />
        abstracts = <Spinner />
      }

    }
    return ( 
      <div className="App">
      <Switch>
          <Route exact path="/" render= {() => 
            <>
            <WelcomeBanner />
            <DateInput
              dateInput = {this.dateInput}
              instituteSelect = {this.instituteSelect}
            /> 
            <div className="displayContainer">
            {dateError}
            <h1 className="instituteTitle">{this.state.institute}</h1>
            {papersDisplay}
            </div>
            </>
            } 
            />
            <Route exact path="/abstracts" render={() =>
              abstracts
          }
          />
          
        </Switch>
      </div>

    );

}
}
export default App;
