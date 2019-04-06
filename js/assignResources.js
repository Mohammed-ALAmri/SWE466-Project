const resourcesList = document.querySelector('#resources-list');

var resourceIDsArray = [];

// Pass the checkbox name to the function
function getCheckedboxes() {
  var checkboxes = document.getElementsByName('checkbox');
  var checkboxesChecked = [];
  // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
     // And stick the checked ones onto an array...
     if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i]);
        resourceIDsArray.push(checkboxes[i].id)
     }
  }

  if (checkboxesChecked.length > 0) {
    batchAddResources();
  }
}

// Create element and render resource
function renderResource(doc){
  let tr = document.createElement('tr');
  let th = document.createElement('th');
  let tdName = document.createElement('td');
  let tdType = document.createElement('td');
  let tdMaterial = document.createElement('td');
  let tdMax = document.createElement('td');
  let tdStandardRate = document.createElement('td');
  let tdOvertimeRate = document.createElement('td');
  let tdCostUse = document.createElement('td');
  let tdCheckbox = document.createElement('td');
  let checkbox = document.createElement('input');

  tr.setAttribute('data-id', doc.id);
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('name', 'checkbox');
  checkbox.setAttribute('id', doc.id)

  th.textContent = doc.data().resourceID;
  tdName.textContent = doc.data().name;
  tdType.textContent = doc.data().type;
  tdMaterial.textContent = doc.data().material;
  tdMax.textContent = doc.data().max;
  tdStandardRate.textContent = doc.data().standardRate;
  tdOvertimeRate.textContent = doc.data().overtimeRate;
  tdCostUse.textContent = doc.data().costUse;

  tdCheckbox.appendChild(checkbox);


  tr.appendChild(th);
  tr.appendChild(tdName);
  tr.appendChild(tdType);
  tr.appendChild(tdMaterial);
  tr.appendChild(tdMax);
  tr.appendChild(tdStandardRate);
  tr.appendChild(tdOvertimeRate);
  tr.appendChild(tdCostUse);
  tr.appendChild(tdCheckbox);

  resourcesList.appendChild(tr);
}

// Get resource IDs not yet mapped to this task ID
db.collection('mappings').where('taskID', '>', taskID).where('taskID', '<', taskID).get().then((snapshot) => {
  if (snapshot.empty) {
    console.log("Couldn't find any docs. Collection is probably empty. Rendering all resources...");
    getAllResources()
  } else {
    snapshot.docs.forEach(doc => {
      console.log("Doc is:" + doc)
    })
  }
})

function getAllResources() {
  db.collection('resources').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      renderResource(doc)
    })
  })
}

function batchAddResources() {
  var batch = db.batch();
  var mappingIDsArray = [];

  resourceIDsArray.forEach(resourceID => {
    let mappingID = taskID + "_" + resourceID;
    mappingIDsArray.push(mappingID);
  })

  mappingIDsArray.forEach(mappingID => {
    batch.set(db.collection('mappings').doc(mappingID), {taskID: mappingID.split("_")[0], resourceID: mappingID.split("_")[1]})
  })

  batch.commit().then(function() {
    location.replace('index.html');
  });
}


function createDateFromString(dateAsString) {
  let dateAsArrayOfStrings = dateAsString.split('/');
  let dd = Number(dateAsArrayOfStrings[0]);
  let mm = Number(dateAsArrayOfStrings[1]);
  let yyyy = Number(dateAsArrayOfStrings[2]);

  let date = new Date();
  date.setFullYear(yyyy)
  date.setMonth(mm-1)
  date.setDate(dd)

  return date;
}

Date.prototype.addDays = function addDays(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function calculateFinishDate(date, duration) {

  let days = Number(duration)

  let startDate = createDateFromString(date);

  let finishDate = startDate.addDays(days);

  let stringifiedFinishDate = convertDateToString(finishDate);
  
  return stringifiedFinishDate;
}

function convertDateToString(date) {

  let dateToConvert = new Date(date);

  var dd = dateToConvert.getDate();
  var mm = dateToConvert.getMonth()+1; // months in js start from 0 to 11
  var yyyy = dateToConvert.getFullYear();
  if(dd<10) {
      dd='0'+dd;
  } 
  if(mm<10) {
      mm='0'+mm;
  }
  
  return dd + '/' + mm + '/' + yyyy;
}