// This file create the THREEJS scene, and adjusts it.
// It also creates 7 spheres at the location of the 7 marker points

//
// temp list
//

var tempFidPointList = [];
var P0 = new THREE.Vector3( -9.462358, -0.20132, 1669.094232);
tempFidPointList.push(P0);
var P1 = new THREE.Vector3( -3.573614, -9.771409, 1674.504326 );
tempFidPointList.push(P1);
var P2 = new THREE.Vector3( 2.731822, 6.209684, 1663.675155 );
tempFidPointList.push(P2);
var P3 = new THREE.Vector3( -15.701624, 7.913488, 1678.531137 );
tempFidPointList.push(P3);
var P4 = new THREE.Vector3( -3.978798, -6.28569, 1655.584399 );
tempFidPointList.push(P4);
var P5 = new THREE.Vector3( -12.843131, 10.4012, 1658.684946 );
tempFidPointList.push(P5);
var P6 = new THREE.Vector3( -23.417403, -3.541256, 1670.466878 );
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

    //4// draw top curves for the first time - no need

    //5// project p0 onto bottom plane
    var projectedP0 = projectPointOntoPlane(tempFidPointList[0] , tempFidPointList[4] , tempFidPointList[5] ,tempFidPointList[6] , myScene1, "bottomCircleShaded" )
    compactor(projectedP0);

    //6// draw circle around P1,P2,P3
    var normNcenterTop = fitCircle(P1,P2,P3,"topCircleLine",myScene1,30,"line");

    //7// find intersection of plane from P0, projectedP0 and P4 with top circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,P4,myScene1.getObjectByName("topCircleLine"))

    //8// find the closest to P4
    var copyP4 = intersections [ findCLosestPoint(P4,intersections) ];
    compactor(copyP4);

    //9// draw a line from projectedP0 to copyP4 and a moving sphere
    projectedP0_copyP4 = new THREE.Line3(projectedP0, copyP4);
    var eval = projectedP0_copyP4.at(0.5);
    compactor(eval);

    //10// draw Q1 top
    var q1Top = getPointOnArc(P1,copyP4,0.5,normNcenterTop[1],myScene1);
    compactor(q1Top);

    //11// draw point along line from projectedP0 and q1top
    projectedP0_q1Top = new THREE.Line3(projectedP0, q1Top);
    var eval = projectedP0_q1Top.at(0.5);
    compactor(eval);

    //12// draw a circle at the P4,P5,P6 (style = line)
    var normNcenterBottom = fitCircle(P4,P5,P6,"bottomCircleLine",myScene1,30,"line");

    //13// find intersection of plane of P0,projectedP0 and q1Top with bottom circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,q1Top,myScene1.getObjectByName("bottomCircleLine"))

    //14// find the closest to q1Top
    var q1Bottom = intersections [ findCLosestPoint(q1Top,intersections) ];
    compactor(q1Bottom);

    //15// draw point along line from q1Bottom and q1top
    q1Bottom_q1Top = new THREE.Line3(q1Bottom, q1Top);
    var eval = q1Bottom_q1Top.at(0.5);
    compactor(eval);







    //13// draw Q1 bottom




    ///////////

    //10// draw cusp1
    drawSurface();

    
    // insert constructionLine List here
    constructionLineList = [projectedP0,P0,projectedP0,copyP4,projectedP0,q1Top,q1Bottom,q1Top];
    drawConstructionLines(constructionLineList , myScene1);

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
var general = new function() {
    this.midpointLoc = 0 ;
    this.pointSize = 1;
    this.constructionLines = true;
}

var cusp1 = new function() {
    this.cusp1mid = 0.5 ;
    this.q1mid = 0.5;
    this.q1end = 0.5;
}


//
//
var fov =30;
var containerTXT = "container1";
var container = document.getElementById(containerTXT);
var sphereList = []; // this will store all sphere even after they are moved;
// 0_P0
// 1_P1
// 2_P2
// 3_P3
// 4_P4
// 5_P5
// 6_P6
// 7_mid of P0-P1
// 8_mid of P0-P2
// 9_mid of P0-P3
// 10_ projectedP0
// 11_copyP4
// 12_point between copyP4-projectedP0
// 13_q1top
// 14_point between projectedP0_q1Top
// 15_q1Bottom
// 16_point between q1Bottom_q1Top


var sphereListOriginal = []; // this will store Vector3 all sphere at their original position and will never be modified.


// Draw construction lines
var constructionLineList;


// lines
var projectedP0_copyP4;
var projectedP0_q1Top;
var q1Bottom_q1Top;

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
    sphere.position.x = point.x;
    sphere.position.y = point.y;
    sphere.position.z = point.z;
    myScene1.add( sphere );
    return sphere;
    

};
//
// this will adjust the camera positon and controls rotation center
//
function adjustView(){
    // FIX TARGET P0
    myCamera1.target = new THREE.Vector3(tempFidPointList[0].x, tempFidPointList[0].y, tempFidPointList[0].z);
    // SET POSITION P1
    myCamera1.position.set(tempFidPointList[1].x, tempFidPointList[1].y, tempFidPointList[1].z);
    // FIX ROTATION 
    myCamera1.updateProjectionMatrix();
    // FIX CONTROLS P0
    controls1.target.set( tempFidPointList[0].x , tempFidPointList[0].y , tempFidPointList[0].z );
}

//
// this function will create a sphere and add it to scene, then add sphere to 
// sphereList and vector to sphereListOrigina;l
//
function compactor(vector){
    var sphere = addSphere('g',vector);
    sphereListOriginal.push(vector)
    sphereList.push(sphere);
    myScene1.add(sphere);
}