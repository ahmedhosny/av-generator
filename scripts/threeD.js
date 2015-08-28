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
var topCurveIdList = [];

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

//
// NOW WE START THE PARAMETRIC WORK
//
// get the top three midpoints
function getTopMidPoint(){
    // get the upper plane normal
    var nor = getNormal(P1,P2,P3)
    //
    for(var i = 1 ; i < 4 ; i++){
        // get the point where it should be
        var Ptemp = getMidpoint(tempFidPointList[0],tempFidPointList[i]);
        sphereListOriginal.push(Ptemp);
        // make a sphere where it should be
        var sphere = addSphere('b',Ptemp);
        sphereList.push(sphere);
        
    }

}

//
// now we move the midpoints along the normal to the top vector
//
function moveSphere(sphere, index, dir,dist){
    sphere.position.x = sphereListOriginal[index].X + dir.x * dist;
    sphere.position.y = sphereListOriginal[index].Y + dir.y * dist;
    sphere.position.z = sphereListOriginal[index].Z + dir.z * dist; 
}

//
// get normal to three points
//
function getNormal(P1,P2,P3){
    // Dir = (B - A) x (C - A)
    var Vec1 = new THREE.Vector3(P2.X-P1.X , P2.Y-P1.Y , P2.Z-P1.Z);
    var Vec2 = new THREE.Vector3(P3.X-P1.X , P3.Y-P1.Y , P3.Z-P1.Z);
    var c = new THREE.Vector3();
    c.crossVectors( Vec1 , Vec2 ).normalize();
    return c;
}

//
// this function will create the gui and add the variables from the var to it
//
function makeGUI(){

    var gui = new dat.GUI({
        height : 5 * 32 - 1
    });
    var guiFolder1 = gui.addFolder('overall controls');

    var topPlaneNormal = getNormal(P1,P2,P3);
    guiFolder1.add(overall, 'midpointLoc' , -5.1 , 0.0 ).onChange( function(){
        // change all three midpoints
        moveSphere(sphereList[7],7,topPlaneNormal,overall.midpointLoc);
        moveSphere(sphereList[8],8,topPlaneNormal,overall.midpointLoc);
        moveSphere(sphereList[9],9,topPlaneNormal,overall.midpointLoc);
        // remove the old curves
        myScene1.remove(myScene1.getObjectById( topCurveIdList[0]) )
        // empty the list
        topCurveIdList = [];
        // draw the top curves again
        drawTopCurves();

    } );

    guiFolder1.open();

}

//
// this function will draw the top three curves connecting P0-P1 , P0-P2 , P0-P3 going through the midpoints.
//
function drawTopCurves(){

    // NURBS curve

    var nurbsControlPoints = [];
    var nurbsKnots = [];
    var nurbsDegree = 2;

    for ( var i = 0; i <= nurbsDegree; i ++ ) {

        nurbsKnots.push( 0 );

    }

    // for ( var i = 0, j = 20; i < j; i ++ ) {

    nurbsControlPoints.push( new THREE.Vector4 (sphereList[0].position.x , sphereList[0].position.y , sphereList[0].position.z , 1 ) );
    var knot = ( 0 + 1 ) / ( 3 - nurbsDegree );
    nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );


    nurbsControlPoints.push( new THREE.Vector4 (sphereList[7].position.x , sphereList[7].position.y , sphereList[7].position.z , 1 ) );
    var knot = ( 1 + 1 ) / ( 3 - nurbsDegree );
    nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

    nurbsControlPoints.push( new THREE.Vector4 (sphereList[1].position.x , sphereList[1].position.y , sphereList[1].position.z , 1 ) );
    var knot = ( 2 + 1 ) / ( 3 - nurbsDegree );
    nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );


    // }

    var nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);

    var nurbsGeometry = new THREE.Geometry();
    nurbsGeometry.vertices = nurbsCurve.getPoints(200);
    var nurbsMaterial = new THREE.LineBasicMaterial( { linewidth: 10, color: 0x333333, transparent: true } );

    var nurbsLine = new THREE.Line( nurbsGeometry, nurbsMaterial );

    // nurbsLine.position.set( 200, -100, 0 );
    myScene1.add( nurbsLine );

    topCurveIdList.push(nurbsLine.id)

    // var nurbsControlPointsGeometry = new THREE.Geometry();
    // nurbsControlPointsGeometry.vertices = nurbsCurve.controlPoints;
    // var nurbsControlPointsMaterial = new THREE.LineBasicMaterial( { linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true } );
    // var nurbsControlPointsLine = new THREE.Line( nurbsControlPointsGeometry, nurbsControlPointsMaterial );
    // nurbsControlPointsLine.position.copy( nurbsLine.position );
    // myScene1.add( nurbsControlPointsLine );


}

