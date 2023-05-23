import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
// import testBadgeModel from '/assets/models/engine.glb';
import testBadgeModel from '/assets/models/test_badge.glb';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class BadgeCardComponent extends Component {
  @service store;
  @service('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }

  @action
  didInsertPreviewContainer(element) {
    const width = 300;
    const height = 300;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
    const loader = new GLTFLoader();

    // const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    // scene.add(ambientLight);

    // Create ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // white light
    scene.add(ambientLight);

    // Create directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // white light
    directionalLight.position.set(0.6, 1, 0.6); // from top to bottom
    scene.add(directionalLight);

    // Or create point light
    let pointLight1 = new THREE.PointLight(0xffffff, 1); // white light
    pointLight1.position.set(10, 10, 0); // some position in your scene
    scene.add(pointLight1);

    let pointLight2 = new THREE.PointLight(0xffffff, 1); // white light
    pointLight2.position.set(0, 10, 10); // some position in your scene
    scene.add(pointLight2);

    let pointLight3 = new THREE.PointLight(0xffffff, 1); // white light
    pointLight3.position.set(-10, 10, -10); // some position in your scene
    scene.add(pointLight3);

    let pointLight4 = new THREE.PointLight(0xffffff, 1); // white light
    pointLight4.position.set(10, 10, -10); // some position in your scene
    scene.add(pointLight4);

    loader.load(
      testBadgeModel,
      (gltf) => {
        console.log('loaded');
        scene.add(gltf.scene);

        let box = new THREE.Box3().setFromObject(gltf.scene);
        let center = box.getCenter(new THREE.Vector3());
        camera.position.copy(center);
        camera.position.x += box.getSize(new THREE.Vector3()).length(); // Move the camera back by the length of the box
        camera.lookAt(center); // Make the camera look at the center of the box
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
      (error) => console.log('An error happened', error)
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;

    controls.autoRotate = false;
    // controls.autoRotateSpeed = 20;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 2;
    controls.update();

    // renderer.setClearColor(0xff0000, 1);
    renderer.setSize(width, height);
    element.appendChild(renderer.domElement);

    controls.addEventListener('start', () => {
      console.log('start', controls.getAzimuthalAngle());
    });

    controls.addEventListener('end', () => {
      console.log('end', controls.getAzimuthalAngle());
      // console.log('azimuthalAngle', controls.getAzimuthalAngle());
      // const theta = controls.object.rotation.z;
      // const targetTheta = Math.abs(theta) < Math.PI / 2 ? 0 : Math.PI;

      // // Implement damping towards target rotation
      // controls.object.rotation.z += (targetTheta - theta) * this.dampingFactor;
    });

    renderer.domElement.addEventListener('mouseout', function () {
      var event = new PointerEvent('pointerup', {
        view: window,
        bubbles: true,
        cancelable: true,
        button: 0, // Left button
      });
      console.log('triggering mouseup');
      renderer.domElement.dispatchEvent(event);
    });

    function animate() {
      requestAnimationFrame(animate);
      controls.update();

      // // Check the rotation and force it to nearest 0 or 180 degrees when the user stops interacting
      // if (!controls.state === THREE.STATE.ROTATE) {
      //   console.log('theta', controls.object.rotation);
      //   const theta = controls.object.rotation.z;
      //   const targetTheta = Math.abs(theta) < Math.PI / 2 ? 0 : Math.PI;

      //   // Implement damping towards target rotation
      //   controls.object.rotation.z += (targetTheta - theta) * this.dampingFactor;
      // }

      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    if (WebGL.isWebGLAvailable()) {
      animate();
    } else {
      var warning = WebGL.getWebGLErrorMessage();
      element.appendChild(warning);
    }
  }

  get userHasBadgeAward() {
    return this.args.badge.currentUserAwards.length > 0;
  }
}
