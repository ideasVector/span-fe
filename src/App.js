import './styles.css';
import './imageGrid.css';
import React from 'react';  
import ImageContainer from './ImageContainer.js';
import TopicMenu from './TopicMenu.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        // State is lifted to application level for all components
        this.state = {
            topicSelected: null,
            imageSelected: null,
            error: null,
            menuIsLoaded: false,
            topics: [],
            // Status only used for initial state when images haven't renedered yet
            status: 'new',
            photos: [],
            columnOffset: 0,
        };
        this.fetchTopics();
    }

    fetchTopics() {
      // NOTE: should not expose client secret here - in production this would be handled via application settings and wrapped in a server-side API endpoint
      fetch("https://api.unsplash.com/topics?client_id=vR12X8SSrM9j15ExG85UhuBhQY3Z13xc8bclZehdXYc&order_by=featured")
        .then((res) => res.json())
        .then(
          (data) => {
            const topics = [];
            data.forEach(element => {
              let topic = {name: element.title, description: element.description, id: element.id};
              topics.push(topic)
            });
            this.setState ({
              menuIsLoaded: true,
              topics: topics,
            });
          },
          (error) => {
            this.setState ({
              menuIsLoaded: true,
              error
            });
            //NOTE: should implement decent error handling in the event of API failure
            alert(error);
          }
        );
    }

    fetchTopicImages(index) {
      // NOTE: should not expose client secret here - in production this would be handled via application settings and wrapped in a server-side API endpoint
      fetch("https://api.unsplash.com/topics/"+this.state.topics[index].id+"/photos?client_id=vR12X8SSrM9j15ExG85UhuBhQY3Z13xc8bclZehdXYc&per_page=20")
        .then((res) => res.json())
        .then(
          (data) => {
            const photos = [];
            data.forEach(element => {
              let photo = {id: element.id, url: element.urls.small};
              photos.push(photo)
            });
            this.setState ({
              menuIsLoaded: true,
              photos: photos,
              status: 'fetched'
            });
          },
          (error) => {
            this.setState ({
              menuIsLoaded: true,
              error
            });
            alert(error);
          }
        );
    }

    handleMenuClick(i) {
        this.setState({
            topicSelected: i,
            imageSelected: null,
            columnOffset: 0
          });
        this.fetchTopicImages(i);
        // Hack to reset media scoller state directly via DOM
        document.getElementById('media-scroller').scrollLeft = 0;
        document.getElementById('left-paddle').style.visibility = 'hidden';
    }

    handleScrollClickLeft() {
      this.setState({columnOffset: this.state.columnOffset - 1});
      // Scrolling distances determined by trial and error - ideally scrolling would bring relevant column into view
      sideScroll(document.getElementById('media-scroller'), 10, 525, -10, this.state.columnOffset-1);
    }

    handleScrollClickRight() {
      this.setState({columnOffset: this.state.columnOffset + 1});
      sideScroll(document.getElementById('media-scroller'), 10, 525, 10,  this.state.columnOffset+1);
    }

    handleImageClick(i) {
      this.setState({imageSelected: i});
    }

    handleKeyPress(event) {
      const leftKey = 37;
      const upKey = 38;
      const rightKey = 39;
      const downKey = 40;
      if (this.state.status == 'new') {
        if (event.keyCode === downKey) {
          if (this.state.menuIsLoaded) {
            this.fetchTopicImages(0);
            this.setState({topicSelected: 0, status: 'fetched'});
          }
        }
      } else {
        if (this.state.imageSelected === null) {
          // No image selected - catch key up and key down in topic menu - key right moves into image container
          if (event.keyCode === downKey) {
            if (this.state.topicSelected == 9) {
              this.fetchTopicImages(0);
              this.setState({topicSelected: 0, status: 'fetched'});
            } else {
              this.fetchTopicImages(this.state.topicSelected + 1);
              this.setState({topicSelected: this.state.topicSelected + 1, status: 'fetched'});
            }
          }
          if (event.keyCode === upKey) {
            if (this.state.topicSelected > 0) {
              this.fetchTopicImages(this.state.topicSelected - 1);
              this.setState({topicSelected: this.state.topicSelected - 1, status: 'fetched'});
            }
          }
          if (event.keyCode === rightKey) {
            this.setState({imageSelected: 0});
            document.getElementById('img-0').focus();
          }
        } else {
        // Image is selected - catch navigation within image container or left to topic menu from first column
          if (event.keyCode === downKey) {
            if (this.state.imageSelected % 2 == 0) {
              // move from top to bottom image
              this.setState({imageSelected: this.state.imageSelected + 1});
            } 
          }
          if (event.keyCode === upKey) {
            if (this.state.imageSelected % 2 == 1) {
              // move from bottom to top image
              this.setState({imageSelected: this.state.imageSelected - 1});
            }
          }
          if (event.keyCode === rightKey) {
            // move to image to the right 
            if (this.state.imageSelected < 19) {
              this.setState({imageSelected: this.state.imageSelected + 2});
              this.handleScrollClickRight();
            }
          }
          if (event.keyCode === leftKey) {
            // move to image to the left or return to topic menu 
            if (this.state.imageSelected > 1) {
              this.setState({imageSelected: this.state.imageSelected - 2});
              this.handleScrollClickLeft();
            } else {
              this.setState({imageSelected: null});
              document.getElementById('topics-header').focus();
            }
          }

        }
      }
    }
    
    render() {
        return (
            <div className="d-flex" id="wrapper">
              <TopicMenu
                onClick={(i) => this.handleMenuClick(i)}
                keyDownHandler={(event) => this.handleKeyPress(event)}
                data={this.state} 
              />
              <ImageContainer
                data={this.state}
                onClick={(i) => this.handleImageClick(i)}
                keyDownHandler={(event) => this.handleKeyPress(event)}
                onScrollClickLeft={(i) => this.handleScrollClickLeft()} 
                onScrollClickRight={(i) => this.handleScrollClickRight()}
              />
           </div>
        );
    }
}

// Helper function for horizontal scrolling in order to enable animation and show/hide paddles. Slight hack - should be possible via pure state change in React component
const sideScroll = (
      element,
      speed,
      distance,
      step,
      columnOffset
  ) => {
        let scrollAmount = 0;
        const slideTimer = setInterval(() => {
          element.scrollLeft += step;
          scrollAmount += Math.abs(step);
          if (scrollAmount >= distance) {
            clearInterval(slideTimer);
            console.log('ColumnOffset: '+columnOffset);
            if(columnOffset>0) {
              //document.getElementById('sidebar-wrapper').style.display='none';
              document.getElementById('left-paddle').style.visibility='visible';
            } else {
              //document.getElementById('sidebar-wrapper').style.display='block';
              document.getElementById('left-paddle').style.visibility='hidden'
            }
            if(columnOffset>=7) {
              //document.getElementById('sidebar-wrapper').style.display='none';
              document.getElementById('right-paddle').style.visibility='hidden';
            } else {
              //document.getElementById('sidebar-wrapper').style.display='block';
              document.getElementById('right-paddle').style.visibility='visible'
            }
        
          }
        }, speed);
};


export default  App;