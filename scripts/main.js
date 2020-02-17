// 02_ main UI - load  files

// container1 - container2 - container3
//   no three -   three1 -     three2

// container4
// three3



//
// global VAR
//
var tempFidPointList = [];
var topPlaneNormal;
var vectorListTop;
var vectorListBottom;
var P0;
var P1;
var P2;
var P3;
var P4;
var P5;
var P6;

var myCoorText;

//
var container1 = document.getElementById("container1");
var container2 = document.getElementById("container2");
var container3 = document.getElementById("container3");

// LINES

var myCuspList = ["L_cusp","NC_cusp","R_cusp"];
// CUSP1 L
var projectedP0_q1Top_L;
var q1Bottom_q1Top_L;
var projectedP0_copyP4;
var projectedP0_q3Top_L;
var q3Bottom_q3Top_L;
var LCusp_Index = [ 21,7,1, 21,14,16,21,12,4,21,18,20,21,8,2 ];
// CUSP2 NC
var projectedP0_q1Top_NC;
var q1Bottom_q1Top_NC;
var projectedP0_copyP5;
var projectedP0_q3Top_NC;
var q3Bottom_q3Top_NC;
var NCCusp_Index = [ 32,8,2, 32 ,25,27 , 32 , 23 ,5, 32 ,29,31,32,9,3 ];
// CUSP3
var projectedP0_q1Top_R;
var q1Bottom_q1Top_R;
var projectedP0_copyP6;
var projectedP0_q3Top_R;
var q3Bottom_q3Top_R;
var RCusp_Index = [ 43,9,3, 43 ,36,38 , 43, 34 ,6, 43 ,40,42,43,7,1 ];
//
var ALLCusp_Index = [ LCusp_Index , NCCusp_Index , RCusp_Index ];


