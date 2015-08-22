//
// double click on container1
//

var container1counter = 1;
container1.ondblclick=function(event){
   
    if(container1counter < 8){
        var myBool = doubleclick(event);
        if (myBool){
            container1counter += 1;
            console.log("Point " + String(container1counter - 1) + " selected.")
        }
    }

};


function doubleclick(event){

    var myBool = true;

    // update the mouse variable
    var mouseX = event.clientX - $('#container1') .offset().left  ;
    var mouseY = event.clientY - $('#container1') .offset().top  ;

    console.log( mouseX, mouseY );
    
    // // find intersections

    // // create a Ray with origin at the mouse position
    // //   and direction into the scene (camera direction)
    // var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    // projector.unprojectVector( vector, camera );
    // var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    // // create an array containing all objects in the scene with which the ray intersects
    // var list = [];
    // list.push(mesh);
    // var intersects = ray.intersectObjects( list);
    // console.log(intersects);

    

    // // if there is one (or more) intersections
    // if ( intersects.length > 0 )
    // {
    //     console.log("Hit @ " + toString( intersects[0].point ) );
    //     addSphere(intersects[0].point,scene, counter);

    //     var temp = [ intersects[0].point.x, intersects[0].point.y , intersects[0].point.z ];
    //     myVer.push(temp);

    //     myBool = true;
        
    // }

    // checkProgress();

    return myBool;

};


