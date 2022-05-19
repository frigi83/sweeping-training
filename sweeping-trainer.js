const queryString = window.location.search;             // read all the parameter in the link
const urlParams = new URLSearchParams(queryString);
const domain = document.location.origin;                // read the basis domain

var timer;
var startTime;

var sweepingTime = urlParams.has('sweepingTime') ? urlParams.get('sweepingTime') * 1000 : 15 * 1000; // ms
var pauseTime = urlParams.has('pauseTime') ? urlParams.get('pauseTime') * 1000 : 45 * 1000;  // ms
var repetitions = urlParams.has('repetitions') ? urlParams.get('repetitions') : 10;
var audioOption = urlParams.has('audio') ? urlParams.get('audio') : "none";

var repetitionsCount = 1;
var startTime = 0; //ms
var status = "sweeping"; // "sweeping", "pause"

var soundWhistle = new Howl({
  src: ['sound/whistle.webm', 'sound/whistle.mp3'],
  sprite: {
    one: [400, 800],
    end: [400, 4460]
  }
});

function timerStartStop() {
  switch (document.getElementById("btn-start-stop").innerHTML) {
    case "Start!":
      document.getElementById("btn-start-stop").innerHTML = "Stop";
      document.getElementById("progressBar").style.width = "1%";
      timer = setInterval(timeRefresh, 10);
      document.getElementById("_timer").innerHTML = "inizio conteggio";
      repetitionsCount = 1;
      document.getElementById("divProgressBar").classList.remove("d-none");
      document.getElementById("divPreset").classList.add("d-none");
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
  document.getElementById("divPreset").classList.remove("d-none");
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

  switch (audioOption) {
    case "none":
      break;

    case "whistle":
        soundWhistle.play(position);
      break;

    default:
  }

}

// Settings value functions

function setStartValues(){
  document.getElementById("sweepingTimeValue").value = sweepingTime / 1000;
  document.getElementById("pauseTimeValue").value = pauseTime / 1000;
  document.getElementById("repetitionsValue").value = repetitions;
  document.getElementById("audioOption").value = audioOption;

  parameterLink();
}

function sweepingTimeValueCheck() {
  if (document.getElementById("sweepingTimeValue").value < 1) {
    document.getElementById("sweepingTimeValue").value = 1;
  }

  sweepingTime = document.getElementById("sweepingTimeValue").value * 1000;
  parameterLink();
}

function pauseTimeValueCheck() {
  if (document.getElementById("pauseTimeValue").value < 1) {
    document.getElementById("pauseTimeValue").value = 1;
  }

  pauseTime = document.getElementById("pauseTimeValue").value * 1000;
  parameterLink();
}

function repetitionsValueCheck() {
  if (document.getElementById("repetitionsValue").value < 1) {
    document.getElementById("repetitionsValue").value = 1;
  }

  repetitions = document.getElementById("repetitionsValue").value;
  parameterLink();
}

function audioOptionChange() {
  audioOption = document.getElementById("audioOption").value;

  parameterLink();
}


function parameterLink() {
  document.getElementById("parameterURL").value = domain + "/?sweepingTime=" + sweepingTime/1000 + "&pauseTime=" + pauseTime/1000 + "&repetitions=" + repetitions + "&audio=" + audioOption;
}

function copyLink() {
  navigator.clipboard.writeText(document.getElementById("parameterURL").value);
}