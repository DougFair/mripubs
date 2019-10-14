import React from 'react'
import './PaperDisplay.css'
import moment from 'moment';
import LinkButton from './LinkButton'

const PapersDisplay = (props) => {
  if((props.inputedDate1 || props.inputedDate2) &&!props.papersListInputedDate.length) {
    return (
      <div className="noPapers">
      {!props.inputedDate2 ? 
      <h2>No papers published since {moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")}</h2>
      : 
      <h2 className="noPapers">No papers published between {moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")} - {moment(props.inputedDate2, "YYYY-MM-DD").format("DD/MM/YYYY")} </h2>
      }
    </div>
    )
  }
  if(props.papersListInputedDate.length){
    const inputedDate = props.papersListInputedDate.map(data => {
      let volume = ""
      if (data.volume === "") {
        volume = " volume/pages not yet available"
      } else {
      volume = `${data.volume}: `
    }

      return(
      <div className="paperlistContainer"
        key={data.id}>
        <span>
        <span className="title">{`${data.title} `}</span>
        <span className="authors">{`${data.authors}, `}</span>
        <span className="journal">{`${data.journal}  `}</span>
        <span className="volume">{`${volume} `}</span>
        <span className="pages">{`${data.pages},  `}</span>
        <span className="pubdate">Publication date: {`${data.pubdate},  `}</span>
        <span className="doi">{`${data.doi}, `}</span>
        <span className="pmid">PMID: <a href={`https://www.ncbi.nlm.nih.gov/pubmed/${data.id}`} target="_blank" rel="noopener noreferrer">{data.id}.</a></span>
        </span>
        </div>
    )})
  return (
    <div>
      {!props.inputedDate2 ? 
      <div style={{display:"flex", alignItems: "center"}}>
      <h2>Papers published since {moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")}</h2>
      <LinkButton to='/abstracts' style={{marginLeft:"20px"}}>Retrieve Abstracts</LinkButton>
      </div>
      :
      <div style={{display:"flex", alignItems: "center"}}>
        <h2>Papers published between {moment(props.inputedDate1, "YYYY-MM-DD").format("DD/MM/YYYY")} - {moment(props.inputedDate2, "YYYY-MM-DD").format("DD/MM/YYYY")} </h2>
        <LinkButton to='/abstracts' style={{marginLeft:"20px"}}>Retrieve Abstracts</LinkButton>
      </div>
      


      }
      {inputedDate}
    </div>
  )
  } else {
    const month = props.papersList.map(data => {
      let volume = ""
      if (data.volume === "") {
        volume = " volume/pages not yet available"
      } else {
      volume = `${data.volume}: `
    }

      return(
      <div className="paperlistContainer"
        key={data.id}>
        <span>
        <span className="title">{`${data.title} `}</span>
        <span className="authors">{`${data.authors}, `}</span>
        <span className="journal">{`${data.journal}  `}</span>
        <span className="volume">{`${volume} `}</span>
        <span className="pages">{`${data.pages},  `}</span>
        <span className="pubdate">Publication date: {`${data.pubdate},  `}</span>
          <span className="doi">{`${data.doi}, `}</span>
          <span className="pmid">PMID: <a href={`https://www.ncbi.nlm.nih.gov/pubmed/${data.id}`} target="_blank" rel="noopener noreferrer">{data.id}.</a></span>
        </span>
        </div>
    )})
     
    return (
        <div style={{margin: "10px 50px 10px 50px"}}>        
          <div style={{display:"flex", alignItems: "center"}}>
            <h2>Papers published in the last 30 days</h2>
            <LinkButton to='/abstracts' style={{marginLeft:"20px"}}>Retrieve Abstracts</LinkButton>
          </div>
          {!props.papersList.length ? 
          <p className="noPapers">No papers published in the last 30 days.</p>
          : month}
        </div>
    )
  } 
}

export default PapersDisplay