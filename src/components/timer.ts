export function sprintTimer(): void {
  const FULL_DASH_ARRAY = 283;
  const WARNING_THRESHOLD = 40;
  const ALERT_THRESHOLD = 20;

  const COLOR_CODES = {
    info: {
      color: 'green',
    },
    warning: {
      color: 'orange',
      threshold: WARNING_THRESHOLD,
    },
    alert: {
      color: 'red',
      threshold: ALERT_THRESHOLD,
    },
  };

  const TIME_LIMIT = 60;
  let timePassed = 0;
  let timeLeft: number = TIME_LIMIT;
  let timerInterval: ReturnType<typeof setInterval>;
  const remainingPathColor = COLOR_CODES.info.color;

  (<HTMLElement>document.getElementById('sprint-timer')).innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${timeLeft}</span>
</div>
`;

  function onTimesUp() {
    clearInterval(timerInterval);
  }

  function setRemainingPathColor() {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      (<HTMLElement>document.getElementById('base-timer-path-remaining')).classList.remove(warning.color);
      (<HTMLElement>document.getElementById('base-timer-path-remaining')).classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
      (<HTMLElement>document.getElementById('base-timer-path-remaining')).classList.remove(info.color);
      (<HTMLElement>document.getElementById('base-timer-path-remaining')).classList.add(warning.color);
    }
  }

  function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }

  function setCircleDasharray() {
    const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    (<HTMLElement>document
      .getElementById('base-timer-path-remaining'))
      .setAttribute('stroke-dasharray', circleDasharray);
  }
  function startTimer() {
    timerInterval = setInterval(() => {
      if (timeLeft === 0 || document.getElementById('base-timer-label') === null) {
        onTimesUp();
      } else {
        timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        (<HTMLElement>document.getElementById('base-timer-label')).innerHTML = `${timeLeft}`;
        setCircleDasharray();
        setRemainingPathColor();
      }
    }, 1000);
  }
  startTimer();
}
