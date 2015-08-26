//
// VAR
//
var XY; // This is the real dimension of the dicom in mm
var currentSliceLoc;
var sliceLocList = [];
var _data;
//
// XTK
//
window.onload = function() {

    // VARIABLES
    var v;
    var dataURLArray = [];
    var sliceZ;

    _webgl_supported = true;
    $(document.body).addClass('webgl_enabled');


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
        console.log("begin initializing");

        

        // add the volume
        sliceZ.add(v);

        // .. and render it
        sliceZ.render();

        console.log("rendered");


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
            $("#container1").find("canvas").css('cursor' , 'crosshair');
            document.getElementById('text1a').innerHTML = "Select the 7 points";
            // this will check if v.IndexZ has 0.5 in it, then it will set the value of currentSliceLoc
            // do it here in case user click right away without scrolling.
            checkDecimal();


        }

        // 
        // on scroll, update the current slice var
        //
        sliceZ.onScroll = function(){

            // this will check if v.IndexZ has 0.5 in it, then it will set the value of currentSliceLoc
            checkDecimal();
        }
        
    }

    //
    // calculate the X and Y dimensions..
    //
    function calculateDim(v){

        // pixel size
        var pixelSize ;
        // if pixel is square
        if(v.H[0] == v.H[1]){
            pixelSize = v.H[0];
        } else{
            console.log('pixel is not square');
        }
        // arraySize
        var arraySize;
        // if array is square
        if(v.aa[0] == v.aa[1]){
            arraySize = v.aa[0];
        } else{
            console.log('array is not square');
        }

        // dim
        XY = pixelSize*arraySize;

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

        createData();
        
        
        for (var  i = 0 ; i < myFiles.length ; i++){

            //1// this load into [file]
            readDCM(i,myFiles);

            //2// this gets sliceLoc info
            parseDCM(myFiles[i]); 
            
        }



        for (var  j = 0 ; j < _data['volume']['file'].length ; j ++){

            var reader = new FileReader();

            // reader.onerror = errorHandler;
            reader.onload = (loadFileData)( _data['volume']['file'][j] , j ); // bind the current type
 
            // start reading this file
            reader.readAsArrayBuffer( _data['volume']['file'][j] );


        }


    }



    function updateProgress(evt){
        if(evt.lengthComputable){
            var value = evt.loaded / evt.total;
            NProgress.set(value);
            // console.log(value);
        }
    }




    //
    // this function will read the dicom into into the volume['file']
    //
    function readDCM(i,myFiles){

        var f = myFiles[i];
        var _fileName = f.name;
        var _fileExtension = _fileName.split('.').pop().toUpperCase();


        // check for files with no extension
        if (_fileExtension == _fileName.toUpperCase()) {
            // this must be dicom
             _fileExtension = 'DCM';
        }


        if (_data['volume']['extensions'].indexOf(_fileExtension) >= 0) {
            _data['volume']['file'].push(f);
        } 
        else {
            console.log("file loaded is not a volume file")
        } 

        console.log("file " + String(i) + " of " + String (myFiles.length) + " done.")

    
        
    }


     // setup callback after reading
    var loadFileData = function(file,j) {


        return function(e) {

            // reading complete
            var data = e.target.result;

            // might have multiple files associated
            // attach the filedata to the right one
            _data['volume']['filedata'][_data['volume']['file'].indexOf(file)] = data;

            // check here
            check(j);  

        };
    };





    //
    // this will check when all have been loaded into xtk - then it initializes.
    //
    function check(j){

        if ( j  == ( _data['volume']['file'].length - 1 ) ){

            NProgress.done();

            console.log('New data', _data);

            // fill up v
            v.file = _data['volume']['file'].map(function(v) {
                return v.name;
            });

            v.filedata = _data['volume']['filedata'];

            v.onComputingProgress = function(value) {
                console.log(value);
            }

            // 
            initiateX();
        }

    }

    //
    // this function will load the dicom set to get the slice Loc
    //

    function parseDCM(file){

        var reader = new FileReader();
        reader.onload = function(file) {
            var arrayBuffer = reader.result;
            var byteArray = new Uint8Array(arrayBuffer);
            var dataSet;
            // Invoke the paresDicom function and get back a DataSet object with the contents
            try {

                dataSet = dicomParser.parseDicom(byteArray);

                if(dataSet.warnings.length > 0)
                {
                    console.log("error in dicomParser 1")
                }
                else
                {
                    var myString = String( dataSet.string('x00200032') );
                    var sliceZ = myString.split(new RegExp(/\\/g))[2];
                    sliceLocList.push(sliceZ);                    
                }

            }
            catch(err)
            {
                console.log(err)
            }

        }
        reader.readAsArrayBuffer(file);

    }



    //
    // This will check if the number of dicom files is off or even.
    //

    function checkDecimal(){
        var currentSliceIndex;
        // it has 0.5
        if (v.indexZ % 1 != 0) { 
            currentSliceIndex = v.indexZ - 0.5;
            currentSliceLoc = sliceLocList[currentSliceIndex];
            console.log(currentSliceIndex , currentSliceLoc);
        }
        //  it is ok
        else{
            currentSliceIndex = v.indexZ;
            currentSliceLoc = sliceLocList[currentSliceIndex];
            console.log(currentSliceIndex , currentSliceLoc);
        }
        // remove drop sign
        document.getElementById('text1').innerHTML = "slice " + String(currentSliceIndex + 1 ) + " of " +  String(sliceLocList.length) ;
        // escape(myFiles[0].name)
    }


    //
    // XTK specific function
    //
    function createData() {

        _data = {
        'volume': {
         'file': [],
         'filedata': [],
         'extensions': ['NRRD', 'MGZ', 'MGH', 'NII', 'GZ', 'DCM', 'DICOM']
        },
        'labelmap': {
         'file': [],
         'filedata': [],
         'extensions': ['NRRD', 'MGZ', 'MGH']
        },
        'colortable': {
         'file': [],
         'filedata': [],
         'extensions': ['TXT', 'LUT']
        },
        'mesh': {
         'file': [],
         'filedata': [],
         'extensions': ['STL', 'VTK', 'FSM', 'SMOOTHWM', 'INFLATED', 'SPHERE',
                        'PIAL', 'ORIG', 'OBJ']
        },
        'scalars': {
         'file': [],
         'filedata': [],
         'extensions': ['CRV', 'LABEL']
        },
        'fibers': {
         'file': [],
         'filedata': [],
         'extensions': ['TRK']
        },
        };

    }



