const ORIGINALTEXT_1 = 'Cantidad total de personas registradas'
const MESSAGE_1 = 'La cantidad total es '
const ORIGINALTEXT_2 = 'El promedio de edad de los socios de Racing '
const MESSAGE_2 = 'El promedio es '
const ORIGINALTEXT_3 = '100 primeras personas casadas'
const MESSAGE_3 = 'Las 100 primeras personas casadas son: '
const ORIGINALTEXT_4 = 'Los 5 nombres más comunes'
const MESSAGE_4 = 'Los nombres más comunes son: '
const ORIGINALTEXT_5 = 'Información de los equipos'
const MESSAGE_5 = 'Información de los equipos según requisitos: '
const STUDY_LEVEL_FILTER = 'Universitario'
const MARITAL_STATUS_FILTER = 'Casado'
const TEAM_FILTER_NAMES = 'River'
const TEAM_FILTER_AGE = 'Racing'

let data = null 

const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");
const input = document.getElementById( 'csvFile' );
const infoArea = document.getElementById( 'file-upload-filename' );


input.addEventListener( 'change', showFileName );

function showFileName( event ) {

    // the change event gives us the input it occurred in 
    const input = event.srcElement;
    
    // the input has an array of files in the `files` property, each one has a name that you can use. We're just using the name here.
    const fileName = input.files[0].name;
    
    // use fileName 
    infoArea.textContent = 'Seleccionado: ' + fileName;
}

function csvToArray(str, delimiter = ";") {

    let rows = str.split("\r\n").filter((e)=> e) 

    const arr = rows.map(function (row) {

        const values = row.split(delimiter);
        return {"name": values[0], "age": parseInt(values[1]), "team": values[2], "maritalStatus": values[3], "studyLevel": values[4]};
    
    });
  
    return arr;
}

myForm.addEventListener("submit", function (e) {
    
    if (csvFile.value == "") {
        e.preventDefault();
        alert("Por favor, seleccioná el archivo socios.csv");
    }else{
        e.preventDefault();
        
        const input = csvFile.files[0];
        const reader = new FileReader();
        reader.readAsText(input, 'ISO-8859-1')
        reader.onload = function (e) {
        const text = e.target.result;
        
        
        data = csvToArray(text);

        //document.write(JSON.stringify(data));
        myForm.hidden=true;
        const f = document.getElementById('filter').style.visibility = 'visible'
        document.body.style.backgroundColor = "yellow"
    

    };
    
    }   
    

   // e.preventDefault();
    
    
});

//Toggle btn to show answer or question.
function toggleBtn(id, originalText, message, answer){
    if (document.getElementById(id).innerHTML == originalText) {
        document.getElementById(id).innerHTML = message + answer
    }
    else {document.getElementById(id).innerHTML = originalText}
}
//Displays the answer of the button or returns to it original text. 
function change(id1, id2, id_condition,originalText, message){
    
    if(document.getElementById(id1).innerHTML == originalText && document.getElementById(id_condition).style.display == 'none'){
        document.getElementById(id1).innerHTML = message
        document.getElementById(id2).style.display = 'block'
    }else{
        
        document.getElementById(id1).innerHTML = originalText
       
        document.getElementById(id2).style.display = 'none'
    }

}

//Returns the top five names of an specific team. 
function listOfCommonNames(){

    const teamFiltered =  data.filter(e => e.team == TEAM_FILTER_NAMES)
  
    const tmp = {}
    let top = []
   
    
    teamFiltered.forEach(function(item) {
        tmp[item.name] = tmp[item.name] ? tmp[item.name]+1 :  1;
    });

    // Create an array of the sorted object properties
    top = Object.keys(tmp).sort(function(a, b) { return tmp[b] - tmp[a] });
    const topFive = top.slice(0,5)
    

    let list = document.getElementById("namesList")

    topFive.forEach((item)=>{
        let li = document.createElement("li");
        li.innerText = item;
        list.appendChild(li);
    })

    return topFive

}

 
commonNames = function(){


    if(document.getElementById('namesList').innerHTML.trim() == ''){
        listOfCommonNames()
        change('commonNames','namesList','namesList',ORIGINALTEXT_4,MESSAGE_4)
    }else{
        change('commonNames','namesList','namesList',ORIGINALTEXT_4,MESSAGE_4)
    }

    
}

//Returns an ordered array of values with matching conditions.
marriedPeopleOrdered = function(){
    let i = 0
    let married = data.filter(function(e) {
        if(e.maritalStatus == MARITAL_STATUS_FILTER && e.studyLevel == STUDY_LEVEL_FILTER && i < 100 ){ 
            i++
            return e
        }
    } ) 
    const ascendingOrder = married.sort(function(a,b){return a.age - b.age})

    return ascendingOrder

}

marriedPeople = function(){

    document.getElementById('team').style.display = 'none'
    document.getElementById('showTeamInformation').innerHTML = ORIGINALTEXT_5
    
    if(document.getElementById('tablePeople').innerHTML == ''){
        
        createTable(['Nombre','Edad','Equipo'],marriedPeopleOrdered())
        
        change('marriedPeople','tablePeople','team',ORIGINALTEXT_3,MESSAGE_3)
    }else{
        change('marriedPeople','tablePeople','team',ORIGINALTEXT_3,MESSAGE_3)
    }
}

