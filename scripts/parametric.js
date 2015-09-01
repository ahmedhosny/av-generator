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
        myScene1.remove(myScene1.getObjectByName( 'topCurve1' ) )
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
    nurbsLine.name = "topCurve1"

    // var nurbsControlPointsGeometry = new THREE.Geometry();
    // nurbsControlPointsGeometry.vertices = nurbsCurve.controlPoints;
    // var nurbsControlPointsMaterial = new THREE.LineBasicMaterial( { linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true } );
    // var nurbsControlPointsLine = new THREE.Line( nurbsControlPointsGeometry, nurbsControlPointsMaterial );
    // nurbsControlPointsLine.position.copy( nurbsLine.position );
    // myScene1.add( nurbsControlPointsLine );


}

//
// the function will project a point onto a plane and make a sphere at the projected location
//
function projectPointOntoPlane(P0,P1,P2,P3,scene){
    // get the normal to the circle fit to the three points
    var normal = fitCircle(P1,P2,P3,"bottomCircle");

    // figure out if direction is correct

    // make ray

    // find intersection with mesh byName


}

//
// this function will draw a segmented circle given three points and return the normal to the circle.
//
function fitCircle(p1,p2,p3,name){
    // convert from fidPoint to column-wise array
    var P1 = new THREE.Vector3(p1.X,p1.Y,p1.Z);
    var P2 = new THREE.Vector3(p2.X,p2.Y,p2.Z);
    var P3 = new THREE.Vector3(p3.X,p3.Y,p3.Z);

    // VAR
    var center  = [];
    var rad = 0;

    // subtract point to get vectors
    var v1 = new THREE.Vector3();
    v1.subVectors(P2,P1);
    var l1 = v1.length();

    //
    var v2 = new THREE.Vector3();
    v2.subVectors(P3,P1);
    var l2 = v2.length();


    // normalize
    var v1n = v1.normalize();
    var temp = new THREE.Vector3();
    temp.copy(v2);
    var v2n = temp.normalize();


    // get cross product
    var nv = new THREE.Vector3();
    nv.crossVectors(v1n,v2n)

    // get dot product of v1n and v2n
    var temp = v1n;
    var dotP = temp.dot(v2n);


    // orthogonalization of v2n against v1n
    var temp = v2n;
    temp.x = temp.x - dotP*v1n.x;
    temp.y = temp.y - dotP*v1n.y;
    temp.z = temp.z - dotP*v1n.z;

    var v2nb = temp.normalize();

    // the circle
    // origin: p1                    
    // normal vector on plane: nv
    // first coordinate vector: v1n  
    // second coordinate vector: v2nb

    var p32d = [0,0];
    //
    p32d[0] = p32d[0] + v2.x * v1n.x ;
    p32d[0] = p32d[0] + v2.y * v1n.y ;
    p32d[0] = p32d[0] + v2.z * v1n.z ;
    //
    p32d[1] = p32d[1] + v2.x * v2nb.x ;
    p32d[1] = p32d[1] + v2.y * v2nb.y ;
    p32d[1] = p32d[1] + v2.z * v2nb.z ;
    //

    //
    var a = l1;
    var b = p32d[0];
    var c = p32d[1];
    var t = 0.5*(a-b)/c;
    var scale1 = b/2 + c*t;
    var scale2 = c/2 - b*t;

    // centers
    var center = [0,0,0];
    center[0] = P1.x + scale1*v1n.x + scale2*v2nb.x;
    center[1] = P1.y + scale1*v1n.y + scale2*v2nb.y;
    center[2] = P1.z + scale1*v1n.z + scale2*v2nb.z;

    // radii
    var rad = Math.sqrt(  Math.pow( (center[0]-P1.x),2) + Math.pow( (center[1]-P1.y),2) + Math.pow( (center[2]-P1.z),2)  );

    // lets draw the circle


    var tempStorage = [];
    var step = 30;
    var myFaceCounter = 0;
    var geometry = new THREE.Geometry();
    // loop to generate segments
    for (var  i = 0 ; i < 361 ; i=i+step){
        var a = (i / 180)*3.1416 ;
        var x = center[0] + Math.sin(a) * rad * v1.x + Math.cos(a) * rad * v2n.x;
        var y = center[1] + Math.sin(a) * rad * v1.y + Math.cos(a) * rad * v2n.y;
        var z = center[2] + Math.sin(a) * rad * v1.z + Math.cos(a) * rad * v2n.z;
        tempStorage.push([x,y,z]);
        // make geometry
        
        var mat = new THREE.MeshBasicMaterial( {  color: 0xFF0000 , opacity: 0.5, transparent: true, wireframe: false } );
        mat.side = THREE.DoubleSide;

        // do not do anything during the first loop because we on;y have one point on the circle

        // if not the first one 
        if(i != 0 ){
            geometry.vertices.push(
                new THREE.Vector3( x ,  y , z ),
                new THREE.Vector3( center[0] ,  center[1] , center[2]  ),
                new THREE.Vector3( tempStorage[tempStorage.length-2][0] ,  
                                   tempStorage[tempStorage.length-2][1] ,
                                   tempStorage[tempStorage.length-2][2]  )
            );

            geometry.faces.push( new THREE.Face3( myFaceCounter , myFaceCounter + 1, myFaceCounter + 2 ) );
            myFaceCounter+= 3
        }     
      
    }

    console.log(geometry);

    // after loop
    var myMesh = new THREE.Mesh( geometry , mat ); 
    myMesh.name = name;
    myScene1.add(myMesh);

    // returns the normal to the circle - normalized
    return nv.normalize();
}


////////


// trash


    // make a face from P1,P2,P3

    // var geometry = new THREE.Geometry();

    // geometry.vertices.push(
    //     new THREE.Vector3( P1.X ,  P1.Y , P1.Z ),
    //     new THREE.Vector3( P2.X ,  P2.Y , P2.Z  ),
    //     new THREE.Vector3( P3.X ,  P3.Y , P3.Z  )
    // );

    // geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    // myScene1.add(new THREE.Mesh(geometry));



    // var material = new THREE.MeshBasicMaterial({
    // color: 0x0000ff
    // });

    // var radius = 5;
    // var segments = 32;

    // var circleGeometry = new THREE.CircleGeometry( radius, segments );              
    // var circle = new THREE.Mesh( circleGeometry, material );
    // myScene1.add( circle );