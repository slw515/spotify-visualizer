import React, { Component } from 'react'
import MagentaSunrise from "./images/button-magenta-surprise.png";
import RedFlash from "./images/button-red-flash.png";
import DancingBlob from "./images/button-dancing-blob.png";

class Buttons extends Component {

  render() {
    const names = [
        ['Dancing Blob', 0, DancingBlob], 
        ['Magenta Sunrise', 1, MagentaSunrise], 
        ['Red Flash', 2, RedFlash], 
        ['Artwork Warp', 3, this.props.albumArtwork], 
        ['Bouncing Skull', 4, this.props.albumArtwork], 

    ];
    const { changeButtonRender  } = this.props;

    // const 
    return (
      <>
        <div id="buttonContainer">
            {names.map(name => (
                <a href className="button" id={name[1]} onClick={changeButtonRender}>
                    <p id={name[1]}>{name[0]}</p>
                    <img id={name[1]} src={name[2]} />
                </a>
            ))}
        </div>
      </>
    )
  }
}

export default Buttons
