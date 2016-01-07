// 01_all threeJS stuff for two main scenes

//
// VARIABLES
// 

var myScene1,
myCamera1,
myRenderer1,
controls1,
myMesh1,
binary1;
var sika;
//
var myScene2,
myCamera2,
myRenderer2,
controls2,
myMesh2,
binary2;
var stlLoader = new THREE.STLLoader();

var fov =30;
NProgress.configure({ showBar: false });

var firstStl1 = true ; // WITHIN THE SAME CONTAINER
var firstStl2 = true ; // WITHIN THE SAME CONTAINER

//
// INITIATE THREEJS
//
initiateScene1();
initiateScene2();


//
// RENDER FUNC
//
function render(){

        myRenderer1.render(myScene1,myCamera1);
        controls1.update();
        myRenderer2.render(myScene2,myCamera2);
        controls2.update();
        requestAnimationFrame(render);
}






//
// LOAD STL FIRST TIME
//
function loadSTL(filePath, myContainer){

    var windowContainer = document.getElementById(myContainer);

    // OBJECT
    // load stl model
    if(myContainer == "container2"){

        console.log("it choose one");
        // RESIZE
        $(window).resize(function () {
            width=$("#" + myContainer).width();
            height=$("#" + myContainer).height();

            myCamera1.aspect = width/height;
            myCamera1.updateProjectionMatrix();

            myRenderer1.setSize( width, height );

        });


        stlLoader.load( filePath, createScene1 ); 
        firstStl1 = false; 
        myRenderer1.setSize( $("#" + myContainer).innerWidth() , $("#" + myContainer).innerHeight() );
        windowContainer.appendChild(myRenderer1.domElement);
        myRenderer1.setClearColor( 0xDDFDFDF , 1 );
        render();
    }
    else {

        console.log("it choose two");
        // RESIZE
        $(window).resize(function () {
            width=$("#" + myContainer).innerWidth();
            height=$("#" + myContainer).innerHeight();

            myCamera2.aspect = width/height;
            myCamera2.updateProjectionMatrix();

            myRenderer2.setSize( width, height );

        });

        stlLoader.load( filePath, createScene2);
        firstStl2 = false;
        myRenderer2.setSize( $("#" + myContainer).innerWidth() , $("#" + myContainer).innerHeight() );
        windowContainer.appendChild(myRenderer2.domElement);
        myRenderer2.setClearColor( 0xDDFDFDF , 1 );
        render();
    }
     


}

//
// LOAD STL SUBSEQUENT TIMES
//    
function loadAnotherSTL(filePath, myContainer){


    if(myContainer == "container2"){
        // REMOVE LAST MESH FROM SCENE
        myScene1.remove(myScene1.children[3]);
        // LOAD NEW MESH
        stlLoader.load( filePath, createScene1);
        render();
    }
    else {
        // REMOVE LAST MESH FROM SCENE
        myScene2.remove(myScene2.children[3]);
        // LOAD NEW MESH
        stlLoader.load( filePath, createScene2);
        render();
    }



}


function gotSTL(){

    if(myMesh1 != undefined && myCoorText  != undefined){
        console.log("sinus mesh and coor loaded");
        // add prompt at container2
        // $("#container2").css('cursor' , 'crosshair');
        // remove "not for clinical use"
        $("#prompt1").empty()
        $("#main").append("<hr id='con3line1' > </hr> <button type='button' class='btn btn-default btn-block' id='threeButton' > generate cusps </button> ")
        // document.getElementById('prompt1').innerHTML =  '<hr id="con1line1"> <p id = "prompt1text" > double click to pick 3 feature points </p> <hr id="con1line2">' ;
        mainSwitch();
    }

}


//
// CREATE SCENE 1
//
function initiateScene1(){

    // SCENE
    myScene1 = new THREE.Scene();
    // CAMERA
    myCamera1 = new THREE.PerspectiveCamera(fov,window.innerWidth / window.innerHeight,1,10000);
    // RENDER
    myRenderer1 = new THREE.WebGLRenderer();
    gl1 = myRenderer1.context;
    // DUMMY POSITION
    // myCamera1.target = new THREE.Vector3(0,0,0);
    // myCamera1.position.set(-8.0, -30, 9);
    myScene1.add(myCamera1);

    // LIGHT
    var light = new THREE.AmbientLight( 0xFFFFFF); // soft white light
    myScene1.add( light );


    // CONTROL
    controls1 = new THREE.TrackballControls( myCamera1, container2);
    controls1.rotateSpeed = 1.0;
    controls1.zoomSpeed = 1.2;
    controls1.panSpeed = 0.8;
    controls1.noZoom = false;
    controls1.noPan = false;
    controls1.staticMoving = false;
    controls1.dynamicDampingFactor = 0.15;
    controls1.keys = [ 65, 83, 68 ];

}


