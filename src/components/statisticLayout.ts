const statisticLayout = `
<h2>Statistic</h2>
<div id="total-learn-words-container">
    <p>Total learned words:<span id="total-learn-words"></span></p>
</div>
<h2>Statistic for this day</h2>
<h3>Words statistic</h3>
<div id="day-stat-container">
    <p>new words:<span id="day-new-words"></span></p>
    <p>correct answers:<span id="day-correct-answers"></span> %</p>
    <p>learned words:<span id="day-learned-words"></span></p>
</div>
<h3>Game statistic</h3>
<div id="game-stat-container">
<div id="audio-challenge-stat-container">
    <h3>audio-challenge<img src="" alt="audio-challenge" id="audio-challenge-img"></h3>
    <p>new words:<span id="audio-challenge-new-words"></span></p>
    <p>correct answers:<span id="audio-challenge-correct-answers">0</span> %</p>
    <p>correct answers streak:<span id="audio-challenge-streak"></span></p>
</div>
<div id="sprint-stat-container">
<h3>Sprint<img src="" alt="sprint" id="sprint-img"></h3>
    <p>new words:<span id="sprint-new-words"></span></p>
    <p>correct answers:<span id="sprint-correct-answers"></span> %</p>
    <p>correct answers streak:<span id="sprint-streak"></span></p>
</div>
</div>
<h2>Statistic for all time</h2>
<div id="schedule-stat-container">
<div id="new-words-per-day">
    <h3>new words per day</h3>
</div>
<div id="total-learned-words-per-day">
    <h3>total learned words per day</h3>
</div>
</div>
`;
export default statisticLayout;
