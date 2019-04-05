const tasksList = document.querySelector('#tasks-list');
const addTaskForm = document.querySelector('#add-task');
const resourcesList = document.querySelector('#resources-list');

// Create element and render task
function renderTask(doc){
  let tr = document.createElement('tr');
  let th = document.createElement('th');
  let tdName = document.createElement('td');
  let tdDuration = document.createElement('td');
  let tdStart = document.createElement('td');
  let tdFinish = document.createElement('td');

  tr.setAttribute('data-id', doc.id);

  th.textContent = doc.data().taskID;
  tdName.textContent = doc.data().name;
  tdDuration.textContent = doc.data().duration;
  tdStart.textContent = doc.data().start;
  tdFinish.textContent = calculateFinishDate(tdStart.textContent, tdDuration.textContent);

  tr.appendChild(th);
  tr.appendChild(tdName);
  tr.appendChild(tdDuration);
  tr.appendChild(tdStart);
  tr.appendChild(tdFinish);

  tasksList.appendChild(tr);
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

  tr.setAttribute('data-id', doc.id);

  th.textContent = doc.data().resourceID;
  tdName.textContent = doc.data().name;
  tdType.textContent = doc.data().type;
  tdMaterial.textContent = doc.data().material;
  tdMax.textContent = doc.data().max;
  tdStandardRate.textContent = doc.data().standardRate;
  tdOvertimeRate.textContent = doc.data().overtimeRate;
  tdCostUse.textContent = doc.data().costUse;


  tr.appendChild(th);
  tr.appendChild(tdName);
  tr.appendChild(tdType);
  tr.appendChild(tdMaterial);
  tr.appendChild(tdMax);
  tr.appendChild(tdStandardRate);
  tr.appendChild(tdOvertimeRate);
  tr.appendChild(tdCostUse);

  resourcesList.appendChild(tr);
}


// Get tasks
db.collection('tasks').orderBy('taskID').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    renderTask(doc);
  })
})

// Get Resources
db.collection('resources').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    renderResource(doc);
  })
})


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