//
// CREATE SCENE 1
//
function initiateScene2(){

    // SCENE
    myScene2 = new THREE.Scene();
    // CAMERA
    myCamera2 = new THREE.PerspectiveCamera(fov,window.innerWidth / window.innerHeight,1,10000);
    myRenderer2 = new THREE.WebGLRenderer();
    // DUMMY POSITION
    myCamera2.target = new THREE.Vector3(0,0,0);
    myCamera2.position.set(-8.0, -30, 9);
    myScene2.add(myCamera2);
    // LIGHT
    var light = new THREE.AmbientLight( 0xFFFFFF); // soft white light
    myScene2.add( light );

    // CONTROL
    controls2 = new THREE.TrackballControls( myCamera2 , container3);
    controls2.rotateSpeed = 1.0;
    controls2.zoomSpeed = 1.2;
    controls2.panSpeed = 0.8;
    controls2.noZoom = false;
    controls2.noPan = false;
    controls2.staticMoving = false;
    controls2.dynamicDampingFactor = 0.15;
    controls2.keys = [ 65, 83, 68 ];

}

//
// CREATE SCENE FUNC AND ADJUST CAMERA
//
function createScene1( geometry, materials ) {

    myMesh1 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {color: 0x5B807A , side: THREE.DoubleSide } ) );  // //wireframe: true
    myScene1.add(myMesh1); 

    //
    // CREATE BOUNDING BOX
    myMesh1.geometry.computeBoundingBox();
    var boundingBox1 = myMesh1.geometry.boundingBox;

    // FIX CAMERA
    var myX1= (boundingBox1.max.x + boundingBox1.min.x) / 2
    var myY1= (boundingBox1.max.y + boundingBox1.min.y) / 2
    var myZ1= (boundingBox1.max.z + boundingBox1.min.z) / 2

    // FIX TARGET
    myCamera1.target = new THREE.Vector3(myX1,myY1,myZ1);

    // SET POSITION
    myCamera1.position.set(boundingBox1.max.x, boundingBox1.max.y, boundingBox1.max.z);

    // FIX ROTATION 
    myCamera1.updateProjectionMatrix();

    // FIX CONTROLS
    controls1.target.set( Math.round(myX1) , Math.round(myY1) , Math.round(myZ1)  );

    // add point lights
    letThereBeLight(geometry,myScene1,0.4);

    //
    gotSTL();

    //change cursor
    $("#container2").css('cursor' , 'url("img/rotate32.png"), auto');

}

function createScene2( geometry, materials ) {
    myMesh2 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {color: 0x6E698C , side: THREE.DoubleSide } )  );
    myScene2.add(myMesh2); 
    //
    // CREATE BOUNDING BOX
    myMesh2.geometry.computeBoundingBox();
    var boundingBox2 = myMesh2.geometry.boundingBox;
    // FIX CAMERA
    var myX2= (boundingBox2.max.x + boundingBox2.min.x) / 2
    var myY2= (boundingBox2.max.y + boundingBox2.min.y) / 2
    var myZ2= (boundingBox2.max.z + boundingBox2.min.z) / 2

    // FIX TARGET
    myCamera2.target = new THREE.Vector3(myX2,myY2,myZ2);

    // SET POSITION
    myCamera2.position.set(boundingBox2.max.x, boundingBox2.max.y, boundingBox2.max.z);

    // FIX ROTATION 
    myCamera2.updateProjectionMatrix();

    // FIX CONTROLS
    controls2.target.set( Math.round(myX2) , Math.round(myY2) , Math.round(myZ2) );

    // add point lights
    letThereBeLight(geometry,myScene2,0.4);



    //change cursor
    $("#container3").css('cursor' , 'url("img/rotate32.png"), auto');
}




//
/////////////////////////////// trash 
//

// function sika(){
    
//     // console.log(myLight1.target.position,"light tar");
//     // console.log(myCamera1.target,"cam tar");

//     //      var geometry = new THREE.SphereGeometry( 1.0, 3, 2 );
//     // var material = new THREE.MeshLambertMaterial( {color: 0xcac200 , side: THREE.DoubleSide} );
//     //  var sphere = new THREE.Mesh( geometry, material );
//     //  sphere.position.x = myLight1.target.position.x;
//     //  sphere.position.y = myLight1.target.position.y;
//     //  sphere.position.z = myLight1.target.position.z;
//     // myScene1.add( sphere );
//     //      var sphere = new THREE.Mesh( geometry, material );
//     //  sphere.position.x = myLight1.position.x;
//     //  sphere.position.y = myLight1.position.y;
//     //  sphere.position.z = myLight1.position.z;
//     // myScene1.add( sphere );\\
//     if (!controls1.noRotate){
//         console.log("being rotated")
//     }


// }

// controls1.addEventListener( 'change', light_update );

// function light_update()
// {
//     // myLight1.rotation.copy( myCamera1.rotation );
//     // // myLight1.position.copy( myCamera1.position );
//     // console.log("changed")

//     //     myLight1a.position.set(myCamera1.position.x+10, myCamera1.position.y+10, myCamera1.position.z+10)
//     //     myLight1b.position.set(myCamera1.position.x-10, myCamera1.position.y-10, myCamera1.position.z-10)
       

// }