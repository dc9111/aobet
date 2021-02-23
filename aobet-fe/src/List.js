import './App.css';
import ListItem from './ListItem.js'
import React from 'react';
import getBets from '../src/functions/app.js'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viableBets: []

    };
  }

 handleClick() {
    getBets().then(data => {
      this.setState({viableBets: data})
  });
}
        

  renderListItem(){
    return (
      <ListItem 
        
      />
    )
  }
  render() {

    if (this.state.viableBets.length > 0) {
      var listedBets = 
      this.state.viableBets.map(viableBets => <ListItem 
      key={viableBets.id}
      date={viableBets.date}
      team1={viableBets.team1}
      team2={viableBets.team2}
      site1={viableBets.site1}
      site2={viableBets.site2}
      site3={viableBets.site3}
      maxHome={viableBets.maxHome}
      maxAway={viableBets.maxAway}
      maxDraw={viableBets.maxDraw}
      point={viableBets.point}
      
      />);
    }
    
    return(
    <div className="List">
      <div>
        {listedBets}
        </div>
        <div>
        <button 
        className='btn' 
        onClick={() => this.handleClick()}
        >Return
        </button>
      </div>
    </div>
    )
  }
}

export default List