import React, { Component } from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";

const shaders = Shaders.create({
  helloBlue: {
 // uniforms are variables from JS. We pipe blue uniform into blue output color
    frag: GLSL`
    precision highp float;
    varying vec2 uv;
    uniform sampler2D t;
    uniform float currentLoudness;
    uniform float currentTime;

    void main() {
      vec2 coord = uv.xy * 50. + 10.;
      vec3 color = vec3(1.3, currentLoudness, .2);
      coord.x += uv.y /uv.x * 3.0 / (uv.x/ 1.0) * abs(sin(currentTime / 15.0));

      color += cos(coord.y * sin(currentTime / 55.0)) * 10. + currentLoudness + sin(currentTime * 2.) - sin(coord.x) * 9.;

      gl_FragColor = vec4(color.g, color.b, color.r, 1.0);
    }
` },
  greenStrobe: {
  // uniforms are variables from JS. We pipe blue uniform into blue output color
     frag: GLSL`
     precision highp float;
     float redPerc = 0.9;
     float greenPerc =0.0;
     float bluePerc = 0.9;
     uniform float currentLoudness;
     uniform float currentTime;
     varying vec2 uv;

     
     void main(){
        vec2 coord = uv.xy * 135.;
     
         for(int n = 1; n < 10; n++) {
             float i = float(n);
             coord += vec2((currentLoudness / 3.) / i *cos(i * abs(sin(currentLoudness / 3.)) +coord.y) + 15.0, 
                (i * sin(coord.x *0.01) + (currentTime / 0.9)));
         }
                 
         vec3 color = vec3(redPerc+ sin(coord.y) * redPerc, 
             greenPerc + sin(currentTime * 1000.) * greenPerc, 
             bluePerc + sin(coord.y) * bluePerc);
     
         gl_FragColor = vec4(color, 1.0);
     }
` },
  magentaSurprise: {
  // uniforms are variables from JS. We pipe blue uniform into blue output color
  frag: GLSL`
  precision highp float;
  float redPerc = 0.9;
  float greenPerc =0.3;
  float bluePerc = 0.9;
  uniform float currentLoudness;
  uniform float currentTime;
  varying vec2 uv;

  void main(){
    vec2 coord = uv.xy * 80.;

    for(int n = 1; n < 2; n++) {
        float i = float(n);
        coord += vec2(sin(coord.x + currentTime), 
            (sin(currentTime) + currentLoudness) / i * sin(coord.x + currentTime +100. * i) + .0);
    }
    

    // coord += vec2(0.7/sin(coord.y + currentTime + 0.3) + 0.8, 0.4 / sin(coord.x + currentTime + 0.3) + 1.6);
   
    vec3 color = vec3(sin(coord.y - redPerc) * redPerc, 
        cos(coord.y - greenPerc) * greenPerc, 
        sin (coord.y * bluePerc) + bluePerc);

    gl_FragColor = vec4(color, 1.0);
  }
` },
  imageManipulate: {
    // uniforms are variables from JS. We pipe blue uniform into blue output color
    frag: GLSL`
    precision highp float;
    float redPerc = 0.9;
    float greenPerc =0.3;
    float bluePerc = 0.9;
    uniform float currentLoudness;
    uniform float currentTime;
    varying vec2 uv;

    uniform sampler2D image;

    void main(){
      vec2 coord = uv.xy;
      vec3 color = vec3(0.0);
      vec4 image = texture2D(image, coord);
      
      image.r += sin(coord.x * 90.0);
      image.g += sin(coord.y * 90.0);

      gl_FragColor = image;
    }
  ` }
});



// We can make a <HelloBlue blue={0.5} /> that will render the concrete <Node/>
export class HelloBlue extends Component {
  render() {
    const { currentLoudness, currentTime } = this.props;
    return <Node shader={shaders.helloBlue} uniforms={{ currentLoudness, currentTime }} />;
  }
}
export class MagentaSurprise extends Component {
  render() {
    const { currentLoudness, currentTime } = this.props;
    return <Node shader={shaders.magentaSurprise} uniforms={{ currentLoudness, currentTime }} />;
  }
}

export class GreenStrobe extends Component {
  render() {
    const { currentLoudness, currentTime } = this.props;
    return <Node shader={shaders.greenStrobe} uniforms={{ currentLoudness, currentTime}} />;
  }
}

export class ImageManipulate extends Component {
  render() {
    const { currentLoudness, currentTime, children } = this.props;
    return <Node shader={shaders.imageManipulate} uniforms={{ currentLoudness, currentTime, image: children }} />;
  }
}

// Our example will pass the slider value to HelloBlue
export default class Example extends Component {
    constructor() {
        super();
        this.state = {
          currentTime: 0
      }
    }
    componentDidMount() {
        this.intervalId = setInterval(() => this.increaseTime(), 1);
        this.increaseTime(); 
        this.currentCubeScale = 0;
        this.cubeScale = 0;
        this.prevLoudness = 0;
        this.prevCubeScale = 0;
        this.moderate = 0;
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    increaseTime() {
      if (this.props.currentLoudness > -12) {
        this.currentCubeScale = this.mapValues(this.props.currentLoudness - this.prevLoudness, -2, 2, 1, 20);
      }
      if (this.props.currentLoudness - this.prevLoudness > 0) {
        this.moderate = 1; 
      }
      if (this.moderate > 0) {
        this.cubeScale = this.lerp(this.cubeScale, this.currentCubeScale, 0.03);
      }
      // if (this.props.currentLoudness - this.prevLoudness == 0 || this.props.currentLoudness - this.prevLoudness < 0 ) {
      else{
        this.cubeScale = this.lerp(this.cubeScale, 0, 0.007);
        // this.cubeScale = this.curr entCubeScale-=0.1;
      }
      this.moderate-=0.06;
      // if (this.prevLoudness != this.props.currentLoudness) {
      this.prevLoudness = this.props.currentLoudness;
      // }
      this.prevCubeScale = this.currentCubeScale;
      this.setState({
          currentTime: this.state.currentTime + 0.005
      })
    }

    mapValues(value, x1, y1, x2, y2) {
      return (value - x1) * (y2 - x2) / (y1 - x1) + x2
    }
  
    lerp(value1, value2, amount) {
      amount = amount < 0 ? 0 : amount;
      amount = amount > 1 ? 1 : amount;
      return value1 + (value2 - value1) * amount;
    }

  render() {
    return (
      <Surface width={this.props.screenWidth} height={this.props.screenHeight}>
        <HelloBlue currentTime={this.state.currentTime} currentLoudness={this.cubeScale}/>
        {/* <GreenStrobe currentTime={this.state.currentTime} currentLoudness={this.cubeScale}/>
        <MagentaSurprise currentTime={this.state.currentTime} currentLoudness={this.cubeScale}/> */}
       </Surface> 
      // <Surface width= {500} height={500}>
      //   <ImageManipulate currentTime={this.state.currentTime} currentLoudness={this.cubeScale}>
      //     {this.props.albumArtwork}
      //   </ImageManipulate>
      // </Surface>
    );
  }
  static defaultProps = { blue: 0.5 };
}