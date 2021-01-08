var timer;
var startTime;
var sweepingTime = localStorage.getItem('sweepingTime') ? localStorage.getItem('sweepingTime') : 15 * 1000; // ms
var pauseTime = localStorage.getItem('pauseTime') ? localStorage.getItem('pauseTime') : 45 * 1000;  // ms
var repetitions = localStorage.getItem('repetitions') ? localStorage.getItem('repetitions') : 10;
var repetitionsCount = 1;
var startTime = 0; //ms
var status = "sweeping"; // "sweeping", "pause"

var soundWhistle = new Howl({
  src: ['sound/whistle.webm', 'sound/whistle.mp3'],
  sprite: {
    one: [0, 1000],
    end: [0, 4460]
  }
});

// var soundSkip = new Howl({
//   src: ['sound/skip.webm', 'sound/skip.mp3'],
//   sprite: {
//     one: [0, 1000],
//     end: [0, 4460]
//   }
// });

function timerStartStop() {
  switch (document.getElementById("btn-start-stop").innerHTML) {
    case "Start!":
      document.getElementById("btn-start-stop").innerHTML = "Stop";
      document.getElementById("progressBar").style.width = "1%";
      timer = setInterval(timeRefresh, 10);
      document.getElementById("_timer").innerHTML = "inizio conteggio";
      repetitionsCount = 1;
      document.getElementById("divProgressBar").classList.remove("d-none");
      document.getElementById("training-bg").classList.remove("bg-cover");
      startTime = Date.now();
      status = "sweeping";
      styleTrainingSweeping();

      break;
    case "Stop":
      stop();
      clearInterval(timer);
      document.getElementById("btn-start-stop").innerHTML = "Start!";
      document.getElementById("_timer").innerHTML = "Ready?";
      break;
    default:
  }
}

function timeRefresh () {
  let currentTime = Date.now();
  let elapsed = currentTime - startTime; // ms
  if (status === "sweeping") {
    if (elapsed >= sweepingTime) {
      status = "pause";
      styleTrainingPause();
      startTime = currentTime;
    } else {
      document.getElementById("_timer").innerHTML = timeToString(elapsed);
    }
  } else if (status ===  "pause") {
    if (elapsed >= pauseTime) {
      repetitionsCount++;
      status = "sweeping";
      styleTrainingSweeping();
      startTime = currentTime;
      if (repetitionsCount > repetitions) {
        stop();
      } else {
        updateProgressBar();
      }
    } else if (repetitionsCount === repetitions) {
      document.getElementById("_timer").innerHTML = "Training completed!";
      playSound('end');
      stop();
    } else {
      document.getElementById("_timer").innerHTML = timeToString(elapsed);
    }
  }
}

function stop() {
  clearInterval(timer);
  document.getElementById("btn-start-stop").innerHTML = "Start!";
  document.getElementById("divProgressBar").classList.add("d-none");
  styleTrainingStop();
}

function timeToString(ms) {
  let rounded = ms / 1000;
  return rounded.toFixed(1);
}

function updateProgressBar() {
  document.getElementById("progressBar").style.width = (((repetitionsCount-1)/repetitions)*100)-2+"%";
}


// Style functions
function styleTrainingSweeping() {
  styleTrainingStop();
  playSound('one');
  document.getElementById("training-bg").classList.add("bg-success");
  document.getElementById("btn-start-stop").classList.remove("btn-primary");
  document.getElementById("btn-start-stop").classList.add("btn-outline-dark");
  document.getElementById("helpText").innerHTML = "SWEEPING TIME!";
  document.getElementById("training-bg").classList.remove("bg-cover");
}

function styleTrainingPause() {
  styleTrainingStop();
  playSound('one');
  document.getElementById("training-bg").classList.add("bg-warning");
  document.getElementById("btn-start-stop").classList.remove("btn-primary");
  document.getElementById("btn-start-stop").classList.add("btn-outline-dark");
  document.getElementById("helpText").innerHTML = "pause time";
  document.getElementById("training-bg").classList.remove("bg-cover");
}

function styleTrainingStop() {
  document.getElementById("training-bg").classList.remove("bg-warning");
  document.getElementById("training-bg").classList.remove("bg-success");
  document.getElementById("btn-start-stop").classList.remove("btn-outline-dark");
  document.getElementById("btn-start-stop").classList.add("btn-primary");
  document.getElementById("helpText").innerHTML = "You can start another session";
  document.getElementById("training-bg").classList.add("bg-cover");
}

function playSound(position) {

  switch (document.getElementById("audioOption").value) {
    case "none":
      break;

    case "whistle":
        soundWhistle.play(position);
      break;

    case "skip":
        soundSkip.play(position);
      break;

    default:
  }

}

// Settings value functions

function setStartValues(){
  document.getElementById("sweepingTimeValue").value = sweepingTime / 1000;
  document.getElementById("pauseTimeValue").value = pauseTime / 1000;
  document.getElementById("repetitionsValue").value = repetitions;

  if (localStorage.getItem('audioOption')) {
    document.getElementById("audioOption").value = localStorage.getItem('audioOption');
    document.getElementById("saveButtons").classList.remove("d-none");
  }
}

function sweepingTimeValueCheck() {
  if (document.getElementById("sweepingTimeValue").value < 1) {
    document.getElementById("sweepingTimeValue").value = 1;
  }

  document.getElementById("saveButtons").classList.remove("d-none");
}

function pauseTimeValueCheck() {
  if (document.getElementById("pauseTimeValue").value < 1) {
    document.getElementById("pauseTimeValue").value = 1;
  }

  document.getElementById("saveButtons").classList.remove("d-none");
}

function repetitionsValueCheck() {
  if (document.getElementById("repetitionsValue").value < 1) {
    document.getElementById("repetitionsValue").value = 1;
  }

  document.getElementById("saveButtons").classList.remove("d-none");
}

function audioOptionChange() {
  document.getElementById("saveButtons").classList.remove("d-none");
}


// Storage Settings
function saveSettings() {
  localStorage.setItem('sweepingTime',sweepingTime);
  localStorage.setItem('pauseTime',pauseTime);
  localStorage.setItem('repetitions',repetitions);
  localStorage.setItem('audioOption',document.getElementById("audioOption").value);
}

function clearSettings() {
  localStorage.clear();
}