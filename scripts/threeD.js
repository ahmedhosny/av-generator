//
// temp list
//

var tempFidPointList = [];
var P0 = new fidPoint( -9.462358, -0.20132, 1669.094232);
tempFidPointList.push(P0);
var P1 = new fidPoint( -3.573614, -9.771409, 1674.504326 );
tempFidPointList.push(P1);
var P2 = new fidPoint( 2.731822, 6.209684, 1663.675155 );
tempFidPointList.push(P2);
var P3 = new fidPoint( -15.701624, 7.913488, 1678.531137 );
tempFidPointList.push(P3);
var P4 = new fidPoint( -3.978798, -6.28569, 1655.584399 );
tempFidPointList.push(P4);
var P5 = new fidPoint( -12.843131, 10.4012, 1658.684946 );
tempFidPointList.push(P5);
var P6 = new fidPoint( -23.417403, -3.541256, 1670.466878 );
tempFidPointList.push(P6);





//
// after all 7 points are recorded - we start drawing them in threejs
//

$('#tempThree').click( function(){


    // empty everything in container1
    $("#" + containerTXT).empty();
    // and the svg
    $("#mySVG").empty();
    // adjust prompt
    document.getElementById('text1a').innerHTML = "adjust the curves";
    

    //1// INITIATE THREEJS
    initiateScene1();

    //2// draw points and adjust camera/controls
    drawPoints();

    //3// draw midpoints
    getTopMidPoint();

    //4// draw top curves for the first time
    drawTopCurves();

    //5// project p0 onto bottom plane
    projectPointOntoPlane(tempFidPointList[0] , tempFidPointList[4] , tempFidPointList[5] ,tempFidPointList[6] , myScene1 )

    //TEST//
    


    makeGUI();

    render();


});


//
// VARIABLES
// 
var myScene1,
myCamera1,
myRenderer1,
controls1;

//
// var for GUI  ///////////////////////////////////////
//
var overall = new function() {
    this.midpointLoc = 0 ;
}

//
//
var fov =30;
var containerTXT = "container1";
var container = document.getElementById(containerTXT);
var sphereList = []; // this will store all sphere even after they are moved;
var sphereListOriginal = []; // this will store fidPoint all sphere at their original position and will never be modified.


// RENDER FUNC

function render(){
        
        controls1.update();
        requestAnimationFrame(render);
        myRenderer1.render(myScene1,myCamera1);

}


//
// CREATE SCENE 1
//
function initiateScene1(){

    // SCENE
    myScene1 = new THREE.Scene();
    // CAMERA
    myCamera1 = new THREE.PerspectiveCamera(fov,window.innerWidth / window.innerHeight,1,10000);
    // RENDER
    myRenderer1 = new THREE.WebGLRenderer();
    // DUMMY POSITION
    myCamera1.target = new THREE.Vector3(0,0,0);
    myCamera1.position.set(-8.0, -30, 9);
    myScene1.add(myCamera1);
    // LIGHT
    var light = new THREE.AmbientLight( 0xFFFFFF); // soft white light
    myScene1.add( light );
    // CONTROL
    controls1 = new THREE.TrackballControls( myCamera1, container);
    controls1.rotateSpeed = 1.0;
    controls1.zoomSpeed = 1.2;
    controls1.panSpeed = 0.8;
    controls1.noZoom = false;
    controls1.noPan = false;
    controls1.staticMoving = false;
    controls1.dynamicDampingFactor = 0.15;
    controls1.keys = [ 65, 83, 68 ];

    // add group to Scene
    // topCurveGroup = new THREE.Group();
    // myScene1.add(topCurveGroup);

}

function drawPoints(){
    for (var i = 0 ; i < tempFidPointList.length ; i++){
        sphereListOriginal.push(tempFidPointList[i]);
        var sphere = addSphere(i,tempFidPointList[i]);
        sphereList.push(sphere);
    }

    myRenderer1.setSize( $('#' + containerTXT ).innerWidth() , $('#' + containerTXT).innerHeight() );
    container.appendChild(myRenderer1.domElement);
    myRenderer1.setClearColor( 0xDCDCDC , 1 );
    adjustView();
    
}


function addSphere(counter,point){

    //
    THREE.ImageUtils.crossOrigin = '';
    var texture = THREE.ImageUtils.loadTexture('https://mecano-eq.s3.amazonaws.com/p' + String(counter) + '.jpg');
    var material = new THREE.MeshPhongMaterial({
        ambient: 0xFFFFFF,
        map: texture,
       specular: 0xFFFFFF,
       shininess: 100,
       shading: THREE.FlatShading
    });

    //
    var radius = 0.5;
    var geometry = new THREE.SphereGeometry( radius, 20,20);
    
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = point.X;
    sphere.position.y = point.Y;
    sphere.position.z = point.Z;
    myScene1.add( sphere );
    return sphere;
    

};
//
// this will adjust the camera positon and controls rotation center
//
function adjustView(){
    // FIX TARGET P0
    myCamera1.target = new THREE.Vector3(tempFidPointList[0].X, tempFidPointList[0].Y, tempFidPointList[0].Z);
    // SET POSITION P1
    myCamera1.position.set(tempFidPointList[1].X, tempFidPointList[1].Y, tempFidPointList[1].Z);
    // FIX ROTATION 
    myCamera1.updateProjectionMatrix();
    // FIX CONTROLS P0
    controls1.target.set( tempFidPointList[0].X , tempFidPointList[0].Y , tempFidPointList[0].Z );
}


