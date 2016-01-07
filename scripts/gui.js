//4// handles all dat gui 

//
// var for GUI  ///////////////////////////////////////
//
var general = new function() {
    this.midpointLoc = -2.5 ;
    this.pointSize = 1;
    this.constructionLines = true;
    this.sinus_opacity = 0.8;
}

var L_cusp = new function() {
    this.mid = 0.5 ;
    this.q1_mid = 0.5;
    this.q1_end = 0.5;
    this.q3_mid = 0.5;
    this.q3_end = 0.5;
}
var NC_cusp = new function() {
    this.mid = 0.5 ;
    this.q1_mid = 0.5;
    this.q1_end = 0.5;
    this.q3_mid = 0.5;
    this.q3_end = 0.5;
}
var R_cusp = new function() {
    this.mid = 0.5 ;
    this.q1_mid = 0.5;
    this.q1_end = 0.5;
    this.q3_mid = 0.5;
    this.q3_end = 0.5;
}

var mainPointCoor = new function(){
    this.P1_X = 0.0; 
    this.P1_Y = 0.0; 
    this.P1_Z = 0.0; 
    this.P2_X = 0.0; 
    this.P2_Y = 0.0; 
    this.P2_Z = 0.0; 
    this.P3_X = 0.0; 
    this.P3_Y = 0.0; 
    this.P3_Z = 0.0; 
    this.P4_X = 0.0; 
    this.P4_Y = 0.0; 
    this.P4_Z = 0.0; 
    this.P5_X = 0.0; 
    this.P5_Y = 0.0; 
    this.P5_Z = 0.0; 
    this.P6_X = 0.0; 
    this.P6_Y = 0.0; 
    this.P6_Z = 0.0; 
}

var maxRange = 5.0;
var minRange = -5.0;

