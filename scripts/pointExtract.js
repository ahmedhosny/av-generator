// This file handles double clicking on the dicom. It stores the points in 
// the fidPointList and controls the snap library for displaying the circles and numbers.



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
            var P = new THREE.Vector3(startX + outputX, startY + outputY,parseFloat(currentSliceLoc) );
            console.log(P.x,P.y,P.z);
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
            var P = new THREE.Vector3(startX + outputX, startY + outputY,parseFloat(currentSliceLoc) );
            console.log(P.x,P.y,P.z);
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

