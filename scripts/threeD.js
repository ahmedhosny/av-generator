// 03_This file create the final THREEJS scene, and generates cusps


//
// VARIABLES
// 
var myScene3,
myCamera3,
myRenderer3,
controls3,
myLight3;
var finalContainer; 
var sphereList = []; // this will store all sphere even after they are moved;
var pushValue = 1.5;
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

////////////////////////

// 11_copyP4
// 12_point between copyP4-projectedP0

// 13_q1top
// 14_point between projectedP0_q1Top
// 15_q1Bottom
// 16_point between q1Bottom_q1Top

// 17_q3top
// 18_point between projectedP0_q3Top
// 19_q3Bottom
// 20_point between q3Bottom_q3Top

// 21_point on mid curve at 0.2 (to curve the end booz)

///////////////////////

// 22_copyP5
// 23_point between copyP5-projectedP0

// 24_q1top
// 25_point between projectedP0_q1Top
// 26_q1Bottom
// 27_point between q1Bottom_q1Top

// 28_q3top
// 29_point between projectedP0_q3Top
// 30_q3Bottom
// 31_point between q3Bottom_q3Top

// 32_point on mid curve at 0.2 (to curve the end booz)

///////////////////////

// 33_copyP5
// 34_point between copyP5-projectedP0

// 35_q1top
// 36_point between projectedP0_q1Top
// 37_q1Bottom
// 38_point between q1Bottom_q1Top

// 39_q3top
// 40_point between projectedP0_q3Top
// 41_q3Bottom
// 42_point between q3Bottom_q3Top

// 43_point on mid curve at 0.2 (to curve the end booz)



var sphereListOriginal = []; // this will store Vector3 all sphere at their original position and will never be modified.
var resultCounter = 0;

// Draw construction lines
var constructionLineList = [];




// // lines
// var projectedP0_copyP4;
// var projectedP0_q1Top;
// var q1Bottom_q1Top;




//
// after all 7 points are recorded - we start drawing them in threejs
//

function mainSwitch(){

    $('#threeButton').click( function(){

        // UI STUFF

        // empty everything in container1
        $("#main").empty();
        // // and the svg
        // $("#mySVG").empty();
        // // adjust prompt
        // document.getElementById('text1a').innerHTML = "adjust the curves";
        document.getElementById("main").innerHTML = ' <div class="row "> <div class="col-md-8" > <div class="my-inner" ><div id="container4" ></div>        <hr id="con3line1" > </hr> <button type= "button" class="btn btn-default btn-block" id="downloadSTL" >  download .stl </button>    </div></div>       <div class="col-md-4" id="forGui" > <div class="my-inner" ><div id="container5" ></div></div></div> </div>  '
        
        finalContainer =  document.getElementById("container4");

        downloadSTL();

        //1// INITIATE THREEJS
        initiateScene3();

        //2// draw points and adjust camera/controls
        drawPoints();

        //3// draw midpoints
        getTopMidPoint(P1,P2,P3,tempFidPointList,sphereListOriginal,sphereList);


        //4// draw top curves for the first time - no need

        //5// project p0 onto bottom plane
        var projectedP0 = projectPointOntoPlane(tempFidPointList[0] , tempFidPointList[4] , tempFidPointList[5] ,tempFidPointList[6] , myScene3, "bottomCircleShaded" )
        compactor(projectedP0);

        //6// draw circle around P1,P2,P3
        var normNcenterTop = fitCircle(P1,P2,P3,"topCircleLine",myScene3,10,"line");

        //7// draw a circle at the P4,P5,P6 (style = line)
        var normNcenterBottom = fitCircle(P4,P5,P6,"bottomCircleLine",myScene3,10,"line");

        //////////////////
        makeLCusp(projectedP0,normNcenterTop);
        //////////////////
        makeNCCusp(projectedP0,normNcenterTop);
        //////////////////
        makeRCusp(projectedP0,normNcenterTop);


        //10// draw cusp1
        drawSurface(  LCusp_Index  , "L_cusp" );
        drawSurface(  NCCusp_Index  , "NC_cusp" );
        drawSurface(  RCusp_Index  , "R_cusp" );
      

        drawConstructionLines(constructionLineList , myScene3);

        makeGUI();

        // insert sinus and calcium stl
        sinusCalcium();

        // light is added


        // 
        render3();
        //



        //
        $("#container4").css('cursor' , 'url("img/rotate32.png"), auto');

    });


}


