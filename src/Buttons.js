import React, { Component } from 'react'
import MagentaSunrise from "./images/button-magenta-surprise.png";
import RedFlash from "./images/button-red-flash.png";

class Buttons extends Component {

  render() {
    const names = [
        ['Red Flash', 0, RedFlash], 
        ['Magenta Sunrise', 1, MagentaSunrise], 
        // ['Artwork Warp', 2], 
        // ['Booming Boxes',3]
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
