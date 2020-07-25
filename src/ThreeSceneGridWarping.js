import React, { Component } from "react";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import OrbitControls from "three-orbitcontrols";

var uniforms;
class ThreeSceneGridWarping extends Component {

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.scene = new THREE.Scene();

    //Add Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#22f");
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    //add Camera
    this.camera = new THREE.Camera();
    this.camera.position.z = 0;
    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
    this.uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    };
    var material = new THREE.ShaderMaterial( {
        uniforms: this.uniforms,
        vertexShader: this.vertexShader(),
        fragmentShader: this.fragmentShader()
    } );
    var mesh = new THREE.Mesh( geometry, material );
    this.scene.add( mesh );
    //Camera Controls
    // const controls = new OrbitControls(this.camera, this.renderer.domElement);

    //Simple Box with WireFrame
    this.renderScene();
    //start animation
    this.start();
  }

  vertexShader() {
    return `
    void main() {
        gl_Position = vec4( position, 1.0 );
    }
    `
  }

  fragmentShader() {
    return `
    uniform vec2 u_resolution;
    uniform float u_time;

    void main() {
        vec2 st = gl_FragCoord.xy/u_resolution.xy;
        gl_FragColor=vec4(st.x, st.y,st.x, 0.7);
    }
    `
  }


  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  animate = () => {
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };
  renderScene = () => {
    this.uniforms.u_time.value += 0.05;
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        style={{ width: "800px", height: "800px" }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default ThreeSceneGridWarping;
