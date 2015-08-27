//
// VAR
//
var width,height,dim;
var fidPointList = [];
var snapDict = []; // this contains all the points and their indices and text


//
// double click on container1
//
var container1counter = 0;
container1.ondblclick=function(event){
   
    if(container1counter < 7){
        var myBool = doubleclick(event , container1counter);
        if (myBool){
            container1counter += 1;
            console.log("Point " + String(container1counter - 1) + " selected.")
        }
    }

};


function doubleclick(event , container1counter){

    var myBool = false;
    // get clicks as is on container1
    var mouseX = event.clientX - $('#container1') .offset().left  ;
    var  mouseY = event.clientY - $('#container1') .offset().top  ;

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
            var mouseYnew = event.clientY - $('#container1') .offset().top - diff/2 ;
            // now mouseX and mouseY are adjusted as per the dicom
            // they need to be remaped according to the dicomXY
            var outputX = ((dicomX - 0) / (dim - 0)) * (mouseX - 0);
            var outputY = ((dicomY - 0) / (dim - 0)) * (mouseYnew - 0);
            // add the startong points at the top letf voxel
            var P = new fidPoint(startX + outputX, startY + outputY,parseFloat(currentSliceLoc) );
            console.log(P.X,P.Y,P.Z);
            fidPointList.push(P);
            // visualize
            addCircle(mouseX , mouseY , container1counter , true );
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
            var mouseXnew = event.clientX - $('#container1') .offset().left - diff/2 ;
            // now mouseX and mouseY are adjusted as per the dicom
            // they need to be remaped according to the dicomXY
            var outputX = ((dicomX - 0) / (dim - 0)) * (mouseXnew - 0);
            var outputY = ((dicomY - 0) / (dim - 0)) * (mouseY - 0);
            var P = new fidPoint(startX + outputX, startY + outputY,parseFloat(currentSliceLoc) );
            console.log(P.X,P.Y,P.Z);
            fidPointList.push(P);
            // visualize
            addCircle(mouseX , mouseY , container1counter , true );
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
    this.X = parseFloat(X);
    this.Y = parseFloat(Y);
    this.Z = parseFloat(Z);
}


//
// snap svg - if bool true, its the first time - 
//
function addCircle(x,y , container1counter, bool){

    var s = Snap("#mySVG");
    var myCircle = s.circle(x, y, 4);
    myCircle.attr({
        fill: "#ff0000",
        stroke: "#000",
        strokeWidth: 1
    });


    var myString = "P" + String(container1counter)
    var myText = s.text(x+7, y, myString);
    myText.attr({
    fill: "#ff0000",
    "font-size": "18px",
    "font-weight" :"bold"
    });

    //
    // now we create an entry for the dictionary - only if first time
    //
    if (bool){
        snapDict.push({
            index: currentSliceIndex,
            x: x,
            y: y,
            counter: container1counter
        });
    }


}

//
// this function will be called everytime the dicom is scrolled
//
function coordinateCircle(currentSliceIndex){
    // first thing is first, empty the whole canvas
    $('#mySVG').empty();
    // loop through the snapDict
    for (var i = 0 ; i < snapDict.length ; i++){
        if( snapDict[i]['index'] == currentSliceIndex ){
            addCircle(snapDict[i]['x'],snapDict[i]['y'] , snapDict[i]['counter'] , false)
        }
    }
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
