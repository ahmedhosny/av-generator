// Thie file reads the nrrd file on drag and drop
//


//
// VAR
//
var dicomX; // This is the real dimension of the dicom in mm
var dicomY; // This is the real dimension of the dicom in mm
var currentSliceLoc;
var currentSliceIndex;
var sliceLocList = [];
var _data;
var startX, startY;
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
        console.log(v);


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
            // this will coordinate the circles
            coordinateCircle(currentSliceIndex)
        }
        
    }

    //
    // calculate the X and Y dimensions..
    //
    function calculateDim(v){

        // pixel size
        var pixelSizeX = v.H[0];
        var pixelSizeY = v.H[1];

        // arraySize
        var arraySize;
        // if array is square
        if(v.aa[0] == v.aa[1]){
            arraySize = v.aa[0];
        } else{
            console.log('array is not square');
        }

        // dim
        dicomX = pixelSizeX*arraySize;
        dicomY = pixelSizeY*arraySize;

        console.log("this dicom is " , dicomX , " by " , dicomY , " in real dims.") ;


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
            parseDCM(myFiles[i], i); 
            
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

    function parseDCM(file , i){

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
                    // get image patient position
                    var myString = String( dataSet.string('x00200032') );
                    if(myString === undefined){
                        alert("x00200032 - image position info does not exist")
                    }
                    else{
                        var sliceZ = myString.split(new RegExp(/\\/g))[2];
                        sliceLocList.push(sliceZ); 
                    }

                    // only for the first file
                    if (i == 0){

                        // get URI encoding
                        var myString2 = String( dataSet.string('x00020010'))   
                        if (myString2 != '1.2.840.10008.1.2.1'){
                            alert('x00020010 - XTK does not support dicoms with bigEndian encoding. ' + String(myString2) + " found.")
                            
                        }   


                        // CHECK IF AXIS ARE ALIGNED 
                        var myString1 = String( dataSet.string('x00200037') );
                        var orient = myString1.split(new RegExp(/\\/g));
                        console.log('myString1' , myString1);
                        // IF THEY ARE ALIGNED
                        if (myString1 === undefined){
                            alert("x00200037 - orientation info does not exist")
                        } 
                        else if ( parseFloat(orient[0]) == 1.0 && parseFloat(orient[1]) == 0.0 && parseFloat(orient[2]) == 0.0 &&
                                  parseFloat(orient[3]) == 0.0 && parseFloat(orient[4]) == 1.0 && parseFloat(orient[5]) == 0.0 ) {
                            // from image position (first one on top)
                            startX = parseFloat( myString.split(new RegExp(/\\/g))[0] );
                            startY = parseFloat( myString.split(new RegExp(/\\/g))[1] );
                            console.log("this dicom starting point is at " , startX , startY) ;
                        }
                        else{
                             alert('axes are not aligned with view. ' + String (myString1) + " found.")
                        }

                                    
                    }
                    // 
                   
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

  