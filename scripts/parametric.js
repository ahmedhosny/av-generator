//
// NOW WE START THE PARAMETRIC WORK
//


//
// get midpoint of two points (given three js vector3)
//
function getMidpoint(p1,p2){
    return new THREE.Vector3 ( (p1.x+p2.x)/2 , (p1.y+p2.y)/2 , (p1.z+p2.z)/2 );   
}

//
// get midpoint of two points (given three js vector3)
//
function getMidpoint3(p1,p2,p3){
    return new THREE.Vector3 ( (p1.x+p2.x+p3.x)/3 , (p1.y+p2.y+p3.y)/3 , (p1.z+p2.z+p3.z)/3 );   
}

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
    sphere.position.x = sphereListOriginal[index].x + dir.x * dist;
    sphere.position.y = sphereListOriginal[index].y + dir.y * dist;
    sphere.position.z = sphereListOriginal[index].z + dir.z * dist; 
}

//
// get normal to three points (takes 3 Vector3 and returns 1 Vector3)
//
function getNormal(P1,P2,P3){
    // Dir = (B - A) x (C - A)
    var Vec1 = new THREE.Vector3(P2.x-P1.x , P2.y-P1.y , P2.z-P1.z);
    var Vec2 = new THREE.Vector3(P3.x-P1.x , P3.y-P1.y , P3.z-P1.z);
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

    //////////////////////////////

    var guiFolder1 = gui.addFolder('general');

    guiFolder1.add(general, 'pointSize' , 0.00 , 5.00 ).onChange( function(){

        for (var i = 0 ; i < sphereList.length ; i++){
            sphereList[i].scale.x = general.pointSize;
            sphereList[i].scale.y = general.pointSize;
            sphereList[i].scale.z = general.pointSize;
        }

    } );



    var topPlaneNormal = getNormal(P1,P2,P3);
    guiFolder1.add(general, 'midpointLoc' , -10.0 , 0.0 ).onChange( function(){
        // change all three midpoints
        moveSphere(sphereList[7],7,topPlaneNormal,general.midpointLoc);
        moveSphere(sphereList[8],8,topPlaneNormal,general.midpointLoc);
        moveSphere(sphereList[9],9,topPlaneNormal,general.midpointLoc);
        // remove the old surface
        myScene1.remove(myScene1.getObjectByName( 'cusp1' ) )
        // draw cusp1 again
        drawSurface();

    } );

    guiFolder1.add(general, "constructionLines").onChange(function(newValue) {
        // it is set to true by default
        // if false
        if (!newValue){
            for (var  i = 0 ; i < constructionLineList.length / 2 ; i++){
                myScene1.remove(myScene1.getObjectByName(  "constructionLine" + String(i) ) );
            }
        }
        // if true    
        else{
            drawConstructionLines(constructionLineList , myScene1);
        }
            
    });
    

   

    guiFolder1.open();

    ////////////////////////////////
    ////////////////////////////////
    ////////////////////////////////

    var guiFolder2 = gui.addFolder('cusp1');
    //
    guiFolder2.add(cusp1, 'q1mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_q1Top.at(cusp1.q1mid);
        // set position of sphere
        sphereList[14].position.x = eval1.x;
        sphereList[14].position.y = eval1.y;
        sphereList[14].position.z = eval1.z;
        // remove the old surface
        myScene1.remove(myScene1.getObjectByName( 'cusp1' ) )
        // draw cusp1 again
        drawSurface();
    });
    guiFolder2.add(cusp1, 'q1end' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = q1Bottom_q1Top.at(cusp1.q1end);
        // set position of sphere
        sphereList[16].position.x = eval1.x;
        sphereList[16].position.y = eval1.y;
        sphereList[16].position.z = eval1.z;
        // remove the old surface
        myScene1.remove(myScene1.getObjectByName( 'cusp1' ) )
        // draw cusp1 again
        drawSurface();
    });
    //
    guiFolder2.add(cusp1, 'cusp1mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_copyP4.at(cusp1.cusp1mid);
        // set position of sphere
        sphereList[12].position.x = eval1.x;
        sphereList[12].position.y = eval1.y;
        sphereList[12].position.z = eval1.z;
        // remove the old surface
        myScene1.remove(myScene1.getObjectByName( 'cusp1' ) )
        // draw cusp1 again
        drawSurface();
    });
    //
    guiFolder2.open();



}

//
// the function will project a point onto a plane and return the vector3 at the projected location
//
function projectPointOntoPlane(P0,P1,P2,P3,scene,mesh){
    // get the normal to the circle fit to the three points and its center
    var result = fitCircle(P1,P2,P3,mesh,scene,30,"shaded");
    // var sphere = addSphere('b' , result[1] );
    // scene.add(sphere);

    // figure out if direction is correct - just make two rays


    // make ray
    // ray
    var ray1 = new THREE.Raycaster( P0, result[0] );
    var ray2 = new THREE.Raycaster( P0, new THREE.Vector3(result[0].x * -1 , result[0].y * -1 , result[0].z * -1 ) );

    var list = [];
    list.push(scene.getObjectByName(mesh));

    // look for intersection
    var intersects1 = ray1.intersectObjects( list );
    var intersects2 = ray2.intersectObjects( list );
    var output;
    
    // look for intersection
    if ( intersects1.length > 0 ) {
        output = intersects1[0].point;
    }
    else {
        output = intersects2[0].point;
    }

    return  output;

}

