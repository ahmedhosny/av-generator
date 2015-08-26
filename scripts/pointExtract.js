//
// VAR
//
var width,height,dim;
var fidPointList = [];


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

    var myBool = false;
    // get clicks as is on container1
    var mouseX = event.clientX - $('#container1') .offset().left  ;
    var mouseY = event.clientY - $('#container1') .offset().top  ;

    //
    // CHECK IF CLICK IS WITHIN DICOM (SET BOOL)
    //
    
    // if dicom is filling width (mouseX is all ok, check mouseY)
    // **********
    // *        *
    // **********
    // **  X   **
    // **  X   **
    // **********
    // *        *
    // **********
    if(dim == width){
        var diff = height - dim;
        //
        if( diff/2 < mouseY && mouseY < ( height - diff/2 )  ){
            myBool = true;
            // update the mouse variable
            mouseY = event.clientY - $('#container1') .offset().top - diff/2 ;
            // now mouseX and mouseY are adjusted as per the dicom
            // they need to be remaped according to the XY
            var outputX = ((XY - 0) / (dim - 0)) * (mouseX - 0);
            var outputY = ((XY - 0) / (dim - 0)) * (mouseY - 0);
            var P = new fidPoint(outputX,outputY,parseFloat(currentSliceLoc) );
            console.log(P.X,P.Y,P.Z);
            fidPointList.push(P);
        }
        
    }

    // if dicom is filling height (mouseY is all ok, check mouseX)
    // ******************
    // *   *********    *
    // *   *   X   *    *
    // *   *   X   *    *   
    // *   *   X   *    *
    // *   *   X   *    *
    // *   *********    *
    // ******************
    if(dim == height){
        var diff = width - dim;
        //
        if( diff/2 < mouseX && mouseX < ( width - diff/2 )  ){
            myBool = true;
            // update the mouse variable
            mouseX = event.clientX - $('#container1') .offset().left - diff/2 ;
            // now mouseX and mouseY are adjusted as per the dicom
            // they need to be remaped according to the XY
            var outputX = ((XY - 0) / (dim - 0)) * (mouseX - 0);
            var outputY = ((XY - 0) / (dim - 0)) * (mouseY - 0);
            var P = new fidPoint(outputX,outputY,parseFloat(currentSliceLoc) );
            console.log(P.X,P.Y,P.Z);
            fidPointList.push(P);
        }
        
    }

    return myBool;

};



//
// If no resize, on init
//
width=$("#container1").width();
height=$("#container1").height();
if(width>height){
    dim = height;
} else {
    dim = width;
}

//
// on resize, get dims of container 1
//

// RESIZE
$(window).resize(function () {
    width=$("#container1").width();
    height=$("#container1").height();
    if(width>height){
        dim = height;
    } else {
        dim = width;
    }
});


//
// point class
//

function fidPoint(X,Y,Z){
    this.X = X;
    this.Y = Y;
    this.Z = Z;
}

//////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////// TRASH





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
