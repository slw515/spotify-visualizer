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
    precision mediump float;
    float redPerc = 0.9;
    float greenPerc =0.3;
    float bluePerc = 0.9;
    uniform float currentLoudness;
    uniform float currentTime;
    varying vec2 uv;

    uniform sampler2D image;

     float radius = 1.0;
     float angle = 2.0;
     vec2 center = vec2(.15, 0.1);

    vec2 distortMap(float distance) {
      float percent = (radius - distance) / radius;
      float theta = pow(percent, 3.0) * angle * 8.0;
      float sinAng = sin(theta);
      float cosAng = cos(theta);
      return vec2(sinAng / 10.0, cosAng / 10.0);
    }

    vec4 imageWarpEffect(sampler2D image, vec2 uvPos, float distortValue) {
      vec2  textureSize  = vec2(uvPos.x, uvPos.y);
      vec2 tc = uvPos * textureSize;
      tc -= center;
      float dist = length(tc);
      if (dist < radius) 
      {
        tc = distortMap(dist);
      }
      tc += center;
      vec3 color = texture2D(image, tc / textureSize).rgb;
      return vec4(color, 1.0);

    }


    void main(){
      radius =abs(sin(currentTime))+ 4.0;
      angle =abs(sin(currentTime)) + sin(currentTime) / 5.0 + currentLoudness / 1.4;
      vec2 coord = uv.xy;
      // vec3 color = vec3(0.0);

      gl_FragColor = imageWarpEffect(image, coord, 2.0);
    }
  ` },
  purpleWaves: {
    frag: GLSL`
    precision highp float;
    float redPerc = 0.;
    float greenPerc = 0.9;
    float bluePerc = 1.;
    uniform float currentLoudness;
    uniform float currentTime;
    varying vec2 uv;

    uniform sampler2D image;

    void main(){
      vec2 coord = uv.xy * 8.;

      for(int n = 1; n < 4; n+=2) {
        float i = float(n);
        // coord += vec2(currentLoudness * 0.5 + sin(currentTime) * 5./ i *sin(i * currentTime + coord.y) + 0.8, 10. /i * sin(coord.x + currentTime + 0.3 * i) + 1.0);
        coord += vec2((currentLoudness / 7.0) / i *sin(i * currentTime + coord.y) + 0.8, 10. /i * sin(coord.x + currentTime + 0.3 * i) + 1.0);

    }
       
    vec3 color = vec3(0.7 * sin(coord.x) * 0.6 + redPerc, 0.1 * + greenPerc, sin(coord.x * coord.y) + bluePerc);
  
    gl_FragColor = vec4(color, 1.0);
    }
  `
  },
  dancingBlob: {
    frag: GLSL`
    precision highp float;
    float redPerc = 0.3;
    float greenPerc = 0.2;
    float bluePerc = 1.;
    uniform float currentLoudness;
    uniform float currentTime;
    varying vec2 uv;
    #define PI 3.14159265359

    float rand(float n){return fract(sin(n) * 43758.5453123);}
    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    
    float noise(vec2 p, float freq ){
      float unit = uv.x/freq;
      vec2 ij = floor(p/unit);
      vec2 xy = mod(p,unit)/unit;
      xy = .5*(1.-cos(PI*xy));
      float a = rand((ij+vec2(0.,0.)));
      float b = rand((ij+vec2(1.,0.)));
      float c = rand((ij+vec2(0.,1.)));
      float d = rand((ij+vec2(1.,1.)));
      float x1 = mix(a, b, xy.x);
      float x2 = mix(c, d, xy.x);
      return mix(x1, x2, xy.y);
    }
    
    float circleShape(vec2 position, float radius) {
      return step(radius, length(position - vec2(noise(position, sin(currentTime / 16.) * 15. / 1.9)) * 0.04));
    }
    
    void main() {
        vec2 coord = uv.xy * 1.;
        float color;
        coord.x *= 1.9;
        vec2 translate = vec2(-.95, -0.5);
        coord += translate;
    
        float circle = circleShape(coord, (abs(sin(currentTime / 3.) / 9.) + 0.26) + abs(currentLoudness) / 80.);
        gl_FragColor = vec4(0.9, circle -0.2, 0.8, 1.);
    }
  `
  }
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
export class DancingBlob extends Component {
  render() {
    const { currentLoudness, currentTime } = this.props;
    return <Node shader={shaders.dancingBlob} uniforms={{ currentLoudness, currentTime }} />;
  }
}

export class GreenStrobe extends Component {
  render() {
    const { currentLoudness, currentTime } = this.props;
    return <Node shader={shaders.greenStrobe} uniforms={{ currentLoudness, currentTime}} />;
  }
}

export class PurpleWaves extends Component {
  render() {
    const { currentLoudness, currentTime } = this.props;
    return <Node shader={shaders.purpleWaves} uniforms={{ currentLoudness, currentTime}} />;
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
      else{
        this.cubeScale = this.lerp(this.cubeScale, 0, 0.007);
      }
      this.moderate-=0.06;
      this.prevLoudness = this.props.currentLoudness;
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
        {(() => {
          console.log(this.state.currentVisualization);
          switch (this.props.whichSketch) {
            case 0:
              return <DancingBlob currentTime={this.state.currentTime} currentLoudness={this.cubeScale}/>
            case 1:
              // return <MagentaSurprise currentTime={this.state.currentTime} currentLoudness={this.cubeScale}/>
              return <PurpleWaves currentTime={this.state.currentTime} currentLoudness={this.cubeScale}/>
              // return <HelloBlue currentTime={this.state.currentTime} currentLoudness={this.cubeScale}/>
            case 2:
              // return <GreenStrobe currentTime={this.state.currentTime} currentLoudness={this.cubeScale}/>
              return <HelloBlue currentTime={this.state.currentTime} currentLoudness={this.cubeScale}/>
            case 3:
              return <ImageManipulate currentTime={this.state.currentTime} currentLoudness={this.cubeScale}>
                {this.props.albumArtwork}
              </ImageManipulate>
            }
        })()}
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