////////////////
//////////////// SOME PROJECT FUNCTIONS
////////////////


// RENDER FUNC
function render3(){
    myRenderer3.render(myScene3,myCamera3);
    controls3.update();
    requestAnimationFrame(render3);
}


//
// CREATE SCENE 1
//
function initiateScene3(){

    // SCENE
    myScene3 = new THREE.Scene();
    // CAMERA
    myCamera3 = new THREE.PerspectiveCamera(fov,window.innerWidth / window.innerHeight,1,10000);
    // RENDER
    myRenderer3 = new THREE.WebGLRenderer();
    // DUMMY POSITION
    myCamera3.target = new THREE.Vector3(0,0,0);
    myCamera3.position.set(-8.0, -30, 9);
    myScene3.add(myCamera3);
    // LIGHT
    var light = new THREE.AmbientLight( 0xFFFFFF); // soft white light
    myScene3.add( light );


    // CONTROL

    controls3 = new THREE.TrackballControls( myCamera3, finalContainer);
    controls3.rotateSpeed = 1.0;
    controls3.zoomSpeed = 1.2;
    controls3.panSpeed = 0.8;
    controls3.noZoom = false;
    controls3.noPan = false;
    controls3.staticMoving = false;
    controls3.dynamicDampingFactor = 0.15;
    controls3.keys = [ 65, 83, 68 ];

    // var axisHelper = new THREE.AxisHelper( 100 );
    // myScene3.add( axisHelper );


}

function drawPoints(){
    for (var i = 0 ; i < tempFidPointList.length ; i++){
        sphereListOriginal.push(tempFidPointList[i]);
        var sphere = addSphere(i,tempFidPointList[i]);
        sphereList.push(sphere);
    }

    adjustView();
    
}


function addSphere(counter,point){

    //
    THREE.ImageUtils.crossOrigin = '';
    var texture = THREE.ImageUtils.loadTexture('https://mecano-eq.s3.amazonaws.com/p' + String(counter) + '.jpg');
    texture.minFilter = THREE.NearestFilter;
    var material = new THREE.MeshPhongMaterial({
        map: texture,
       specular: 0xFFFFFF,
       shininess: 100
    });

    //
    var radius = 0.5;
    var geometry = new THREE.SphereGeometry( radius, 20,20);
    
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = point.x;
    sphere.position.y = point.y;
    sphere.position.z = point.z;
    myScene3.add( sphere );
    return sphere;
    

};
// //
// // this will adjust the camera positon and controls rotation center
// //
function adjustView(){
    // FIX TARGET P0
    myCamera3.target = new THREE.Vector3(tempFidPointList[0].x, tempFidPointList[0].y, tempFidPointList[0].z);
    // SET POSITION P1
    myCamera3.position.set(tempFidPointList[1].x, tempFidPointList[1].y, tempFidPointList[1].z);
    // FIX ROTATION 
    myCamera3.updateProjectionMatrix();
    // FIX CONTROLS P0
    controls3.target.set( tempFidPointList[0].x , tempFidPointList[0].y , tempFidPointList[0].z );
}

//
// this function will create a sphere and add it to scene, then add sphere to 
// sphereList and vector to sphereListOrigina;l
//
function compactor(vector){
    var sphere = addSphere('g',vector);
    sphereListOriginal.push(vector);
    sphereList.push(sphere);
    myScene3.add(sphere);
}

