'use strict';
// Temporary generator for saetningsmaskinen clause_chain items (chain-11..chain-100).
// Each entry: [id, level, chunks[], note]. sentence is derived by joining chunks with a space.
var items = [
  // Category 1: relative clause embedded in subject NP + main clause
  ["chain-11", "B2", ["Den bil,", "som han købte i sidste uge,", "er allerede gået i stykker."], "Som er objekt for købte i relativsætningen."],
  ["chain-12", "B2", ["Manden,", "der bor i huset overfor,", "arbejder som læge på hospitalet."], "Der er subjekt i relativsætningen og kan ikke udelades."],
  ["chain-13", "C1", ["Pigen,", "hvis mor er lærer,", "vandt konkurrencen i går."], "Hvis udtrykker ejerskab (pigens mor) i relativsætningen."],
  ["chain-14", "B2", ["Byen,", "hvor vi mødte hinanden første gang,", "ligger tæt på kysten."], "Hvor henviser til et sted i relativsætningen."],
  ["chain-15", "B2", ["Den rapport,", "som chefen bad om,", "skal være klar til fredag."], "Som er objekt for bad om i relativsætningen."],
  ["chain-16", "B2", ["Det hus,", "der ligger for enden af vejen,", "har stået tomt i årevis."], "Der er subjekt i relativsætningen og kan ikke udelades."],
  ["chain-17", "C1", ["Studenten,", "hvis eksamen gik godt,", "fejrede det med sine venner."], "Hvis udtrykker ejerskab (studentens eksamen)."],
  ["chain-18", "C1", ["Firmaet,", "som blev grundlagt i 1990,", "beskæftiger nu over hundrede medarbejdere."], "Som er subjekt i en passiv relativsætning og kan ikke udelades."],
  ["chain-19", "B2", ["Vejen,", "hvor ulykken skete,", "er nu blevet spærret af politiet."], "Hvor henviser til stedet for handlingen i relativsætningen."],
  ["chain-20", "C1", ["Den forsker,", "hvis artikel blev citeret overalt,", "modtog en stor pris."], "Hvis udtrykker ejerskab (forskerens artikel)."],

  // Category 2: causal/structural da / fordi chains (fronted subordinate + V2 main clause)
  ["chain-21", "B2", ["Fordi toget var forsinket,", "nåede hun", "ikke mødet til tiden."], "Ledsætningen fordi står forrest; hovedsætningen får derfor verbum før subjekt."],
  ["chain-22", "B2", ["Da regningen ikke var betalt,", "blev strømmen", "afbrudt om morgenen."], "Ledsætningen med da står forrest; hovedsætningen har verbum før subjekt."],
  ["chain-23", "B2", ["Fordi han glemte sin paraply,", "og fordi det begyndte at regne,", "blev han", "helt gennemblødt."], "To koordinerede fordi-sætninger står forrest for hovedsætningen."],
  ["chain-24", "B2", ["Da hun ikke kunne finde sine nøgler,", "måtte hun", "ringe til låsesmeden."], "Ledsætningen står forrest; ikke står før det finitte verbum i ledsætningen."],
  ["chain-25", "B2", ["Fordi prisen steg så meget,", "valgte mange kunder", "at skifte leverandør."], "Fordi-sætningen forrest styrer ordstillingen i hovedsætningen."],
  ["chain-26", "B2", ["Da læreren blev syg,", "måtte timen", "aflyses med kort varsel."], "Ledsætningen med da står forrest; hovedsætningen bruger en passiv infinitiv."],
  ["chain-27", "B2", ["Fordi naboerne klagede igen og igen,", "besluttede kommunen", "at undersøge sagen."], "Fordi-sætningen forrest giver inversion i hovedsætningen."],
  ["chain-28", "B2", ["Da bilen gik i stykker på motorvejen,", "måtte de vente", "over en time på hjælp."], "Ledsætningen med da står forrest; hovedsætningen har verbum før subjekt."],
  ["chain-29", "B2", ["Fordi hun havde forberedt sig godt,", "bestod hun", "eksamen uden problemer."], "Fordi-sætningen forrest; hovedsætningen har inversion."],
  ["chain-30", "C1", ["Da de to firmaer fusionerede,", "ændrede hele organisationen", "sig markant."], "Ledsætningen med da står forrest; hovedsætningen har verbum før subjekt."],

  // Category 3: conditional hvis chains
  ["chain-31", "B2", ["Hvis det bliver koldt i aften,", "tager vi", "den varme jakke med."], "Hvis-sætningen forrest; hovedsætningen har verbum før subjekt."],
  ["chain-32", "C1", ["Hvis han havde vidst det tidligere,", "ville han", "have handlet anderledes."], "Irrealis betingelse med pluskvamperfektum og ville + infinitiv."],
  ["chain-33", "B2", ["Hvis I ikke skriver under i dag,", "bliver kontrakten", "annulleret."], "Ikke står før det finitte verbum i hvis-sætningen."],
  ["chain-34", "B2", ["Hvis prisen falder yderligere,", "køber mange flere forbrugere", "produktet."], "Hvis-sætningen forrest styrer ordstillingen i hovedsætningen."],
  ["chain-35", "C1", ["Hvis du spørger mig,", "og hvis du virkelig vil vide det,", "var det", "en fejl."], "To koordinerede hvis-sætninger står forrest."],
  ["chain-36", "B2", ["Hvis vejret holder,", "og hvis alle kan komme,", "holder vi festen", "udenfor."], "Koordinerede betingelsessætninger forrest for hovedsætningen."],
  ["chain-37", "B2", ["Hvis hun ikke svarer inden fredag,", "mister hun", "sin plads på kurset."], "Ikke står før det finitte verbum i betingelsessætningen."],
  ["chain-38", "C1", ["Hvis regeringen ikke griber ind snart,", "forværres krisen", "yderligere."], "Betingelsessætningen forrest giver inversion i hovedsætningen."],
  ["chain-39", "B2", ["Hvis man læser instruktionerne ordentligt,", "undgår man", "de fleste fejl."], "Generisk man-betingelse; hovedsætningen har verbum før subjekt."],
  ["chain-40", "C1", ["Hvis de havde haft mere tid,", "havde de", "nok løst problemet selv."], "Irrealis betingelse i fortid med pluskvamperfektum i begge sætninger."],

  // Category 4: temporal da / efter at / før / mens chains
  ["chain-41", "B2", ["Mens børnene sov,", "ryddede forældrene op", "i hele huset."], "Mens udtrykker samtidighed; hovedsætningen har verbum før subjekt."],
  ["chain-42", "B2", ["Før toget kører,", "skal alle passagerer", "vise deres billet."], "Før-sætningen forrest; hovedsætningen har modalverbum før subjekt."],
  ["chain-43", "B2", ["Efter at hun var kommet hjem,", "lavede hun", "straks aftensmad."], "Efter at indleder en tidsledsætning; hovedsætningen har verbum før subjekt."],
  ["chain-44", "B2", ["Da klokken ringede,", "rejste alle eleverne sig", "med det samme."], "Da-sætningen forrest; refleksivt verbum i hovedsætningen."],
  ["chain-45", "B2", ["Mens han studerede i udlandet,", "lærte han", "tre nye sprog."], "Mens udtrykker en periode; hovedsætningen har verbum før subjekt."],
  ["chain-46", "B2", ["Før de flyttede til byen,", "boede familien", "på landet i mange år."], "Før-sætningen forrest angiver en forudgående periode."],
  ["chain-47", "C1", ["Efter at mødet var slut,", "og efter at alle havde forladt lokalet,", "slukkede han", "lyset."], "To koordinerede efter at-sætninger forrest for hovedsætningen."],
  ["chain-48", "B2", ["Da hun så resultatet,", "kunne hun", "næsten ikke tro sine egne øjne."], "Da-sætningen forrest; i hovedsætningen står ikke efter det finitte verbum kunne."],
  ["chain-49", "B2", ["Mens regnen blev kraftigere og kraftigere,", "søgte vi", "beskyttelse under et træ."], "Mens-sætningen forrest beskriver en samtidig udvikling."],
  ["chain-50", "B2", ["Før du underskriver aftalen,", "bør du", "læse alle betingelserne grundigt."], "Før-sætningen forrest; hovedsætningen har modalverbum før subjekt."],

  // Category 5: concessive selvom / skønt chains
  ["chain-51", "B2", ["Selvom hun var meget nervøs,", "holdt hun", "en flot tale."], "Selvom-sætningen forrest; hovedsætningen har verbum før subjekt."],
  ["chain-52", "C1", ["Skønt vejret var dårligt,", "mødte mange mennesker op", "til koncerten."], "Skønt er en formel variant af selvom og indleder en indrømmelse."],
  ["chain-53", "B2", ["Selvom han ikke havde trænet længe,", "vandt han", "løbet alligevel."], "Ikke står før det finitte verbum i selvom-sætningen."],
  ["chain-54", "C1", ["Selvom prisen var høj,", "og selvom kvaliteten var tvivlsom,", "købte de", "produktet."], "To koordinerede selvom-sætninger står forrest for hovedsætningen."],
  ["chain-55", "C1", ["Skønt han havde advaret dem flere gange,", "lyttede ingen", "til ham."], "Skønt-sætningen forrest; hovedsætningen har verbum før subjekt."],
  ["chain-56", "B2", ["Selvom børnene var trætte efter turen,", "ville de", "ikke gå i seng."], "Selvom-sætningen forrest; ikke står efter det finitte verbum ville i hovedsætningen."],
  ["chain-57", "B2", ["Selvom hun fik et godt jobtilbud,", "valgte hun", "at blive i sin gamle stilling."], "Selvom-sætningen forrest styrer ordstillingen i hovedsætningen."],
  ["chain-58", "C1", ["Skønt firmaet tabte penge hele året,", "fyrede ledelsen", "ingen medarbejdere."], "Skønt-sætningen forrest; hovedsætningen har verbum før subjekt."],
  ["chain-59", "B2", ["Selvom de boede langt fra hinanden,", "talte de", "i telefon hver aften."], "Selvom-sætningen forrest beskriver en modsætning til hovedsætningen."],
  ["chain-60", "B2", ["Selvom det stadig var tidligt,", "var gaden", "allerede fuld af mennesker."], "Selvom-sætningen forrest; hovedsætningen har verbum før subjekt."],

  // Category 6: fronted subordinate + two coordinated main clauses
  ["chain-61", "B2", ["Da festen var slut,", "ryddede vi op,", "og vi gik", "tidligt i seng."], "Ledsætningen forrest; to koordinerede hovedsætninger følger efter, den sidste uden inversion."],
  ["chain-62", "B2", ["Fordi hun var forsinket,", "ringede hun til mig,", "og vi ændrede", "planen."], "Årsagssætning forrest; to koordinerede hovedsætninger følger."],
  ["chain-63", "B2", ["Selvom det regnede,", "gik vi en tur,", "og vi blev", "våde til skindet."], "Selvom-sætningen forrest; to koordinerede hovedsætninger følger."],
  ["chain-64", "B2", ["Hvis du kommer forbi,", "laver jeg kaffe,", "og vi kan", "tale om sagen."], "Betingelsessætning forrest; to koordinerede hovedsætninger følger."],
  ["chain-65", "B2", ["Da hun blev færdig med studiet,", "flyttede hun til København,", "og hun fandt", "et job."], "Tidssætning forrest; to koordinerede hovedsætninger følger."],
  ["chain-66", "B2", ["Fordi vejret var så godt,", "tog vi cyklerne frem,", "og vi kørte", "hele dagen."], "Årsagssætning forrest; to koordinerede hovedsætninger følger."],
  ["chain-67", "C1", ["Efter at han havde læst bogen,", "skrev han en anmeldelse,", "og han delte den", "online."], "Tidssætning forrest; to koordinerede hovedsætninger følger."],
  ["chain-68", "B2", ["Mens de ventede på bussen,", "snakkede de om fremtiden,", "og tiden gik", "hurtigt."], "Tidssætning forrest; to koordinerede hovedsætninger følger."],
  ["chain-69", "B2", ["Hvis prisen stiger igen,", "skifter jeg leverandør,", "og jeg fortæller mine venner", "det."], "Betingelsessætning forrest; to koordinerede hovedsætninger følger."],
  ["chain-70", "B2", ["Selvom han var træt efter rejsen,", "mødte han op til arbejde,", "og han smilede", "hele dagen."], "Selvom-sætningen forrest; to koordinerede hovedsætninger følger."],

  // Category 7: indirect question chains
  ["chain-71", "B2", ["Jeg ved ikke,", "om hun kommer i aften,", "eller om hun bliver", "hjemme."], "Om indleder et indirekte ja/nej-spørgsmål uden inversion."],
  ["chain-72", "B2", ["Han spurgte,", "hvem der havde taget", "hans bog fra bordet."], "Hvem som subjekt følges af der i det indirekte spørgsmål."],
  ["chain-73", "B2", ["Vi vidste ikke,", "hvornår toget ville ankomme", "til stationen."], "Ingen inversion i det indirekte spørgsmål; subjekt står før verbum."],
  ["chain-74", "B2", ["Hun spurgte mig,", "hvorfor jeg ikke havde svaret", "på hendes besked."], "Ikke står før det finitte verbum i det indirekte spørgsmål."],
  ["chain-75", "C1", ["Ingen vidste,", "hvad der egentlig var sket", "i løbet af natten."], "Hvad som subjekt følges af der i det indirekte spørgsmål."],
  ["chain-76", "C1", ["Læreren spurgte,", "hvor mange elever der havde lavet", "opgaven hjemme."], "Hvor mange elever er subjekt og følges af der."],
  ["chain-77", "B2", ["Jeg er ikke sikker på,", "om vi nåede at bestille", "bordet i tide."], "Om indleder et indirekte ja/nej-spørgsmål uden inversion."],
  ["chain-78", "B2", ["De diskuterede,", "hvordan de bedst kunne løse", "problemet sammen."], "Ingen inversion i det indirekte spørgsmål."],
  ["chain-79", "B2", ["Hun spurgte,", "hvem der skulle hente", "børnene fra skole i dag."], "Hvem som subjekt følges af der i det indirekte spørgsmål."],
  ["chain-80", "C1", ["Vi vidste ikke,", "hvad vi skulle gøre,", "eller hvem vi skulle spørge", "om hjælp."], "Koordinerede indirekte spørgsmål uden inversion."],

  // Category 8: nominal at-clause (extraposition with det)
  ["chain-81", "B2", ["Det er tydeligt,", "at projektet er forsinket", "på grund af mange faktorer."], "At-ledsætningen er det formelle subjekts reelle indhold."],
  ["chain-82", "B2", ["Det glæder mig,", "at du fandt et nyt job", "så hurtigt."], "At-ledsætningen fungerer som det formelle subjekts reelle indhold."],
  ["chain-83", "C1", ["Det faktum,", "at hun aldrig har rejst udenlands,", "overrasker mange."], "Nominalfrase med at-ledsætning som indskud."],
  ["chain-84", "B2", ["Det er vigtigt,", "at alle møder op", "til tiden i morgen."], "At-ledsætningen angiver indholdet af det formelle det."],
  ["chain-85", "B2", ["Det overrasker mig ikke,", "at han sagde nej", "til tilbuddet."], "Ikke står efter det finitte verbum i hovedsætningen."],
  ["chain-86", "B2", ["Det bekymrer forældrene,", "at skolen har så få lærere", "tilbage."], "At-ledsætningen udtrykker grunden til bekymringen."],
  ["chain-87", "B2", ["Det viste sig,", "at hele historien var opfundet", "fra ende til anden."], "At-ledsætningen angiver, hvad der viste sig."],
  ["chain-88", "B2", ["Det er ikke sikkert,", "at mødet bliver afholdt", "som planlagt."], "Ikke står inde i hovedsætningen før adjektivet sikkert."],
  ["chain-89", "C1", ["Den omstændighed,", "at firmaet manglede kapital,", "førte til konkursen."], "Nominalfrase med at-ledsætning som indskud, ligesom det faktum."],
  ["chain-90", "B2", ["Det undrer mig,", "at ingen har nævnt problemet", "før nu."], "At-ledsætningen angiver, hvad der undrer."],

  // Category 9: double embedding — at-clause containing a relative clause
  ["chain-91", "C1", ["Jeg tror,", "at den mand,", "du mødte i går,", "er min nye chef."], "At-ledsætning med en indskudt relativsætning uden som/der (objekt udeladt)."],
  ["chain-92", "C1", ["Hun sagde,", "at bogen,", "som jeg lånte af hende,", "var fantastisk god."], "At-ledsætning med indskudt relativsætning (som som objekt)."],
  ["chain-93", "C1", ["Vi hørte,", "at huset,", "der lå nær stranden,", "var blevet solgt for en høj pris."], "At-ledsætning med indskudt relativsætning (der som subjekt)."],
  ["chain-94", "C1", ["Det er sandt,", "at den beslutning,", "han tog dengang,", "ændrede alt for firmaet."], "At-ledsætning med indskudt relativsætning uden som/der (objekt udeladt)."],
  ["chain-95", "C1", ["Jeg husker,", "at den sommer,", "hvor vi rejste til Italien,", "var usædvanlig varm."], "At-ledsætning med indskudt relativsætning indledt af hvor."],
  ["chain-96", "C1", ["Han forklarede,", "at grunden,", "som han ikke ville nævne,", "var ret personlig."], "At-ledsætning med indskudt relativsætning; ikke står før det finitte verbum i relativsætningen."],
  ["chain-97", "C1", ["De fortalte,", "at læreren,", "hvis metoder var meget moderne,", "havde ændret hele skolen."], "At-ledsætning med indskudt relativsætning indledt af hvis."],
  ["chain-98", "C1", ["Jeg tvivler på,", "at det argument,", "de brugte i debatten,", "holder i praksis."], "At-ledsætning med indskudt relativsætning uden som/der (objekt udeladt)."],
  ["chain-99", "C1", ["Det viste sig,", "at manden,", "der ringede om natten,", "bare havde taget fejl af nummeret."], "At-ledsætning med indskudt relativsætning (der som subjekt)."],
  ["chain-100", "C1", ["Hun indså,", "at den fejl,", "hun havde begået,", "ikke kunne rettes nu."], "At-ledsætning med indskudt relativsætning; ikke står før det finitte verbum i den inderste ledsætning."]
];

