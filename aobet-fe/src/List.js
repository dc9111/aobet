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
    const viableBets = getBets();
    this.setState.viableBets = viableBets;
  }

  renderListItem(){
    return (
      <ListItem 
        
      />
    )
  }
  render() {
    
    return(
    <div className="List">
      <div>
        {this.state.viableBets.map(viableBets => <ListItem key={viableBets.id}/>)}
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