// get the top three midpoints
function getTopMidPoint(P1,P2,P3,tempFidPointList,sphereListOriginal,sphereList){
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
    sphere.position.x = sphereListOriginal[index].x + dir.x * dist;
    sphere.position.y = sphereListOriginal[index].y + dir.y * dist;
    sphere.position.z = sphereListOriginal[index].z + dir.z * dist; 
}



function drawSurface(list,name){


    // CONSTRUCT FIVE MAIN SPLINES
    //
    // 1
    //
    var curve1 = new THREE.CatmullRomCurve3( [
            new THREE.Vector3 ( sphereList[ list[0] ].position.x , sphereList[ list[0] ].position.y , sphereList[ list[0] ].position.z ),
            new THREE.Vector3 ( sphereList[ list[1] ].position.x , sphereList[ list[1] ].position.y , sphereList[ list[1]  ].position.z ),
            new THREE.Vector3 ( sphereList[ list[2] ].position.x , sphereList[ list[2] ].position.y , sphereList[ list[2] ].position.z  )
    ] );
    geometry1 = drawCurve(curve1,myScene3, "curve1")

    //
    // 2
    //
    var curve2 = new THREE.CatmullRomCurve3( [
            new THREE.Vector3 ( sphereList[ list[3] ].position.x , sphereList[ list[3] ].position.y , sphereList[ list[3] ].position.z ),
            new THREE.Vector3 ( sphereList[ list[4] ].position.x , sphereList[ list[4] ].position.y , sphereList[ list[4]  ].position.z ),
            new THREE.Vector3 ( sphereList[ list[5] ].position.x , sphereList[ list[5] ].position.y , sphereList[ list[5] ].position.z  )
    ] );
    geometry2 = drawCurve(curve2,myScene3, "curve2")


    //
    // 3
    //
    var curve3 = new THREE.CatmullRomCurve3( [
            new THREE.Vector3 ( sphereList[ list[6] ].position.x , sphereList[ list[6] ].position.y , sphereList[ list[6] ].position.z ),
            new THREE.Vector3 ( sphereList[ list[7] ].position.x , sphereList[ list[7] ].position.y , sphereList[ list[7]  ].position.z ),
            new THREE.Vector3 ( sphereList[ list[8] ].position.x , sphereList[ list[8] ].position.y , sphereList[ list[8] ].position.z  )
    ] );
    geometry3 = drawCurve(curve3,myScene3, "curve3")

    //
    //4
    //
    var curve4 = new THREE.CatmullRomCurve3( [
            new THREE.Vector3 ( sphereList[ list[9] ].position.x , sphereList[ list[9] ].position.y , sphereList[ list[9] ].position.z ),
            new THREE.Vector3 ( sphereList[ list[10] ].position.x , sphereList[ list[10] ].position.y , sphereList[ list[10]  ].position.z ),
            new THREE.Vector3 ( sphereList[ list[11] ].position.x , sphereList[ list[11] ].position.y , sphereList[ list[11] ].position.z  )
    ] );
    geometry4 = drawCurve(curve4,myScene3, "curve4")

    //
    // 5
    //
    var curve5 = new THREE.CatmullRomCurve3( [
            new THREE.Vector3 ( sphereList[ list[12] ].position.x , sphereList[ list[12] ].position.y , sphereList[ list[12] ].position.z ),
            new THREE.Vector3 ( sphereList[ list[13] ].position.x , sphereList[ list[13] ].position.y , sphereList[ list[13]  ].position.z ),
            new THREE.Vector3 ( sphereList[ list[14] ].position.x , sphereList[ list[14] ].position.y , sphereList[ list[14] ].position.z  )
    ] );
    geometry5 = drawCurve(curve5,myScene3, "curve5")



    var curveGeometryVerticesList = [];

    //
    // MAKE ALL 50 CROSS - CURVES
    //
    for ( var i = 0 ; i < 51 ; i++){

        var curve = new THREE.CatmullRomCurve3( [ geometry1.vertices[i] , geometry2.vertices[i] , geometry3.vertices[i], geometry4.vertices[i], geometry5.vertices[i]     ] );
        var geometry = new THREE.Geometry();
        geometry.vertices = curve.getPoints( 50 );
        curveGeometryVerticesList.push(geometry.vertices);

        // draw last curve only 
        if (i == 50){
            var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
            var curveobj = new THREE.Line( geometry, material );
            curveobj.name = name + "_outline";
            myScene3.add(curveobj);

        }


    }



    var myCuspGeo = new THREE.Geometry();
    //
    // NOW LOOP THROUGH CURVE GEOMETRIES AND DRAW MESH
    //
    for ( var i = 0 ; i < 50 ; i++){

        // loop through points on curve
        // remove first point and last point - for gaps between cusps
        // original 0 to 50 i.e. 51 points - runs 50 times 50*4 = 200
        // now 1 to 49 i.e. 48
        for ( var j = 1 ; j < 49 ; j++){ 
            

            var v1 = curveGeometryVerticesList[i][j] ; 
            var v2 =  curveGeometryVerticesList[i+1][j+1] ; // sub
            var v3 = curveGeometryVerticesList[i][j+1]  ; 
            var v4 = curveGeometryVerticesList[i+1][j] ; 

            myCuspGeo.vertices.push(v1);
            myCuspGeo.vertices.push(v2);
            myCuspGeo.vertices.push(v3);
            myCuspGeo.vertices.push(v4);


            
            var multi = 192;
            // traingle 1 
            myCuspGeo.faces.push( new THREE.Face3( i*multi + (j-1)*4 ,  i*multi + (j-1)*4 + 1 , i*multi + (j-1)*4 + 2) );
            // traingle  2
            myCuspGeo.faces.push( new THREE.Face3( i*multi + (j-1)*4  , i*multi + (j-1)*4 + 3   , i*multi + (j-1)*4 + 1 ) );
            

        }


    }


    var myMat = new THREE.MeshLambertMaterial( {color: 0xA49480 , side: THREE.DoubleSide} );
    // thicken(myCuspGeo, myScene3 , myMat ,1, 'L_cusp',false);

    myCuspGeo.mergeVertices();
    myCuspGeo.computeFaceNormals();
    var myCuspMesh = new THREE.Mesh( myCuspGeo, myMat  );
    myCuspMesh.name = name;
    myScene3.add( myCuspMesh );
            // after render loop
    myCuspMesh.material.needsUpdate=true;

}

