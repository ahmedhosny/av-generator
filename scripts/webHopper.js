//
// webHopper
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
// the function will project a point onto a plane and return the vector3 at the projected location
//
function projectPointOntoPlane(P0,P1,P2,P3,scene,mesh){
    // get the normal to the circle fit to the three points and its center
    var result = fitCircle(P1,P2,P3,mesh,scene,10,"shaded");
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

    scene.remove( scene.getObjectByName(mesh) );
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




//
// this dunction add 8 point lights around a geometry
//
function letThereBeLight(geometry,sceneToAdd,intens){

    geometry.computeBoundingBox();
    var boundingBox = geometry.boundingBox;


    var myLight1 = new THREE.PointLight( 0xFFFFFF, intens , 0 , 0 );
    sceneToAdd.add(myLight1)
    var myLight2 = new THREE.PointLight( 0xFFFFFF, intens , 0 , 0 );
    sceneToAdd.add(myLight2)
    var myLight3 = new THREE.PointLight( 0xFFFFFF, intens , 0 , 0 );
    sceneToAdd.add(myLight3)
    var myLight4 = new THREE.PointLight( 0xFFFFFF, intens , 0 , 0 );
    sceneToAdd.add(myLight4)
    var myLight5 = new THREE.PointLight( 0xFFFFFF, intens , 0 , 0 );
    sceneToAdd.add(myLight5)
    var myLight6 = new THREE.PointLight( 0xFFFFFF, intens , 0 , 0 );
    sceneToAdd.add(myLight6)
    var myLight7 = new THREE.PointLight( 0xFFFFFF, intens , 0 , 0 );
    sceneToAdd.add(myLight7)
    var myLight8 = new THREE.PointLight( 0xFFFFFF, intens , 0 , 0 );
    sceneToAdd.add(myLight8)


    var one = new THREE.Vector3(boundingBox.min.x , boundingBox.min.y, boundingBox.min.z );
    var two = new THREE.Vector3(boundingBox.max.x , boundingBox.max.y, boundingBox.max.z );
    var offset = one.distanceTo ( two ) / 2;

    myLight1.position.set(boundingBox.min.x - offset, boundingBox.min.y - offset, boundingBox.min.z - offset)
    myLight2.position.set(boundingBox.max.x + offset, boundingBox.max.y + offset, boundingBox.min.z - offset)
    myLight3.position.set(boundingBox.min.x - offset, boundingBox.max.y + offset, boundingBox.min.z - offset)
    myLight4.position.set(boundingBox.max.x + offset, boundingBox.min.y - offset, boundingBox.min.z - offset)
    //
    myLight5.position.set(boundingBox.min.x - offset, boundingBox.min.y - offset, boundingBox.max.z - offset)
    myLight6.position.set(boundingBox.max.x + offset, boundingBox.max.y + offset, boundingBox.max.z - offset)
    myLight7.position.set(boundingBox.min.x - offset, boundingBox.max.y + offset, boundingBox.max.z - offset)
    myLight8.position.set(boundingBox.max.x + offset, boundingBox.min.y - offset, boundingBox.max.z - offset)
 
}

//
// this function takes in a surface geometry (not buffer, made of triangles only) and thickens it by some amount returning a closed mesh
//
function thicken(geometryToThicken, sceneToAdd , material ,amount, name, flip){


    

    geometryToThicken.normalsNeedUpdate = true;
    geometryToThicken.computeFaceNormals();
    geometryToThicken.mergeVertices();
    // geometryToThicken.computeVertexNormals ();
    console.log(geometryToThicken);


    var edgeMidPoint = [];

    // list to be populated
    var vertexNormalList = [];
    // // populate with 0,0,0 vectors
    for (var j = 0 ; j < geometryToThicken.vertices.length ; j++){
        vertexNormalList.push( [] );
    }
    console.log(geometryToThicken.vertices.length);
    //var allEdgeConnect = [];
    //
    // loop through faces
    for (var i = 0 ; i < geometryToThicken.faces.length; i++){  // 
        vertexNormalList [  geometryToThicken.faces[i].a ] . push( geometryToThicken.faces[i].normal ) ;
        vertexNormalList [  geometryToThicken.faces[i].b ] . push( geometryToThicken.faces[i].normal ) ;
        vertexNormalList [  geometryToThicken.faces[i].c ] . push( geometryToThicken.faces[i].normal ) ;

        // this is to find edges 
        // allEdgeConnect.push( [ geometryToThicken.faces[i].a , geometryToThicken.faces[i].b ])
        // allEdgeConnect.push( [ geometryToThicken.faces[i].b , geometryToThicken.faces[i].c ])
        // allEdgeConnect.push( [ geometryToThicken.faces[i].c , geometryToThicken.faces[i].a ])
    }

    console.log(edgeMidPoint)


    //
    //
    //
    // var edgeVertexIndex = [];

    var newVer = [];

    // loop through list to average out
    for (var i = 0 ; i < vertexNormalList.length  ; i++){  // 
        // get count
        var myLength = vertexNormalList[i].length;

        var myAvgNormal = new THREE.Vector3(0,0,0)
        for (var j = 0 ; j < myLength ; j++){
            myAvgNormal.add( vertexNormalList[i][j] )
        }

////////////
        // if ( myLength < 4 || 6 < myLength  ){
        //     edgeVertexIndex.push(i)
        // }
////////////

        // average it out
        var myTarget = myAvgNormal.divideScalar ( myLength );
        
        // get its x,y,z pos
        var myCloneVertex = geometryToThicken.vertices[i].clone();
        
        var newPos;
        if (flip){
            newPos = myCloneVertex.add( myTarget.multiplyScalar(amount) )
        }
        else{
            newPos = myCloneVertex.add( myTarget.multiplyScalar(amount*-1) )
        }
        newVer.push(newPos)


    //      var geometry = new THREE.SphereGeometry( 0.1, 3, 2 );
    // var material = new THREE.MeshLambertMaterial( {color: 0xcac200 , side: THREE.DoubleSide} );
    //  var sphere = new THREE.Mesh( geometry, material );
    //  sphere.position.x = newPos.x;
    //  sphere.position.y = newPos.y;
    //  sphere.position.z = newPos.z;
    // sceneToAdd.add( sphere );


    }

    var myNewGeo = new THREE.Geometry();
    //
    // now I have a list of new ver
    //
    
    var originalFaceCount = geometryToThicken.faces.length;
    // var originalVerCount = geometryToThicken.vertices.length;
    // // loop through faces
    for(var i = 0 ; i <originalFaceCount ; i++ ){

        var v1 = newVer [ geometryToThicken.faces[i].a  ];
        var v2 = newVer [ geometryToThicken.faces[i].b  ];
        var v3 = newVer [ geometryToThicken.faces[i].c  ];

        myNewGeo.vertices.push(v1);
        myNewGeo.vertices.push(v2);
        myNewGeo.vertices.push(v3);


        myNewGeo.faces.push( new THREE.Face3(   3*i ,  1 + 3*i , 2 + 3*i ) ) ;

    }



    // console.log(edgeVertexIndex)
    // // 
    // // generate Edge
    // //
    // var myEdgeGeo = new THREE.Geometry();
    
    // // loop through edge vertex index list
    // for (var i = 0 ; i < (edgeVertexIndex.length - 1) ; i++){
    //     var v1 =   myNewGeo.vertices                      [   edgeVertexIndex[i]  ] ;
    //     var v2 =   geometryToThicken.vertices             [   edgeVertexIndex[i+1]   ];
    //     var v3 =   myNewGeo.vertices                      [   edgeVertexIndex[i+1]  ] ;
    //     var v4 =   geometryToThicken.vertices             [   edgeVertexIndex[i]   ];

    //     myEdgeGeo.vertices.push(v1);
    //     myEdgeGeo.vertices.push(v2);
    //     myEdgeGeo.vertices.push(v3);
    //     myEdgeGeo.vertices.push(v4);



    //     // traingle 1 
    //     myEdgeGeo.faces.push( new THREE.Face3( i * 4 + 3 ,  i*4 + 1 , i*4 + 2) ); // v4,v2,v3
    //     // traingle  2
    //     myEdgeGeo.faces.push( new THREE.Face3( i*4 + 0  , i*4 + 3   , i*4 + 2 ) ); // v1,v4,v3
        
    // }

    // //

    // ///
    // var myMat = new THREE.MeshLambertMaterial( {color: 0xff0000 , side: THREE.DoubleSide} );
    // var sika = new THREE.Mesh( myEdgeGeo, myMat  );
    // sceneToAdd.add( sika );





    //////

    
    //1// convert first surface into mesh
    var myCuspMesh1 = new THREE.Mesh( geometryToThicken, material  );


    //2// merge
    myCuspMesh1.updateMatrix();
    myNewGeo.merge( myCuspMesh1.geometry, myCuspMesh1.matrix );

    //3// mesh the second surface
    var myCuspMesh2 = new THREE.Mesh( myNewGeo, material  );
    myCuspMesh2.name = name;
    sceneToAdd.add( myCuspMesh2 );
    console.log(myCuspMesh2);




//////////////////////







}





       // var P1 =  geometryToThicken.vertices [ geometryToThicken.faces[i].a  ]
       //  var P2 =  geometryToThicken.vertices [ geometryToThicken.faces[i].b  ]
       //  var P3 =  geometryToThicken.vertices [ geometryToThicken.faces[i].c  ]
       //  //
       //  var mid1 = ( P1.clone().add(P2) ) .divideScalar( 2 );
       //  var mid2 = ( P2.clone().add(P3) ) .divideScalar( 2 );
       //  var mid3 = ( P1.clone().add(P3) ) .divideScalar( 2 );

       //  var currentLength = edgeMidPoint.length;

       //  // 
       //  if ( i == 0){
       //      edgeMidPoint.push(P1);
       //      edgeMidPoint.push(P2);
       //      edgeMidPoint.push(P3);
       //  }
       //  else{
       //      //
       //      // loop through list
       //      for (var j = 0 ; j < currentLength ; j++ ){
       //          if ( mid1.x == edgeMidPoint[j].x ){
       //              // dont add it
       //              // and set existing one to zero.
       //              edgeMidPoint[j].x = 0 ; 
       //          }else{
       //              // add
       //              edgeMidPoint.push(mid1)
       //          }
       //          if ( mid2.x == edgeMidPoint[j].x ){
       //              // dont add it
       //              // and set existing one to zero.
       //              edgeMidPoint[j].x = 0 ; 
       //          }else{
       //              // add
       //              edgeMidPoint.push(mid2)
       //          }
       //          if ( mid3.x == edgeMidPoint[j].x ){
       //              // dont add it
       //              // and set existing one to zero.
       //              edgeMidPoint[j].x = 0 ; 
       //          }else{
       //              // add
       //              edgeMidPoint.push(mid3)
       //          }
       //      }
       //    }

    // var nakedEdgeConnect= []

    // for (var i = 0 ; i < allEdgeConnect.length; i++){  
    //     for (var j = 0 ; j < allEdgeConnect.length; j++){ 
    //         // if there is a match

    //         if (i != j && allEdgeConnect[i] == allEdgeConnect[j].reverse() ){
    //             nakedEdgeConnect.push(i)
    //             nakedEdgeConnect.push(j)
    //         }

    //     }


    // }


    // console.log(nakedEdgeConnect);

// var occurrence = function (array) {
//     "use strict";
//     var result = {};
//     if (array instanceof Array) { // Check if input is array.
//         array.forEach(function (v, i) {
//             if (array[v][0] == result[v][1] && array[v][1] == result[v][0]) { // Same occurrences found.    
//                 result[v].push(i); // Fill the array.
//             } else {  // Initial object property creation.
//                 result[v] = [i]; // Create an array for that property.
//             }
//         });
//     }
//     return result;
// };



// //
// //
// // for sorting

// function foo(arr) {
//     // a containe unique and b number of occurance
//     var a = [], b = [], prev1, prev2;
    
//     arr.sort();
//     for ( var i = 0; i < arr.length; i++ ) {
//         // if  match
//         if ( arr[i][0] == prev1 && arr[i][1] == prev2  ||  arr[i][0] == prev2 && arr[i][1] == prev1 ) {
//             b[b.length-1]++;

//             // if no match
//         } else {
//             a.push(arr[i]);
//             b.push(1);
            
//         }
//         // set prev
//         prev1 = arr[i][0];
//         prev2 = arr[i][1];
//     }
    
//     return [a, b];
// }




//   v.pos.x += v.norm.x*thicken; v.pos.y += v.norm.y*thicken; v.pos.z += v.norm.z*thicken










// 1// 

    // var exist = geometryToThicken.vertices.length;

    // // loop throug points crated by VertexNormalsHelper
    // var counter = 0;
    // for (var i = 0 ; i < edges.geometry.attributes.position.array.length ; i=i+18 ){ // 

    //     var v1 = new THREE.Vector3 (edges.geometry.attributes.position.array[i+3] ,  edges.geometry.attributes.position.array[i+4] , edges.geometry.attributes.position.array[i+5]   ) ;
    //     var v2 = new THREE.Vector3 (edges.geometry.attributes.position.array[i+9] ,  edges.geometry.attributes.position.array[i+10] , edges.geometry.attributes.position.array[i+11]   ) ;
    //     var v3 = new THREE.Vector3 (edges.geometry.attributes.position.array[i+15] ,  edges.geometry.attributes.position.array[i+16] , edges.geometry.attributes.position.array[i+17]   ) ;

    //     geometryToThicken.vertices.push(v1);
    //     geometryToThicken.vertices.push(v2);
    //     geometryToThicken.vertices.push(v3);

    //     // traingle 1 
    //     geometryToThicken.faces.push( new THREE.Face3(  exist + 1 + 3*counter , exist + 2 + 3*counter , exist + 3 + 3*counter ) ) ;
    //     counter+=1;

    // }












// 2 //

    

    // var pointList = [];
    // // populate list
    // // loop throug points crated by VertexNormalsHelper
    // for (var i = 0 ; i < edges.geometry.attributes.position.array.length ; i=i+6 ){ 
    //     pointList.push( new THREE.Vector3 (edges.geometry.attributes.position.array[i+3] ,  edges.geometry.attributes.position.array[i+4] , edges.geometry.attributes.position.array[i+5]   )  );
    // }
    // console.log(pointList);

    // ///////

    // // done once
    // var existVer = geometryToThicken.vertices.length 
    // var existFac = geometryToThicken.faces.length

    // console.log(edges.geometry.attributes.position.array.length/6 , existVer )

    // var myOffsetGeo = new THREE.Geometry();

    // // loop through faces
    // for (var i = 0 ; i < existFac ; i++){

    //     var v1 = pointList [  geometryToThicken.faces[i].a ];
    //     var v2 = pointList [  geometryToThicken.faces[i].b ];
    //     var v3 = pointList [  geometryToThicken.faces[i].c ];

    //     myOffsetGeo.vertices.push(v1);
    //     myOffsetGeo.vertices.push(v2);
    //     myOffsetGeo.vertices.push(v3);

    //     myOffsetGeo.faces.push( new THREE.Face3(  3 * i , 1 + 3 * i , 2 + 3 * i ) );

    // }
    



    // //////////




    //     var myCuspMesh1 = new THREE.Mesh( myOffsetGeo, material  );
    // myCuspMesh1.name = name;
    // sceneToAdd.add( myCuspMesh1 );
    








//// vertexNormalHelper doesnt work very well....

//     // dummy step
//     var myClone = geometryToThicken.clone();
//     var myCuspMesh = new THREE.Mesh( myClone , material );

//     // dont add to scene just use info inside
//     var edges = new THREE.VertexNormalsHelper( myCuspMesh, amount , 0x00ff00, 1 );
//     console.log(edges);



// var counter = 0
// for (var i = 0 ; i < edges.geometry.attributes.position.array.length ; i=i+6 ){ 


//     var geometry = new THREE.SphereGeometry( 0.1, 3, 2 );
//     var material = new THREE.MeshLambertMaterial( {color: 0xcac200 , side: THREE.DoubleSide} );
//     var sphere = new THREE.Mesh( geometry, material );
//     sphere.position.x = edges.geometry.attributes.position.array[i+3];
//     sphere.position.y = edges.geometry.attributes.position.array[i+4];
//     sphere.position.z = edges.geometry.attributes.position.array[i+5];

//     sceneToAdd.add( sphere );
//     counter +=1;

// }

// console.log(counter);




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