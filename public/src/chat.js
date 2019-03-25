'use strict';
class Window extends React.Component {
  render(){
    return(
      <div className="main"></div>
    )
  }
}



class Chat extends React.Component {
    render() {
        return (
          <div>
            <Window />
          </div>
        );
    }
}
ReactDOM.render(
    <Chat />,
    document.getElementById('chat')
);
