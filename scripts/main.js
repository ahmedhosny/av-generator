// //
// // VARIABLES
// // 
// var myScene1,
// myCamera1,
// myRenderer1,
// myMaterial1,
// controls1,
// myMesh1,
// binary1;
// //


// //
// var fov =30;
// NProgress.configure({ showSpinner: false });


//
//
//
// var container1 = document.getElementById("container1");




//
// INITIATE THREEJS
//
// initiateScene1();




//
// RENDER FUNC
//
// function render(){
//         myRenderer1.render(myScene1,myCamera1);
//         controls1.update();
//         requestAnimationFrame(render);
// }




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//
// XTK
//




window.onload = function() {

    // VARIABLES
    var v;
    var dataURLArray = [];
    var sliceZ;
    var URL = window.URL || window.webkitURL;
    var XY;





    // create a new test_renderer
    sliceZ = new X.renderer2D();
    sliceZ.container = 'container1';
    sliceZ.orientation = 'Z';
    sliceZ.init();

    // r.camera.position = [0, 300, 0];

    // we create the X.volume container and attach all DICOM files
    v = new X.volume();
    // map the data url to each of the slices
    // v.file = 'https://mecano-eq.s3.amazonaws.com/IM-0008-0282-0001.dcm' 
    // http://x.babymri.org/?vol.nrrd
    // https://mecano-eq.s3.amazonaws.com/2901.nrrd
    // initiateX();


    function initiateX(){

        

        // add the volume
        sliceZ.add(v);

        // .. and render it
        sliceZ.render();

        // r.onShowtime = function() {

        // // activate volume rendering
        // v.volumeRendering = true;
        // v.lowerThreshold = 0;
        // v.windowLower = 0;
        // v.windowHigh = 1000;
        // v.minColor = [0, 0.06666666666666667, 1];
        // v.maxColor = [0.5843137254901961, 1, 0];
        // v.opacity = 0.9;

        // };

        // volume = v;

        sliceZ.onShowtime = function(){

            calculateDim(v);


        }

        
    }


    // calculate the X and Y dimensions..
    function calculateDim(v){

        // pixel size
        var pixelSize ;
        // if pixel is square
        if(v.H[0] == v.H[1]){
            pixelSize = v.H[0];
            console.log('pixelSize' , pixelSize);
        } else{
            console.log('pixel is not square');
        }
        // arraySize
        var arraySize;
        // if array is square
        if(v.aa[0] == v.aa[1]){
            arraySize = v.aa[0];
            console.log('arraySize' , arraySize);
        } else{
            console.log('array is not square');
        }

        // dim
        XY = pixelSize*arraySize;
        console.log('dim' , XY);

        return XY;

    }



    if (window.File && window.FileReader && window.FileList && window.Blob) {
      console.log("file api is supported");
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }



    // Setup the dnd listeners.
    // CONTAINER 1
    container1.addEventListener('dragover', handleDragOver, false);
    container1.addEventListener('drop', handleFileSelect1, false);



    // BOTH

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // CONTAINER 1


    function updateProgress(evt){
        if(evt.lengthComputable){
            var value = evt.loaded / evt.total;
            NProgress.set(value);
            console.log(value);
        }
    }


    function handleFileSelect1(evt) {

        //CHANGE PROGRESS BAR
        NProgress.configure({ parent: '#container1' });
        NProgress.start();

        evt.stopPropagation();
        evt.preventDefault();

        var myFiles = evt.dataTransfer.files; // FileList object.

        
        for (var  i = 0 ; i < myFiles.length ; i++){

            var reader = new FileReader();
        
            reader.readAsDataURL(myFiles[i]);

            reader.onprogress = updateProgress;

            reader.onload = function(e) {
                // get file content
                dataURLArray.push( e.target.result)
                // 
                check(dataURLArray);                

            }



        }


        function check(dataURLArray){
            if (dataURLArray.length == myFiles.length){
                v.file = dataURLArray;
                initiateX();
            }
        }


        

        // LIST NAME

        document.getElementById('text1').innerHTML = escape(myFiles[0].name);


    }



    function updateProgress(evt){
        if(evt.lengthComputable){
            var value = evt.loaded / evt.total;
            NProgress.set(value);
            console.log(value);
        }
    }


// END OF WINDOW.ONLOAD
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









// //
// // PREVENT FILES BEING DOWNLOADED
// //
// window.addEventListener("dragover",function(e){
//   e = e || event;
//   e.preventDefault();
// },false);
// window.addEventListener("drop",function(e){
//   e = e || event;
//   e.preventDefault();
// },false);

// //
// // CREATE SCENE 1
// //
// function initiateScene1(){

//     // SCENE
//     myScene1 = new THREE.Scene();
//     // CAMERA
//     myCamera1 = new THREE.PerspectiveCamera(fov,window.innerWidth / window.innerHeight,1,10000);
//     // RENDER
//     myRenderer1 = new THREE.WebGLRenderer();
//     // DUMMY POSITION
//     myCamera1.target = new THREE.Vector3(0,0,0);
//     myCamera1.position.set(-8.0, -30, 9);
//     myScene1.add(myCamera1);
//     // MATERIAL
//     myMaterial1 = new THREE.MeshBasicMaterial({color: 0x867970 //wireframe: true
//     });
//     // LIGHT
//     var light = new THREE.AmbientLight( 0xFFFFFF); // soft white light
//     myScene1.add( light );
//     // CONTROL
//     controls1 = new THREE.TrackballControls( myCamera1, container1);
//     controls1.rotateSpeed = 1.0;
//     controls1.zoomSpeed = 1.2;
//     controls1.panSpeed = 0.8;
//     controls1.noZoom = false;
//     controls1.noPan = false;
//     controls1.staticMoving = false;
//     controls1.dynamicDampingFactor = 0.15;
//     controls1.keys = [ 65, 83, 68 ];

// }








