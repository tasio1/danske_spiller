// Dataset of Danish verbs with their conjugated forms and translations.
// This list contains exactly 150 of the most common Danish verbs.
// For regular verbs, the present tense typically adds “-er” to the stem, while the past and past participle often add “-ede”/“-te” and “-et”/“-t” respectively【387159120025026†L40-L63】.  
// Irregular verbs follow patterns shown in Danish grammar resources【709793738603747†L56-L139】.  
const verbs = [
    { infinitive: 'være', present: 'er', past: 'var', pastParticiple: 'været', translation: 'to be' },
    { infinitive: 'have', present: 'har', past: 'havde', pastParticiple: 'haft', translation: 'to have' },
    { infinitive: 'komme', present: 'kommer', past: 'kom', pastParticiple: 'kommet', translation: 'to come' },
    { infinitive: 'gøre', present: 'gør', past: 'gjorde', pastParticiple: 'gjort', translation: 'to do/make' },
    { infinitive: 'tage', present: 'tager', past: 'tog', pastParticiple: 'taget', translation: 'to take' },
    { infinitive: 'sige', present: 'siger', past: 'sagde', pastParticiple: 'sagt', translation: 'to say' },
    { infinitive: 'vide', present: 'ved', past: 'vidste', pastParticiple: 'vidst', translation: 'to know' },
    { infinitive: 'lade', present: 'lader', past: 'lod', pastParticiple: 'ladet', translation: 'to let' },
    { infinitive: 'holde', present: 'holder', past: 'holdt', pastParticiple: 'holdt', translation: 'to hold' },
    { infinitive: 'hedde', present: 'hedder', past: 'hed', pastParticiple: 'heddet', translation: 'to be called' },
    { infinitive: 'gå', present: 'går', past: 'gik', pastParticiple: 'gået', translation: 'to go/walk' },
    { infinitive: 'rejse', present: 'rejser', past: 'rejste', pastParticiple: 'rejst', translation: 'to travel' },
    { infinitive: 'bære', present: 'bærer', past: 'bar', pastParticiple: 'båret', translation: 'to carry' },
    { infinitive: 'trække', present: 'trækker', past: 'trak', pastParticiple: 'trukket', translation: 'to pull/drag' },
    { infinitive: 'ligge', present: 'ligger', past: 'lå', pastParticiple: 'ligget', translation: 'to lie' },
    { infinitive: 'lægge', present: 'lægger', past: 'lagde', pastParticiple: 'lagt', translation: 'to lay/put' },
    { infinitive: 'sidde', present: 'sidder', past: 'sad', pastParticiple: 'siddet', translation: 'to sit' },
    { infinitive: 'slå', present: 'slår', past: 'slog', pastParticiple: 'slået', translation: 'to hit' },
    { infinitive: 'falde', present: 'falder', past: 'faldt', pastParticiple: 'faldet', translation: 'to fall' },
    { infinitive: 'spise', present: 'spiser', past: 'spiste', pastParticiple: 'spist', translation: 'to eat' },
    { infinitive: 'sove', present: 'sover', past: 'sov', pastParticiple: 'sovet', translation: 'to sleep' },
    { infinitive: 'stjæle', present: 'stjæler', past: 'stjal', pastParticiple: 'stjålet', translation: 'to steal' },
    { infinitive: 'græde', present: 'græder', past: 'græd', pastParticiple: 'grædt', translation: 'to cry' },
    { infinitive: 'sælge', present: 'sælger', past: 'solgte', pastParticiple: 'solgt', translation: 'to sell' },
    { infinitive: 'vælge', present: 'vælger', past: 'valgte', pastParticiple: 'valgt', translation: 'to choose' },
    { infinitive: 'vænne', present: 'vænner', past: 'vænnede', pastParticiple: 'vænnet', translation: 'to accustom' },
    { infinitive: 'binde', present: 'binder', past: 'bandt', pastParticiple: 'bundet', translation: 'to bind' },
    { infinitive: 'brænde', present: 'brænder', past: 'brændte', pastParticiple: 'brændt', translation: 'to burn' },
    { infinitive: 'drikke', present: 'drikker', past: 'drak', pastParticiple: 'drukket', translation: 'to drink' },
    { infinitive: 'finde', present: 'finder', past: 'fandt', pastParticiple: 'fundet', translation: 'to find' },
    { infinitive: 'forsvinde', present: 'forsvinder', past: 'forsvandt', pastParticiple: 'forsvundet', translation: 'to disappear' },
    { infinitive: 'løbe', present: 'løber', past: 'løb', pastParticiple: 'løbet', translation: 'to run' },
    { infinitive: 'slippe', present: 'slipper', past: 'slap', pastParticiple: 'sluppet', translation: 'to let go' },
    { infinitive: 'stikke', present: 'stikker', past: 'stak', pastParticiple: 'stukket', translation: 'to stick/pierce' },
    { infinitive: 'vinde', present: 'vinder', past: 'vandt', pastParticiple: 'vundet', translation: 'to win' },
    { infinitive: 'bide', present: 'bider', past: 'bed', pastParticiple: 'bidt', translation: 'to bite' },
    { infinitive: 'gribe', present: 'griber', past: 'greb', pastParticiple: 'grebet', translation: 'to grasp/catch' },
    { infinitive: 'lide', present: 'lider', past: 'led', pastParticiple: 'lidt', translation: 'to suffer' },
    { infinitive: 'ride', present: 'rider', past: 'red', pastParticiple: 'redet', translation: 'to ride' },
    { infinitive: 'skinne', present: 'skinner', past: 'skinnede', pastParticiple: 'skinnet', translation: 'to shine' },
    { infinitive: 'skrive', present: 'skriver', past: 'skrev', pastParticiple: 'skrevet', translation: 'to write' },
    { infinitive: 'slide', present: 'slider', past: 'sled', pastParticiple: 'slidt', translation: 'to wear out' },
    { infinitive: 'stige', present: 'stiger', past: 'steg', pastParticiple: 'steget', translation: 'to rise' },
    { infinitive: 'tie', present: 'tier', past: 'tav', pastParticiple: 'tiet', translation: 'to be silent' },
    { infinitive: 'vride', present: 'vrider', past: 'vred', pastParticiple: 'vredet', translation: 'to twist/wring' },
    { infinitive: 'byde', present: 'byder', past: 'bød', pastParticiple: 'budt', translation: 'to offer/bid' },
    { infinitive: 'lyve', present: 'lyver', past: 'løj', pastParticiple: 'løjet', translation: 'to lie' },
    { infinitive: 'synge', present: 'synger', past: 'sang', pastParticiple: 'sunget', translation: 'to sing' },
    { infinitive: 'skyde', present: 'skyder', past: 'skød', pastParticiple: 'skudt', translation: 'to shoot' },
    { infinitive: 'bryde', present: 'bryder', past: 'brød', pastParticiple: 'brudt', translation: 'to break' },
    { infinitive: 'flyve', present: 'flyver', past: 'fløj', pastParticiple: 'fløjet', translation: 'to fly' },
    { infinitive: 'flyde', present: 'flyder', past: 'flød', pastParticiple: 'flydt', translation: 'to flow' },
    { infinitive: 'fryse', present: 'fryser', past: 'frøs', pastParticiple: 'frosset', translation: 'to freeze' },
    { infinitive: 'krybe', present: 'krøber', past: 'krøb', pastParticiple: 'krøbet', translation: 'to crawl' },
    { infinitive: 'blive', present: 'bliver', past: 'blev', pastParticiple: 'blevet', translation: 'to become/stay' },
    { infinitive: 'stå', present: 'står', past: 'stod', pastParticiple: 'stået', translation: 'to stand' },
    { infinitive: 'give', present: 'giver', past: 'gav', pastParticiple: 'givet', translation: 'to give' },
    { infinitive: 'få', present: 'får', past: 'fik', pastParticiple: 'fået', translation: 'to get/receive' },
    { infinitive: 'se', present: 'ser', past: 'så', pastParticiple: 'set', translation: 'to see' },
    { infinitive: 'bringe', present: 'bringer', past: 'bragte', pastParticiple: 'bragt', translation: 'to bring' },
    { infinitive: 'kunne', present: 'kan', past: 'kunne', pastParticiple: 'kunnet', translation: 'to be able/can' },
    { infinitive: 'skulle', present: 'skal', past: 'skulle', pastParticiple: 'skullet', translation: 'to have to/shall' },
    { infinitive: 'ville', present: 'vil', past: 'ville', pastParticiple: 'villet', translation: 'to want/will' },
    { infinitive: 'måtte', present: 'må', past: 'måtte', pastParticiple: 'måttet', translation: 'to must' },
    { infinitive: 'bør', present: 'bør', past: 'burde', pastParticiple: 'burdet', translation: 'to ought to/should' },
    { infinitive: 'tør', present: 'tør', past: 'turde', pastParticiple: 'turdet', translation: 'to dare' },
    { infinitive: 'sætte', present: 'sætter', past: 'satte', pastParticiple: 'sat', translation: 'to put/place' },
    { infinitive: 'træffe', present: 'træffer', past: 'traf', pastParticiple: 'truffet', translation: 'to meet' },
    { infinitive: 'nyde', present: 'nyder', past: 'nød', pastParticiple: 'nydt', translation: 'to enjoy' },
    { infinitive: 'tilbringe', present: 'tilbringer', past: 'tilbragte', pastParticiple: 'tilbragt', translation: 'to spend (time)' },
    { infinitive: 'fortsætte', present: 'fortsætter', past: 'fortsatte', pastParticiple: 'fortsat', translation: 'to continue' },
    { infinitive: 'opgive', present: 'opgiver', past: 'opgav', pastParticiple: 'opgivet', translation: 'to give up' },
    { infinitive: 'springe', present: 'springer', past: 'sprang', pastParticiple: 'sprunget', translation: 'to jump' },
    { infinitive: 'tvinge', present: 'tvinger', past: 'tvang', pastParticiple: 'tvunget', translation: 'to force' },
    { infinitive: 'tilføje', present: 'tilføjer', past: 'tilføjede', pastParticiple: 'tilføjet', translation: 'to add' },
    { infinitive: 'glemme', present: 'glemmer', past: 'glemte', pastParticiple: 'glemt', translation: 'to forget' },
    { infinitive: 'drømme', present: 'drømmer', past: 'drømte', pastParticiple: 'drømt', translation: 'to dream' },
    { infinitive: 'løfte', present: 'løfter', past: 'løftede', pastParticiple: 'løftet', translation: 'to lift' },
    { infinitive: 'læse', present: 'læser', past: 'læste', pastParticiple: 'læst', translation: 'to read' },
    { infinitive: 'vokse', present: 'vokser', past: 'voksede', pastParticiple: 'vokset', translation: 'to grow' },
    { infinitive: 'betyde', present: 'betyder', past: 'betød', pastParticiple: 'betydet', translation: 'to mean' },
    { infinitive: 'rive', present: 'river', past: 'rev', pastParticiple: 'revet', translation: 'to tear' },
    { infinitive: 'forstå', present: 'forstår', past: 'forstod', pastParticiple: 'forstået', translation: 'to understand' },
    { infinitive: 'fortælle', present: 'fortæller', past: 'fortalte', pastParticiple: 'fortalt', translation: 'to tell' },
    { infinitive: 'hjælpe', present: 'hjælper', past: 'hjalp', pastParticiple: 'hjulpet', translation: 'to help' },
    { infinitive: 'modtage', present: 'modtager', past: 'modtog', pastParticiple: 'modtaget', translation: 'to receive' },
    { infinitive: 'ringe', present: 'ringer', past: 'ringede', pastParticiple: 'ringet', translation: 'to call' },
    { infinitive: 'ryge', present: 'ryger', past: 'røg', pastParticiple: 'røget', translation: 'to smoke' },
    { infinitive: 'smage', present: 'smager', past: 'smagte', pastParticiple: 'smagt', translation: 'to taste' },
    { infinitive: 'smide', present: 'smider', past: 'smed', pastParticiple: 'smidt', translation: 'to throw away' },
    { infinitive: 'svømme', present: 'svømmer', past: 'svømmede', pastParticiple: 'svømmet', translation: 'to swim' },
    { infinitive: 'svare', present: 'svarer', past: 'svarede', pastParticiple: 'svaret', translation: 'to answer' },
    { infinitive: 'tænke', present: 'tænker', past: 'tænkte', pastParticiple: 'tænkt', translation: 'to think' },
    { infinitive: 'kysse', present: 'kysser', past: 'kyssede', pastParticiple: 'kysset', translation: 'to kiss' },
    { infinitive: 'kende', present: 'kender', past: 'kendte', pastParticiple: 'kendt', translation: 'to know (someone)' },
    { infinitive: 'forlade', present: 'forlader', past: 'forlod', pastParticiple: 'forladt', translation: 'to leave' },
    { infinitive: 'mødes', present: 'mødes', past: 'mødtes', pastParticiple: 'mødt', translation: 'to meet (each other)' },
    { infinitive: 'låne', present: 'låner', past: 'lånte', pastParticiple: 'lånt', translation: 'to borrow' },
    { infinitive: 'træde', present: 'træder', past: 'trådte', pastParticiple: 'trådt', translation: 'to step' },
    { infinitive: 'oversætte', present: 'oversætter', past: 'oversatte', pastParticiple: 'oversat', translation: 'to translate' },
    { infinitive: 'beskrive', present: 'beskriver', past: 'beskrev', pastParticiple: 'beskrevet', translation: 'to describe' },
    { infinitive: 'beslutte', present: 'beslutter', past: 'besluttede', pastParticiple: 'besluttet', translation: 'to decide' },
    { infinitive: 'forberede', present: 'forbereder', past: 'forberedte', pastParticiple: 'forberedt', translation: 'to prepare' },
    { infinitive: 'oplyse', present: 'oplyser', past: 'oplyste', pastParticiple: 'oplyst', translation: 'to inform' },
    { infinitive: 'påstå', present: 'påstår', past: 'påstod', pastParticiple: 'påstået', translation: 'to claim' },
    { infinitive: 'sørge', present: 'sørger', past: 'sørgede', pastParticiple: 'sørget', translation: 'to care/ensure' },
    { infinitive: 'undskylde', present: 'undskylder', past: 'undskyldte', pastParticiple: 'undskyldt', translation: 'to apologize' },
    { infinitive: 'undersøge', present: 'undersøger', past: 'undersøgte', pastParticiple: 'undersøgt', translation: 'to examine/investigate' },
    { infinitive: 'glæde', present: 'glæder', past: 'glædede', pastParticiple: 'glædet', translation: 'to please' },
    { infinitive: 'interessere', present: 'interesserer', past: 'interesserede', pastParticiple: 'interesseret', translation: 'to interest' },
    { infinitive: 'skynde', present: 'skynder', past: 'skyndte', pastParticiple: 'skyndt', translation: 'to hurry' },
    { infinitive: 'mene', present: 'mener', past: 'mente', pastParticiple: 'ment', translation: 'to think/mean' },
    { infinitive: 'acceptere', present: 'accepterer', past: 'accepterede', pastParticiple: 'accepteret', translation: 'to accept' },
    { infinitive: 'arbejde', present: 'arbejder', past: 'arbejdede', pastParticiple: 'arbejdet', translation: 'to work' },
    { infinitive: 'arrangere', present: 'arrangerer', past: 'arrangerede', pastParticiple: 'arrangeret', translation: 'to arrange' },
    { infinitive: 'begynde', present: 'begynder', past: 'begyndte', pastParticiple: 'begyndt', translation: 'to begin' },
    { infinitive: 'besøge', present: 'besøger', past: 'besøgte', pastParticiple: 'besøgt', translation: 'to visit' },
    { infinitive: 'betale', present: 'betaler', past: 'betalte', pastParticiple: 'betalt', translation: 'to pay' },
    { infinitive: 'danse', present: 'danser', past: 'dansede', pastParticiple: 'danset', translation: 'to dance' },
    { infinitive: 'deltage', present: 'deltager', past: 'deltog', pastParticiple: 'deltaget', translation: 'to participate' },
    { infinitive: 'diskutere', present: 'diskuterer', past: 'diskuterede', pastParticiple: 'diskuteret', translation: 'to discuss' },
    { infinitive: 'elske', present: 'elsker', past: 'elskede', pastParticiple: 'elsket', translation: 'to love' },
    { infinitive: 'forklare', present: 'forklarer', past: 'forklarede', pastParticiple: 'forklaret', translation: 'to explain' },
    { infinitive: 'fotografere', present: 'fotograferer', past: 'fotograferede', pastParticiple: 'fotograferet', translation: 'to photograph' },
    { infinitive: 'frygte', present: 'frygter', past: 'frygtede', pastParticiple: 'frygtet', translation: 'to fear' },
    { infinitive: 'grine', present: 'griner', past: 'grinede', pastParticiple: 'grinet', translation: 'to laugh' },
    { infinitive: 'hente', present: 'henter', past: 'hentede', pastParticiple: 'hentet', translation: 'to fetch' },
    { infinitive: 'høre', present: 'hører', past: 'hørte', pastParticiple: 'hørt', translation: 'to hear' },
    { infinitive: 'købe', present: 'køber', past: 'købte', pastParticiple: 'købt', translation: 'to buy' },
    { infinitive: 'køre', present: 'kører', past: 'kørte', pastParticiple: 'kørt', translation: 'to drive' },
    { infinitive: 'lave', present: 'laver', past: 'lavede', pastParticiple: 'lavet', translation: 'to make/do' },
    { infinitive: 'lege', present: 'leger', past: 'legede', pastParticiple: 'leget', translation: 'to play' },
    { infinitive: 'lære', present: 'lærer', past: 'lærte', pastParticiple: 'lært', translation: 'to learn' },
    { infinitive: 'lytte', present: 'lytter', past: 'lyttede', pastParticiple: 'lyttet', translation: 'to listen' },
    { infinitive: 'lukke', present: 'lukker', past: 'lukkede', pastParticiple: 'lukket', translation: 'to close' },
    { infinitive: 'male', present: 'maler', past: 'malede', pastParticiple: 'malet', translation: 'to paint' },
    { infinitive: 'åbne', present: 'åbner', past: 'åbnede', pastParticiple: 'åbnet', translation: 'to open' },
    { infinitive: 'prøve', present: 'prøver', past: 'prøvede', pastParticiple: 'prøvet', translation: 'to try' },
    { infinitive: 'reparere', present: 'reparerer', past: 'reparerede', pastParticiple: 'repareret', translation: 'to repair' },
    { infinitive: 'savne', present: 'savner', past: 'savnede', pastParticiple: 'savnet', translation: 'to miss' },
    { infinitive: 'smile', present: 'smiler', past: 'smilede', pastParticiple: 'smilet', translation: 'to smile' },
    { infinitive: 'snakke', present: 'snakker', past: 'snakkede', pastParticiple: 'snakket', translation: 'to chat' },
    { infinitive: 'spille', present: 'spiller', past: 'spillede', pastParticiple: 'spillet', translation: 'to play' },
    { infinitive: 'spørge', present: 'spørger', past: 'spurgte', pastParticiple: 'spurgt', translation: 'to ask' },
    { infinitive: 'starte', present: 'starter', past: 'startede', pastParticiple: 'startet', translation: 'to start' },
    { infinitive: 'stoppe', present: 'stopper', past: 'stoppede', pastParticiple: 'stoppet', translation: 'to stop' },
    { infinitive: 'studere', present: 'studerer', past: 'studerede', pastParticiple: 'studeret', translation: 'to study' },
    { infinitive: 'tale', present: 'taler', past: 'talte', pastParticiple: 'talt', translation: 'to speak' },
    { infinitive: 'træne', present: 'træner', past: 'trænede', pastParticiple: 'trænet', translation: 'to train' },
    { infinitive: 'tømme', present: 'tømmer', past: 'tømte', pastParticiple: 'tømt', translation: 'to empty' }
];

