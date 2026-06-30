// Dataset of Danish verbs with their conjugated forms, translations, and an
// example sentence (with English translation) showing the verb in use.
// This list contains exactly 150 of the most common Danish verbs.
const verbs = [
    { infinitive: 'være', present: 'er', past: 'var', pastParticiple: 'været', translation: 'to be', example: 'Hun er glad i dag.', exampleEn: 'She is happy today.', cefr: 'A1', note: 'The most fundamental Danish verb; "er" is both present tense and the copula used in all definitional sentences.' },
    { infinitive: 'have', present: 'har', past: 'havde', pastParticiple: 'haft', translation: 'to have', example: 'Jeg har en hund.', exampleEn: 'I have a dog.', cefr: 'A1', note: 'Core auxiliary verb; "har" forms the present perfect with past participles (e.g. "jeg har spist").' },
    { infinitive: 'komme', present: 'kommer', past: 'kom', pastParticiple: 'kommet', translation: 'to come', example: 'Han kommer snart.', exampleEn: 'He is coming soon.', cefr: 'A1', note: 'Irregular strong verb: present "kommer," past "kom" (vowel shift o→o, short form). Also used in "komme fra" (to come from).' },
    { infinitive: 'gøre', present: 'gør', past: 'gjorde', pastParticiple: 'gjort', translation: 'to do/make', example: 'Hvad gør du nu?', exampleEn: 'What are you doing now?', cefr: 'A1', note: 'Irregular verb; past "gjorde" does not follow the regular -ede pattern. Distinct from "lave" (make/cook) in everyday speech.' },
    { infinitive: 'tage', present: 'tager', past: 'tog', pastParticiple: 'taget', translation: 'to take', example: 'Hun tager bussen til arbejde.', exampleEn: 'She takes the bus to work.', cefr: 'A1', note: 'Irregular strong verb: past "tog" (vowel change a→o). Widely used in fixed phrases like "tage en beslutning" (make a decision).' },
    { infinitive: 'sige', present: 'siger', past: 'sagde', pastParticiple: 'sagt', translation: 'to say', example: 'Han siger altid sandheden.', exampleEn: 'He always tells the truth.', cefr: 'A1', note: 'Irregular: present "siger," past "sagde," past participle "sagt." The past participle drops the -de ending entirely.' },
    { infinitive: 'vide', present: 'ved', past: 'vidste', pastParticiple: 'vidst', translation: 'to know', example: 'Jeg ved ikke svaret.', exampleEn: "I don't know the answer.", cefr: 'A1', note: 'Preterite-present verb: present "ved" has a strong-verb form even though the infinitive looks weak. Refers to knowing facts, not people.' },
    { infinitive: 'lade', present: 'lader', past: 'lod', pastParticiple: 'ladet', translation: 'to let', example: 'Han lader mig låne bogen.', exampleEn: 'He lets me borrow the book.', cefr: 'A2', note: 'Irregular strong verb: past "lod" (vowel shift a→o). Common in "lade være med" (to refrain from doing something).' },
    { infinitive: 'holde', present: 'holder', past: 'holdt', pastParticiple: 'holdt', translation: 'to hold', example: 'Hun holder hans hånd.', exampleEn: 'She holds his hand.', cefr: 'A2', note: 'Irregular: past and past participle both "holdt" (consonant cluster ending). Used in many compounds like "holde op" (stop) and "holde ferie" (be on holiday).' },
    { infinitive: 'hedde', present: 'hedder', past: 'hed', pastParticiple: 'heddet', translation: 'to be called', example: 'Hvad hedder du?', exampleEn: 'What is your name?', cefr: 'A1', note: 'Strong verb used exclusively for names; past "hed" (vowel change e→e, but shorter). "Hvad hedder du?" is the standard way to ask someone\'s name.' },
    { infinitive: 'gå', present: 'går', past: 'gik', pastParticiple: 'gået', translation: 'to go/walk', example: 'Vi går i skole hver dag.', exampleEn: 'We go to school every day.', cefr: 'A1', note: 'Irregular strong verb: past "gik" (unexpected vowel form). "Gå i skole" means to attend school, while "gå til skole" means to walk there.' },
    { infinitive: 'rejse', present: 'rejser', past: 'rejste', pastParticiple: 'rejst', translation: 'to travel', example: 'De rejser til Italien om sommeren.', exampleEn: 'They travel to Italy in the summer.', cefr: 'A2', note: 'Regular weak verb (-te/-t endings). Also means "to leave/depart" in certain contexts, e.g. "toget rejser kl. 8."' },
    { infinitive: 'bære', present: 'bærer', past: 'bar', pastParticiple: 'båret', translation: 'to carry', example: 'Han bærer en tung taske.', exampleEn: 'He carries a heavy bag.', cefr: 'B1', note: 'Irregular strong verb: stem vowel shifts æ→a→å across tenses. Also used for wearing clothing (e.g. "bære en hat").' },
    { infinitive: 'trække', present: 'trækker', past: 'trak', pastParticiple: 'trukket', translation: 'to pull/drag', example: 'Hun trækker vognen op ad bakken.', exampleEn: 'She pulls the cart up the hill.', cefr: 'B1', note: 'Irregular strong verb: æ→a→u vowel shift across tenses. "Trække vejret" means "to breathe."' },
    { infinitive: 'ligge', present: 'ligger', past: 'lå', pastParticiple: 'ligget', translation: 'to lie', example: 'Katten ligger på sofaen.', exampleEn: 'The cat is lying on the sofa.', cefr: 'A2', note: 'Irregular strong verb: past "lå" (major vowel contraction). Do not confuse with "lægge" (to lay/place something).' },
    { infinitive: 'lægge', present: 'lægger', past: 'lagde', pastParticiple: 'lagt', translation: 'to lay/put', example: 'Jeg lægger bogen på bordet.', exampleEn: 'I put the book on the table.', cefr: 'A2', note: 'Irregular: past "lagde," past participle "lagt." Transitive counterpart to "ligge" (intransitive); the distinction matters in Danish grammar.' },
    { infinitive: 'sidde', present: 'sidder', past: 'sad', pastParticiple: 'siddet', translation: 'to sit', example: 'Han sidder ved vinduet.', exampleEn: 'He sits by the window.', cefr: 'A2', note: 'Irregular strong verb: past "sad" (vowel shift i→a). Always intransitive; you cannot "sidde" an object.' },
    { infinitive: 'slå', present: 'slår', past: 'slog', pastParticiple: 'slået', translation: 'to hit', example: 'Bølgerne slår mod klipperne.', exampleEn: 'The waves hit the rocks.', cefr: 'B1', note: 'Irregular strong verb: past "slog" (vowel shift å→o). Used in idioms like "slå op" (look up) and "slå til" (go for it).' },
    { infinitive: 'falde', present: 'falder', past: 'faldt', pastParticiple: 'faldet', translation: 'to fall', example: 'Bladene falder om efteråret.', exampleEn: 'The leaves fall in autumn.', cefr: 'A2', note: 'Irregular: past "faldt" (consonant cluster, not a regular -ede ending). Common in "falde i søvn" (fall asleep).' },
    { infinitive: 'spise', present: 'spiser', past: 'spiste', pastParticiple: 'spist', translation: 'to eat', example: 'Vi spiser morgenmad klokken syv.', exampleEn: 'We eat breakfast at seven o\'clock.', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). Essential vocabulary; "spise middag" means to have dinner.' },
    { infinitive: 'sove', present: 'sover', past: 'sov', pastParticiple: 'sovet', translation: 'to sleep', example: 'Babyen sover hele natten.', exampleEn: 'The baby sleeps all night.', cefr: 'A1', note: 'Irregular strong verb: past "sov" (vowel shift o→o, shortened). "Sove godt" (sleep well) is a common fixed expression.' },
    { infinitive: 'stjæle', present: 'stjæler', past: 'stjal', pastParticiple: 'stjålet', translation: 'to steal', example: 'Tyven stjæler hendes cykel.', exampleEn: 'The thief steals her bicycle.', cefr: 'B1', note: 'Irregular strong verb: stem vowel shifts æ→a→å across tenses, similar to "bære."' },
    { infinitive: 'græde', present: 'græder', past: 'græd', pastParticiple: 'grædt', translation: 'to cry', example: 'Barnet græder, fordi det er træt.', exampleEn: 'The child cries because it is tired.', cefr: 'A2', note: 'Irregular strong verb: past "græd" (vowel shortening without a separate ending). Common in emotional contexts.' },
    { infinitive: 'sælge', present: 'sælger', past: 'solgte', pastParticiple: 'solgt', translation: 'to sell', example: 'Han sælger grøntsager på markedet.', exampleEn: 'He sells vegetables at the market.', cefr: 'A2', note: 'Irregular: stem vowel shifts æ→o in past and past participle ("solgte/solgt"). Antonym: "købe" (to buy).' },
    { infinitive: 'vælge', present: 'vælger', past: 'valgte', pastParticiple: 'valgt', translation: 'to choose', example: 'Hun vælger den røde kjole.', exampleEn: 'She chooses the red dress.', cefr: 'A2', note: 'Irregular: stem vowel shifts æ→a in past and past participle ("valgte/valgt"). Often followed by "at + infinitive."' },
    { infinitive: 'vænne', present: 'vænner', past: 'vænnede', pastParticiple: 'vænnet', translation: 'to accustom', example: 'Han vænner sig til det kolde vejr.', exampleEn: 'He gets used to the cold weather.', cefr: 'B1', note: 'Regular weak verb; almost always used reflexively with "sig" — "vænne sig til" means "to get used to."' },
    { infinitive: 'binde', present: 'binder', past: 'bandt', pastParticiple: 'bundet', translation: 'to bind', example: 'Hun binder sit hår op.', exampleEn: 'She ties her hair up.', cefr: 'B1', note: 'Irregular strong verb: i→a→u vowel shift across tenses. "Binde op" means to tie up, and "binde an" means to pick a fight.' },
    { infinitive: 'brænde', present: 'brænder', past: 'brændte', pastParticiple: 'brændt', translation: 'to burn', example: 'Lyset brænder hele natten.', exampleEn: 'The candle burns all night.', cefr: 'B1', note: 'Regular weak verb (-te/-t endings). Can be intransitive (the candle burns) or transitive (burn something down).' },
    { infinitive: 'drikke', present: 'drikker', past: 'drak', pastParticiple: 'drukket', translation: 'to drink', example: 'Jeg drikker kaffe hver morgen.', exampleEn: 'I drink coffee every morning.', cefr: 'A1', note: 'Irregular strong verb: i→a→u vowel shift across tenses (the classic i-a-u pattern shared with "binde," "finde," "vinde").' },
    { infinitive: 'finde', present: 'finder', past: 'fandt', pastParticiple: 'fundet', translation: 'to find', example: 'Han finder sine nøgler under sofaen.', exampleEn: 'He finds his keys under the sofa.', cefr: 'A1', note: 'Irregular strong verb: i→a→u vowel shift. "Finde på" means "to come up with/invent."' },
    { infinitive: 'forsvinde', present: 'forsvinder', past: 'forsvandt', pastParticiple: 'forsvundet', translation: 'to disappear', example: 'Solen forsvinder bag skyerne.', exampleEn: 'The sun disappears behind the clouds.', cefr: 'A2', note: 'Prefix compound of "svinde" (to dwindle); follows the same i→a→u strong-verb pattern as "finde."' },
    { infinitive: 'løbe', present: 'løber', past: 'løb', pastParticiple: 'løbet', translation: 'to run', example: 'Hun løber en tur hver morgen.', exampleEn: 'She goes for a run every morning.', cefr: 'A2', note: 'Irregular strong verb: past "løb" (same form as present minus -er). "Løbe en tur" means "to go for a run."' },
    { infinitive: 'slippe', present: 'slipper', past: 'slap', pastParticiple: 'sluppet', translation: 'to let go', example: 'Han slipper ballonen.', exampleEn: 'He lets go of the balloon.', cefr: 'B1', note: 'Irregular strong verb: i→a→u vowel shift. "Slippe af sted med" means "to get away with something."' },
    { infinitive: 'stikke', present: 'stikker', past: 'stak', pastParticiple: 'stukket', translation: 'to stick/pierce', example: 'Bien stikker ham i armen.', exampleEn: 'The bee stings him on the arm.', cefr: 'B1', note: 'Irregular strong verb: i→a→u vowel shift. "Stikke af" (to run off) and "stikke ud" (to stand out) are common phrasal uses.' },
    { infinitive: 'vinde', present: 'vinder', past: 'vandt', pastParticiple: 'vundet', translation: 'to win', example: 'Vores hold vinder kampen.', exampleEn: 'Our team wins the match.', cefr: 'A2', note: 'Irregular strong verb: i→a→u vowel shift. Antonym is "tabe" (to lose); "vinde over" means to beat someone.' },
    { infinitive: 'bide', present: 'bider', past: 'bed', pastParticiple: 'bidt', translation: 'to bite', example: 'Hunden bider ikke fremmede.', exampleEn: "The dog doesn't bite strangers.", cefr: 'B1', note: 'Irregular strong verb: past "bed" (vowel shift i→e). "Bide mærke i" means "to take note of."' },
    { infinitive: 'gribe', present: 'griber', past: 'greb', pastParticiple: 'grebet', translation: 'to grasp/catch', example: 'Han griber bolden med én hånd.', exampleEn: 'He catches the ball with one hand.', cefr: 'B1', note: 'Irregular strong verb: past "greb" (vowel shift i→e). "Gribe ind" means "to intervene."' },
    { infinitive: 'lide', present: 'lider', past: 'led', pastParticiple: 'lidt', translation: 'to suffer', example: 'Patienten lider af hovedpine.', exampleEn: 'The patient suffers from a headache.', cefr: 'B1', note: 'Irregular strong verb: past "led" (vowel shift i→e). "Lide af" means "to suffer from"; do not confuse with "at lide" (to like) in regional/older use.' },
    { infinitive: 'ride', present: 'rider', past: 'red', pastParticiple: 'redet', translation: 'to ride', example: 'Hun rider på sin hest hver weekend.', exampleEn: 'She rides her horse every weekend.', cefr: 'B1', note: 'Irregular strong verb: past "red" (vowel shift i→e). Specifically used for riding animals; "køre" is used for vehicles.' },
    { infinitive: 'skinne', present: 'skinner', past: 'skinnede', pastParticiple: 'skinnet', translation: 'to shine', example: 'Solen skinner i dag.', exampleEn: 'The sun is shining today.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). Most commonly used for sunlight; "glimte" or "lyse" are used for artificial light.' },
    { infinitive: 'skrive', present: 'skriver', past: 'skrev', pastParticiple: 'skrevet', translation: 'to write', example: 'Jeg skriver et brev til min ven.', exampleEn: 'I am writing a letter to my friend.', cefr: 'A1', note: 'Irregular strong verb: past "skrev" (vowel shift i→e). "Skrive under" means "to sign (a document)."' },
    { infinitive: 'slide', present: 'slider', past: 'sled', pastParticiple: 'slidt', translation: 'to wear out', example: 'Skoene slider hurtigt på asfalten.', exampleEn: 'The shoes wear out quickly on the asphalt.', cefr: 'B2', note: 'Irregular strong verb: past "sled" (vowel shift i→e). Often used reflexively or figuratively: "slide sig op" (to work oneself to exhaustion).' },
    { infinitive: 'stige', present: 'stiger', past: 'steg', pastParticiple: 'steget', translation: 'to rise', example: 'Prisen stiger hver måned.', exampleEn: 'The price rises every month.', cefr: 'B1', note: 'Irregular strong verb: past "steg" (vowel shift i→e). Commonly used for prices, temperatures, and climbing.' },
    { infinitive: 'tie', present: 'tier', past: 'tav', pastParticiple: 'tiet', translation: 'to be silent', example: 'Han tier, når hun taler.', exampleEn: 'He stays silent when she speaks.', cefr: 'B2', note: 'Irregular strong verb: past "tav" is a notably suppletive form. "Tie stille" is the emphatic phrase for keeping quiet.' },
    { infinitive: 'vride', present: 'vrider', past: 'vred', pastParticiple: 'vredet', translation: 'to twist/wring', example: 'Hun vrider vasketøjet.', exampleEn: 'She wrings the laundry.', cefr: 'B2', note: 'Irregular strong verb: past "vred" (vowel shift i→e). Also used figuratively: "vride sig" (to writhe/squirm).' },
    { infinitive: 'byde', present: 'byder', past: 'bød', pastParticiple: 'budt', translation: 'to offer/bid', example: 'Han byder på et gammelt maleri.', exampleEn: 'He bids on an old painting.', cefr: 'B2', note: 'Irregular strong verb: y→ø→u vowel shift across tenses. "Byde velkommen" means "to welcome."' },
    { infinitive: 'lyve', present: 'lyver', past: 'løj', pastParticiple: 'løjet', translation: 'to lie', example: 'Han lyver, når det passer ham.', exampleEn: 'He lies when it suits him.', cefr: 'B1', note: 'Irregular strong verb: past "løj" (notable vowel shift y→øj). Do not confuse with "ligge" (to lie down).' },
    { infinitive: 'synge', present: 'synger', past: 'sang', pastParticiple: 'sunget', translation: 'to sing', example: 'Børnene synger en sang.', exampleEn: 'The children are singing a song.', cefr: 'A2', note: 'Irregular strong verb: y→a→u vowel shift across tenses. The noun "sang" (song) is the same form as the past tense.' },
    { infinitive: 'skyde', present: 'skyder', past: 'skød', pastParticiple: 'skudt', translation: 'to shoot', example: 'Jægeren skyder ikke i naturreservatet.', exampleEn: "The hunter doesn't shoot in the nature reserve.", cefr: 'B1', note: 'Irregular strong verb: y→ø→u vowel shift. "Skyde genvej" means "to take a shortcut."' },
    { infinitive: 'bryde', present: 'bryder', past: 'brød', pastParticiple: 'brudt', translation: 'to break', example: 'Bølgerne bryder mod stranden.', exampleEn: 'The waves break against the beach.', cefr: 'B1', note: 'Irregular strong verb: y→ø→u vowel shift. "Bryde sig om" means "to care about/like."' },
    { infinitive: 'flyve', present: 'flyver', past: 'fløj', pastParticiple: 'fløjet', translation: 'to fly', example: 'Flyet flyver højt over skyerne.', exampleEn: 'The plane flies high above the clouds.', cefr: 'A2', note: 'Irregular strong verb: past "fløj" (major vowel shift y→øj). Used for birds, aircraft, and colloquially for things moving fast.' },
    { infinitive: 'flyde', present: 'flyder', past: 'flød', pastParticiple: 'flydt', translation: 'to flow', example: 'Vandet flyder ned ad floden.', exampleEn: 'The water flows down the river.', cefr: 'B1', note: 'Irregular strong verb: y→ø→y vowel shift. Also means "to be untidy/messy" colloquially: "det flyder" (the place is a mess).' },
    { infinitive: 'fryse', present: 'fryser', past: 'frøs', pastParticiple: 'frosset', translation: 'to freeze', example: 'Jeg fryser, når det er koldt udenfor.', exampleEn: "I freeze when it's cold outside.", cefr: 'A2', note: 'Irregular strong verb: y→ø→o vowel shift. Can be impersonal ("det fryser") or personal ("jeg fryser").' },
    { infinitive: 'krybe', present: 'kryber', past: 'krøb', pastParticiple: 'krøbet', translation: 'to crawl', example: 'Babyen kryber på gulvet.', exampleEn: 'The baby crawls on the floor.', cefr: 'B1', note: 'Irregular strong verb: y→ø vowel shift. "Krybe til korset" is an idiom meaning "to eat humble pie."' },
    { infinitive: 'blive', present: 'bliver', past: 'blev', pastParticiple: 'blevet', translation: 'to become/stay', example: 'Hun bliver lærer efter uddannelsen.', exampleEn: 'She becomes a teacher after her education.', cefr: 'A1', note: 'Irregular strong verb: past "blev" (vowel shift i→e). Also forms the passive voice with past participle: "det bliver gjort" (it is being done).' },
    { infinitive: 'stå', present: 'står', past: 'stod', pastParticiple: 'stået', translation: 'to stand', example: 'Han står ved døren.', exampleEn: 'He stands by the door.', cefr: 'A1', note: 'Irregular strong verb: past "stod" (vowel shift å→o). "Stå op" means "to get up/stand up."' },
    { infinitive: 'give', present: 'giver', past: 'gav', pastParticiple: 'givet', translation: 'to give', example: 'Jeg giver hende en gave.', exampleEn: 'I give her a present.', cefr: 'A1', note: 'Irregular strong verb: past "gav" (vowel shift i→a). "Give op" means "to give up."' },
    { infinitive: 'få', present: 'får', past: 'fik', pastParticiple: 'fået', translation: 'to get/receive', example: 'Vi får post hver dag.', exampleEn: 'We get mail every day.', cefr: 'A1', note: 'Highly irregular: present "får," past "fik," past participle "fået." Also functions as a causative auxiliary: "få nogen til at gøre noget."' },
    { infinitive: 'se', present: 'ser', past: 'så', pastParticiple: 'set', translation: 'to see', example: 'Jeg ser en fugl i træet.', exampleEn: 'I see a bird in the tree.', cefr: 'A1', note: 'Irregular strong verb: past "så" (vowel contraction e→å). "Se ud" means "to look/appear," and "se på" means "to look at."' },
    { infinitive: 'bringe', present: 'bringer', past: 'bragte', pastParticiple: 'bragt', translation: 'to bring', example: 'Han bringer blomster til hende.', exampleEn: 'He brings her flowers.', cefr: 'A2', note: 'Irregular: past "bragte," past participle "bragt" (vowel shift and shortened ending). More formal than "tage med" (bring along) in everyday speech.' },
    { infinitive: 'kunne', present: 'kan', past: 'kunne', pastParticiple: 'kunnet', translation: 'to be able/can', example: 'Jeg kan tale dansk.', exampleEn: 'I can speak Danish.', cefr: 'A1', note: 'Modal verb: present "kan" is its own strong form (preterite-present). Past and infinitive are identical ("kunne"), which can be confusing.' },
    { infinitive: 'skulle', present: 'skal', past: 'skulle', pastParticiple: 'skullet', translation: 'to have to/shall', example: 'Vi skal mødes klokken fem.', exampleEn: "We're meeting at five o'clock.", cefr: 'A1', note: 'Modal verb: present "skal" (preterite-present form). Past and infinitive are identical ("skulle"). Often expresses obligation or future intention.' },
    { infinitive: 'ville', present: 'vil', past: 'ville', pastParticiple: 'villet', translation: 'to want/will', example: 'Hun vil rejse til Spanien.', exampleEn: 'She wants to travel to Spain.', cefr: 'A1', note: 'Modal verb: present "vil" (preterite-present form). Past and infinitive are identical ("ville"). Expresses desire or prediction.' },
    { infinitive: 'måtte', present: 'må', past: 'måtte', pastParticiple: 'måttet', translation: 'to must', example: 'Du må ikke ryge her.', exampleEn: 'You must not smoke here.', cefr: 'A1', note: 'Modal verb: present "må" (preterite-present form). "Må ikke" (must not) is very different from "ikke skal" (don\'t need to).' },
    { infinitive: 'burde', present: 'bør', past: 'burde', pastParticiple: 'burdet', translation: 'to ought to/should', example: 'Du bør spise flere grøntsager.', exampleEn: 'You should eat more vegetables.', cefr: 'B1', note: 'Modal verb: present "bør" (preterite-present form). Past and infinitive are identical ("burde"). Expresses moral obligation or advice.' },
    { infinitive: 'turde', present: 'tør', past: 'turde', pastParticiple: 'turdet', translation: 'to dare', example: 'Han tør ikke springe ud i vandet.', exampleEn: "He doesn't dare jump into the water.", cefr: 'B2', note: 'Modal verb: present "tør" (preterite-present form). Past and infinitive identical. Less common than other modals; often replaced by "vove" in writing.' },
    { infinitive: 'sætte', present: 'sætter', past: 'satte', pastParticiple: 'sat', translation: 'to put/place', example: 'Hun sætter koppen på bordet.', exampleEn: 'She puts the cup on the table.', cefr: 'A2', note: 'Irregular: past "satte," past participle "sat" (shortened form). "Sætte sig" means "to sit down"; "sætte i gang" means "to start something."' },
    { infinitive: 'træffe', present: 'træffer', past: 'traf', pastParticiple: 'truffet', translation: 'to meet', example: 'Jeg træffer ham ofte i kantinen.', exampleEn: 'I often meet him in the canteen.', cefr: 'B1', note: 'Irregular strong verb: æ→a→u vowel shift. "Træffe en beslutning" (to make a decision) is the formal register; everyday speech uses "tage en beslutning."' },
    { infinitive: 'nyde', present: 'nyder', past: 'nød', pastParticiple: 'nydt', translation: 'to enjoy', example: 'Vi nyder solen på terrassen.', exampleEn: 'We enjoy the sun on the terrace.', cefr: 'B1', note: 'Irregular strong verb: y→ø→y vowel shift. More literary/formal than "synes om"; pairs naturally with sensory pleasures.' },
    { infinitive: 'tilbringe', present: 'tilbringer', past: 'tilbragte', pastParticiple: 'tilbragt', translation: 'to spend (time)', example: 'De tilbringer sommeren ved kysten.', exampleEn: 'They spend the summer by the coast.', cefr: 'B1', note: 'Prefixed form of "bringe"; follows the same irregular pattern (past "tilbragte"). Exclusively used for spending time, not money.' },
    { infinitive: 'fortsætte', present: 'fortsætter', past: 'fortsatte', pastParticiple: 'fortsat', translation: 'to continue', example: 'Hun fortsætter med at træne hver dag.', exampleEn: 'She continues to train every day.', cefr: 'A2', note: 'Prefixed form of "sætte"; follows same irregular pattern. Always followed by "med at + infinitive" when an activity continues.' },
    { infinitive: 'opgive', present: 'opgiver', past: 'opgav', pastParticiple: 'opgivet', translation: 'to give up', example: 'Han opgiver aldrig så let.', exampleEn: 'He never gives up so easily.', cefr: 'B1', note: 'Prefixed form of "give"; follows the same irregular pattern (past "opgav"). Also means "to declare/state" in formal contexts (e.g. "opgive sin adresse").' },
    { infinitive: 'springe', present: 'springer', past: 'sprang', pastParticiple: 'sprunget', translation: 'to jump', example: 'Børnene springer i vandpytterne.', exampleEn: 'The children jump in the puddles.', cefr: 'B1', note: 'Irregular strong verb: i→a→u vowel shift. "Springe over" means "to skip" (a step, a class, etc.).' },
    { infinitive: 'tvinge', present: 'tvinger', past: 'tvang', pastParticiple: 'tvunget', translation: 'to force', example: 'Regnen tvinger os indenfor.', exampleEn: 'The rain forces us inside.', cefr: 'B1', note: 'Irregular strong verb: i→a→u vowel shift. Usually followed by "til at + infinitive" when forcing someone to do something.' },
    { infinitive: 'tilføje', present: 'tilføjer', past: 'tilføjede', pastParticiple: 'tilføjet', translation: 'to add', example: 'Hun tilføjer salt til suppen.', exampleEn: 'She adds salt to the soup.', cefr: 'B1', note: 'Regular weak verb (-ede/-et endings). Used for adding ingredients, information, or items to a list; more formal than "putte i."' },
    { infinitive: 'glemme', present: 'glemmer', past: 'glemte', pastParticiple: 'glemt', translation: 'to forget', example: 'Jeg glemmer altid mine nøgler.', exampleEn: 'I always forget my keys.', cefr: 'A2', note: 'Regular weak verb (-te/-t endings). "Glemme alt om" means "to forget all about something" as a fixed phrase.' },
    { infinitive: 'drømme', present: 'drømmer', past: 'drømte', pastParticiple: 'drømt', translation: 'to dream', example: 'Han drømmer om at blive pilot.', exampleEn: 'He dreams of becoming a pilot.', cefr: 'A2', note: 'Regular weak verb (-te/-t endings). "Drømme om" means "to dream of/about"; "drømme" alone refers to dreaming while asleep.' },
    { infinitive: 'løfte', present: 'løfter', past: 'løftede', pastParticiple: 'løftet', translation: 'to lift', example: 'Hun løfter den tunge kasse.', exampleEn: 'She lifts the heavy box.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). "Løfte sløret" means "to lift the veil/reveal something."' },
    { infinitive: 'læse', present: 'læser', past: 'læste', pastParticiple: 'læst', translation: 'to read', example: 'Jeg læser en bog hver aften.', exampleEn: 'I read a book every evening.', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). "Læse op" means "to read aloud"; "læse til" means "to study to become" (e.g. "læse til læge").' },
    { infinitive: 'vokse', present: 'vokser', past: 'voksede', pastParticiple: 'vokset', translation: 'to grow', example: 'Planten vokser hurtigt i solen.', exampleEn: 'The plant grows quickly in the sun.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). "Vokse op" means "to grow up" (for people); "vokse" alone is used for plants and abstract growth.' },
    { infinitive: 'betyde', present: 'betyder', past: 'betød', pastParticiple: 'betydet', translation: 'to mean', example: 'Ordet betyder noget helt andet.', exampleEn: 'The word means something completely different.', cefr: 'A2', note: 'Irregular: past "betød" (vowel shift y→ø). "Det betyder meget for mig" (it means a lot to me) is a common expression.' },
    { infinitive: 'rive', present: 'river', past: 'rev', pastParticiple: 'revet', translation: 'to tear', example: 'Hun river papiret i stykker.', exampleEn: 'She tears the paper into pieces.', cefr: 'B1', note: 'Irregular strong verb: past "rev" (vowel shift i→e). "Rive ned" means "to tear down/demolish."' },
    { infinitive: 'forstå', present: 'forstår', past: 'forstod', pastParticiple: 'forstået', translation: 'to understand', example: 'Jeg forstår ikke spørgsmålet.', exampleEn: "I don't understand the question.", cefr: 'A1', note: 'Prefixed form of "stå"; follows the same irregular pattern (past "forstod"). "Forstå sig på" means "to have expertise in."' },
    { infinitive: 'fortælle', present: 'fortæller', past: 'fortalte', pastParticiple: 'fortalt', translation: 'to tell', example: 'Han fortæller en historie til børnene.', exampleEn: 'He tells the children a story.', cefr: 'A1', note: 'Irregular: past "fortalte," past participle "fortalt" (vowel shift æ→a). "Fortælle om" means "to tell about"; distinct from "sige" (to say).' },
    { infinitive: 'hjælpe', present: 'hjælper', past: 'hjalp', pastParticiple: 'hjulpet', translation: 'to help', example: 'Vi hjælper hinanden med opgaverne.', exampleEn: 'We help each other with the tasks.', cefr: 'A1', note: 'Irregular strong verb: æ→a→u vowel shift across tenses. "Hjælpe til" means "to pitch in/assist."' },
    { infinitive: 'modtage', present: 'modtager', past: 'modtog', pastParticiple: 'modtaget', translation: 'to receive', example: 'Hun modtager en pakke i dag.', exampleEn: 'She receives a package today.', cefr: 'B1', note: 'Prefixed compound of "tage"; follows the same irregular pattern (past "modtog"). More formal than "få" (to get/receive).' },
    { infinitive: 'ringe', present: 'ringer', past: 'ringede', pastParticiple: 'ringet', translation: 'to call', example: 'Jeg ringer til min mor hver søndag.', exampleEn: 'I call my mother every Sunday.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). "Ringe til" means "to call someone (by phone)"; "ringe på" means "to ring a doorbell."' },
    { infinitive: 'ryge', present: 'ryger', past: 'røg', pastParticiple: 'røget', translation: 'to smoke', example: 'Han ryger ikke længere.', exampleEn: 'He no longer smokes.', cefr: 'B1', note: 'Irregular strong verb: past "røg" (vowel shift y→ø). Also means "to fly/vanish" colloquially: "det røg ud af vinduet" (it went out the window).' },
    { infinitive: 'smage', present: 'smager', past: 'smagte', pastParticiple: 'smagt', translation: 'to taste', example: 'Kagen smager virkelig godt.', exampleEn: 'The cake tastes really good.', cefr: 'A2', note: 'Regular weak verb (-te/-t endings). "Det smager godt" is the standard way to say "it tastes good"; "smage på" means "to taste/try a bite of."' },
    { infinitive: 'smide', present: 'smider', past: 'smed', pastParticiple: 'smidt', translation: 'to throw away', example: 'Han smider skraldet ud.', exampleEn: 'He throws the trash out.', cefr: 'B1', note: 'Irregular strong verb: past "smed" (vowel shift i→e). "Smide ud" means "to throw out/discard"; "smide med" means "to throw carelessly."' },
    { infinitive: 'svømme', present: 'svømmer', past: 'svømmede', pastParticiple: 'svømmet', translation: 'to swim', example: 'Vi svømmer i havet om sommeren.', exampleEn: 'We swim in the sea in the summer.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). "Svømme over" can mean "to overflow" in a figurative sense.' },
    { infinitive: 'svare', present: 'svarer', past: 'svarede', pastParticiple: 'svaret', translation: 'to answer', example: 'Hun svarer på alle spørgsmålene.', exampleEn: 'She answers all the questions.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). "Svare på" means "to respond to"; "svare til" means "to correspond to/match."' },
    { infinitive: 'tænke', present: 'tænker', past: 'tænkte', pastParticiple: 'tænkt', translation: 'to think', example: 'Jeg tænker på dig hver dag.', exampleEn: 'I think of you every day.', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). "Tænke på" means "to think of/about"; "tænke over" means "to reflect on something."' },
    { infinitive: 'kysse', present: 'kysser', past: 'kyssede', pastParticiple: 'kysset', translation: 'to kiss', example: 'De kysser hinanden farvel.', exampleEn: 'They kiss each other goodbye.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). "Kysse farvel" (to kiss goodbye) is a common fixed phrase.' },
    { infinitive: 'kende', present: 'kender', past: 'kendte', pastParticiple: 'kendt', translation: 'to know (someone)', example: 'Jeg kender ham fra skolen.', exampleEn: 'I know him from school.', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). "Kende" refers to knowing people or being acquainted with things; contrast with "vide" (to know a fact).' },
    { infinitive: 'forlade', present: 'forlader', past: 'forlod', pastParticiple: 'forladt', translation: 'to leave', example: 'Hun forlader huset klokken otte.', exampleEn: 'She leaves the house at eight o\'clock.', cefr: 'B1', note: 'Prefixed form of "lade"; follows the same irregular pattern (past "forlod"). More formal/literary than "gå" or "tage af sted."' },
    { infinitive: 'mødes', present: 'mødes', past: 'mødtes', pastParticiple: 'mødt', translation: 'to meet (each other)', example: 'Vi mødes på caféen kl. tre.', exampleEn: 'We meet at the café at 3 o\'clock.', cefr: 'A2', note: 'Reciprocal reflexive verb (deponent form with -s); present and infinitive both end in -es. The -s cannot be removed without changing the meaning.' },
    { infinitive: 'låne', present: 'låner', past: 'lånte', pastParticiple: 'lånt', translation: 'to borrow', example: 'Jeg låner en bog fra biblioteket.', exampleEn: 'I borrow a book from the library.', cefr: 'A2', note: 'Regular weak verb (-te/-t endings). Danish uses the same verb "låne" for both "to borrow" and "to lend"; context or direction preposition clarifies.' },
    { infinitive: 'træde', present: 'træder', past: 'trådte', pastParticiple: 'trådt', translation: 'to step', example: 'Han træder ud af bilen.', exampleEn: 'He steps out of the car.', cefr: 'B1', note: 'Irregular: past "trådte" (vowel shift æ→å). More formal than "gå"; used in fixed phrases like "træde i kraft" (to come into effect).' },
    { infinitive: 'oversætte', present: 'oversætter', past: 'oversatte', pastParticiple: 'oversat', translation: 'to translate', example: 'Hun oversætter teksten til engelsk.', exampleEn: 'She translates the text into English.', cefr: 'B1', note: 'Prefixed form of "sætte"; follows the same irregular pattern. "Oversætte fra ... til ..." specifies the source and target language.' },
    { infinitive: 'beskrive', present: 'beskriver', past: 'beskrev', pastParticiple: 'beskrevet', translation: 'to describe', example: 'Han beskriver sin rejse i detaljer.', exampleEn: 'He describes his trip in detail.', cefr: 'B1', note: 'Prefixed form of "skrive"; follows the same irregular pattern (past "beskrev"). Common in academic and journalistic writing.' },
    { infinitive: 'beslutte', present: 'beslutter', past: 'besluttede', pastParticiple: 'besluttet', translation: 'to decide', example: 'Vi beslutter os for at blive hjemme.', exampleEn: 'We decide to stay home.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). Almost always reflexive: "beslutte sig for at" (to decide to do something).' },
    { infinitive: 'forberede', present: 'forbereder', past: 'forberedte', pastParticiple: 'forberedt', translation: 'to prepare', example: 'Hun forbereder middagen i køkkenet.', exampleEn: 'She prepares dinner in the kitchen.', cefr: 'B1', note: 'Regular weak verb (-te/-t endings). Often reflexive: "forberede sig på" (to prepare oneself for something).' },
    { infinitive: 'oplyse', present: 'oplyser', past: 'oplyste', pastParticiple: 'oplyst', translation: 'to inform', example: 'Skolen oplyser forældrene om ændringen.', exampleEn: 'The school informs the parents about the change.', cefr: 'B2', note: 'Regular weak verb (-te/-t endings). Formal register; everyday speech would use "fortælle" or "informere." "Oplyse om" takes the preposition "om."' },
    { infinitive: 'påstå', present: 'påstår', past: 'påstod', pastParticiple: 'påstået', translation: 'to claim', example: 'Han påstår, at han har ret.', exampleEn: 'He claims that he is right.', cefr: 'B1', note: 'Prefixed form of "stå"; follows the same irregular pattern (past "påstod"). Implies a potentially disputed assertion, unlike the neutral "sige."' },
    { infinitive: 'sørge', present: 'sørger', past: 'sørgede', pastParticiple: 'sørget', translation: 'to care/ensure', example: 'Hun sørger for, at alt er klar.', exampleEn: 'She makes sure everything is ready.', cefr: 'B1', note: 'Regular weak verb (-ede/-et endings). "Sørge for" means "to ensure/take care of"; "sørge over" means "to mourn/grieve."' },
    { infinitive: 'undskylde', present: 'undskylder', past: 'undskyldte', pastParticiple: 'undskyldt', translation: 'to apologize', example: 'Han undskylder for at komme sent.', exampleEn: 'He apologizes for being late.', cefr: 'A2', note: 'Regular weak verb (-te/-t endings). "Undskyld" alone is the standard word for "sorry/excuse me"; "undskyld mig" is "excuse me."' },
    { infinitive: 'undersøge', present: 'undersøger', past: 'undersøgte', pastParticiple: 'undersøgt', translation: 'to examine/investigate', example: 'Lægen undersøger patienten.', exampleEn: 'The doctor examines the patient.', cefr: 'B1', note: 'Regular weak verb (-te/-t endings). Used for medical examination, scientific investigation, and general inquiry.' },
    { infinitive: 'glæde', present: 'glæder', past: 'glædede', pastParticiple: 'glædet', translation: 'to please', example: 'Det glæder mig at se dig.', exampleEn: 'It pleases me to see you.', cefr: 'B1', note: 'Regular weak verb (-ede/-et endings). Often reflexive: "glæde sig til" (to look forward to something).' },
    { infinitive: 'interessere', present: 'interesserer', past: 'interesserede', pastParticiple: 'interesseret', translation: 'to interest', example: 'Musik interesserer hende meget.', exampleEn: 'Music interests her a lot.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). Often reflexive: "interessere sig for" (to be interested in something).' },
    { infinitive: 'skynde', present: 'skynder', past: 'skyndte', pastParticiple: 'skyndt', translation: 'to hurry', example: 'Vi skynder os til toget.', exampleEn: 'We hurry to the train.', cefr: 'A2', note: 'Regular weak verb (-te/-t endings). Almost exclusively reflexive in use: "skynde sig" (to hurry up). Rarely used without "sig."' },
    { infinitive: 'mene', present: 'mener', past: 'mente', pastParticiple: 'ment', translation: 'to think/mean', example: 'Jeg mener, det er en god idé.', exampleEn: "I think it's a good idea.", cefr: 'A2', note: 'Regular weak verb (-te/-t endings). "Mene" expresses an opinion ("jeg mener" = I think/believe); contrast with "tænke" (thinking as a process).' },
    { infinitive: 'acceptere', present: 'accepterer', past: 'accepterede', pastParticiple: 'accepteret', translation: 'to accept', example: 'Han accepterer tilbuddet.', exampleEn: 'He accepts the offer.', cefr: 'A2', note: 'Regular weak verb; the -ere infinitive ending always produces -erede/-eret in past tenses. Borrowed from French via English or German.' },
    { infinitive: 'arbejde', present: 'arbejder', past: 'arbejdede', pastParticiple: 'arbejdet', translation: 'to work', example: 'Hun arbejder på et hospital.', exampleEn: 'She works at a hospital.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). "Arbejde med" means "to work on/with"; "arbejde som" means "to work as."' },
    { infinitive: 'arrangere', present: 'arrangerer', past: 'arrangerede', pastParticiple: 'arrangeret', translation: 'to arrange', example: 'De arrangerer en fest for ham.', exampleEn: 'They arrange a party for him.', cefr: 'B1', note: 'Regular -ere verb (-erede/-eret endings). More formal than "organisere" in some contexts; common in event and meeting planning.' },
    { infinitive: 'begynde', present: 'begynder', past: 'begyndte', pastParticiple: 'begyndt', translation: 'to begin', example: 'Filmen begynder klokken otte.', exampleEn: "The movie begins at eight o'clock.", cefr: 'A1', note: 'Regular weak verb (-te/-t endings). "Begynde at + infinitive" is the standard construction for starting to do something.' },
    { infinitive: 'besøge', present: 'besøger', past: 'besøgte', pastParticiple: 'besøgt', translation: 'to visit', example: 'Vi besøger vores bedsteforældre i weekenden.', exampleEn: 'We visit our grandparents on the weekend.', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). Used for visiting people and places; "besøge en by" (to visit a city).' },
    { infinitive: 'betale', present: 'betaler', past: 'betalte', pastParticiple: 'betalt', translation: 'to pay', example: 'Han betaler regningen online.', exampleEn: 'He pays the bill online.', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). "Betale for" means "to pay for"; "betale sig" means "to be worthwhile."' },
    { infinitive: 'danse', present: 'danser', past: 'dansede', pastParticiple: 'danset', translation: 'to dance', example: 'De danser hele natten.', exampleEn: 'They dance all night.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). "Danse med nogen" means "to dance with someone"; the noun "dans" is a common derivation.' },
    { infinitive: 'deltage', present: 'deltager', past: 'deltog', pastParticiple: 'deltaget', translation: 'to participate', example: 'Hun deltager i konkurrencen.', exampleEn: 'She participates in the competition.', cefr: 'B1', note: 'Prefixed compound of "tage"; follows the irregular strong pattern (past "deltog"). Always followed by "i" when specifying the activity.' },
    { infinitive: 'diskutere', present: 'diskuterer', past: 'diskuterede', pastParticiple: 'diskuteret', translation: 'to discuss', example: 'Vi diskuterer planerne for ferien.', exampleEn: 'We discuss the plans for the vacation.', cefr: 'A2', note: 'Regular -ere verb (-erede/-eret endings). Interchangeable with "tale om" (to talk about) in most contexts, but more formal.' },
    { infinitive: 'elske', present: 'elsker', past: 'elskede', pastParticiple: 'elsket', translation: 'to love', example: 'Jeg elsker dig.', exampleEn: 'I love you.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). "Jeg elsker dig" is the standard romantic declaration; "elske at gøre noget" means "to love doing something."' },
    { infinitive: 'forklare', present: 'forklarer', past: 'forklarede', pastParticiple: 'forklaret', translation: 'to explain', example: 'Læreren forklarer reglen igen.', exampleEn: 'The teacher explains the rule again.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). "Forklare for nogen" means "to explain to someone"; often paired with "hvordan" or "at"-clause.' },
    { infinitive: 'fotografere', present: 'fotograferer', past: 'fotograferede', pastParticiple: 'fotograferet', translation: 'to photograph', example: 'Han fotograferer solnedgangen.', exampleEn: 'He photographs the sunset.', cefr: 'B1', note: 'Regular -ere verb (-erede/-eret endings). Formal; everyday speech often uses "tage et billede" (take a photo) instead.' },
    { infinitive: 'frygte', present: 'frygter', past: 'frygtede', pastParticiple: 'frygtet', translation: 'to fear', example: 'Hun frygter mørket.', exampleEn: 'She fears the dark.', cefr: 'B1', note: 'Regular weak verb (-ede/-et endings). More formal than "være bange for" (to be afraid of). "Frygte det værste" means "to fear the worst."' },
    { infinitive: 'grine', present: 'griner', past: 'grinede', pastParticiple: 'grinet', translation: 'to laugh', example: 'Vi griner af den sjove vittighed.', exampleEn: 'We laugh at the funny joke.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). Colloquial Danish for laughing; more formal texts use "le." "Grine af" means "to laugh at (someone)."' },
    { infinitive: 'hente', present: 'henter', past: 'hentede', pastParticiple: 'hentet', translation: 'to fetch', example: 'Jeg henter børnene fra skole.', exampleEn: 'I pick up the children from school.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). "Hente" implies going to get and bringing back; "hente nogen" often means picking someone up.' },
    { infinitive: 'høre', present: 'hører', past: 'hørte', pastParticiple: 'hørt', translation: 'to hear', example: 'Hører du musikken?', exampleEn: 'Do you hear the music?', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). "Høre til" means "to belong to"; "høre fra" means "to hear from someone."' },
    { infinitive: 'købe', present: 'køber', past: 'købte', pastParticiple: 'købt', translation: 'to buy', example: 'Hun køber mælk i butikken.', exampleEn: 'She buys milk at the store.', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). "Købe ind" means "to go shopping/grocery shopping." Antonym: "sælge" (to sell).' },
    { infinitive: 'køre', present: 'kører', past: 'kørte', pastParticiple: 'kørt', translation: 'to drive', example: 'Han kører til arbejde hver dag.', exampleEn: 'He drives to work every day.', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). Used for driving any vehicle, and also for cycling ("køre på cykel").' },
    { infinitive: 'lave', present: 'laver', past: 'lavede', pastParticiple: 'lavet', translation: 'to make/do', example: 'Vi laver mad sammen i aften.', exampleEn: 'We are making food together tonight.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). "Lave mad" (to cook) and "lave lektier" (to do homework) are extremely common collocations.' },
    { infinitive: 'lege', present: 'leger', past: 'legede', pastParticiple: 'leget', translation: 'to play', example: 'Børnene leger i parken.', exampleEn: 'The children play in the park.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). "Lege" is used for children\'s play; for sports and instruments, use "spille."' },
    { infinitive: 'lære', present: 'lærer', past: 'lærte', pastParticiple: 'lært', translation: 'to learn', example: 'Jeg lærer dansk hver dag.', exampleEn: 'I learn Danish every day.', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). "Lære" can mean both "to learn" and "to teach" — context determines which. "Lære nogen noget" means "to teach someone something."' },
    { infinitive: 'lytte', present: 'lytter', past: 'lyttede', pastParticiple: 'lyttet', translation: 'to listen', example: 'Hun lytter til radioen.', exampleEn: 'She listens to the radio.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). "Lytte til" takes the preposition "til." Contrast with "høre" (to hear, passive).' },
    { infinitive: 'lukke', present: 'lukker', past: 'lukkede', pastParticiple: 'lukket', translation: 'to close', example: 'Butikken lukker klokken seks.', exampleEn: "The store closes at six o'clock.", cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). "Lukke op" means "to open up," which is the opposite — a useful idiomatic pairing.' },
    { infinitive: 'male', present: 'maler', past: 'malede', pastParticiple: 'malet', translation: 'to paint', example: 'Han maler et billede af søen.', exampleEn: 'He paints a picture of the lake.', cefr: 'B1', note: 'Regular weak verb (-ede/-et endings). Covers both artistic painting and house painting; context distinguishes them.' },
    { infinitive: 'åbne', present: 'åbner', past: 'åbnede', pastParticiple: 'åbnet', translation: 'to open', example: 'Hun åbner vinduet for frisk luft.', exampleEn: 'She opens the window for fresh air.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). "Åbne for" means "to turn on" (water, gas): "åbne for vandhanen" (turn on the tap).' },
    { infinitive: 'prøve', present: 'prøver', past: 'prøvede', pastParticiple: 'prøvet', translation: 'to try', example: 'Jeg prøver en ny opskrift.', exampleEn: 'I am trying a new recipe.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). "Prøve at" means "to try to do something"; "prøve på" means "to try on (clothes)."' },
    { infinitive: 'reparere', present: 'reparerer', past: 'reparerede', pastParticiple: 'repareret', translation: 'to repair', example: 'Han reparerer cyklen i garagen.', exampleEn: 'He repairs the bike in the garage.', cefr: 'B1', note: 'Regular -ere verb (-erede/-eret endings). Formal; everyday Danish often says "fikse" (fix) or "sætte i stand" (restore).' },
    { infinitive: 'savne', present: 'savner', past: 'savnede', pastParticiple: 'savnet', translation: 'to miss', example: 'Jeg savner mine venner.', exampleEn: 'I miss my friends.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). Only used for missing people or things emotionally; "mangle" is used for lacking something.' },
    { infinitive: 'smile', present: 'smiler', past: 'smilede', pastParticiple: 'smilet', translation: 'to smile', example: 'Hun smiler, når hun ser ham.', exampleEn: 'She smiles when she sees him.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). "Smile til nogen" means "to smile at someone." The noun form is also "et smil."' },
    { infinitive: 'snakke', present: 'snakker', past: 'snakkede', pastParticiple: 'snakket', translation: 'to chat', example: 'Vi snakker om gamle dage.', exampleEn: 'We chat about old times.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). Colloquial; more formal contexts use "tale" or "konversere." "Snakke om" means "to talk about."' },
    { infinitive: 'spille', present: 'spiller', past: 'spillede', pastParticiple: 'spillet', translation: 'to play', example: 'Han spiller fodbold om søndagene.', exampleEn: 'He plays football on Sundays.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). Used for sports and musical instruments; "lege" is used for children\'s imaginative play.' },
    { infinitive: 'spørge', present: 'spørger', past: 'spurgte', pastParticiple: 'spurgt', translation: 'to ask', example: 'Hun spørger om vejen til stationen.', exampleEn: 'She asks for directions to the station.', cefr: 'A1', note: 'Irregular: past "spurgte," past participle "spurgt" (vowel shift ø→u). "Spørge om" means "to ask about"; "spørge efter" means "to inquire after."' },
    { infinitive: 'starte', present: 'starter', past: 'startede', pastParticiple: 'startet', translation: 'to start', example: 'Mødet starter om ti minutter.', exampleEn: 'The meeting starts in ten minutes.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). Interchangeable with "begynde" in most contexts, but "starte" is the more colloquial/modern option.' },
    { infinitive: 'stoppe', present: 'stopper', past: 'stoppede', pastParticiple: 'stoppet', translation: 'to stop', example: 'Bussen stopper ved hjørnet.', exampleEn: 'The bus stops at the corner.', cefr: 'A1', note: 'Regular weak verb (-ede/-et endings). Interchangeable with "holde op" (to stop doing something) in many contexts.' },
    { infinitive: 'studere', present: 'studerer', past: 'studerede', pastParticiple: 'studeret', translation: 'to study', example: 'Hun studerer medicin på universitetet.', exampleEn: 'She studies medicine at university.', cefr: 'A1', note: 'Regular -ere verb (-erede/-eret endings). Used for university-level study; "læse" is more general for studying at all levels.' },
    { infinitive: 'tale', present: 'taler', past: 'talte', pastParticiple: 'talt', translation: 'to speak', example: 'Vi taler dansk i klassen.', exampleEn: 'We speak Danish in class.', cefr: 'A1', note: 'Regular weak verb (-te/-t endings). "Tale med" means "to speak with"; "tale om" means "to speak about." Slightly more formal than "snakke."' },
    { infinitive: 'træne', present: 'træner', past: 'trænede', pastParticiple: 'trænet', translation: 'to train', example: 'Han træner i fitnesscentret hver morgen.', exampleEn: 'He trains at the gym every morning.', cefr: 'A2', note: 'Regular weak verb (-ede/-et endings). "Træne" covers exercise and sports practice; also used for training others in a coaching context.' },
    { infinitive: 'tømme', present: 'tømmer', past: 'tømte', pastParticiple: 'tømt', translation: 'to empty', example: 'Hun tømmer skraldespanden.', exampleEn: 'She empties the trash can.', cefr: 'B1', note: 'Regular weak verb (-te/-t endings). "Tømme" is specifically about removing all contents; "tappe" is used when draining liquids.' },
];