//
// this function will draw a segmented circle given three points and return the normal to the circle and its center
//
function fitCircle(P1,P2,P3,name,scene,step,style){


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
    var centerV = new THREE.Vector3(center[0], center[1], center[2]);

    // radii
    var rad = Math.sqrt(  Math.pow( (center[0]-P1.x),2) + Math.pow( (center[1]-P1.y),2) + Math.pow( (center[2]-P1.z),2)  );

    // lets draw the circle


    var tempStorage = [];
    var myFaceCounter = 0;
    var geometry = new THREE.Geometry();
    var mat;

    if(style=="shaded"){
        mat = new THREE.MeshBasicMaterial( {  color: 0xFF0000 , opacity: 0.5, transparent: true, wireframe: false } );
        mat.side = THREE.DoubleSide;
    }
    else if(style=="line"){
        mat = new THREE.LineBasicMaterial({ color: 0x0000ff });
    }



    // loop to generate segments
    for (var  i = 0 ; i < 361 ; i=i+step){
        var a = (i / 180)*3.1416 ;
        var x = center[0] + Math.sin(a) * rad * v1.x + Math.cos(a) * rad * v2n.x;
        var y = center[1] + Math.sin(a) * rad * v1.y + Math.cos(a) * rad * v2n.y;
        var z = center[2] + Math.sin(a) * rad * v1.z + Math.cos(a) * rad * v2n.z;
        tempStorage.push([x,y,z]);
        // 
        // do not do anything during the first loop because we on;y have one point on the circle

        // if not the first one 
        if(i != 0 ){
            // if style is shaded
            if(style=="shaded"){
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
            //
        }   
        //

        if(style=="line"){
            geometry.vertices.push( new THREE.Vector3( x ,  y , z ) );
        }  
      
    }

    // after loop
    var myMesh;

    if(style=="shaded"){
        myMesh = new THREE.Mesh( geometry , mat ); 
    }
    else if(style=="line"){
        myMesh = new THREE.Line( geometry , mat );
    }

    myMesh.name = name;
    scene.add(myMesh);

    // returns the normal to the circle - normalized
    var result = [nv.normalize(),centerV]
    return result;
}


//
// intersect a plane (made from three Points) and a line(collection of lines) - this will output a list of intersections
//
function intersectPlaneLineGeom(P1,P2,P3,lineGeom){
    // get normal
    var nor = getNormal(P1,P2,P3);
    var myPlane = new THREE.Plane();
    myPlane.setFromNormalAndCoplanarPoint(nor,P1);

    var intersectionList = [];
    // loop through vertices, make line3 and check for intersections
    for(var i = 0 ; i < lineGeom.geometry.vertices.length ; i++){
        var myLine = new THREE.Line3(lineGeom.geometry.vertices[i] , lineGeom.geometry.vertices[(i+1)%lineGeom.geometry.vertices.length])
        var intersection = myPlane.intersectLine(myLine);
        // if there is an intersection
        if(intersection != undefined ){
            intersectionList.push(intersection);
         }   

    }

    return intersectionList ;

}

//
// find the closest point to a point from a list of points
//

function findCLosestPoint(point,list){

    var closestIndex;
    var dist = 1000000000000000000;
    for (var  i = 0 ; i < list.length ; i ++){
        var temp = point.distanceTo(list[i]);
        // if it is smaller
        if (temp < dist){
            dist = temp;
            closestIndex = i;
        }
        // if not - do nothing
    }

    return closestIndex;
}



function drawSurface(){


    var nsControlPoints = [
                    [
                        new THREE.Vector4 ( sphereList[0].position.x , sphereList[0].position.y , sphereList[0].position.z,  1 ),
                        new THREE.Vector4 ( sphereList[7].position.x , sphereList[7].position.y , sphereList[7].position.z , 1 ),
                        new THREE.Vector4 ( sphereList[1].position.x , sphereList[1].position.y , sphereList[1].position.z , 1 )
                    ],
                    [
                        new THREE.Vector4 ( sphereList[0].position.x , sphereList[0].position.y , sphereList[0].position.z,  1 ),
                        new THREE.Vector4 ( sphereList[14].position.x , sphereList[14].position.y , sphereList[14].position.z , 1 ),
                        new THREE.Vector4 ( sphereList[16].position.x , sphereList[16].position.y , sphereList[16].position.z , 1 )
                    ],
                    [
                        new THREE.Vector4 ( sphereList[0].position.x , sphereList[0].position.y , sphereList[0].position.z,  1 ),
                        new THREE.Vector4 ( sphereList[12].position.x , sphereList[12].position.y , sphereList[12].position.z,  1 ),
                        new THREE.Vector4 ( sphereList[4].position.x , sphereList[4].position.y , sphereList[4].position.z, 1  )
                    ],
                    [
                        new THREE.Vector4 ( sphereList[0].position.x , sphereList[0].position.y , sphereList[0].position.z,  1  ),
                        new THREE.Vector4 ( sphereList[8].position.x , sphereList[8].position.y , sphereList[8].position.z,  1 ),
                        new THREE.Vector4 ( sphereList[2].position.x , sphereList[2].position.y , sphereList[2].position.z,  1   )
                    ]
                ];
                var degree1 = 3;
                var degree2 = 2;
                // The number of knots is always equal to the number of control points plus curve degree plus one 
                // (i.e. number of control points plus curve order)
                var knots1 = [0, 0, 0, 0, 1, 1, 1, 1 ];
                var knots2 = [0, 0, 0,  1, 1, 1 ];
                var nurbsSurface = new THREE.NURBSSurface(degree1, degree2, knots1, knots2, nsControlPoints);

                var map = THREE.ImageUtils.loadTexture( 'https://mecano-eq.s3.amazonaws.com/UV_Grid_Sm.jpg' );
                map.wrapS = map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 16;

                getSurfacePoint = function(u, v) {
                    return nurbsSurface.getPoint(u, v);
                };

                var geometry = new THREE.ParametricGeometry( getSurfacePoint, 20, 20 );
                var material = new THREE.MeshLambertMaterial( { map: map , side: THREE.DoubleSide } ); // 
                var object = new THREE.Mesh( geometry, material );
                object.name = 'cusp1';
                myScene1.add(object);

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

//
// this function will find the point between two points along arc
// -- takes as input twp points and the center of the circle and parameterT

function getPointOnArc(P1,P2,t,center,scene){
    // get line and evaluate point on it
    var line = new THREE.Line3(P1,P2)
    var eval = line.at(t);

    // get radius
    var radius = center.distanceTo(P1);
    // get distnace
    var smallerDist = center.distanceTo(eval);
    // get distance to move
    var distToMove = radius - smallerDist;


    // get vector from eval to the center
    var temp = new THREE.Vector3();
    temp.copy(center);
    var vector = temp.sub(eval);
    vector.normalize();

    var point = new THREE.Vector3(eval.x-vector.x*distToMove , 
                                    eval.y-vector.y*distToMove , 
                                    eval.z-vector.z*distToMove );

    
    return point;
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

    //
// this function will draw the top three curves connecting P0-P1 , P0-P2 , P0-P3 going through the midpoints.
//
// function drawTopCurves(){

//     // NURBS curve

//     var nurbsControlPoints = [];
//     var nurbsKnots = [];
//     var nurbsDegree = 2;

//     for ( var i = 0; i <= nurbsDegree; i ++ ) {

//         nurbsKnots.push( 0 );

//     }

//     // for ( var i = 0, j = 20; i < j; i ++ ) {

//     nurbsControlPoints.push( new THREE.Vector4 (sphereList[0].position.x , sphereList[0].position.y , sphereList[0].position.z , 1 ) );
//     var knot = ( 0 + 1 ) / ( 3 - nurbsDegree );
//     nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );


//     nurbsControlPoints.push( new THREE.Vector4 (sphereList[7].position.x , sphereList[7].position.y , sphereList[7].position.z , 1 ) );
//     var knot = ( 1 + 1 ) / ( 3 - nurbsDegree );
//     nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

//     nurbsControlPoints.push( new THREE.Vector4 (sphereList[1].position.x , sphereList[1].position.y , sphereList[1].position.z , 1 ) );
//     var knot = ( 2 + 1 ) / ( 3 - nurbsDegree );
//     nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );


//     // }

//     var nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);

//     var nurbsGeometry = new THREE.Geometry();
//     nurbsGeometry.vertices = nurbsCurve.getPoints(200);
//     var nurbsMaterial = new THREE.LineBasicMaterial( { linewidth: 10, color: 0x333333, transparent: true } );

//     var nurbsLine = new THREE.Line( nurbsGeometry, nurbsMaterial );

//     // nurbsLine.position.set( 200, -100, 0 );
//     myScene1.add( nurbsLine );
//     nurbsLine.name = "topCurve1"

//     // var nurbsControlPointsGeometry = new THREE.Geometry();
//     // nurbsControlPointsGeometry.vertices = nurbsCurve.controlPoints;
//     // var nurbsControlPointsMaterial = new THREE.LineBasicMaterial( { linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true } );
//     // var nurbsControlPointsLine = new THREE.Line( nurbsControlPointsGeometry, nurbsControlPointsMaterial );
//     // nurbsControlPointsLine.position.copy( nurbsLine.position );
//     // myScene1.add( nurbsControlPointsLine );


// }