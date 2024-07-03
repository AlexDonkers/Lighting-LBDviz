import { IfcViewerAPI } from 'web-ifc-viewer';
import { MeshBasicMaterial, LineBasicMaterial, Color, Mesh, BoxGeometry } from 'three';
import { ClippingEdges } from 'web-ifc-viewer/dist/components/display/clipping-planes/clipping-edges';
import { IFCSPACE, IFCOPENINGELEMENT, IFCFURNISHINGELEMENT, IFCWALL, IFCWINDOW, IFCCURTAINWALL, IFCMEMBER, IFCPLATE, IFCWALLSTANDARDCASE, IFCDOOR, IFCSLAB, IfcWindowStandardCase } from 'web-ifc';
import { CSS2DRenderer , CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import _ from 'lodash';

// Functions
import { queryComunica } from './comunica.js'
import { queryComunicaGlobalIdProps } from './comunicaGlobalIdProps.js'

// Functions Lighting LBDviz
import { queryComunicaDeskProperties } from './comunicaDeskProperties.js'
import { queryComunicaOccupantInformation } from './comunicaOccupantInformation.js'
import { queryComunicaObjectiveAndSubjectiveMeasurements } from './comunicaObjectiveAndSubjectiveMeasurements.js'
import { queryComunicaObjectiveAndSubjectiveMeasurementsGUID } from './comunicaObjectiveAndSubjectiveMeasurementsGUID.js'
import { queryComunicaRoomProperties } from './comunicaRoomProperties.js'
import { queryComunicaBeeEye } from './comunicaBeeEye.js'
import { queryComunicaPlot } from './comunicaPlot.js'



const container = document.getElementById('viewer-container');
const viewerColor = new Color('#DFDDEF');
const viewer = new IfcViewerAPI({ container, backgroundColor: viewerColor });
viewer.axes.setAxes();
viewer.shadowDropper.darkness = 1.5;

viewer.IFC.setWasmPath("../Lighting-LBDviz/dist/");

viewer.IFC.loader.ifcManager.applyWebIfcConfig({
    USE_FAST_BOOLS: true,
    COORDINATE_TO_ORIGIN: true
  });

const lineMaterial = new LineBasicMaterial({ color: 0x555555 });
const baseMaterial = new MeshBasicMaterial({ color: 0xffffff, side: 2 });

let first = true;
let model;

//
// LOAD IFC
//

const loadIfc = async (event) => {


    // tests with glTF
    // const file = event.target.files[0];
    // const url = URL.createObjectURL(file);
    // const result = await viewer.GLTF.exportIfcFileAsGltf({ ifcFileUrl: url });
    //
    // const link = document.createElement('a');
    // link.download = `${file.name}.gltf`;
    // document.body.appendChild(link);
    //
    // for(const levelName in result.gltf) {
    //   const level = result.gltf[levelName];
    //   for(const categoryName in level) {
    //     const category = level[categoryName];
    //     link.href = URL.createObjectURL(category.file);
    //     link.click();
    //   }
    // }
    //
    // link.remove();
  
    const overlay = document.getElementById('loading-overlay');
    const progressText = document.getElementById('loading-progress');
  
    overlay.classList.remove('hidden');
    progressText.innerText = `Loading`;
  
    viewer.IFC.loader.ifcManager.setOnProgress((event) => {
      const percentage = Math.floor((event.loaded * 100) / event.total);
      progressText.innerText = `Loaded ${percentage}%`;
    });
  
    viewer.IFC.loader.ifcManager.parser.setupOptionalCategories({
      [IFCSPACE]: true,
      [IFCOPENINGELEMENT]: false
    });
  
    model = await viewer.IFC.loadIfc(event.target.files[0], false);
    model.material.forEach(mat => mat.side = 2);

    if(first) first = false;
    else {
      ClippingEdges.forceStyleUpdate = true;
    }
  
    // await createFill(model.modelID);
    viewer.edges.create(`${model.modelID}`, model.modelID, lineMaterial, baseMaterial);
    await viewer.shadowDropper.renderShadow(model.modelID);
  
    overlay.classList.add('hidden');
  
  };
  
//
// LOAD DEFAULT IFC
//

async function loadDefaultIfc(url) {
	const model = await viewer.IFC.loadIfcUrl(url);
  model.material.forEach(mat => mat.side = 2);
	await viewer.shadowDropper.renderShadow(model.modelID);
  viewer.IFC.loader.ifcManager.parser.setupOptionalCategories({
    [IFCSPACE]: true,
    [IFCOPENINGELEMENT]: false
  });
  if(first) first = false;
  else {
    ClippingEdges.forceStyleUpdate = true;
  }
  viewer.edges.create(`${model.modelID}`, model.modelID, lineMaterial, baseMaterial);
  await viewer.shadowDropper.renderShadow(model.modelID);
}

document.getElementById("load-default-ifc-button").addEventListener('click', () => {
  loadDefaultIfc('https://raw.githubusercontent.com/RubyvR/Vertigo_VisualComfort/main/resources/VertigoFloor9%2BSensors.ifc')
 });


 //
 // GET SCENE
 //


const scene = viewer.context.getScene();

const inputElement = document.createElement('input');
inputElement.setAttribute('type', 'file');
inputElement.classList.add('hidden');
inputElement.addEventListener('change', loadIfc, false);

document.getElementById("load-ifc-button").addEventListener('click', () => {
  document.getElementById("load-ifc-button").blur();
  inputElement.click();
});



//
// window. functions
//

window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
window.onclick = async () => {
    const result = await viewer.IFC.selector.pickIfcItem(true);
    if(!result) return;
    const {modelID, id} = result;
    const props = await viewer.IFC.getProperties(modelID, id, true, false);
    console.log(props.GlobalId.value);
    document.getElementById("results-box-content").innerHTML = JSON.stringify(props);
    document.getElementById("selected-guid").innerHTML = props.GlobalId.value;
    console.log(props)
    return props.GlobalId
};
viewer.clipper.active=true;

window.onkeydown = (event) => {
    if(event.code === 'KeyP') {
        viewer.clipper.createPlane();
    }
    else if(event.code === 'KeyO') {
        viewer.clipper.deletePlane();
    }
    else if(event.code === 'KeyT') {
        viewer.clipper.toggle();
    }

    else if(event.code === 'KeyQ') {
      queryComunica();
    }        
    else if(event.code === 'KeyW') {
      queryComunicaWalls()
    }  
    else if(event.code === 'KeyT') {
      queryComunicaGlobalIdProps()
    }  
    else if(event.code === 'KeyI') {
      queryComunicaOccupantInformation()
      queryComunicaDeskProperties()
      queryComunicaObjectiveAndSubjectiveMeasurements()
      queryComunicaObjectiveAndSubjectiveMeasurementsGUID()
      queryComunicaRoomProperties()
      queryComunicaBeeEye()
      queryComunicaPlot()
    }
    else if(event.code === 'KeyS') {
      queryInfluxSensorData()
     
    }
    else if(event.code === 'KeyR') {
      queryInfluxSensorDataInSelectedRoom()
    }
    else if(event.code === 'KeyR') {
      queryComunicaDesk()
    }
    else if(event.code === 'KeyE') {
      requestEnergySocketData()
      requestP1MeterData()
      requestWaterMeterData()
      setEnergySocketState()
    }
};


//
// Menu functions
//

// accordion
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}