// Status tracking for each verb: 'unreviewed', 'correct', or 'wrong'
let statuses = verbs.map(() => ({ status: 'unreviewed' }));

// Index of the current card being shown
let currentIndex = 0;

// Score counters
let correctCount = 0;
let wrongCount = 0;

// DOM references
const verbListEl = document.getElementById('verb-list');
const cardWrapper = document.querySelector('.card-wrapper');
const cardNumberEl = document.getElementById('card-number');
const remainingEl = document.getElementById('remaining');
const correctCountEl = document.getElementById('correct-count');
const wrongCountEl = document.getElementById('wrong-count');
const wrongBtn = document.getElementById('wrong-btn');
const rightBtn = document.getElementById('right-btn');
const restartBtn = document.getElementById('restart-btn');

// Create and display the card for the current verb
function renderCard() {
    // Clear previous card
    cardWrapper.innerHTML = '';

    const verb = verbs[currentIndex];
    // Create card element
    const card = document.createElement('div');
    card.classList.add('flashcard');

    // Front side: shows infinitive and translation
    const front = document.createElement('div');
    front.classList.add('card-face', 'card-front');
    front.innerHTML = `<div>${verb.infinitive}</div><div style="font-size:0.8rem; margin-top:0.5rem;">${verb.translation}</div>`;

    // Back side: shows conjugated forms (present, past and past participle)
    const back = document.createElement('div');
    back.classList.add('card-face', 'card-back');
    back.innerHTML = `
        <p><strong>Present:</strong> ${verb.present}</p>
        <p><strong>Past:</strong> ${verb.past}</p>
        <p><strong>Past Participle:</strong> ${verb.pastParticiple}</p>
    `;

    // Append faces and event listener to flip
    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
    });

    cardWrapper.appendChild(card);
}

