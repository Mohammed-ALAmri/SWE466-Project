const addTaskForm = document.querySelector('#add-task');
const errorMessage = document.querySelector('#error');

// Hide error message by default
errorMessage.style.display = "none";

// When Any input field is focused, hide the error message
function addEventListener(el, eventName, handler) {
  if (el.addEventListener) {
    el.addEventListener(eventName, handler);
  } else {
    el.attachEvent('on' + eventName, function(){
      handler.call(el);
    });
  }
}

function addEventListeners(selector, type, handler) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
    addEventListener(elements[i], type, handler);
  }
}

addEventListeners('input', 'focus', function(e) {
  errorMessage.style.display = "none";
});

// Add task
addTaskForm.addEventListener('submit', (event) => {
  event.preventDefault()

  let docRef = db.collection('tasks').doc(`${addTaskForm.taskID.value}`);

  docRef.get().then(function(doc) {
    if (doc.exists) {
      errorMessage.style.display = "block";
    } else {
      console.log("No such doc!")
      db.collection('tasks').doc(`${addTaskForm.taskID.value}`).set({
        taskID: addTaskForm.taskID.value,
        name: addTaskForm.taskName.value,
        start: convertDateToString(addTaskForm.start.value),
        duration: addTaskForm.duration.value
      });
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });
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