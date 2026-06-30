// Dataset of Danish verbs with their conjugated forms, translations, and an
// example sentence (with English translation) showing the verb in use.
// This list contains exactly 150 of the most common Danish verbs.
const verbs = [
    { infinitive: 'være', present: 'er', past: 'var', pastParticiple: 'været', translation: 'to be', example: 'Hun er glad i dag.', exampleEn: 'She is happy today.' },
    { infinitive: 'have', present: 'har', past: 'havde', pastParticiple: 'haft', translation: 'to have', example: 'Jeg har en hund.', exampleEn: 'I have a dog.' },
    { infinitive: 'komme', present: 'kommer', past: 'kom', pastParticiple: 'kommet', translation: 'to come', example: 'Han kommer snart.', exampleEn: 'He is coming soon.' },
    { infinitive: 'gøre', present: 'gør', past: 'gjorde', pastParticiple: 'gjort', translation: 'to do/make', example: 'Hvad gør du nu?', exampleEn: 'What are you doing now?' },
    { infinitive: 'tage', present: 'tager', past: 'tog', pastParticiple: 'taget', translation: 'to take', example: 'Hun tager bussen til arbejde.', exampleEn: 'She takes the bus to work.' },
    { infinitive: 'sige', present: 'siger', past: 'sagde', pastParticiple: 'sagt', translation: 'to say', example: 'Han siger altid sandheden.', exampleEn: 'He always tells the truth.' },
    { infinitive: 'vide', present: 'ved', past: 'vidste', pastParticiple: 'vidst', translation: 'to know', example: 'Jeg ved ikke svaret.', exampleEn: "I don't know the answer." },
    { infinitive: 'lade', present: 'lader', past: 'lod', pastParticiple: 'ladet', translation: 'to let', example: 'Han lader mig låne bogen.', exampleEn: 'He lets me borrow the book.' },
    { infinitive: 'holde', present: 'holder', past: 'holdt', pastParticiple: 'holdt', translation: 'to hold', example: 'Hun holder hans hånd.', exampleEn: 'She holds his hand.' },
    { infinitive: 'hedde', present: 'hedder', past: 'hed', pastParticiple: 'heddet', translation: 'to be called', example: 'Hvad hedder du?', exampleEn: 'What is your name?' },
    { infinitive: 'gå', present: 'går', past: 'gik', pastParticiple: 'gået', translation: 'to go/walk', example: 'Vi går i skole hver dag.', exampleEn: 'We go to school every day.' },
    { infinitive: 'rejse', present: 'rejser', past: 'rejste', pastParticiple: 'rejst', translation: 'to travel', example: 'De rejser til Italien om sommeren.', exampleEn: 'They travel to Italy in the summer.' },
    { infinitive: 'bære', present: 'bærer', past: 'bar', pastParticiple: 'båret', translation: 'to carry', example: 'Han bærer en tung taske.', exampleEn: 'He carries a heavy bag.' },
    { infinitive: 'trække', present: 'trækker', past: 'trak', pastParticiple: 'trukket', translation: 'to pull/drag', example: 'Hun trækker vognen op ad bakken.', exampleEn: 'She pulls the cart up the hill.' },
    { infinitive: 'ligge', present: 'ligger', past: 'lå', pastParticiple: 'ligget', translation: 'to lie', example: 'Katten ligger på sofaen.', exampleEn: 'The cat is lying on the sofa.' },
    { infinitive: 'lægge', present: 'lægger', past: 'lagde', pastParticiple: 'lagt', translation: 'to lay/put', example: 'Jeg lægger bogen på bordet.', exampleEn: 'I put the book on the table.' },
    { infinitive: 'sidde', present: 'sidder', past: 'sad', pastParticiple: 'siddet', translation: 'to sit', example: 'Han sidder ved vinduet.', exampleEn: 'He sits by the window.' },
    { infinitive: 'slå', present: 'slår', past: 'slog', pastParticiple: 'slået', translation: 'to hit', example: 'Bølgerne slår mod klipperne.', exampleEn: 'The waves hit the rocks.' },
    { infinitive: 'falde', present: 'falder', past: 'faldt', pastParticiple: 'faldet', translation: 'to fall', example: 'Bladene falder om efteråret.', exampleEn: 'The leaves fall in autumn.' },
    { infinitive: 'spise', present: 'spiser', past: 'spiste', pastParticiple: 'spist', translation: 'to eat', example: 'Vi spiser morgenmad klokken syv.', exampleEn: 'We eat breakfast at seven o\'clock.' },
    { infinitive: 'sove', present: 'sover', past: 'sov', pastParticiple: 'sovet', translation: 'to sleep', example: 'Babyen sover hele natten.', exampleEn: 'The baby sleeps all night.' },
    { infinitive: 'stjæle', present: 'stjæler', past: 'stjal', pastParticiple: 'stjålet', translation: 'to steal', example: 'Tyven stjæler hendes cykel.', exampleEn: 'The thief steals her bicycle.' },
    { infinitive: 'græde', present: 'græder', past: 'græd', pastParticiple: 'grædt', translation: 'to cry', example: 'Barnet græder, fordi det er træt.', exampleEn: 'The child cries because it is tired.' },
    { infinitive: 'sælge', present: 'sælger', past: 'solgte', pastParticiple: 'solgt', translation: 'to sell', example: 'Han sælger grøntsager på markedet.', exampleEn: 'He sells vegetables at the market.' },
    { infinitive: 'vælge', present: 'vælger', past: 'valgte', pastParticiple: 'valgt', translation: 'to choose', example: 'Hun vælger den røde kjole.', exampleEn: 'She chooses the red dress.' },
    { infinitive: 'vænne', present: 'vænner', past: 'vænnede', pastParticiple: 'vænnet', translation: 'to accustom', example: 'Han vænner sig til det kolde vejr.', exampleEn: 'He gets used to the cold weather.' },
    { infinitive: 'binde', present: 'binder', past: 'bandt', pastParticiple: 'bundet', translation: 'to bind', example: 'Hun binder sit hår op.', exampleEn: 'She ties her hair up.' },
    { infinitive: 'brænde', present: 'brænder', past: 'brændte', pastParticiple: 'brændt', translation: 'to burn', example: 'Lyset brænder hele natten.', exampleEn: 'The candle burns all night.' },
    { infinitive: 'drikke', present: 'drikker', past: 'drak', pastParticiple: 'drukket', translation: 'to drink', example: 'Jeg drikker kaffe hver morgen.', exampleEn: 'I drink coffee every morning.' },
    { infinitive: 'finde', present: 'finder', past: 'fandt', pastParticiple: 'fundet', translation: 'to find', example: 'Han finder sine nøgler under sofaen.', exampleEn: 'He finds his keys under the sofa.' },
    { infinitive: 'forsvinde', present: 'forsvinder', past: 'forsvandt', pastParticiple: 'forsvundet', translation: 'to disappear', example: 'Solen forsvinder bag skyerne.', exampleEn: 'The sun disappears behind the clouds.' },
    { infinitive: 'løbe', present: 'løber', past: 'løb', pastParticiple: 'løbet', translation: 'to run', example: 'Hun løber en tur hver morgen.', exampleEn: 'She goes for a run every morning.' },
    { infinitive: 'slippe', present: 'slipper', past: 'slap', pastParticiple: 'sluppet', translation: 'to let go', example: 'Han slipper ballonen.', exampleEn: 'He lets go of the balloon.' },
    { infinitive: 'stikke', present: 'stikker', past: 'stak', pastParticiple: 'stukket', translation: 'to stick/pierce', example: 'Bien stikker ham i armen.', exampleEn: 'The bee stings him on the arm.' },
    { infinitive: 'vinde', present: 'vinder', past: 'vandt', pastParticiple: 'vundet', translation: 'to win', example: 'Vores hold vinder kampen.', exampleEn: 'Our team wins the match.' },
    { infinitive: 'bide', present: 'bider', past: 'bed', pastParticiple: 'bidt', translation: 'to bite', example: 'Hunden bider ikke fremmede.', exampleEn: "The dog doesn't bite strangers." },
    { infinitive: 'gribe', present: 'griber', past: 'greb', pastParticiple: 'grebet', translation: 'to grasp/catch', example: 'Han griber bolden med én hånd.', exampleEn: 'He catches the ball with one hand.' },
    { infinitive: 'lide', present: 'lider', past: 'led', pastParticiple: 'lidt', translation: 'to suffer', example: 'Patienten lider af hovedpine.', exampleEn: 'The patient suffers from a headache.' },
    { infinitive: 'ride', present: 'rider', past: 'red', pastParticiple: 'redet', translation: 'to ride', example: 'Hun rider på sin hest hver weekend.', exampleEn: 'She rides her horse every weekend.' },
    { infinitive: 'skinne', present: 'skinner', past: 'skinnede', pastParticiple: 'skinnet', translation: 'to shine', example: 'Solen skinner i dag.', exampleEn: 'The sun is shining today.' },
    { infinitive: 'skrive', present: 'skriver', past: 'skrev', pastParticiple: 'skrevet', translation: 'to write', example: 'Jeg skriver et brev til min ven.', exampleEn: 'I am writing a letter to my friend.' },
    { infinitive: 'slide', present: 'slider', past: 'sled', pastParticiple: 'slidt', translation: 'to wear out', example: 'Skoene slider hurtigt på asfalten.', exampleEn: 'The shoes wear out quickly on the asphalt.' },
    { infinitive: 'stige', present: 'stiger', past: 'steg', pastParticiple: 'steget', translation: 'to rise', example: 'Prisen stiger hver måned.', exampleEn: 'The price rises every month.' },
    { infinitive: 'tie', present: 'tier', past: 'tav', pastParticiple: 'tiet', translation: 'to be silent', example: 'Han tier, når hun taler.', exampleEn: 'He stays silent when she speaks.' },
    { infinitive: 'vride', present: 'vrider', past: 'vred', pastParticiple: 'vredet', translation: 'to twist/wring', example: 'Hun vrider vasketøjet.', exampleEn: 'She wrings the laundry.' },
    { infinitive: 'byde', present: 'byder', past: 'bød', pastParticiple: 'budt', translation: 'to offer/bid', example: 'Han byder på et gammelt maleri.', exampleEn: 'He bids on an old painting.' },
    { infinitive: 'lyve', present: 'lyver', past: 'løj', pastParticiple: 'løjet', translation: 'to lie', example: 'Han lyver, når det passer ham.', exampleEn: 'He lies when it suits him.' },
    { infinitive: 'synge', present: 'synger', past: 'sang', pastParticiple: 'sunget', translation: 'to sing', example: 'Børnene synger en sang.', exampleEn: 'The children are singing a song.' },
    { infinitive: 'skyde', present: 'skyder', past: 'skød', pastParticiple: 'skudt', translation: 'to shoot', example: 'Jægeren skyder ikke i naturreservatet.', exampleEn: "The hunter doesn't shoot in the nature reserve." },
    { infinitive: 'bryde', present: 'bryder', past: 'brød', pastParticiple: 'brudt', translation: 'to break', example: 'Bølgerne bryder mod stranden.', exampleEn: 'The waves break against the beach.' },
    { infinitive: 'flyve', present: 'flyver', past: 'fløj', pastParticiple: 'fløjet', translation: 'to fly', example: 'Flyet flyver højt over skyerne.', exampleEn: 'The plane flies high above the clouds.' },
    { infinitive: 'flyde', present: 'flyder', past: 'flød', pastParticiple: 'flydt', translation: 'to flow', example: 'Vandet flyder ned ad floden.', exampleEn: 'The water flows down the river.' },
    { infinitive: 'fryse', present: 'fryser', past: 'frøs', pastParticiple: 'frosset', translation: 'to freeze', example: 'Jeg fryser, når det er koldt udenfor.', exampleEn: "I freeze when it's cold outside." },
    { infinitive: 'krybe', present: 'kryber', past: 'krøb', pastParticiple: 'krøbet', translation: 'to crawl', example: 'Babyen kryber på gulvet.', exampleEn: 'The baby crawls on the floor.' },
    { infinitive: 'blive', present: 'bliver', past: 'blev', pastParticiple: 'blevet', translation: 'to become/stay', example: 'Hun bliver lærer efter uddannelsen.', exampleEn: 'She becomes a teacher after her education.' },
    { infinitive: 'stå', present: 'står', past: 'stod', pastParticiple: 'stået', translation: 'to stand', example: 'Han står ved døren.', exampleEn: 'He stands by the door.' },
    { infinitive: 'give', present: 'giver', past: 'gav', pastParticiple: 'givet', translation: 'to give', example: 'Jeg giver hende en gave.', exampleEn: 'I give her a present.' },
    { infinitive: 'få', present: 'får', past: 'fik', pastParticiple: 'fået', translation: 'to get/receive', example: 'Vi får post hver dag.', exampleEn: 'We get mail every day.' },
    { infinitive: 'se', present: 'ser', past: 'så', pastParticiple: 'set', translation: 'to see', example: 'Jeg ser en fugl i træet.', exampleEn: 'I see a bird in the tree.' },
    { infinitive: 'bringe', present: 'bringer', past: 'bragte', pastParticiple: 'bragt', translation: 'to bring', example: 'Han bringer blomster til hende.', exampleEn: 'He brings her flowers.' },
    { infinitive: 'kunne', present: 'kan', past: 'kunne', pastParticiple: 'kunnet', translation: 'to be able/can', example: 'Jeg kan tale dansk.', exampleEn: 'I can speak Danish.' },
    { infinitive: 'skulle', present: 'skal', past: 'skulle', pastParticiple: 'skullet', translation: 'to have to/shall', example: 'Vi skal mødes klokken fem.', exampleEn: "We're meeting at five o'clock." },
    { infinitive: 'ville', present: 'vil', past: 'ville', pastParticiple: 'villet', translation: 'to want/will', example: 'Hun vil rejse til Spanien.', exampleEn: 'She wants to travel to Spain.' },
    { infinitive: 'måtte', present: 'må', past: 'måtte', pastParticiple: 'måttet', translation: 'to must', example: 'Du må ikke ryge her.', exampleEn: 'You must not smoke here.' },
    { infinitive: 'burde', present: 'bør', past: 'burde', pastParticiple: 'burdet', translation: 'to ought to/should', example: 'Du bør spise flere grøntsager.', exampleEn: 'You should eat more vegetables.' },
    { infinitive: 'turde', present: 'tør', past: 'turde', pastParticiple: 'turdet', translation: 'to dare', example: 'Han tør ikke springe ud i vandet.', exampleEn: "He doesn't dare jump into the water." },
    { infinitive: 'sætte', present: 'sætter', past: 'satte', pastParticiple: 'sat', translation: 'to put/place', example: 'Hun sætter koppen på bordet.', exampleEn: 'She puts the cup on the table.' },
    { infinitive: 'træffe', present: 'træffer', past: 'traf', pastParticiple: 'truffet', translation: 'to meet', example: 'Jeg træffer ham ofte i kantinen.', exampleEn: 'I often meet him in the canteen.' },
    { infinitive: 'nyde', present: 'nyder', past: 'nød', pastParticiple: 'nydt', translation: 'to enjoy', example: 'Vi nyder solen på terrassen.', exampleEn: 'We enjoy the sun on the terrace.' },
    { infinitive: 'tilbringe', present: 'tilbringer', past: 'tilbragte', pastParticiple: 'tilbragt', translation: 'to spend (time)', example: 'De tilbringer sommeren ved kysten.', exampleEn: 'They spend the summer by the coast.' },
    { infinitive: 'fortsætte', present: 'fortsætter', past: 'fortsatte', pastParticiple: 'fortsat', translation: 'to continue', example: 'Hun fortsætter med at træne hver dag.', exampleEn: 'She continues to train every day.' },
    { infinitive: 'opgive', present: 'opgiver', past: 'opgav', pastParticiple: 'opgivet', translation: 'to give up', example: 'Han opgiver aldrig så let.', exampleEn: 'He never gives up so easily.' },
    { infinitive: 'springe', present: 'springer', past: 'sprang', pastParticiple: 'sprunget', translation: 'to jump', example: 'Børnene springer i vandpytterne.', exampleEn: 'The children jump in the puddles.' },
    { infinitive: 'tvinge', present: 'tvinger', past: 'tvang', pastParticiple: 'tvunget', translation: 'to force', example: 'Regnen tvinger os indenfor.', exampleEn: 'The rain forces us inside.' },
    { infinitive: 'tilføje', present: 'tilføjer', past: 'tilføjede', pastParticiple: 'tilføjet', translation: 'to add', example: 'Hun tilføjer salt til suppen.', exampleEn: 'She adds salt to the soup.' },
    { infinitive: 'glemme', present: 'glemmer', past: 'glemte', pastParticiple: 'glemt', translation: 'to forget', example: 'Jeg glemmer altid mine nøgler.', exampleEn: 'I always forget my keys.' },
    { infinitive: 'drømme', present: 'drømmer', past: 'drømte', pastParticiple: 'drømt', translation: 'to dream', example: 'Han drømmer om at blive pilot.', exampleEn: 'He dreams of becoming a pilot.' },
    { infinitive: 'løfte', present: 'løfter', past: 'løftede', pastParticiple: 'løftet', translation: 'to lift', example: 'Hun løfter den tunge kasse.', exampleEn: 'She lifts the heavy box.' },
    { infinitive: 'læse', present: 'læser', past: 'læste', pastParticiple: 'læst', translation: 'to read', example: 'Jeg læser en bog hver aften.', exampleEn: 'I read a book every evening.' },
    { infinitive: 'vokse', present: 'vokser', past: 'voksede', pastParticiple: 'vokset', translation: 'to grow', example: 'Planten vokser hurtigt i solen.', exampleEn: 'The plant grows quickly in the sun.' },
    { infinitive: 'betyde', present: 'betyder', past: 'betød', pastParticiple: 'betydet', translation: 'to mean', example: 'Ordet betyder noget helt andet.', exampleEn: 'The word means something completely different.' },
    { infinitive: 'rive', present: 'river', past: 'rev', pastParticiple: 'revet', translation: 'to tear', example: 'Hun river papiret i stykker.', exampleEn: 'She tears the paper into pieces.' },
    { infinitive: 'forstå', present: 'forstår', past: 'forstod', pastParticiple: 'forstået', translation: 'to understand', example: 'Jeg forstår ikke spørgsmålet.', exampleEn: "I don't understand the question." },
    { infinitive: 'fortælle', present: 'fortæller', past: 'fortalte', pastParticiple: 'fortalt', translation: 'to tell', example: 'Han fortæller en historie til børnene.', exampleEn: 'He tells the children a story.' },
    { infinitive: 'hjælpe', present: 'hjælper', past: 'hjalp', pastParticiple: 'hjulpet', translation: 'to help', example: 'Vi hjælper hinanden med opgaverne.', exampleEn: 'We help each other with the tasks.' },
    { infinitive: 'modtage', present: 'modtager', past: 'modtog', pastParticiple: 'modtaget', translation: 'to receive', example: 'Hun modtager en pakke i dag.', exampleEn: 'She receives a package today.' },
    { infinitive: 'ringe', present: 'ringer', past: 'ringede', pastParticiple: 'ringet', translation: 'to call', example: 'Jeg ringer til min mor hver søndag.', exampleEn: 'I call my mother every Sunday.' },
    { infinitive: 'ryge', present: 'ryger', past: 'røg', pastParticiple: 'røget', translation: 'to smoke', example: 'Han ryger ikke længere.', exampleEn: 'He no longer smokes.' },
    { infinitive: 'smage', present: 'smager', past: 'smagte', pastParticiple: 'smagt', translation: 'to taste', example: 'Kagen smager virkelig godt.', exampleEn: 'The cake tastes really good.' },
    { infinitive: 'smide', present: 'smider', past: 'smed', pastParticiple: 'smidt', translation: 'to throw away', example: 'Han smider skraldet ud.', exampleEn: 'He throws the trash out.' },
    { infinitive: 'svømme', present: 'svømmer', past: 'svømmede', pastParticiple: 'svømmet', translation: 'to swim', example: 'Vi svømmer i havet om sommeren.', exampleEn: 'We swim in the sea in the summer.' },
    { infinitive: 'svare', present: 'svarer', past: 'svarede', pastParticiple: 'svaret', translation: 'to answer', example: 'Hun svarer på alle spørgsmålene.', exampleEn: 'She answers all the questions.' },
    { infinitive: 'tænke', present: 'tænker', past: 'tænkte', pastParticiple: 'tænkt', translation: 'to think', example: 'Jeg tænker på dig hver dag.', exampleEn: 'I think of you every day.' },
    { infinitive: 'kysse', present: 'kysser', past: 'kyssede', pastParticiple: 'kysset', translation: 'to kiss', example: 'De kysser hinanden farvel.', exampleEn: 'They kiss each other goodbye.' },
    { infinitive: 'kende', present: 'kender', past: 'kendte', pastParticiple: 'kendt', translation: 'to know (someone)', example: 'Jeg kender ham fra skolen.', exampleEn: 'I know him from school.' },
    { infinitive: 'forlade', present: 'forlader', past: 'forlod', pastParticiple: 'forladt', translation: 'to leave', example: 'Hun forlader huset klokken otte.', exampleEn: 'She leaves the house at eight o\'clock.' },
    { infinitive: 'mødes', present: 'mødes', past: 'mødtes', pastParticiple: 'mødt', translation: 'to meet (each other)', example: 'Vi mødes på caféen kl. tre.', exampleEn: 'We meet at the café at 3 o\'clock.' },
    { infinitive: 'låne', present: 'låner', past: 'lånte', pastParticiple: 'lånt', translation: 'to borrow', example: 'Jeg låner en bog fra biblioteket.', exampleEn: 'I borrow a book from the library.' },
    { infinitive: 'træde', present: 'træder', past: 'trådte', pastParticiple: 'trådt', translation: 'to step', example: 'Han træder ud af bilen.', exampleEn: 'He steps out of the car.' },
    { infinitive: 'oversætte', present: 'oversætter', past: 'oversatte', pastParticiple: 'oversat', translation: 'to translate', example: 'Hun oversætter teksten til engelsk.', exampleEn: 'She translates the text into English.' },
    { infinitive: 'beskrive', present: 'beskriver', past: 'beskrev', pastParticiple: 'beskrevet', translation: 'to describe', example: 'Han beskriver sin rejse i detaljer.', exampleEn: 'He describes his trip in detail.' },
    { infinitive: 'beslutte', present: 'beslutter', past: 'besluttede', pastParticiple: 'besluttet', translation: 'to decide', example: 'Vi beslutter os for at blive hjemme.', exampleEn: 'We decide to stay home.' },
    { infinitive: 'forberede', present: 'forbereder', past: 'forberedte', pastParticiple: 'forberedt', translation: 'to prepare', example: 'Hun forbereder middagen i køkkenet.', exampleEn: 'She prepares dinner in the kitchen.' },
    { infinitive: 'oplyse', present: 'oplyser', past: 'oplyste', pastParticiple: 'oplyst', translation: 'to inform', example: 'Skolen oplyser forældrene om ændringen.', exampleEn: 'The school informs the parents about the change.' },
    { infinitive: 'påstå', present: 'påstår', past: 'påstod', pastParticiple: 'påstået', translation: 'to claim', example: 'Han påstår, at han har ret.', exampleEn: 'He claims that he is right.' },
    { infinitive: 'sørge', present: 'sørger', past: 'sørgede', pastParticiple: 'sørget', translation: 'to care/ensure', example: 'Hun sørger for, at alt er klar.', exampleEn: 'She makes sure everything is ready.' },
    { infinitive: 'undskylde', present: 'undskylder', past: 'undskyldte', pastParticiple: 'undskyldt', translation: 'to apologize', example: 'Han undskylder for at komme sent.', exampleEn: 'He apologizes for being late.' },
    { infinitive: 'undersøge', present: 'undersøger', past: 'undersøgte', pastParticiple: 'undersøgt', translation: 'to examine/investigate', example: 'Lægen undersøger patienten.', exampleEn: 'The doctor examines the patient.' },
    { infinitive: 'glæde', present: 'glæder', past: 'glædede', pastParticiple: 'glædet', translation: 'to please', example: 'Det glæder mig at se dig.', exampleEn: 'It pleases me to see you.' },
    { infinitive: 'interessere', present: 'interesserer', past: 'interesserede', pastParticiple: 'interesseret', translation: 'to interest', example: 'Musik interesserer hende meget.', exampleEn: 'Music interests her a lot.' },
    { infinitive: 'skynde', present: 'skynder', past: 'skyndte', pastParticiple: 'skyndt', translation: 'to hurry', example: 'Vi skynder os til toget.', exampleEn: 'We hurry to the train.' },
    { infinitive: 'mene', present: 'mener', past: 'mente', pastParticiple: 'ment', translation: 'to think/mean', example: 'Jeg mener, det er en god idé.', exampleEn: "I think it's a good idea." },
    { infinitive: 'acceptere', present: 'accepterer', past: 'accepterede', pastParticiple: 'accepteret', translation: 'to accept', example: 'Han accepterer tilbuddet.', exampleEn: 'He accepts the offer.' },
    { infinitive: 'arbejde', present: 'arbejder', past: 'arbejdede', pastParticiple: 'arbejdet', translation: 'to work', example: 'Hun arbejder på et hospital.', exampleEn: 'She works at a hospital.' },
    { infinitive: 'arrangere', present: 'arrangerer', past: 'arrangerede', pastParticiple: 'arrangeret', translation: 'to arrange', example: 'De arrangerer en fest for ham.', exampleEn: 'They arrange a party for him.' },
    { infinitive: 'begynde', present: 'begynder', past: 'begyndte', pastParticiple: 'begyndt', translation: 'to begin', example: 'Filmen begynder klokken otte.', exampleEn: "The movie begins at eight o'clock." },
    { infinitive: 'besøge', present: 'besøger', past: 'besøgte', pastParticiple: 'besøgt', translation: 'to visit', example: 'Vi besøger vores bedsteforældre i weekenden.', exampleEn: 'We visit our grandparents on the weekend.' },
    { infinitive: 'betale', present: 'betaler', past: 'betalte', pastParticiple: 'betalt', translation: 'to pay', example: 'Han betaler regningen online.', exampleEn: 'He pays the bill online.' },
    { infinitive: 'danse', present: 'danser', past: 'dansede', pastParticiple: 'danset', translation: 'to dance', example: 'De danser hele natten.', exampleEn: 'They dance all night.' },
    { infinitive: 'deltage', present: 'deltager', past: 'deltog', pastParticiple: 'deltaget', translation: 'to participate', example: 'Hun deltager i konkurrencen.', exampleEn: 'She participates in the competition.' },
    { infinitive: 'diskutere', present: 'diskuterer', past: 'diskuterede', pastParticiple: 'diskuteret', translation: 'to discuss', example: 'Vi diskuterer planerne for ferien.', exampleEn: 'We discuss the plans for the vacation.' },
    { infinitive: 'elske', present: 'elsker', past: 'elskede', pastParticiple: 'elsket', translation: 'to love', example: 'Jeg elsker dig.', exampleEn: 'I love you.' },
    { infinitive: 'forklare', present: 'forklarer', past: 'forklarede', pastParticiple: 'forklaret', translation: 'to explain', example: 'Læreren forklarer reglen igen.', exampleEn: 'The teacher explains the rule again.' },
    { infinitive: 'fotografere', present: 'fotograferer', past: 'fotograferede', pastParticiple: 'fotograferet', translation: 'to photograph', example: 'Han fotograferer solnedgangen.', exampleEn: 'He photographs the sunset.' },
    { infinitive: 'frygte', present: 'frygter', past: 'frygtede', pastParticiple: 'frygtet', translation: 'to fear', example: 'Hun frygter mørket.', exampleEn: 'She fears the dark.' },
    { infinitive: 'grine', present: 'griner', past: 'grinede', pastParticiple: 'grinet', translation: 'to laugh', example: 'Vi griner af den sjove vittighed.', exampleEn: 'We laugh at the funny joke.' },
    { infinitive: 'hente', present: 'henter', past: 'hentede', pastParticiple: 'hentet', translation: 'to fetch', example: 'Jeg henter børnene fra skole.', exampleEn: 'I pick up the children from school.' },
    { infinitive: 'høre', present: 'hører', past: 'hørte', pastParticiple: 'hørt', translation: 'to hear', example: 'Hører du musikken?', exampleEn: 'Do you hear the music?' },
    { infinitive: 'købe', present: 'køber', past: 'købte', pastParticiple: 'købt', translation: 'to buy', example: 'Hun køber mælk i butikken.', exampleEn: 'She buys milk at the store.' },
    { infinitive: 'køre', present: 'kører', past: 'kørte', pastParticiple: 'kørt', translation: 'to drive', example: 'Han kører til arbejde hver dag.', exampleEn: 'He drives to work every day.' },
    { infinitive: 'lave', present: 'laver', past: 'lavede', pastParticiple: 'lavet', translation: 'to make/do', example: 'Vi laver mad sammen i aften.', exampleEn: 'We are making food together tonight.' },
    { infinitive: 'lege', present: 'leger', past: 'legede', pastParticiple: 'leget', translation: 'to play', example: 'Børnene leger i parken.', exampleEn: 'The children play in the park.' },
    { infinitive: 'lære', present: 'lærer', past: 'lærte', pastParticiple: 'lært', translation: 'to learn', example: 'Jeg lærer dansk hver dag.', exampleEn: 'I learn Danish every day.' },
    { infinitive: 'lytte', present: 'lytter', past: 'lyttede', pastParticiple: 'lyttet', translation: 'to listen', example: 'Hun lytter til radioen.', exampleEn: 'She listens to the radio.' },
    { infinitive: 'lukke', present: 'lukker', past: 'lukkede', pastParticiple: 'lukket', translation: 'to close', example: 'Butikken lukker klokken seks.', exampleEn: "The store closes at six o'clock." },
    { infinitive: 'male', present: 'maler', past: 'malede', pastParticiple: 'malet', translation: 'to paint', example: 'Han maler et billede af søen.', exampleEn: 'He paints a picture of the lake.' },
    { infinitive: 'åbne', present: 'åbner', past: 'åbnede', pastParticiple: 'åbnet', translation: 'to open', example: 'Hun åbner vinduet for frisk luft.', exampleEn: 'She opens the window for fresh air.' },
    { infinitive: 'prøve', present: 'prøver', past: 'prøvede', pastParticiple: 'prøvet', translation: 'to try', example: 'Jeg prøver en ny opskrift.', exampleEn: 'I am trying a new recipe.' },
    { infinitive: 'reparere', present: 'reparerer', past: 'reparerede', pastParticiple: 'repareret', translation: 'to repair', example: 'Han reparerer cyklen i garagen.', exampleEn: 'He repairs the bike in the garage.' },
    { infinitive: 'savne', present: 'savner', past: 'savnede', pastParticiple: 'savnet', translation: 'to miss', example: 'Jeg savner mine venner.', exampleEn: 'I miss my friends.' },
    { infinitive: 'smile', present: 'smiler', past: 'smilede', pastParticiple: 'smilet', translation: 'to smile', example: 'Hun smiler, når hun ser ham.', exampleEn: 'She smiles when she sees him.' },
    { infinitive: 'snakke', present: 'snakker', past: 'snakkede', pastParticiple: 'snakket', translation: 'to chat', example: 'Vi snakker om gamle dage.', exampleEn: 'We chat about old times.' },
    { infinitive: 'spille', present: 'spiller', past: 'spillede', pastParticiple: 'spillet', translation: 'to play', example: 'Han spiller fodbold om søndagene.', exampleEn: 'He plays football on Sundays.' },
    { infinitive: 'spørge', present: 'spørger', past: 'spurgte', pastParticiple: 'spurgt', translation: 'to ask', example: 'Hun spørger om vejen til stationen.', exampleEn: 'She asks for directions to the station.' },
    { infinitive: 'starte', present: 'starter', past: 'startede', pastParticiple: 'startet', translation: 'to start', example: 'Mødet starter om ti minutter.', exampleEn: 'The meeting starts in ten minutes.' },
    { infinitive: 'stoppe', present: 'stopper', past: 'stoppede', pastParticiple: 'stoppet', translation: 'to stop', example: 'Bussen stopper ved hjørnet.', exampleEn: 'The bus stops at the corner.' },
    { infinitive: 'studere', present: 'studerer', past: 'studerede', pastParticiple: 'studeret', translation: 'to study', example: 'Hun studerer medicin på universitetet.', exampleEn: 'She studies medicine at university.' },
    { infinitive: 'tale', present: 'taler', past: 'talte', pastParticiple: 'talt', translation: 'to speak', example: 'Vi taler dansk i klassen.', exampleEn: 'We speak Danish in class.' },
    { infinitive: 'træne', present: 'træner', past: 'trænede', pastParticiple: 'trænet', translation: 'to train', example: 'Han træner i fitnesscentret hver morgen.', exampleEn: 'He trains at the gym every morning.' },
    { infinitive: 'tømme', present: 'tømmer', past: 'tømte', pastParticiple: 'tømt', translation: 'to empty', example: 'Hun tømmer skraldespanden.', exampleEn: 'She empties the trash can.' }
];