// END OF WINDOW.ONLOAD
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// function read(files) {

  




      // // we now have the following data structure for the scene
      // 

      // var _types = Object.keys(_data);

      // // number of total files
      // var _numberOfFiles = files.length;
      // var _numberRead = 0;
      // window.console.log('Total new files:', _numberOfFiles);

      // //
      // // the HTML5 File Reader callbacks
      // //

      // // setup callback for errors during reading
      // var errorHandler = function(e) {

      //  console.log('Error:' + e.target.error.code);

      // };

      // // setup callback after reading
      // var loadHandler = function(type, file) {

      //  return function(e) {

      //    // reading complete
      //    var data = e.target.result;

      //    // might have multiple files associated
      //    // attach the filedata to the right one
      //    _data[type]['filedata'][_data[type]['file'].indexOf(file)] = data;

      //    _numberRead++;
      //    if (_numberRead == _numberOfFiles) {

      //      // all done, start the parsing
      //      parse(_data);

      //    }

      //  };
      // };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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







    // function parseDCM2(file){
    //     var p = new X.parserDCM();
    //     var b = new X.base();
    //     var o = new X.object();


    //     var reader = new FileReader();
    //     reader.onload = function(file) {
    //         var arrayBuffer = reader.result;
    //         var byteArray = new Uint8Array(arrayBuffer);
    //         p.parse(p, b, byteArray, error());
    //         console.log(p);
    //         console.log("done!")

    //     }

    //     function error(){
    //         console.log("a7aaa!");
    //     }

    //     reader.readAsArrayBuffer(file);

    // }









        ///////////////////////////////////////////////////////
        // var reader = new FileReader();   
        // reader.onprogress = updateProgress;
        // reader.readAsDataURL(file);
        // reader.onload = function(e) {
        //     // get file content
        //     dataURLArray.push( e.target.result)
        //     //
        //     
        //     // 
        //     check(dataURLArray,myFiles);                
        // }



         // initialize renderers


   // // add callbacks for computing
   // volume.onComputing = function(direction) {
   //   //console.log('computing', direction);
   // }

   // volume.onComputingProgress = function(value) {
   //   //console.log(value);
   // }

   // volume.onComputingEnd = function(direction) {
   //   //console.log('computing end', direction);
   // }

  