// Status tracking for each verb: 'unreviewed', 'correct', or 'wrong'
let statuses = verbs.map(() => ({ status: 'unreviewed' }));

// Index of the current card being shown
let currentIndex = 0;

// Score counters
let correctCount = 0;
let wrongCount = 0;

// Active CEFR filter: 'All' or one of 'A1','A2','B1','B2','C1'
let cefrFilter = 'All';

// Returns the subset of verbs that match the current CEFR filter
function filteredVerbs() {
    if (cefrFilter === 'All') return verbs;
    return verbs.filter(v => v.cefr === cefrFilter);
}

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

/* ---------- CEFR LEVEL FILTER UI ---------- */
function buildCefrFilter() {
    const sidebar = document.querySelector('.sidebar');
    const heading = sidebar.querySelector('h2');

    const filterRow = document.createElement('div');
    filterRow.id = 'cefr-filter';
    filterRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-bottom:0.9rem;';

    const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];
    levels.forEach(level => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = level;
        btn.dataset.level = level;
        btn.style.cssText = [
            'padding:3px 9px',
            'border-radius:999px',
            'border:2px solid var(--wl-gold)',
            'background:rgba(255,255,255,0.07)',
            'color:var(--wl-gold-light)',
            'font-family:\'Quicksand\',sans-serif',
            'font-size:0.78rem',
            'font-weight:700',
            'cursor:pointer',
            'transition:background 0.2s,color 0.2s',
        ].join(';');
        if (level === cefrFilter) {
            btn.style.background = 'var(--wl-gold)';
            btn.style.color = 'var(--wl-ink)';
        }
        btn.addEventListener('click', () => {
            cefrFilter = level;
            // Update active styling
            filterRow.querySelectorAll('button').forEach(b => {
                b.style.background = 'rgba(255,255,255,0.07)';
                b.style.color = 'var(--wl-gold-light)';
            });
            btn.style.background = 'var(--wl-gold)';
            btn.style.color = 'var(--wl-ink)';
            // Jump to first card in the filtered set (or stay if already valid)
            const fv = filteredVerbs();
            if (fv.length === 0) return;
            // If currentIndex verb is not in filtered set, move to first filtered verb
            if (!fv.includes(verbs[currentIndex])) {
                currentIndex = verbs.indexOf(fv[0]);
            }
            renderAll();
        });
        filterRow.appendChild(btn);
    });

    // Insert filter row between heading and verb list
    heading.insertAdjacentElement('afterend', filterRow);
}

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

    // Usage/conjugation note (shown on card back)
    if (verb.note) {
        const noteEl = document.createElement('p');
        noteEl.className = 'verb-note';
        noteEl.style.cssText = [
            'margin-top:0.45rem',
            'font-size:0.72rem',
            'font-style:italic',
            'opacity:0.78',
            'color:var(--wl-cream)',
            'border-top:1px dashed rgba(212,175,55,0.35)',
            'padding-top:0.35rem',
            'line-height:1.35',
        ].join(';');
        noteEl.textContent = verb.note;
        back.appendChild(noteEl);
    }

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
    const fv = filteredVerbs();
    fv.forEach((verb) => {
        const index = verbs.indexOf(verb);
        const li = document.createElement('li');
        li.textContent = verb.infinitive;

        // Determine status class
        if (index === currentIndex) {
            li.classList.add('now');
        } else if (fv.indexOf(verb) === fv.indexOf(verbs[currentIndex]) + 1) {
            li.classList.add('next');
        }

        if (statuses[index].status === 'correct') {
            li.classList.add('completed', 'correct');
        } else if (statuses[index].status === 'wrong') {
            li.classList.add('completed', 'wrong');
        }

        // Add click event to jump to card
        li.addEventListener('click', () => {
            currentIndex = index;
            renderAll();
        });

        verbListEl.appendChild(li);
    });
}

