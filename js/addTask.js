const addTaskForm = document.querySelector('#add-task');

// Add task
addTaskForm.addEventListener('submit', (event) => {
  event.preventDefault()
  db.collection('tasks').add({
    taskID: addTaskForm.taskID.value,
    name: addTaskForm.taskName.value,
    start: convertDateToString(addTaskForm.start.value),
    duration: addTaskForm.duration.value
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