function ImageColumn(props) {
    var columnClass;
    // This function naively stacks two images in a column - support for different number of rows would require a more sophisticated column rendering
    var imageClass1;
    var imageClass2;
    if (props.imageIndex == 0) {
      columnClass = 'firstColumn';
    } else {
      columnClass = 'imageColumn'
    }
    if (props.imageIndex == props.imageSelected) {
      imageClass1 = 'imageSelected';
    } else {
      imageClass1 = 'imageUnselected';
    }
    if (props.imageIndex+1 == props.imageSelected) {
      imageClass2 = 'imageSelected';
    } else {
      imageClass2 = 'imageUnselected';
    }
    // note use of lazy loading along with CSS class to render background-image as a grey linear gradient in images awaiting loading
    return (
      <li key={'li-'+props.identifier1} className={columnClass}><figure key={'fig-'+props.identifier1} ><picture key={'pic-'+props.identifier1} >
        <img onKeyDown={props.keyDownHandler} tabIndex='0' id={'img-'+props.imageIndex} key={'img-'+props.identifier1} alt={props.src1} onClick={props.onClick1} loading="lazy" src={props.src1} className={imageClass1}/>
      </picture>
      <picture key={'pic-'+props.identifier2}>
        <img onKeyDown={props.keyDownHandler} tabIndex='0' id={'img-'+(props.imageIndex + 1)} key={'img-'+props.identifier2} alt={props.src2} onClick={props.onClick2} loading="lazy" src={props.src2} className={imageClass2}/>
      </picture></figure></li>
  );
}

function renderImageColumn(props, i) {
  if (props.data.menuIsLoaded) {
    return (<ImageColumn
            src1={props.data.photos[i].url}
            src2={props.data.photos[i+1].url}
            onClick1={() => props.onClick(i)}
            onClick2={() => props.onClick(i+1)}
            identifier1={props.data.photos[i].id}
            identifier2={props.data.photos[i+1].id}
            imageIndex={i}
            imageSelected={props.data.imageSelected}
            keyDownHandler={props.keyDownHandler}
          />);
  } else {
    return null;
  }
}

function ImageContainer(props) {

    const currentImages = [];
    if (props.data.status != 'new') {
      props.data.photos.forEach((element, index) => {
        if (index % 2 == 0) {
          currentImages.push(renderImageColumn(props, index));
        }
      });
      // paddles would ideally use SVGs for arrows - using large < and > symbols for simplicity
      return (
        <section><ul id="media-scroller" className="horizontal-media-scroller" ><div id='left-paddle' className='paddle left-paddle hidden'  onClick={props.onScrollClickLeft}>&#60;</div>
          {currentImages}
          <div id='right-paddle' className='paddle right-paddle'  onClick={props.onScrollClickRight} >&#62;</div></ul></section>
        );    
    } else return (<div className='NoImages'><div>Select a topic to see images</div><div style={{fontSize:40}}><b>tip:</b> scroll down using arrow keys / TV controller</div></div>);
}

export default  ImageContainer;