// Update the scoreboard numbers
function updateScoreboard() {
    const fv = filteredVerbs();
    const filteredStatuses = fv.map(v => statuses[verbs.indexOf(v)]);
    const completedCount = filteredStatuses.filter(item => item.status !== 'unreviewed').length;
    const filteredPosition = fv.indexOf(verbs[currentIndex]);
    const displayIndex = filteredPosition >= 0 ? filteredPosition : 0;

    cardNumberEl.textContent = `Card ${displayIndex + 1} of ${fv.length}`;
    const remaining = fv.length - completedCount;
    remainingEl.textContent = `Remaining: ${remaining}`;
    correctCountEl.textContent = `Correct: ${correctCount}`;
    wrongCountEl.textContent = `Wrong: ${wrongCount}`;

    // Update progress bar width based on completed count within filter
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = fv.length > 0 ? (completedCount / fv.length) * 100 : 0;
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

// Move to the next card within the filtered set; if at the end, stay
function goToNext() {
    const fv = filteredVerbs();
    const currentPosInFilter = fv.indexOf(verbs[currentIndex]);
    if (currentPosInFilter < fv.length - 1) {
        currentIndex = verbs.indexOf(fv[currentPosInFilter + 1]);
    }
    renderAll();
}

// Handle marking as wrong — also auto-flips the card to reveal note
wrongBtn.addEventListener('click', () => {
    if (statuses[currentIndex].status === 'unreviewed') {
        statuses[currentIndex].status = 'wrong';
        wrongCount++;
        saveProgress();
        // Flip the card so the note is visible before advancing
        const card = cardWrapper.querySelector('.flashcard');
        if (card && !card.classList.contains('is-flipped')) {
            card.classList.add('is-flipped');
        }
        // Delay advance so learner can read the note
        setTimeout(() => goToNext(), 1200);
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
    // Build the CEFR filter UI in the sidebar
    buildCefrFilter();

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