// Status tracking for each verb: 'unreviewed', 'correct', or 'wrong'
let statuses = verbs.map(() => ({ status: 'unreviewed' }));

// Index of the current card being shown
let currentIndex = 0;

// Score counters
let correctCount = 0;
let wrongCount = 0;

/* ---------- PROGRESS (localStorage) ---------- */
const LS_KEY = 'verb_glosekort_v1';

// Build a fresh, default progress object matching the current deck size
function defaultProgress() {
    return {
        currentIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        statuses: verbs.map(() => ({ status: 'unreviewed' }))
    };
}

// Load saved progress from localStorage, falling back to defaults on any
// missing/invalid data or if storage is unavailable (e.g. private browsing).
function loadProgress() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return defaultProgress();
        const data = JSON.parse(raw);
        if (
            !data ||
            !Array.isArray(data.statuses) ||
            data.statuses.length !== verbs.length ||
            typeof data.currentIndex !== 'number'
        ) {
            return defaultProgress();
        }
        return data;
    } catch (e) {
        return defaultProgress();
    }
}

// Persist the current game state to localStorage
function saveProgress() {
    try {
        const data = {
            currentIndex: currentIndex,
            correctCount: correctCount,
            wrongCount: wrongCount,
            statuses: statuses
        };
        localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (e) {
        // Storage blocked (e.g. private browsing) - silently ignore.
    }
}

/* ---------- SPEECH SYNTHESIS (Danish) ---------- */
let voices = [];
function refreshVoices(){
    if(!('speechSynthesis' in window)) return;
    voices = speechSynthesis.getVoices();
}
function danishVoice(){
    return voices.find(v=>/da(-|_)?DK/i.test(v.lang)) || voices.find(v=>/^da/i.test(v.lang)) || null;
}
if('speechSynthesis' in window){
    speechSynthesis.onvoiceschanged = refreshVoices;
    refreshVoices();
}
function speak(text){
    if(!('speechSynthesis' in window) || !text) return;
    try{
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "da-DK";
        const v = danishVoice();
        if(v) u.voice = v;
        u.rate = 0.95;
        speechSynthesis.speak(u);
    }catch(e){/* ignore */}
}
function speakerBtn(text, cls){
    const b = document.createElement("button");
    b.className = "speaker " + (cls||"");
    b.type = "button";
    b.textContent = "🔊";
    b.setAttribute("aria-label","Pronounce");
    b.addEventListener("click", e=>{ e.stopPropagation(); speak(text); });
    return b;
}

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
    front.innerHTML = `<div class="infinitive-row"><span>${verb.infinitive}</span></div><div style="font-size:0.8rem; margin-top:0.5rem;">${verb.translation}</div>`;
    front.querySelector('.infinitive-row').appendChild(speakerBtn(verb.infinitive, 'speaker-front'));

    // Back side: shows conjugated forms plus an example sentence in context
    const back = document.createElement('div');
    back.classList.add('card-face', 'card-back');
    back.innerHTML = `
        <p><strong>Present:</strong> ${verb.present}</p>
        <p><strong>Past:</strong> ${verb.past}</p>
        <p><strong>Past Participle:</strong> ${verb.pastParticiple}</p>
        <p class="example example-row">"${verb.example}"</p>
        <p class="example-en">${verb.exampleEn}</p>
    `;
    back.querySelector('.example-row').appendChild(speakerBtn(verb.example, 'speaker-back'));

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
        saveProgress();
        goToNext();
    }
});

// Handle marking as correct
rightBtn.addEventListener('click', () => {
    if (statuses[currentIndex].status === 'unreviewed') {
        statuses[currentIndex].status = 'correct';
        correctCount++;
        saveProgress();
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
    saveProgress();
    renderAll();
});

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    // Restore any saved progress before the first render so the sidebar's
    // now/next/completed classes and the scoreboard reflect where the user
    // left off. Falls back to a fresh game if nothing was saved or storage
    // is unavailable.
    const saved = loadProgress();
    statuses = saved.statuses;
    currentIndex = saved.currentIndex;
    correctCount = saved.correctCount;
    wrongCount = saved.wrongCount;

    renderAll();
});