//total number of people in file.
totalCount = function(){

    let data_unique = new Set(data);
    const unique = [...data_unique]
    const uniqueLength = unique.length

    toggleBtn('totalCount', ORIGINALTEXT_1,MESSAGE_1, uniqueLength)

    
}

//Calculate mean age of a particular team.
meanAge = function(){

    let count = 0
    let sum = 0
    const team = data.filter(e => e.team == TEAM_FILTER_AGE)
    const title = document.getElementById('meanAge').innerHTML
    
    team.forEach(element => {
        count += 1
        
        sum = sum + element.age
        
    });

    const promedio = parseInt(sum / count) 

    toggleBtn('meanAge', ORIGINALTEXT_2, MESSAGE_2, promedio)


    
}
//Create Table to show answer of button 3. 
createTable = function(headers, result) {
    document.getElementById("tablePeople").style.display = 'block'
    const t = document.getElementById("tablePeople")
    const r = document.createElement("tr")
    t.appendChild(r)
    headers.forEach(header => {
        const h = document.createElement("th")
        h.style.color = 'black'
        h.style.padding = '8px 50px 5px 50px';
        h.innerText = header
        r.appendChild(h)
    });

    result.forEach(res => {
        const newRow = document.createElement("tr")
        const colName = document.createElement("td")
        const colAge = document.createElement("td")
        const colTeam = document.createElement("td")

        newRow.appendChild(colName)
        newRow.appendChild(colAge)
        newRow.appendChild(colTeam)

        colName.style.padding = '8px 50px 5px 50px';
        colName.style.color = 'black'
        colAge.style.padding = '8px 50px 5px 50px';
        colAge.style.color = 'black'
        colTeam.style.padding ='8px 50px 5px 50px'; 
        colTeam.style.color = 'black'
        
        colName.innerText = res.name
        colAge.innerText = res.age
        colTeam.innerText = res.team

        t.appendChild(newRow)
    });
}

//Create Tabla to show answer of button 5.
createTeamTable = function(headers, result) {
    const t = document.getElementById("team")
    const r = document.createElement("tr")
    t.appendChild(r)
    headers.forEach(header => {
        const h = document.createElement("th")
        h.style.color = 'black'
        h.style.padding = '8px 50px 5px 50px';
        h.innerText = header
        r.appendChild(h)
    });

    result.forEach(res => {
        const newRow = document.createElement("tr")
        const colTeam = document.createElement("td")
        const colMeanAge = document.createElement("td")
        const colMaxAge = document.createElement("td")
        const colMinAge = document.createElement("td")



        newRow.appendChild(colTeam)
        newRow.appendChild(colMeanAge)
        newRow.appendChild(colMinAge)
        newRow.appendChild(colMaxAge)
        
        colTeam.style.color = 'black'
        colTeam.style.padding = '8px 50px 5px 50px';
        colMeanAge.style.color = 'black'
        colMeanAge.style.padding = '8px 50px 5px 50px';
        colMaxAge.style.color = 'black'
        colMaxAge.style.padding = '8px 50px 5px 50px';
        colMinAge.style.color = 'black'
        colMinAge.style.padding = '8px 50px 5px 50px';

        colTeam.innerText = res[0]
        colMeanAge.innerText = res[1].promedio
        colMaxAge.innerText = res[1].maxEdadReg
        colMinAge.innerText = res[1].minEdadReg
        


        t.appendChild(newRow)
    });
    
}

//Calculte the required data to fill the table to answer the question of the last button. 
buildData = function(){
    
    let parcial = {}
    data.forEach(element => {
        if (parcial[element.team] === undefined) {
            parcial[element.team] = {
                count:0,
                minEdadReg:1000,
                maxEdadReg:0,
                sumaEdades: 0,
                promedio:0

            }
        }  
            
        parcial[element.team].count += 1
        parcial[element.team].minEdadReg = Math.min(parcial[element.team].minEdadReg, element.age)
        parcial[element.team].maxEdadReg = Math.max(parcial[element.team].maxEdadReg, element.age)
        parcial[element.team].sumaEdades = parcial[element.team].sumaEdades + element.age
    
    });

    for (let k in parcial) {
        parcial[k].promedio = parseInt(parcial[k].sumaEdades/ parcial[k].count)
        
    }
    g = Object.entries(parcial).sort(([,a],[,b]) => b.count-a.count)
   
    return g
    

}


showTeamInformation = function() {
    
    document.getElementById('tablePeople').style.display = 'none'
    document.getElementById('marriedPeople').innerHTML = ORIGINALTEXT_3
    
    if(document.getElementById('team').innerHTML.trim() == ''){
        createTeamTable(["Equipo", " PromedioEdad", " MenorEdad", " MayorEdad"],buildData())
        change('showTeamInformation','team','tablePeople',ORIGINALTEXT_5,MESSAGE_5)
    }else{
        change('showTeamInformation','team','tablePeople',ORIGINALTEXT_5,MESSAGE_5)
    }
    

}



