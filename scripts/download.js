function downloadSTL(){


	$('#downloadSTL').click( function(){
		console.log("download b");
		saveSTL(  combine3geometry( myScene3.getObjectByName( 'L_cusp' ).geometry,
                                    myScene3.getObjectByName( 'NC_cusp' ).geometry,
                                    myScene3.getObjectByName( 'R_cusp' ).geometry  )  , "my2.stl")
	});


}


// Written by Paul Kaplan

function  writeVector(dataview, offset, vector, isLittleEndian) {
    offset = writeFloat(dataview, offset, vector.x, isLittleEndian);
    offset = writeFloat(dataview, offset, vector.y, isLittleEndian);
    return writeFloat(dataview, offset, vector.z, isLittleEndian);
};

function writeFloat(dataview, offset, float, isLittleEndian) {
    dataview.setFloat32(offset, float, isLittleEndian);
    return offset + 4;
};

function geometryToDataView(geometry) {
    var tris = geometry.faces;
    var verts = geometry.vertices;
    
    var isLittleEndian = true; // STL files assume little endian, see wikipedia page
    
    var bufferSize = 84 + (50 * tris.length);
    var buffer = new ArrayBuffer(bufferSize);
    var dv = new DataView(buffer);
    var offset = 0;

    offset += 80; // Header is empty

    dv.setUint32(offset, tris.length, isLittleEndian);
    offset += 4;

    for(var n = 0; n < tris.length; n++) {
      offset = writeVector(dv, offset, tris[n].normal, isLittleEndian);
      offset = writeVector(dv, offset, verts[tris[n].a], isLittleEndian);
      offset = writeVector(dv, offset, verts[tris[n].b], isLittleEndian);
      offset = writeVector(dv, offset, verts[tris[n].c], isLittleEndian);
      offset += 2; // unused 'attribute byte count' is a Uint16
    }

    return dv;
};

function  saveSTL(geometry, filename) {
    var dv = geometryToDataView(geometry);
    var blob = new Blob([dv], {type: 'application/octet-binary'});
    
    // FileSaver.js defines `saveAs` for saving files out of the browser
    saveAs(blob, filename);
};

function combine3geometry(geo1,geo2,geo3){
    // some dummy material
    var myMat = new THREE.MeshLambertMaterial( {color: 0xcab590 , side: THREE.DoubleSide} );

    //1// convert geo1 into mesh
    var myCuspMesh1 = new THREE.Mesh( geo1, myMat  );
    //2// merge
    myCuspMesh1.updateMatrix();
    geo2.merge( myCuspMesh1.geometry, myCuspMesh1.matrix );
    //3// make mesh from geo2
    var myCuspMesh2 = new THREE.Mesh( geo2, myMat  );
    //4// merge
    myCuspMesh2.updateMatrix();
    geo3.merge( myCuspMesh2.geometry, myCuspMesh2.matrix );

    return geo3
}