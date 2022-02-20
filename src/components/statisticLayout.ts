const statisticLayout = `

<div id="statistic-for-this-day">
    <h2>Statistic for this day</h2>
    
    <div id="words-statistic">
    <h3>Words statistic</h3>
        <div id="words-stat-container">
            <p>new words:<span id="day-new-words"></span></p>

            <p>correct answers:<span id="day-correct-answers"></span></p>

            <p>learned words:<span id="day-learned-words"></span></p>
        </div>
    </div>

    <div id="game-statistic">
    <h3>Game statistic</h3>
        <div id="game-stat-container">
            
            <div id="audio-challenge-stat-container">
                <h3>audio-challenge
                    <img src="../assets/game_challenge.png" alt="audio-challenge" id="audio-challenge-img">
                </h3>
                <p>new words:<span id="audio-challenge-new-words"></span></p>

                <p>correct answers:<span id="audio-challenge-correct-answers">0</span> </p>

                <p>correct answers streak:<span id="audio-challenge-streak"></span></p>
            </div>

            <div id="sprint-stat-container">
                <h3>
                    Sprint<img src="../assets/game_sprint.png" alt="sprint" id="sprint-img">
                </h3>
                <p>new words:<span id="sprint-new-words"></span></p>

                <p>correct answers:<span id="sprint-correct-answers"></span> </p>
                <p>correct answers streak:<span id="sprint-streak"></span></p>
            </div> 
        </div>
    </div>
</div>

<div id="statistic-for-all-time">
    <h2>Statistic for all time</h2>
    <div id="schedule-stat-container">
        <div id="new-words-per-day">
            <h3>new words per day</h3>
            <canvas width="500" height="500" id="canvas1"></canvas>
        </div>
        <div id="total-learned-words-per-day">
            <h3>total learned words per day</h3>
            <canvas width="500" height="500" id="canvas2"></canvas>
        </div>    
    </div>
</div>

`;
export default statisticLayout;
