import './ListItem.css';

function ListItem(props) {

  let timestamp = props.date;
  let date = new Date(timestamp*1000).toDateString();
  

  return (
    <div className="ListItem">
      <table>
      <tr>
        <td>{date}</td>
        <td>{props.team1}</td>
        <td>{props.team2}</td>
        <td>{props.site1}</td>
        <td>{props.maxHome}</td>
        <td>{props.site2}</td>
        <td>{props.maxAway}</td>
        <td>{props.site3}</td>
        <td>{props.maxDraw}</td>
        <td>{props.point}</td>
      </tr>
      </table>
    </div>
  );
}

export default ListItem;