//
// this function will create the gui and add the variables from the var to it
//
function makeGUI(){

    // var gui = new dat.GUI({
    //     height : 5 * 32 - 1
    // });

    var gui = new dat.GUI({ autoPlace: false });

    var customContainer = document.getElementById('container5');
    customContainer.appendChild(gui.domElement);



    //////////////////////////////

    var guiFolder1 = gui.addFolder('general');

    guiFolder1.add(general, 'pointSize' , 0.00 , 5.00 ).onChange( function(){

        if (general.pointSize == 0) {

        }
        else{
            for (var i = 0 ; i < sphereList.length ; i++){
                sphereList[i].scale.x = general.pointSize;
                sphereList[i].scale.y = general.pointSize;
                sphereList[i].scale.z = general.pointSize;
            }
        }

    } );



    
    guiFolder1.add(general, 'midpointLoc' , -10.0 , 0.001 ).onChange( function(){
        
        // change all three midpoints
        moveSphere(sphereList[7],7,topPlaneNormal.normalize(),general.midpointLoc);
        moveSphere(sphereList[8],8,topPlaneNormal.normalize(),general.midpointLoc);
        moveSphere(sphereList[9],9,topPlaneNormal.normalize(),general.midpointLoc);
        for (var i = 0 ; i < 3 ; i ++ ){
            myScene3.remove(myScene3.getObjectByName( myCuspList[i] ) )
            myScene3.remove(myScene3.getObjectByName( myCuspList[i]+"_outline" ) )
            drawSurface( ALLCusp_Index[i]  , myCuspList[i] );
        }

    } );

    guiFolder1.add(general, "sinus_opacity", 0.0 , 1.0 ).onChange(function() {
        myMesh3a.material.opacity = general.sinus_opacity;
    });


    guiFolder1.add(general, "constructionLines").onChange(function(newValue) {
        // it is set to true by default
        // if false
        if (!newValue){
            for (var  i = 0 ; i < constructionLineList.length / 2 ; i++){
                myScene3.remove(myScene3.getObjectByName(  "constructionLine" + String(i) ) );
            }
        }
        // if true    
        else{
            drawConstructionLines(constructionLineList , myScene3);
        }
            
    });


    

   

    guiFolder1.open();






    ////////////////////////////////
    ////////////////////////////////
    ////////////////////////////////

    var guiFolder2 = gui.addFolder('L_cusp');
    //
    guiFolder2.add(L_cusp, 'q1_mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_q1Top_L.at(L_cusp.q1_mid);
        // set position of sphere
        myComapctor( sphereList , eval1, 14, LCusp_Index, "L_cusp" );
    });
    guiFolder2.add(L_cusp, 'q1_end' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = q1Bottom_q1Top_L.at(L_cusp.q1_end);
        var newEval = moveOutABit(P0,eval1,pushValue)
        // set position of sphere
        myComapctor( sphereList , newEval, 16, LCusp_Index, "L_cusp" );
    });
    //
    guiFolder2.add(L_cusp, 'mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_copyP4.at(L_cusp.mid);
        // set position of sphere
        myComapctor( sphereList , eval1, 12, LCusp_Index, "L_cusp" );
    });
    guiFolder2.add(L_cusp, 'q3_mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_q3Top_L.at(L_cusp.q3_mid);
        // set position of sphere
        myComapctor( sphereList , eval1, 18, LCusp_Index, "L_cusp" );
    });
    guiFolder2.add(L_cusp, 'q3_end' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = q3Bottom_q3Top_L.at(L_cusp.q3_end);
        var newEval = moveOutABit(P0,eval1,pushValue)
        // set position of sphere
        myComapctor( sphereList , newEval, 20, LCusp_Index, "L_cusp" );
    });
    ////////////////////////////////
    ////////////////////////////////
    ////////////////////////////////
    var guiFolder3 = gui.addFolder('NC_cusp');
    //
    guiFolder3.add(NC_cusp, 'q1_mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_q1Top_NC.at(NC_cusp.q1_mid);
        // set position of sphere
        myComapctor( sphereList , eval1, 25, NCCusp_Index, "NC_cusp" );
    });
    guiFolder3.add(NC_cusp, 'q1_end' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = q1Bottom_q1Top_NC.at(NC_cusp.q1_end);
        var newEval = moveOutABit(P0,eval1,pushValue)
        // set position of sphere
        myComapctor( sphereList , newEval, 27, NCCusp_Index, "NC_cusp" );
    });
    //
    guiFolder3.add(NC_cusp, 'mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_copyP5.at(NC_cusp.mid);
        // set position of sphere
        myComapctor( sphereList , eval1, 23, NCCusp_Index, "NC_cusp" );
    });
    guiFolder3.add(NC_cusp, 'q3_mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_q3Top_NC.at(NC_cusp.q3_mid);
        // set position of sphere
        myComapctor( sphereList , eval1, 29, NCCusp_Index, "NC_cusp" );
    });
    guiFolder3.add(NC_cusp, 'q3_end' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = q3Bottom_q3Top_NC.at(NC_cusp.q3_end);
        var newEval = moveOutABit(P0,eval1,pushValue)
        // set position of sphere
        myComapctor( sphereList , newEval, 31, NCCusp_Index, "NC_cusp" );
    });


    var guiFolder4 = gui.addFolder('R_cusp');

    guiFolder4.add(R_cusp, 'q1_mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_q1Top_R.at(R_cusp.q1_mid);
        // set position of sphere
        myComapctor( sphereList , eval1, 36, RCusp_Index, "R_cusp" );
    });
    guiFolder4.add(R_cusp, 'q1_end' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = q1Bottom_q1Top_R.at(R_cusp.q1_end);
        var newEval = moveOutABit(P0,eval1,pushValue)
        // set position of sphere
        myComapctor( sphereList , newEval, 38, RCusp_Index, "R_cusp" );
    });
    //
    guiFolder4.add(R_cusp, 'mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_copyP6.at(R_cusp.mid);
        // set position of sphere
        myComapctor( sphereList , eval1, 34, RCusp_Index, "R_cusp" );
    });
    guiFolder4.add(R_cusp, 'q3_mid' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = projectedP0_q3Top_R.at(R_cusp.q3_mid);
        // set position of sphere
        myComapctor( sphereList , eval1, 40, RCusp_Index, "R_cusp" );
    });
    guiFolder4.add(R_cusp, 'q3_end' , 0.00 , 1.00 ).onChange( function(){
        // evaluate the line at a new value
        var eval1 = q3Bottom_q3Top_R.at(R_cusp.q3_end);
        var newEval = moveOutABit(P0,eval1,pushValue)
        // set position of sphere
        myComapctor( sphereList , newEval, 42, RCusp_Index, "R_cusp" );
    });






    ////////////////////////////////
    ////////////////////////////////
    ////////////////////////////////



    var guiFolder5 = gui.addFolder('Main Point Coordinates');

    // add elements
    addGuiElement(guiFolder5,'P1_',"P1_X",1,vectorListTop);
    // addGuiElement(guiFolder5,'P1_',"P1_Y",1,vectorListTop);
    // addGuiElement(guiFolder5,'P1_',"P1_Z",1,vectorListTop);
    //
    addGuiElement(guiFolder5,'P2_',"P2_X",2,vectorListTop);
    // addGuiElement(guiFolder5,'P2_',"P2_Y",2,vectorListTop);
    // addGuiElement(guiFolder5,'P2_',"P2_Z",2,vectorListTop);
    //
    // addGuiElement(guiFolder5,'P3_',"P3_X",3,vectorListTop);
    addGuiElement(guiFolder5,'P3_',"P3_Y",3,vectorListTop);
    // addGuiElement(guiFolder5,'P3_',"P3_Z",3,vectorListTop);
    //
    //
    //
    addGuiElement(guiFolder5,'P4_',"P4_X",4,vectorListBottom);
    // addGuiElement(guiFolder5,'P4_',"P4_Y",4,vectorListBottom);
    addGuiElement(guiFolder5,'P4_',"P4_Z",4,vectorListBottom);
    //
    addGuiElement(guiFolder5,'P5_',"P5_X",5,vectorListBottom);
    // addGuiElement(guiFolder5,'P5_',"P5_Y",5,vectorListBottom);
    addGuiElement(guiFolder5,'P5_',"P5_Z",5,vectorListBottom);
    //
    // addGuiElement(guiFolder5,'P6_',"P6_X",6,vectorListBottom);
    addGuiElement(guiFolder5,'P6_',"P6_Y",6,vectorListBottom);
    addGuiElement(guiFolder5,'P6_',"P6_Z",6,vectorListBottom);


}




