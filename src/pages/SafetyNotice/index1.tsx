import React, { Component } from 'react';
import { Spin } from 'antd';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './index.less';

class SafetyNotice extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    const that = this
    console.log(111)
    that.drawThreeScene()
    // this.drawTokyo()
    setTimeout(function () {
      that.setState({
        loading: false
      })
    }, 10)

  }

  drawThreeScene() {
    var cameraFar = 60;
    var theModel;
    // const MODEL_PATH = './model/gongchang.glb';
    const MODEL_PATH = "./model/untitled22.glb";
    console.log('MODEL_PATH', MODEL_PATH)

    // 背景色
    var BACKGROUND_COLOR = 0xf1f1f1;
    // 半球光
    var hemiLightColor = 0xffffff
    // 定向光
    var dirLightColor = 0xffffff
    // 地板色
    var floorLightColor = 0xcccccc

    var parts = {
      "chuang": { color: 0xffffff, opacity: 1, old_opacity: 1 },
      "screen": { color: 0x000000, opacity: 1, old_opacity: 1 },
      "ke": { color: 0xffffff, opacity: 1, old_opacity: 1 },
      "citi": { color: 0x000000, opacity: 1, old_opacity: 1 },
      "立方体9_1": { color: 0xff0000, opacity: 1, old_opacity: 1 },
      "dizuo": { color: 0xcccccc, opacity: 1, old_opacity: 1 },
      "he": { color: 0xB1E1FF, opacity: 1, old_opacity: 1 }
    }

    var INITIAL_MAP = []

    for (var item in parts) {
      INITIAL_MAP.push({
        childID: item,
        mtl: new THREE.MeshPhongMaterial({
          color: parts[item].color,
          shininess: 10,
          opacity: parts[item].opacity,
          transparent: true
        })
      })
    }

    // Init the scene
    const scene = new THREE.Scene();

    // Set background
    scene.background = new THREE.Color(BACKGROUND_COLOR);
    // scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 2000);

    // const canvas = document.querySelector('#modalContainer');

    // // Init the renderer
    // const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    // renderer.shadowMap.enabled = true;
    // renderer.setPixelRatio(window.devicePixelRatio);


    var container = document.getElementById('canvasContainer');

    var stats = new Stats();
    container.appendChild(stats.dom);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    document.querySelector('#canvasContainer').appendChild(renderer.domElement);

    // Add a camerra
    var camera = new THREE.PerspectiveCamera(cameraFar, window.innerWidth / window.innerHeight, 0.1, 1800);
    camera.position.x = 14;
    camera.position.y = 100;
    camera.position.z = 140;
    camera.lookAt(0, 0, 0)

    // x轴
    function linexFun() {
      var material = new THREE.LineBasicMaterial({
        color: 0xFF0000
      });

      var geometry = new THREE.Geometry();
      geometry.vertices.push(
        new THREE.Vector3(-100, 0, 0),
        new THREE.Vector3(100, 0, 0),
      );

      var line = new THREE.Line(geometry, material);
      scene.add(line);
    }

    linexFun()
    // y轴
    function lineyFun() {
      var material = new THREE.LineBasicMaterial({
        color: 0xFFFF00
      });

      var geometry = new THREE.Geometry();
      geometry.vertices.push(
        new THREE.Vector3(0, -100, 0),
        new THREE.Vector3(0, 100, 0),
      );

      var line = new THREE.Line(geometry, material);
      scene.add(line);
    }

    lineyFun();
    // z轴
    function linezFun() {
      var material = new THREE.LineBasicMaterial({
        color: 0x0000FF
      });

      var geometry = new THREE.Geometry();
      geometry.vertices.push(
        new THREE.Vector3(0, 0, -100),
        new THREE.Vector3(0, 0, 100),
      );

      var line = new THREE.Line(geometry, material);
      scene.add(line);
    }

    linezFun()
    var clock = new THREE.Clock();
    var mixer

    // envmap
    var path = "./Park2/";
    var format = ".jpg";
    var envMap = new THREE.CubeTextureLoader().load([
      require('../../../public/Park2/posx.jpg'),
      require('../../../public/Park2/negx1.jpg'),
      require('../../../public/Park2/posy.jpg'),
      require('../../../public/Park2/negy.jpg'),
      require('../../../public/Park2/posz.jpg'),
      require('../../../public/Park2/negz.jpg'),
    ]);

    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./js/");

    // Init the object loader
    var loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load("./model/gongchang.glb", function (gltf) {

      theModel = gltf.scene;
      theModel.scale.set(0.1, 0.1, 0.1);
      theModel.rotation.y = Math.PI;

      theModel.traverse((o) => {
        console.log(o)
        if (o.isMesh) {
          o.castShadow = true;
          o.material.envMap = envMap;
          o.receiveShadow = true;
        }
      });

      // Set initial textures
      for (let object of INITIAL_MAP) {
        initColor(theModel, object.childID, object.mtl);
      }

      // Add the model to the scene
      scene.add(theModel);

      // mixer = new THREE.AnimationMixer(theModel);
      // mixer.clipAction(gltf.animations[0]).play();
      animate();

    }, undefined, function (error) {
      console.error(error)
    });

    // Function - Add the textures to the models
    function initColor(parent, type, mtl) {
      parent.traverse((o) => {
        if (o.isMesh) {
          // console.log(o.name, type, o.name.indexOf(type))
          if (o.name.includes(type)) {
            // console.log(111111, o.material)
            o.material = mtl;
            o.nameID = type; // Set a new property to identify this object
          }
        }
      });
    }

    // Add lights

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
    // hemiLight.color.setHSL(0.6, 1, 0.6);
    // hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    // hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    // var hemHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    // scene.add(hemHelper);

    var dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 2, 8);
    scene.add(dirLight);

    // Floor
    // var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    // var floorMaterial = new THREE.MeshPhongMaterial({
    //   color: floorLightColor,
    //   shininess: 0
    // });

    // var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // floor.rotation.x = -0.5 * Math.PI;
    // floor.receiveShadow = true;
    // floor.position.y = 0;
    // scene.add(floor);

    // Add controls
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
    controls.enableDamping = true;
    controls.enablePan = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
    controls.autoRotateSpeed = -0.5; // 30

    // Function - New resizing method
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      var width = window.innerWidth;
      var height = window.innerHeight;
      var canvasPixelWidth = canvas.width / window.devicePixelRatio;
      var canvasPixelHeight = canvas.height / window.devicePixelRatio;

      const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
      if (needResize) {

        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    var o = 1
    var views = [
      [
        [0, 5, 0], 16, 20, ['chuang', 'dizuo', 'he', 'estop', 'citi', 'screen', 'ke']
      ],
      [
        [0, 5, 0], 5, 20, ['citi']
      ],
      [
        [0, 5, 0], 3, 20, ['chuang', 'dizuo', 'he', 'estop', 'citi', 'screen', 'ke']
      ],
      [
        [-1, 3.6, 0.47], 1, 50, ['estop']
      ],
      [
        [3, 5, 0], 3, 20, ['ke']
      ],
      // [
      //     [-1, 6, 0.47], 20, 50, ['citi']
      // ],
    ] // [坐标，巡视半径， 巡视角度（时长），高亮部分，转场时间（可选）]

    var view_pointer = 0,
      view_tween = 20,
      view_speed = 0.1,
      view_time = 0,
      view_sum_time = 0
    var pre_view_pointer = 0

    // function animate() {
    //   // controls.update();
    //   renderer.render(scene, camera);
    //   requestAnimationFrame(animate);

    //   if (resizeRendererToDisplaySize(renderer)) {
    //     const canvas = renderer.domElement;
    //     camera.aspect = canvas.clientWidth / canvas.clientHeight;
    //     camera.updateProjectionMatrix();
    //   }

    //   // if (theModel != null) {
    //   //     nextView(theModel)
    //   // }

    // }

    // animate();


    window.onresize = function () {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

    };



    function animate() {

      requestAnimationFrame(animate);

      // var delta = clock.getDelta();

      // mixer.update(delta);

      // controls.update();

      // stats.update();

      renderer.render(scene, camera);

    }


    function getTween(val_new, val_old, percentage) { return val_old + (val_new - val_old) * (Math.sin((percentage - 0.5) * Math.PI) + 1) / 2 }

    function nextView(model) {

      var abso_degree = view_speed * view_sum_time
      var rela_degree = view_speed * view_time
      var radius = views[view_pointer][1]
      var x = views[view_pointer][0][0]
      var y = views[view_pointer][0][1]
      var z = views[view_pointer][0][2]
      var opactiy = [1, 0.1]
      var down, up, init, init1

      if (rela_degree < view_tween) {
        //转场

        radius = getTween(views[view_pointer][1], views[pre_view_pointer][1], rela_degree / view_tween)
        x = getTween(views[view_pointer][0][0], views[pre_view_pointer][0][0], rela_degree / view_tween)
        y = getTween(views[view_pointer][0][1], views[pre_view_pointer][0][1], rela_degree / view_tween)
        z = getTween(views[view_pointer][0][2], views[pre_view_pointer][0][2], rela_degree / view_tween)
        init1 = getTween(opactiy[0], opactiy[0], rela_degree / view_tween)
        up = getTween(opactiy[0], opactiy[1], rela_degree / view_tween)
        down = getTween(opactiy[1], opactiy[0], rela_degree / view_tween)
        init = getTween(opactiy[1], opactiy[1], rela_degree / view_tween)

        //材质
        for (var key in parts) {
          var op = getTween(parts[key].opacity, parts[key].old_opacity, rela_degree / view_tween)
          // if(key === 'citi') {
          // console.log('次数', key, view_pointer, '值', op, 'opacity', parts[key].opacity, 'old opacity', parts[key].old_opacity,)
          // }
          setMaterial(theModel, key, op)
        }
      }

      //巡视
      camera.position.x = x + radius * Math.sin(abso_degree / 180 * Math.PI)
      camera.position.y = y
      camera.position.z = z + radius * Math.cos(abso_degree / 180 * Math.PI)
      camera.lookAt(new THREE.Vector3(x, y, z))

      view_time++
      view_sum_time++

      if (views[view_pointer][2] < rela_degree) {
        pre_view_pointer = view_pointer
        view_pointer++
        view_pointer = view_pointer % views.length

        view_time = 0

        if (views[view_pointer][3] == undefined || views[view_pointer][3] == 'all') {
          for (var key in parts) {
            parts[key].old_opacity = parts[key].opacity
            parts[key].opacity = 1
          }
        }
        else {
          for (var key in parts) {
            parts[key].old_opacity = parts[key].opacity
            parts[key].opacity = 0.1
          }

          for (var key in views[view_pointer][3]) {
            parts[views[view_pointer][3][key]].opacity = 1
          }
        }
      }
    }

    function initMaterial(parent, mtl) {
      // console.log(mtl)
      for (var item in parts) {
        setMaterial(parent, item, mtl)
      }
    }

    function setMaterial(model, type, num) {
      // console.log(curent,pre)
      model.traverse(o => {
        if (o.isMesh && o.nameID != null) {
          if (o.name.includes(type)) {
            o.material.opacity = num;
          }
        }
      });
      // console.log('end')
    }

    // function setMaterial(model, curent, pre, down, up, init, init1) {
    //     // console.log(curent,pre)
    //     model.traverse(o => {
    //         if (o.isMesh && o.nameID != null) {
    //             // console.log(curent.indexOf(o.nameID))
    //             // if (curent.indexOf(o.nameID) >= 0 && pre.indexOf(o.nameID) >= 0) {
    //             //     // console.log(view_pointer,o.nameID)
    //             //     o.material.opacity = init1;
    //             //     // console.log(1111,o.nameID)
    //             // } else if (curent.indexOf(o.nameID) >= 0 && !pre.indexOf(o.nameID) >= 0) {
    //             //     if(o.material.opacity === 1) {
    //             //         // console.log(o.material.opacity)
    //             //         o.material.opacity = init1;
    //             //     } else {
    //             //         o.material.opacity = up;
    //             //     }
    //             //     // console.log(2222,o.nameID)
    //             // } else if (!curent.indexOf(o.nameID) >= 0 && pre.indexOf(o.nameID) >= 0) {
    //             //     if(o.material.opacity === 0.1) {
    //             //         o.material.opacity = init;
    //             //     } else {
    //             //         o.material.opacity = down;
    //             //     }
    //             //     // console.log(3333,o.nameID)
    //             // } else if (!curent.indexOf(o.nameID) >= 0 && !pre.indexOf(o.nameID) >= 0) {
    //             //     if(o.material.opacity === 1) {
    //             //         o.material.opacity = init1;
    //             //     } else {
    //             //         o.material.opacity = init;
    //             //     }
    //             //     // console.log(4444,o.nameID)
    //             // }
    //             // console.log(down, up, init, init1)
    //             var temp = ''
    //             for (var key in curent) {
    //                 temp = temp + curent[key]  + '～'
    //             }
    //             console.log(temp)
    //             if(temp.indexOf(o.nameID) >= 0) {
    //                 // console.log(11,o.nameID,temp.indexOf(o.nameID),o.material.opacity)
    //                 console.log(o.nameID, o.material.opacity)
    //                 if(o.material.opacity === 0.1) {
    //                     o.material.opacity = init1;
    //                 } else if(o.material.opacity === 1) {
    //                     o.material.opacity = up;
    //                 }
    //             } else {
    //                 // console.log(22,o.nameID,curent.indexOf(o.nameID),o.material.opacity)
    //                 if(o.material.opacity === 0.1) {
    //                     o.material.opacity = down;
    //                 } else if(o.material.opacity === 1) {
    //                     o.material.opacity = init;
    //                 }
    //             }
    //         }
    //     });
    //     // console.log('end')
    // }
  }

  drawTokyo() {
    var scene, camera, dirLight, stats;
    var renderer, mixer, controls;

    var clock = new THREE.Clock();
    var container = document.getElementById('canvasContainer');

    stats = new Stats();
    container.appendChild(stats.dom);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3dd);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(5, 2, 8);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.4));

    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 2, 8);
    scene.add(dirLight);

    // envmap
    var path = "./Park2/";
    var format = ".jpg";
    var envMap = new THREE.CubeTextureLoader().load([
      require('../../../public/Park2/posx.jpg'),
      require('../../../public/Park2/negx1.jpg'),
      require('../../../public/Park2/posy.jpg'),
      require('../../../public/Park2/negy.jpg'),
      require('../../../public/Park2/posz.jpg'),
      require('../../../public/Park2/negz.jpg'),
    ]);

    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./js/");

    var loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load("./model/LittlestTokyo.glb", function (gltf) {

      var model = gltf.scene;
      model.position.set(1, 1, 0);
      model.scale.set(0.01, 0.01, 0.01);
      console.log(gltf)
      model.traverse(function (child) {
        // console.log(child)

        if (child.isMesh) child.material.envMap = envMap;

      });

      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      mixer.clipAction(gltf.animations[0]).play();

      animate();

    }, undefined, function (e) {

      console.error(e);

    });


    window.onresize = function () {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

    };


    function animate() {

      requestAnimationFrame(animate);

      var delta = clock.getDelta();

      mixer.update(delta);

      controls.update();

      stats.update();

      renderer.render(scene, camera);

    }
  }

  render() {

    const { loading } = this.state

    return (
      <div className="safety-notice-page">
        {/* <Spin spinning={loading}> */}
          <div className="notice-modal-contianer" id="canvasContainer">
            {/* <canvas id="modalContainer"></canvas> */}
          </div>
        {/* </Spin> */}
      </div>
    );
  }
}

export default SafetyNotice;