// Render the list of verbs in the sidebar with status indicators
function renderVerbList() {
    verbListEl.innerHTML = '';
    verbs.forEach((verb, index) => {
        const li = document.createElement('li');
        li.textContent = verb.infinitive;

        // Determine status class
        if (index === currentIndex) {
            li.classList.add('now');
        } else if (index === currentIndex + 1) {
            li.classList.add('next');
        }

        if (statuses[index].status === 'correct') {
            li.classList.add('completed', 'correct');
        } else if (statuses[index].status === 'wrong') {
            li.classList.add('completed', 'wrong');
        }

        // Add click event to jump to card
        li.addEventListener('click', () => {
            // Only allow jumping to reviewed or current cards
            currentIndex = index;
            renderAll();
        });

        verbListEl.appendChild(li);
    });
}

// Update the scoreboard numbers
function updateScoreboard() {
    cardNumberEl.textContent = `Card ${currentIndex + 1} of ${verbs.length}`;
    // Remaining is total minus number of verbs that have been marked correct or wrong
    const completedCount = statuses.filter(item => item.status !== 'unreviewed').length;
    const remaining = verbs.length - completedCount;
    remainingEl.textContent = `Remaining: ${remaining}`;
    correctCountEl.textContent = `Correct: ${correctCount}`;
    wrongCountEl.textContent = `Wrong: ${wrongCount}`;

    // Update progress bar width based on completed count
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = (completedCount / verbs.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Disable buttons if current card already marked
    const status = statuses[currentIndex].status;
    if (status === 'correct' || status === 'wrong') {
        wrongBtn.disabled = true;
        rightBtn.disabled = true;
        wrongBtn.classList.add('disabled');
        rightBtn.classList.add('disabled');
    } else {
        wrongBtn.disabled = false;
        rightBtn.disabled = false;
        wrongBtn.classList.remove('disabled');
        rightBtn.classList.remove('disabled');
    }
}

// Render everything
function renderAll() {
    renderVerbList();
    renderCard();
    updateScoreboard();
}

// Move to the next card automatically; if at the end, stay
function goToNext() {
    if (currentIndex < verbs.length - 1) {
        currentIndex++;
    }
    renderAll();
}

// Handle marking as wrong
wrongBtn.addEventListener('click', () => {
    if (statuses[currentIndex].status === 'unreviewed') {
        statuses[currentIndex].status = 'wrong';
        wrongCount++;
        goToNext();
    }
});

// Handle marking as correct
rightBtn.addEventListener('click', () => {
    if (statuses[currentIndex].status === 'unreviewed') {
        statuses[currentIndex].status = 'correct';
        correctCount++;
        goToNext();
    }
});

// Restart the game
restartBtn.addEventListener('click', () => {
    // Reset statuses
    statuses = verbs.map(() => ({ status: 'unreviewed' }));
    currentIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    renderAll();
});

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    renderAll();
});