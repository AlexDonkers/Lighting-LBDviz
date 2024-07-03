
import { QueryEngine } from '@comunica/query-sparql'

export async function queryComunicaPlot() {
  const myEngine = new QueryEngine();
  console.log(document.getElementById("selected-guid").innerHTML);
  const graphs = document.getElementById("GRAPH-input").value.split(',')
  const bindingsStream = await myEngine.queryBindings(`PREFIX lbd: <https://linkedbuildingdata.org/LBD#>
PREFIX bop: <https://w3id.org/bop#>
select ?Comfort ?Glare_Perception ?Illuminance_Level ?Screen_Status ?Sky_conditions ?plot where {
    ?o lbd:globalId "0UrD4dlw19mhLyyqQr_Ko9" ;
    bop:hasComfort ?Comfort ;
    bop:hasGlare ?Glare_Perception ;
    bop:hasIlluminance ?Illuminance_Level ;
    bop:hasScreen ?Screen_Status ;
    bop:hasSky ?Sky_conditions;
    bop:hasPlot ?plot .
}`, {
    sources: graphs,
  });

  document.getElementById("gallery").innerHTML = "";

  const bindings = bindingsStream;
  const images = [];

  bindings.on('data', (binding) => {
      const imageUrl = binding.get('plot').value;
      images.push(imageUrl);
  });

  bindings.on('end', () => {
      displayPlot(images);
});
}
window.queryComunicaPlot = queryComunicaPlot; 
queryComunicaPlot(); 



export function displayPlot(images) {
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
    img.width = 600;
    // Append the image element to the anchor tag instead of the list item element
    anchor.appendChild(img);
    imageList.appendChild(anchor);
  });

  gallery.appendChild(imageList);
}