// tabs

export function openOptionsTab(evt, optionsTab) {
  var i, optionstabcontent, optionstablinks;
  optionstabcontent = document.getElementsByClassName("optionstabcontent");
  for (i = 0; i < optionstabcontent.length; i++) {
    optionstabcontent[i].style.display = "none";
  }
  optionstablinks = document.getElementsByClassName("optionstablinks");
  for (i = 0; i < optionstablinks.length; i++) {
    optionstablinks[i].className = optionstablinks[i].className.replace(" active", "");
  }
  document.getElementById(optionsTab).style.display = "block";
  evt.currentTarget.className += " active";

}
window.openOptionsTab = openOptionsTab;
document.getElementById("defaultOptionsOpen").click();


export function openQueryTab(evt, queryTab) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(queryTab).style.display = "block";
  evt.currentTarget.className += " active";

}
window.openQueryTab = openQueryTab;
document.getElementById("defaultOpen").click();



// Chart



// Feedback function


window.addEventListener("click", pick())
export async function pick() {
    const result = await viewer.IFC.selector.pickIfcItem(true);
    if(!result) return;
    const {modelID, id} = result;
    const props = await viewer.IFC.getProperties(modelID, id, true, false);
    console.log("test"+props.GlobalId);
    document.getElementById("sensor-data-box-content").innerHTML = JSON.stringify(props);
}
window.pick = pick;


// toggle


function toggleDarkMode() {
  var element = document.getElementById("viewer-container");
  element.classList.toggle("viewer-container-dark-mode");
}
window.toggleDarkMode = toggleDarkMode;
document.getElementById("dark-mode-toggle").click();