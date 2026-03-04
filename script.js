import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'css3d';

//씬 생성
const scene = new THREE.Scene(); //씬 생성

//카메라 생성
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //카메라 생성(원근 카메라 사용)
camera.position.z = 1000; //카메라 위치 설정

const base_width = 1920;
const base_height = 1080;

//iframe 요소 생성
const frame = document.createElement('iframe'); //iframe 요소 생성
frame.src = './p.html'; //iframe에 표시할 웹 페이지 URL 설정
frame.style.width = base_width + 'px'; //iframe 너비 설정
frame.style.height = base_height + 'px';
frame.style.border = 'none'; //iframe 테두리 제거
frame.style.backfaceVisibility = 'hidden'; //iframe 뒷면이 보이지 않도록 설정
frame.style.transform = 'translateZ(0)'; //iframe을 중앙에 배치


//css3d 객체 생성
const cssObject = new CSS3DObject(frame); //CSS3DObject 생성

scene.add(cssObject);

//렌더러 생성
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}); //렌더러 생성(알파 채널 사용)
renderer.setSize(window.innerWidth, window.innerHeight); //렌더러 크기 설정
renderer.domElement.style.position = 'absolute'; //렌더러 위치 설정
renderer.domElement.style.top = '0';
renderer.domElement.style.pointerEvents = 'none'; //렌더러가 마우스 이벤트를 받지 않도록 설정
document.body.appendChild( renderer.domElement); //렌더러를 HTML 문서에 추가

//css3d 랜더러 생성
const cssRenderer = new CSS3DRenderer(); //CSS3D 렌더러 생성
cssRenderer.setSize(window.innerWidth, window.innerHeight); //CSS3D 렌더러 크기 설정
cssRenderer.domElement.style.position = 'absolute'; //CSS3D 렌더러 위치 설정
cssRenderer.domElement.style.top = '0';

cssRenderer.domElement.style.zIndex = '1'; // 뒷장 (웹페이지)
renderer.domElement.style.zIndex = '2';    // 앞장 (투명 3D 도화지)

document.body.appendChild(cssRenderer.domElement); //CSS3D 렌더러를 HTML 문서에 추가

//테이블과 유리판 생성
const table = new THREE.Group();
table.add(cssObject);

const glassGeometry = new THREE.PlaneGeometry(base_width, base_height);
const glassMaterial = new THREE.MeshStandardMaterial({
    colorWrite: false
});
const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
table.add(glassMesh);

const caseGeometry = new THREE.BoxGeometry(base_width + 180, base_height + 120, 10);
const caseMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00});
const tableCase = new THREE.Mesh(caseGeometry, caseMaterial);

tableCase.position.z = -25;
table.add(tableCase);
scene.add(table);

//조명 추가
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(500, 500, 500);
scene.add(directionalLight);

//크기 조절
function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    cssRenderer.setSize(width, height);

    const scaleX = width / base_width;
    const scaleY = height / base_height;
    const scale = Math.min(scaleX, scaleY);

    cssObject.scale.set(scale, scale, 1);
}

window.addEventListener('resize', resize);
resize();


//스크롤 감지
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const ratio = scrollY / window.innerHeight;

    // camera.position.z = 1000 + (ratio * 200); //카메라 위치 조정

    table.rotation.x = ratio * -4;
    // table.rotation.y = ratio * -1;
})

//애니메이션 루프
function animate() {
    requestAnimationFrame(animate); //애니메이션 루프 설정

    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
}

animate();