export async function requestEnergySocketData() {
    console.log('http://'+document.getElementById('Energy-socket-IP').value+'/api/v1/data')
    setInterval(async function(){
        fetch('http://'+document.getElementById('Energy-socket-IP').value+'/api/v1/data')
        .then(response => response.json())
        .then(data => { 
            console.log("EnergySocketActivePower: "+data.active_power_w)
            console.log("EnergySocketActivePower: "+data.total_power_import_t1_kwh)

            document.getElementById("EnergySocketActivePower-box-content").innerHTML = data.active_power_w + " W"
            document.getElementById("EnergySocketTotalPower-box-content").innerHTML = data.total_power_import_t1_kwh + " kWh"
            var cost = document.getElementById("Energy-price").innerHTML * data.active_power_w / 1000
            document.getElementById("EnergySocketCost-box-content").innerHTML = Math.round(cost * 1000) / 1000
            console.log(cost, Math.round(cost * 1000) / 1000)
            if (data.active_power_w === 0) {
                document.getElementById("EnergySocketImage").src='../resources/Socket_off.png'
            } else {
                document.getElementById("EnergySocketImage").src='../resources/Socket_on.png'
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
     
    }, document.getElementById('Energy-frequency').value)
    
  }
  window.requestEnergySocketData = requestEnergySocketData;
  requestEnergySocketData()