//
// will draw a curve given a spline curve and add to scene
//
function drawCurve(curve,myScene, name){
    // DEFINE CURVE MATERIAL
    // var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    var geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints( 50 );
    // var curveobj = new THREE.Line( geometry, material );
    // curveobj.name = name;
    // myScene.add(curveobj);
    return geometry;
}

//
// for smoothing the end booz
//
function smoothEnd(sphereList,list){ 

    var curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3 ( sphereList[ list[0] ].position.x , sphereList[ list[0]  ].position.y , sphereList[ list[0] ].position.z ),
            new THREE.Vector3 ( sphereList[ list[1] ].position.x , sphereList[ list[1] ].position.y , sphereList[ list[1] ].position.z ),
            new THREE.Vector3 ( sphereList[ list[2] ].position.x , sphereList[  list[2] ].position.y , sphereList[  list[2] ].position.z  )
    ] );

    return curve.getPoint(0.15)

}
//
// for moving out two points to match the curve of the sinus
//
function moveOutABit(P0,point,amount){
    var vec = point.clone().sub(P0).normalize();
    return point.add(  vec.multiplyScalar(amount) )

}


//
// This function will draw all construction Lines - given a list of even # of Vector3
//
function drawConstructionLines(list,scene){



    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });

    var myCounter = 0;
    for (var i = 0 ; i < list.length ; i=i+2){
        var geometry = new THREE.Geometry();
        geometry.vertices.push(list[i]);
        geometry.vertices.push(list[i+1]);
        var line = new THREE.Line(geometry, material);
        scene.add(line);
        line.name = "constructionLine" + String(myCounter);
        myCounter++;
    } 

}