//
// for guifolder 2,3,4
//

function myComapctor( sphereList , newEval, index, indexList, name ){
    sphereList[index].position.x = newEval.x;
    sphereList[index].position.y = newEval.y;
    sphereList[index].position.z = newEval.z;
    // remove the old surface
    myScene3.remove(myScene3.getObjectByName( name ) )
    myScene3.remove(myScene3.getObjectByName( name + "_outline" ) )
    // draw L_cusp again
    drawSurface( indexList  , name);
}


// for guiFolder5
//
// point & coordinate , vector to move along, number in list
//


function addGuiElement(guiFolder, coor,coor2,index,vectorList){


    var tempCoorX = (coor+"X" ).replace(/^"(.*)"$/, '$1');
    var tempCoorY = (coor+"Y" ).replace(/^"(.*)"$/, '$1');
    var tempCoorZ = (coor+"Z" ).replace(/^"(.*)"$/, '$1');


    guiFolder.add(mainPointCoor, coor2 , minRange , maxRange, 0.1 ).onChange( function(){

        var tempX = vectorList[0].clone();
        var myVecX = tempX.multiplyScalar(parseFloat(mainPointCoor[tempCoorX]));
        //
        var tempY = vectorList[1].clone();
        var myVecY = tempY.multiplyScalar(parseFloat(mainPointCoor[tempCoorY]));
        //
        var tempZ = vectorList[2].clone();
        var myVecZ = tempZ.multiplyScalar(parseFloat(mainPointCoor[tempCoorZ]));


        var myTransVec = new THREE.Vector3(myVecX.x + myVecY.x + myVecZ.x , 
                                      myVecX.y + myVecY.y + myVecZ.y , 
                                      myVecX.z + myVecY.z + myVecZ.z )

            sphereList[index].position.x = sphereListOriginal[index].x + myTransVec.x;
            sphereList[index].position.y = sphereListOriginal[index].y + myTransVec.y;
            sphereList[index].position.z = sphereListOriginal[index].z + myTransVec.z;

        for (var i = 0 ; i < 3 ; i ++ ){
            myScene3.remove(myScene3.getObjectByName( myCuspList[i] ) )
            myScene3.remove(myScene3.getObjectByName( myCuspList[i] + "_outline" ) )
            drawSurface( ALLCusp_Index[i]  , myCuspList[i] );
        }

    });

}

function dummyTrigger(){
   // change all three midpoints
    moveSphere(sphereList[7],7,topPlaneNormal.normalize(),-2.5);
    moveSphere(sphereList[8],8,topPlaneNormal.normalize(),-2.5);
    moveSphere(sphereList[9],9,topPlaneNormal.normalize(),-2.5);
    for (var i = 0 ; i < 3 ; i ++ ){
        myScene3.remove(myScene3.getObjectByName( myCuspList[i] ) )
        myScene3.remove(myScene3.getObjectByName( myCuspList[i]+"_outline" ) )
        drawSurface( ALLCusp_Index[i]  , myCuspList[i] );
    }
    console.log("dummyTrigger")
}