
import { QueryEngine } from '@comunica/query-sparql'

export async function queryComunicaBeeEye() {
  const myEngine = new QueryEngine();
  console.log(document.getElementById("selected-guid").innerHTML);
  const graphs = document.getElementById("GRAPH-input").value.split(',')
  const bindingsStream = await myEngine.queryBindings(`PREFIX lbd: <https://linkedbuildingdata.org/LBD#>
PREFIX bop: <https://w3id.org/bop#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX bot: <https://w3id.org/bot#>

SELECT DISTINCT ?BE02 where {
    ?o lbd:globalId "0td7d4boX8mPNuPc5g7U4u" ;
    bot:containsElement ?sensor .
    ?sensor bop:Observes ?Property .
    ?sensor bop:hasExternalDatabase ?DB .
    ?DB a bop:Database ; 
    bop:hasImage ?image .
    ?image a bop:Image;
    bop:filePath ?BE02 .
} 
 `, {
    sources: graphs,
  });

  document.getElementById("gallery").innerHTML = "";

  const bindings = bindingsStream;
  const images = [];

  bindings.on('data', (binding) => {
      const imageUrl = binding.get('BE02').value;
      images.push(imageUrl);
  });

  bindings.on('end', () => {
      displayImages(images);
});
}
window.queryComunicaBeeEye = queryComunicaBeeEye; 
queryComunicaBeeEye(); 



export function displayImages(images) {
  const gallery = document.getElementById('gallery');
  const imageList = document.createElement('ul');
  imageList.classList.add('gallery');

  images.forEach((imageUrl) => {
    const img = document.createElement('img');
    const anchor = document.createElement('a');
    // Set the href attribute of the anchor tag to the URL you want to link to
    anchor.href = imageUrl;
    // Set the target attribute to '_blank' to open the link in a new window/tab
    anchor.target = '_blank';
    img.src = imageUrl;
    img.alt = 'Image from SPARQL query';
    img.height = 300;
    // Append the image element to the anchor tag instead of the list item element
    anchor.appendChild(img);
    imageList.appendChild(anchor);
  });

  gallery.appendChild(imageList);
}