function sinusCalcium(){

    // start a progress bar here
    NProgress.configure({ parent: '#container4' });
    NProgress.start();

    // Load  both files
    // sinus
    loadSTL3(binary1, "container4");

    // calcium
    if (binary2!=undefined){
        loadSTL3(binary2, "container4");
    }
    else{
        NProgress.done();
    }



}


function loadSTL3(filePath, myContainer){

    var windowContainer = document.getElementById(myContainer);


        // RESIZE
        $(window).resize(function () {
            width=$("#" + myContainer).width();
            height=$("#" + myContainer).height();

            myCamera3.aspect = width/height;
            myCamera3.updateProjectionMatrix();

            myRenderer3.setSize( width, height );

        });


        stlLoader.load( filePath, createScene3 ); 
        myRenderer3.setSize( $("#" + myContainer).innerWidth() , $("#" + myContainer).innerHeight() );
        windowContainer.appendChild(myRenderer3.domElement);
        myRenderer3.setClearColor( 0xddfdfdf , 1 );
        

}

function createScene3( geometry, materials ) {

    // wireframe materials of different colors
    if(resultCounter == 0){
        var mat = new THREE.MeshLambertMaterial( {color: 0x5B807A , side: THREE.DoubleSide, opacity: 0.8, transparent: true } ) ;
        myMesh3a = new THREE.Mesh( geometry , mat );
        myScene3.add(myMesh3a); 
        myMesh3a.name = "myMesh3a"; //sinus
        // add point lights
        letThereBeLight(geometry,myScene3,0.4);
        //
        // now they are moved an extra -0.5 bringing the GUI total to -2.5
        dummyTrigger();

    }
    else{
        var mat = new THREE.MeshLambertMaterial( {color: 0x6E698C , side: THREE.DoubleSide , opacity: 0.8 } ) ;
        // double sides so that it detects rays coming from behind
        // mat.side = THREE.DoubleSide;
        myMesh3b = new THREE.Mesh( geometry , mat );
        myScene3.add(myMesh3b); 
        myMesh3b.name = "myMesh3b"; // calcium

        NProgress.done();

    }



    resultCounter+= 1;

}