window.onload = function() {



    if (window.File && window.FileReader && window.FileList && window.Blob) {
      console.log("file api is supported");
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }

    //
    // PREVENT FILES BEING DOWNLOADED
    //
    window.addEventListener("dragover",function(e){
      e = e || event;
      e.preventDefault();
    },false);
    window.addEventListener("drop",function(e){
      e = e || event;
      e.preventDefault();
    },false);



    ////////////////
    // CONTAINER 1
    ////////////////
    container1.addEventListener('dragover', handleDragOver, false);
    container1.addEventListener('drop', handleFileSelect1, false);

    function handleFileSelect1(evt) {

        evt.stopPropagation();
        evt.preventDefault();

        var myFiles = evt.dataTransfer.files; // FileList object.
        var reader = new FileReader();
        reader.readAsText(myFiles[0]);

        reader.onload = function(e) {
            // get file content and make Vector3
            getCoord(e.target.result) ;
            myCoorText = e.target.result;
            // clear the container
            $('#container1').empty(); ////////////////////////////////////////////////////////////////////////////////
            document.getElementById('container1').innerHTML = "<br><br><br>" + e.target.result;
        }

        // LIST NAME
        document.getElementById('text1a').style.left = "-3px"; 
        document.getElementById('text1a').style.backgroundColor = "white";     
        document.getElementById('text1a').innerHTML = decodeURI( escape(myFiles[0].name) )  ;

    }

    ////////////////
    // CONTAINER 2
    ////////////////

    container2.addEventListener('dragover', handleDragOver, false);
    container2.addEventListener('drop', handleFileSelect2, false);


    function handleFileSelect2(evt) {

        // remove the icon
        //$('#con1Logo').remove();
        $('#container2').empty(); /////////////////////////////////////////////////////////////////////////////////////

        //CHANGE PROGRESS BAR
        NProgress.configure({ parent: '#container2' });
        NProgress.start();

        evt.stopPropagation();
        evt.preventDefault();

        var myFiles = evt.dataTransfer.files; // FileList object.

        var reader = new FileReader();
        
        reader.readAsDataURL(myFiles[0]);

        reader.onprogress = updateProgress;

        reader.onload = function(e) {
            // get file content
            binary1 = e.target.result;

            if (firstStl1){
                loadSTL(binary1, "container2");
                console.log("sinus loaded"); 
            }
            else{
                loadAnotherSTL(binary1, "container2");
                console.log("another sinus loaded"); 
            }


        }

        gotSTL();

        // LIST NAME
        // document.getElementById('text2a').style.left = "-3px"; 
        // document.getElementById('text2a').style.backgroundColor = "white";     
        // document.getElementById('text2a').innerHTML = decodeURI( escape(myFiles[0].name) )  ;

    }

    ////////////////
    // CONTAINER 3
    ////////////////

    container3.addEventListener('dragover', handleDragOver, false);
    container3.addEventListener('drop', handleFileSelect3, false);


    function handleFileSelect3(evt) {

        // remove the icon
        //$('#con1Logo').remove();
        $('#container3').empty(); /////////////////////////////////////////////////////////////////////////////////////

        //CHANGE PROGRESS BAR
        NProgress.configure({ parent: '#container3' });
        NProgress.start();

        evt.stopPropagation();
        evt.preventDefault();

        var myFiles = evt.dataTransfer.files; // FileList object.

        var reader = new FileReader();
        
        reader.readAsDataURL(myFiles[0]);

        reader.onprogress = updateProgress;

        reader.onload = function(e) {
            // get file content
            binary2 = e.target.result;

            if (firstStl2){
                loadSTL(binary2, "container3");
                console.log("calcium loaded"); 
            }
            else{
                loadAnotherSTL(binary2, "container3");
                console.log("another calcium loaded"); 
            }


        }

        // LIST NAME
        // document.getElementById('text2a').style.left = "-3px"; 
        // document.getElementById('text2a').style.backgroundColor = "white";     
        // document.getElementById('text2a').innerHTML = decodeURI( escape(myFiles[0].name) )  ;

    }


    //
    // works for container2 and container3
    //
    function updateProgress(evt){
        if(evt.lengthComputable){
            var value = evt.loaded / evt.total;
            NProgress.set(value);
            console.log(value);
        }
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }



    //
    //
    //


    function getCoord(myString){

        var multiX = 1;
        var multiY = 1;
        var multiZ = 1;

        var rows = myString.split("\n");

        P0 = new THREE.Vector3(  parseFloat( rows[0].split(',')[1] ) * multiX, parseFloat( rows[0].split(',')[2] ) * multiY, parseFloat( rows[0].split(',')[3] ) * multiZ );
        tempFidPointList.push(P0);
        P1 = new THREE.Vector3(  parseFloat( rows[1].split(',')[1] ) * multiX, parseFloat( rows[1].split(',')[2] ) * multiY, parseFloat( rows[1].split(',')[3] ) * multiZ );
        tempFidPointList.push(P1);
        P2 = new THREE.Vector3(  parseFloat( rows[2].split(',')[1] ) * multiX, parseFloat( rows[2].split(',')[2] ) * multiY, parseFloat( rows[2].split(',')[3] ) * multiZ );
        tempFidPointList.push(P2);
        P3 = new THREE.Vector3(  parseFloat( rows[3].split(',')[1] ) * multiX, parseFloat( rows[3].split(',')[2] ) * multiY, parseFloat( rows[3].split(',')[3] ) * multiZ );
        tempFidPointList.push(P3);
        P4 = new THREE.Vector3(  parseFloat( rows[4].split(',')[1] ) * multiX, parseFloat( rows[4].split(',')[2] ) * multiY, parseFloat( rows[4].split(',')[3] )* multiZ );
        tempFidPointList.push(P4);
        P5 = new THREE.Vector3(  parseFloat( rows[5].split(',')[1] ) * multiX, parseFloat( rows[5].split(',')[2] ) * multiY, parseFloat( rows[5].split(',')[3] ) * multiZ );
        tempFidPointList.push(P5);
        P6 = new THREE.Vector3(  parseFloat( rows[6].split(',')[1] ) * multiX, parseFloat( rows[6].split(',')[2] ) * multiY, parseFloat( rows[6].split(',')[3] ) * multiZ  );
        tempFidPointList.push(P6);
        
        console.log(P0, P1, P2, P3, P4, P5, P6)
        //
        // top plane
        //
        topPlaneNormal = getNormal(P1,P2,P3);
        var P2Clone = P2.clone();
        var topPlaneVectorX = P2Clone.sub(P1).normalize();
        var P3Clone = P3.clone();
        var topPlaneVectorY = P3Clone.sub(P1).normalize();
        vectorListTop = [topPlaneVectorX,topPlaneVectorY,topPlaneNormal];

        //
        // bottom plane
        //
        var bottomPlaneNormal = getNormal(P4,P5,P6);
        var P5Clone = P5.clone();
        var bottomPlaneVectorX = P5Clone.sub(P4).normalize();
        var P6Clone = P6.clone();
        var bottomPlaneVectorY = P6Clone.sub(P4).normalize();
        vectorListBottom = [bottomPlaneVectorX,bottomPlaneVectorY,bottomPlaneNormal];



    }


  


// END OF WINDOW.ONLOAD
}


