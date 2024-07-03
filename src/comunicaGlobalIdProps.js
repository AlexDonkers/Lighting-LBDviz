
import { QueryEngine } from '@comunica/query-sparql'

export async function queryComunicaGlobalIdProps() {
  const myEngine = new QueryEngine();
  console.log(document.getElementById("selected-guid").innerHTML);
  const graphs = document.getElementById("GRAPH-input").value.split(',')
  const bindingsStream = await myEngine.queryBindings(`prefix owl: <http://www.w3.org/2002/07/owl#> 
prefix bot: <https://w3id.org/bot#> 
prefix ifc: <https://standards.buildingsmart.org/IFC/DEV/IFC2x3/TC1/OWL#> 
prefix omg: <https://w3id.org/omg#> 
prefix xsd: <https://www.w3.org/2001/XMLSchema#> 
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
prefix lbd: <https://linkedbuildingdata.org/LBD#> 
prefix props: <http://lbd.arch.rwth-aachen.de/props#> 
prefix geo: <https://www.opengis.net/ont/geosparql#> 
prefix unit: <http://qudt.org/vocab/unit/> 
prefix IFC4-PSD: <https://www.linkedbuildingdata.net/IFC4-PSD#> 
prefix smls: <https://w3id.org/def/smls-owl#> 
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
prefix inst: <https://www.ugent.be/VertigoFloor9RvR#> 
prefix fog: <https://w3id.org/fog#> 
prefix ofo:  <https://w3id.org/ofo#> 
prefix bop:  <https://w3id.org/bop#> 						
  select * where { 
    ?element lbd:globalId `+JSON.stringify(document.getElementById("selected-guid").innerHTML)+` .
    ?element ?p ?o .
  } limit 100 `, {
    sources: graphs,
  });

  const bindings = await bindingsStream.toArray(); console.log(bindings);
  //clear result box
  document.getElementById("results-box-content").innerHTML = "";
  //start table component
  let tableContent = "<table>" 

  tableContent +="<tr>"
  const headers = bindings[0].entries._root.entries
  for (var y = 0; y<headers.length; y++) {
    tableContent += "<th>"+headers[y][0]+"</th>"
  }
  tableContent +="</tr>"

  for (var i = 0; i<bindings.length; i++) {
    const binding1 = bindings[i]
    const results = binding1.entries._root.entries

    //create table rows
    tableContent += "<tr>"
    for (var x = 0; x<results.length; x++) {
      if (results[x][1].termType === "Literal") {
        console.log(results[x][0] +": "+ results[x][1].value)
        
        tableContent += "<td>"+results[x][1].value+"</td>"
      }
      if (results[x][1].termType !== "Literal") {
        console.log(results[x][0] +": "+ results[x][1].value.split("#", 2)[1])
        tableContent += "<td><a target='_blank' href='"+results[x][1].value+"'>"+results[x][1].value.split("#", 2)[1]+"</a></td>"
      }
    }
    tableContent += "</tr>"
  } 
  //end
  tableContent += "</table>" 

  //add table to results box
  document.getElementById("results-box-content").innerHTML = tableContent

}
window.queryComunicaGlobalIdProps = queryComunicaGlobalIdProps;
queryComunicaGlobalIdProps()