////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeLCusp(projectedP0,normNcenterTop){

    //
    // MAIN (Q2)
    //

    //8// find intersection of plane from P0, projectedP0 and P4 with top circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,P4,myScene3.getObjectByName("topCircleLine"))

    //9// find the closest to P4
    var copyP4 = intersections [ findCLosestPoint(P4,intersections) ];
    compactor(copyP4);

    //10// draw a line from projectedP0 to copyP4 and a moving sphere
    projectedP0_copyP4 = new THREE.Line3(projectedP0, copyP4);
    var eval = projectedP0_copyP4.at(0.5);
    compactor(eval);

    //
    // Q1
    //

    //11// draw Q1 top
    var q1Top = getPointOnArc(P1,copyP4,0.5,normNcenterTop[1],myScene3);
    compactor(q1Top);

    //12// draw point along line from projectedP0 and q1top
    projectedP0_q1Top_L = new THREE.Line3(projectedP0, q1Top);
    var eval = projectedP0_q1Top_L.at(0.5);
    compactor(eval);


    //13// find intersection of plane of P0,projectedP0 and q1Top with bottom circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,q1Top,myScene3.getObjectByName("bottomCircleLine"))

    //14// find the closest to q1Top
    var q1Bottom = intersections [ findCLosestPoint(q1Top,intersections) ];
    compactor(q1Bottom);

    //15// draw point along line from q1Bottom and q1top
    q1Bottom_q1Top_L = new THREE.Line3(q1Bottom, q1Top);
    var eval = q1Bottom_q1Top_L.at(0.5);
    // move it out a bit
    var newEval = moveOutABit(P0,eval,pushValue)
    compactor(newEval);

    //
    // Q3
    //

    //16// draw Q1 top
    var q3Top = getPointOnArc(P2,copyP4,0.5,normNcenterTop[1],myScene3);
    compactor(q3Top);

    //17// draw point along line from projectedP0 and q3top
    projectedP0_q3Top_L = new THREE.Line3(projectedP0, q3Top);
    var eval = projectedP0_q3Top_L.at(0.5);
    compactor(eval);

    //18// find intersection of plane of P0,projectedP0 and q3Top with bottom circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,q3Top,myScene3.getObjectByName("bottomCircleLine"))

    //19// find the closest to q1Top
    var q3Bottom = intersections [ findCLosestPoint(q3Top,intersections) ];
    compactor(q3Bottom);

    //20// draw point along line from q1Bottom and q1top
    q3Bottom_q3Top_L = new THREE.Line3(q3Bottom, q3Top);
    var eval = q3Bottom_q3Top_L.at(0.5);
    // move it out a bit
    var newEval = moveOutABit(P0,eval,pushValue)
    compactor(newEval);

    //
    // for curved end
    //
    compactor( smoothEnd(sphereList, [0,12,4] ) ) ;

    //
            // insert constructionLine List here
    constructionLineList.push(projectedP0,P0,projectedP0,copyP4,projectedP0,q1Top,q1Bottom,q1Top,projectedP0,q3Top,q3Bottom,q3Top);

}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeNCCusp(projectedP0,normNcenterTop){

    //
    // MAIN (Q2)
    //

    //8// find intersection of plane from P0, projectedP0 and P5 with top circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,P5,myScene3.getObjectByName("topCircleLine"))

    //9// find the closest to P5
    var copyP5 = intersections [ findCLosestPoint(P5,intersections) ];
    compactor(copyP5);

    //10// draw a line from projectedP0 to copyP4 and a moving sphere
    projectedP0_copyP5 = new THREE.Line3(projectedP0, copyP5);
    var eval = projectedP0_copyP5.at(0.5);
    compactor(eval);

    //
    // Q1
    //

    //11// draw Q1 top
    var q1Top = getPointOnArc(P2,copyP5,0.5,normNcenterTop[1],myScene3);
    compactor(q1Top);

    //12// draw point along line from projectedP0 and q1top
    projectedP0_q1Top_NC = new THREE.Line3(projectedP0, q1Top);
    var eval = projectedP0_q1Top_NC.at(0.5);
    compactor(eval);


    //13// find intersection of plane of P0,projectedP0 and q1Top with bottom circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,q1Top,myScene3.getObjectByName("bottomCircleLine"))

    //14// find the closest to q1Top
    var q1Bottom = intersections [ findCLosestPoint(q1Top,intersections) ];
    compactor(q1Bottom);

    //15// draw point along line from q1Bottom and q1top
    q1Bottom_q1Top_NC = new THREE.Line3(q1Bottom, q1Top);
    var eval = q1Bottom_q1Top_NC.at(0.5);
    // move it out a bit
    var newEval = moveOutABit(P0,eval,pushValue)
    compactor(newEval);

    //
    // Q3
    //

    //16// draw Q1 top
    var q3Top = getPointOnArc(P3,copyP5,0.5,normNcenterTop[1],myScene3);
    compactor(q3Top);

    //17// draw point along line from projectedP0 and q3top
    projectedP0_q3Top_NC = new THREE.Line3(projectedP0, q3Top);
    var eval = projectedP0_q3Top_NC.at(0.5);
    compactor(eval);

    //18// find intersection of plane of P0,projectedP0 and q3Top with bottom circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,q3Top,myScene3.getObjectByName("bottomCircleLine"))

    //19// find the closest to q1Top
    var q3Bottom = intersections [ findCLosestPoint(q3Top,intersections) ];
    compactor(q3Bottom);

    //20// draw point along line from q1Bottom and q1top
    q3Bottom_q3Top_NC = new THREE.Line3(q3Bottom, q3Top);
    var eval = q3Bottom_q3Top_NC.at(0.5);
    // move it out a bit
    var newEval = moveOutABit(P0,eval,pushValue)
    compactor(newEval);

    //
    // for curved end
    //
    compactor( smoothEnd(sphereList , [0,23, 5] ) ) ;

    //
            // insert constructionLine List here
    constructionLineList.push(projectedP0,copyP5,projectedP0,q1Top,q1Bottom,q1Top,projectedP0,q3Top,q3Bottom,q3Top);

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeRCusp(projectedP0,normNcenterTop){

    //
    // MAIN (Q2)
    //

    //8// find intersection of plane from P0, projectedP0 and P5 with top circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,P6,myScene3.getObjectByName("topCircleLine"))

    //9// find the closest to P5
    var copyP6 = intersections [ findCLosestPoint(P6,intersections) ];
    compactor(copyP6);

    //10// draw a line from projectedP0 to copyP4 and a moving sphere
    projectedP0_copyP6 = new THREE.Line3(projectedP0, copyP6);
    var eval = projectedP0_copyP6.at(0.5);
    compactor(eval);

    //
    // Q1
    //

    //11// draw Q1 top
    var q1Top = getPointOnArc(P3,copyP6,0.5,normNcenterTop[1],myScene3);
    compactor(q1Top);

    //12// draw point along line from projectedP0 and q1top
    projectedP0_q1Top_R = new THREE.Line3(projectedP0, q1Top);
    var eval = projectedP0_q1Top_R.at(0.5);
    compactor(eval);


    //13// find intersection of plane of P0,projectedP0 and q1Top with bottom circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,q1Top,myScene3.getObjectByName("bottomCircleLine"))

    //14// find the closest to q1Top
    var q1Bottom = intersections [ findCLosestPoint(q1Top,intersections) ];
    compactor(q1Bottom);

    //15// draw point along line from q1Bottom and q1top
    q1Bottom_q1Top_R = new THREE.Line3(q1Bottom, q1Top);
    var eval = q1Bottom_q1Top_R.at(0.5);
    // move it out a bit
    var newEval = moveOutABit(P0,eval,pushValue)
    compactor(newEval);

    //
    // Q3
    //

    //16// draw Q1 top
    var q3Top = getPointOnArc(P1,copyP6,0.5,normNcenterTop[1],myScene3);
    compactor(q3Top);

    //17// draw point along line from projectedP0 and q3top
    projectedP0_q3Top_R = new THREE.Line3(projectedP0, q3Top);
    var eval = projectedP0_q3Top_R.at(0.5);
    compactor(eval);

    //18// find intersection of plane of P0,projectedP0 and q3Top with bottom circle
    var intersections = intersectPlaneLineGeom(P0,projectedP0,q3Top,myScene3.getObjectByName("bottomCircleLine"))

    //19// find the closest to q1Top
    var q3Bottom = intersections [ findCLosestPoint(q3Top,intersections) ];
    compactor(q3Bottom);

    //20// draw point along line from q1Bottom and q1top
    q3Bottom_q3Top_R = new THREE.Line3(q3Bottom, q3Top);
    var eval = q3Bottom_q3Top_R.at(0.5);
    // move it out a bit
    var newEval = moveOutABit(P0,eval,pushValue)
    compactor(newEval);

    //
    // for curved end
    //
    compactor( smoothEnd(sphereList , [0,34, 6] ) ) ;

    //
            // insert constructionLine List here
    constructionLineList.push(projectedP0,copyP6,projectedP0,q1Top,q1Bottom,q1Top,projectedP0,q3Top,q3Bottom,q3Top);

}