// Validation
var ids = {};
var problems = [];
items.forEach(function (it) {
  var id = it[0], level = it[1], chunks = it[2], note = it[3];
  if (ids[id]) problems.push("duplicate id " + id);
  ids[id] = true;
  if (chunks.length > 5) problems.push(id + ": more than 5 chunks (" + chunks.length + ")");
  if (level !== "B2" && level !== "C1") problems.push(id + ": bad level " + level);
  if (!note || !note.trim()) problems.push(id + ": empty note");
});
if (items.length !== 90) problems.push("expected 90 items, got " + items.length);
if (problems.length) {
  console.error("PROBLEMS:\n" + problems.join("\n"));
  process.exit(1);
}

var lines = items.map(function (it) {
  var id = it[0], level = it[1], chunks = it[2], note = it[3];
  var sentence = chunks.join(" ");
  function js(s) { return JSON.stringify(s); }
  var chunksJs = "[" + chunks.map(js).join(", ") + "]";
  return '    { id: ' + js(id) + ', level: ' + js(level) + ', mode: "clause_chain", sentence: ' + js(sentence) + ', chunks: ' + chunksJs + ', accepted_orders: [' + chunksJs + '], note: ' + js(note) + ' },';
});

require('fs').writeFileSync('tmp_chain_lines.txt', lines.join("\n") + "\n");
console.log("OK: wrote " + lines.length + " lines to tmp_chain_lines.txt");
