import React from 'react'; 

class TopicMenu extends React.Component {
// NOTE could be rewritten as function
    constructor(props) {
        super(props);
    } 

    renderTopicItem(i) {
        if (this.props.data.menuIsLoaded) {
            return (<TopicItem
                name={this.props.data.topics[i].name}
                onClick={() => this.props.onClick(i)}
                identifier={this.props.data.topics[i].id}
                topicSelected={this.props.data.topicSelected}
                topicIndex={i}
                key={this.props.data.topics[i].id}
            />);
        } else {
            return null;
        }
    }
    
    render() {
        const currentTopics = [];
        if (this.props.data.menuIsLoaded) {
            this.props.data.topics.forEach((element, index) => {
            currentTopics.push(this.renderTopicItem(index));
            });
            
            return (
            <div className="border-end bg-white" id="sidebar-wrapper">
                <div id="topics-header" className="sidebar-heading border-bottom bg-light" tabIndex="0" onKeyDown={this.props.keyDownHandler}>Topics</div>
                <div className="list-group list-group-flush">{currentTopics}</div>
            </div>
            );    
        } else return null;
    }
}
  
function TopicItem(props) {
    var topicClass;
    if (props.topicSelected == props.topicIndex) {
        topicClass='list-group-item list-group-item-action list-group-item-light p-3 topicSelected';
    } else {
        topicClass = 'list-group-item list-group-item-action list-group-item-light p-3';
    }
    return (
        <button id={'topic-'+props.topicIndex} onKeyDown={props.keyDownHandler} onClick={props.onClick} className={topicClass} key={'topic-'+props.identifier}>{props.name}</button>
    );
}

export default TopicMenu;