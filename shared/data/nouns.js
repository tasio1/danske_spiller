// shared/data/nouns.js
// Canonical Danish noun dataset. Exports window.DANSK_NOUNS.
// Schema (see prd.md § 1.3):
// { id, level, base, gender, indefinite_singular, definite_singular,
//   indefinite_plural, definite_plural, plural_pattern, note, example, tags, verify }
// plural_pattern in: er | e | zero | umlaut-er | irregular | foreign
(function () {
  'use strict';

  function slug(base) {
    return base
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'oe')
      .replace(/å/g, 'aa')
      .replace(/é/g, 'e')
      .replace(/[^a-z0-9]+/g, '-');
  }

  // Builder for nouns whose definite forms follow the regular mechanical
  // rules cleanly (no consonant-doubling or vowel-elision surprises).
  function noun(level, base, gender, indefinitePlural, pattern, note, example, tags, verify) {
    var isEn = gender === 'en';
    var defSingular = /e$/.test(base) ? base + (isEn ? 'n' : 't') : base + (isEn ? 'en' : 'et');
    var defPlural = /(e|er)$/.test(indefinitePlural) ? indefinitePlural + 'ne' : indefinitePlural + 'ene';
    return {
      id: slug(base),
      level: level,
      base: base,
      gender: gender,
      indefinite_singular: (isEn ? 'en ' : 'et ') + base,
      definite_singular: defSingular,
      indefinite_plural: indefinitePlural,
      definite_plural: defPlural,
      plural_pattern: pattern,
      note: note,
      example: example,
      tags: tags || [],
      verify: !!verify
    };
  }

  // Fully explicit entries for nouns with irregular stems, umlaut plurals,
  // zero plurals, or consonant doubling that the mechanical builder above
  // cannot derive safely.
  var MANUAL = [
    { id: 'mand', level: 'A1', base: 'mand', gender: 'en', indefinite_singular: 'en mand', definite_singular: 'manden', indefinite_plural: 'mænd', definite_plural: 'mændene', plural_pattern: 'irregular', note: 'Mand har uregelmæssigt flertal med vokalskifte: mand → mænd.', example: 'Mændene arbejder i haven.', tags: ['family'], verify: false },
    { id: 'barn', level: 'A1', base: 'barn', gender: 'et', indefinite_singular: 'et barn', definite_singular: 'barnet', indefinite_plural: 'børn', definite_plural: 'børnene', plural_pattern: 'irregular', note: 'Barn danner flertal med vokalskifte: barn → børn, ikke *barner.', example: 'Børnene leger i parken.', tags: ['family'], verify: false },
    { id: 'bror', level: 'A1', base: 'bror', gender: 'en', indefinite_singular: 'en bror', definite_singular: 'broren', indefinite_plural: 'brødre', definite_plural: 'brødrene', plural_pattern: 'irregular', note: 'Bror har uregelmæssigt flertal: bror → brødre.', example: 'Mine brødre bor i København.', tags: ['family'], verify: false },
    { id: 'mor', level: 'A1', base: 'mor', gender: 'en', indefinite_singular: 'en mor', definite_singular: 'moren', indefinite_plural: 'mødre', definite_plural: 'mødrene', plural_pattern: 'irregular', note: 'Mor har uregelmæssigt flertal: mor → mødre.', example: 'Mødrene henter børnene fra skole.', tags: ['family'], verify: false },
    { id: 'far', level: 'A1', base: 'far', gender: 'en', indefinite_singular: 'en far', definite_singular: 'faren', indefinite_plural: 'fædre', definite_plural: 'fædrene', plural_pattern: 'irregular', note: 'Far har uregelmæssigt flertal: far → fædre.', example: 'Fædrene mødtes til forældremøde.', tags: ['family'], verify: false },
    { id: 'soester', level: 'A1', base: 'søster', gender: 'en', indefinite_singular: 'en søster', definite_singular: 'søsteren', indefinite_plural: 'søstre', definite_plural: 'søstrene', plural_pattern: 'irregular', note: 'Søster mister sit sidste e i flertal: søster → søstre.', example: 'Søstrene ligner hinanden meget.', tags: ['family'], verify: false },
    { id: 'datter', level: 'A1', base: 'datter', gender: 'en', indefinite_singular: 'en datter', definite_singular: 'datteren', indefinite_plural: 'døtre', definite_plural: 'døtrene', plural_pattern: 'irregular', note: 'Datter har uregelmæssigt flertal med vokalskifte: datter → døtre.', example: 'Døtrene hjælper deres mor.', tags: ['family'], verify: false },
    { id: 'soen', level: 'A1', base: 'søn', gender: 'en', indefinite_singular: 'en søn', definite_singular: 'sønnen', indefinite_plural: 'sønner', definite_plural: 'sønnerne', plural_pattern: 'er', note: 'Søn fordobler konsonanten foran endelsen: søn → sønnen, sønner.', example: 'Sønnerne spiller fodbold sammen.', tags: ['family'], verify: false },
    { id: 'ven', level: 'A1', base: 'ven', gender: 'en', indefinite_singular: 'en ven', definite_singular: 'vennen', indefinite_plural: 'venner', definite_plural: 'vennerne', plural_pattern: 'er', note: 'Ven fordobler konsonanten foran endelsen: ven → vennen, venner.', example: 'Vennerne mødes hver fredag.', tags: ['family'], verify: false },
    { id: 'fod', level: 'A1', base: 'fod', gender: 'en', indefinite_singular: 'en fod', definite_singular: 'foden', indefinite_plural: 'fødder', definite_plural: 'fødderne', plural_pattern: 'umlaut-er', note: 'Fod danner flertal med vokalskifte og -er: fod → fødder.', example: 'Fødderne er kolde om vinteren.', tags: ['body'], verify: false },
    { id: 'haand', level: 'A1', base: 'hånd', gender: 'en', indefinite_singular: 'en hånd', definite_singular: 'hånden', indefinite_plural: 'hænder', definite_plural: 'hænderne', plural_pattern: 'umlaut-er', note: 'Hånd danner flertal med vokalskifte og -er: hånd → hænder.', example: 'Hænderne var beskidte efter arbejdet.', tags: ['body'], verify: false },
    { id: 'tand', level: 'A1', base: 'tand', gender: 'en', indefinite_singular: 'en tand', definite_singular: 'tanden', indefinite_plural: 'tænder', definite_plural: 'tænderne', plural_pattern: 'umlaut-er', note: 'Tand danner flertal med vokalskifte og -er: tand → tænder.', example: 'Tænderne skal børstes to gange om dagen.', tags: ['body'], verify: false },
    { id: 'oeje', level: 'A1', base: 'øje', gender: 'et', indefinite_singular: 'et øje', definite_singular: 'øjet', indefinite_plural: 'øjne', definite_plural: 'øjnene', plural_pattern: 'irregular', note: 'Øje har uregelmæssigt flertal: øje → øjne, ikke *øjer.', example: 'Øjnene lukkede sig af træthed.', tags: ['body'], verify: false },
    { id: 'oere', level: 'A1', base: 'øre', gender: 'et', indefinite_singular: 'et øre', definite_singular: 'øret', indefinite_plural: 'ører', definite_plural: 'ørerne', plural_pattern: 'er', note: 'Øre (kropsdel) får -er i flertal: øre → ører.', example: 'Ørerne blev røde af kulden.', tags: ['body'], verify: false },
    { id: 'bog', level: 'A1', base: 'bog', gender: 'en', indefinite_singular: 'en bog', definite_singular: 'bogen', indefinite_plural: 'bøger', definite_plural: 'bøgerne', plural_pattern: 'umlaut-er', note: 'Bog danner flertal med vokalskifte og -er: bog → bøger.', example: 'Bøgerne står på hylden.', tags: ['objects'], verify: false },
    { id: 'nat', level: 'A1', base: 'nat', gender: 'en', indefinite_singular: 'en nat', definite_singular: 'natten', indefinite_plural: 'nætter', definite_plural: 'nætterne', plural_pattern: 'umlaut-er', note: 'Nat fordobler konsonanten og skifter vokal: nat → natten, nætter.', example: 'Nætterne bliver længere om vinteren.', tags: ['time'], verify: false },
    { id: 'gaas', level: 'A2', base: 'gås', gender: 'en', indefinite_singular: 'en gås', definite_singular: 'gåsen', indefinite_plural: 'gæs', definite_plural: 'gæssene', plural_pattern: 'irregular', note: 'Gås danner flertal ved rent vokalskifte og fordobler s i bestemt flertal: gås → gæs → gæssene.', example: 'Gæssene fløj mod syd.', tags: ['animals'], verify: false },
    { id: 'and', level: 'A2', base: 'and', gender: 'en', indefinite_singular: 'en and', definite_singular: 'anden', indefinite_plural: 'ænder', definite_plural: 'ænderne', plural_pattern: 'umlaut-er', note: 'And danner flertal med vokalskifte og -er: and → ænder.', example: 'Ænderne svømmer i søen.', tags: ['animals'], verify: false },
    { id: 'ko', level: 'A1', base: 'ko', gender: 'en', indefinite_singular: 'en ko', definite_singular: 'koen', indefinite_plural: 'køer', definite_plural: 'køerne', plural_pattern: 'umlaut-er', note: 'Ko danner flertal med vokalskifte og -er: ko → køer.', example: 'Køerne græsser på marken.', tags: ['animals'], verify: false },
    { id: 'mus', level: 'A1', base: 'mus', gender: 'en', indefinite_singular: 'en mus', definite_singular: 'musen', indefinite_plural: 'mus', definite_plural: 'musene', plural_pattern: 'zero', note: 'Mus har samme form i ubestemt ental og flertal: en mus, mus.', example: 'Musene løb hen over gulvet.', tags: ['animals'], verify: false },
    { id: 'finger', level: 'A1', base: 'finger', gender: 'en', indefinite_singular: 'en finger', definite_singular: 'fingeren', indefinite_plural: 'fingre', definite_plural: 'fingrene', plural_pattern: 'irregular', note: 'Finger mister sit e foran flertalsendelsen: finger → fingre.', example: 'Fingrene var stive af kulde.', tags: ['body'], verify: false },
    { id: 'trae', level: 'A1', base: 'træ', gender: 'et', indefinite_singular: 'et træ', definite_singular: 'træet', indefinite_plural: 'træer', definite_plural: 'træerne', plural_pattern: 'irregular', note: 'Træ får -er i flertal selvom ordet ender på vokal: træ → træer.', example: 'Træerne mister blade om efteråret.', tags: ['nature'], verify: false },
    { id: 'sko', level: 'A1', base: 'sko', gender: 'en', indefinite_singular: 'en sko', definite_singular: 'skoen', indefinite_plural: 'sko', definite_plural: 'skoene', plural_pattern: 'zero', note: 'Sko har samme form i ubestemt ental og flertal: en sko, sko.', example: 'Skoene stod ved døren.', tags: ['clothing'], verify: false },
    { id: 'tal', level: 'A1', base: 'tal', gender: 'et', indefinite_singular: 'et tal', definite_singular: 'tallet', indefinite_plural: 'tal', definite_plural: 'tallene', plural_pattern: 'zero', note: 'Tal fordobler konsonanten i bestemt form: tal → tallet, tallene.', example: 'Tallene stod skrevet på tavlen.', tags: ['abstract'], verify: false },
    { id: 'aar', level: 'A1', base: 'år', gender: 'et', indefinite_singular: 'et år', definite_singular: 'året', indefinite_plural: 'år', definite_plural: 'årene', plural_pattern: 'zero', note: 'År har samme form i ubestemt ental og flertal: et år, år.', example: 'Årene går hurtigt.', tags: ['time'], verify: false },
    { id: 'ord', level: 'A1', base: 'ord', gender: 'et', indefinite_singular: 'et ord', definite_singular: 'ordet', indefinite_plural: 'ord', definite_plural: 'ordene', plural_pattern: 'zero', note: 'Ord har samme form i ubestemt ental og flertal: et ord, ord.', example: 'Ordene stod tydeligt i bogen.', tags: ['abstract'], verify: false },
    { id: 'dyr', level: 'A1', base: 'dyr', gender: 'et', indefinite_singular: 'et dyr', definite_singular: 'dyret', indefinite_plural: 'dyr', definite_plural: 'dyrene', plural_pattern: 'zero', note: 'Dyr har samme form i ubestemt ental og flertal: et dyr, dyr.', example: 'Dyrene sover om vinteren.', tags: ['animals'], verify: false },
    { id: 'knae', level: 'A1', base: 'knæ', gender: 'et', indefinite_singular: 'et knæ', definite_singular: 'knæet', indefinite_plural: 'knæ', definite_plural: 'knæene', plural_pattern: 'zero', note: 'Knæ har samme form i ental og flertal: et knæ, knæ.', example: 'Knæene gjorde ondt efter løbeturen.', tags: ['body'], verify: false },
    { id: 'hjul', level: 'A2', base: 'hjul', gender: 'et', indefinite_singular: 'et hjul', definite_singular: 'hjulet', indefinite_plural: 'hjul', definite_plural: 'hjulene', plural_pattern: 'zero', note: 'Hjul har samme form i ental og flertal: et hjul, hjul.', example: 'Hjulene drejede hurtigt rundt.', tags: ['transport'], verify: false },
    { id: 'glas', level: 'A1', base: 'glas', gender: 'et', indefinite_singular: 'et glas', definite_singular: 'glasset', indefinite_plural: 'glas', definite_plural: 'glassene', plural_pattern: 'zero', note: 'Glas fordobler konsonanten i bestemt form: glas → glasset, glassene.', example: 'Glassene stod på bordet.', tags: ['objects'], verify: false },
    { id: 'aeg', level: 'A1', base: 'æg', gender: 'et', indefinite_singular: 'et æg', definite_singular: 'ægget', indefinite_plural: 'æg', definite_plural: 'æggene', plural_pattern: 'zero', note: 'Æg fordobler konsonanten i bestemt form: æg →ægget, æggene.', example: 'Æggene lå i kurven.', tags: ['food'], verify: false },
    { id: 'taa', level: 'A2', base: 'tå', gender: 'en', indefinite_singular: 'en tå', definite_singular: 'tåen', indefinite_plural: 'tæer', definite_plural: 'tæerne', plural_pattern: 'umlaut-er', note: 'Tå danner flertal med vokalskifte og -er: tå → tæer.', example: 'Tæerne var kolde i sandalerne.', tags: ['body'], verify: false },
    { id: 'laar', level: 'B1', base: 'lår', gender: 'et', indefinite_singular: 'et lår', definite_singular: 'låret', indefinite_plural: 'lår', definite_plural: 'lårene', plural_pattern: 'zero', note: 'Lår har samme form i ubestemt ental og flertal: et lår, lår.', example: 'Lårene var trætte efter cykelturen.', tags: ['body'], verify: false },
    { id: 'menneske', level: 'A1', base: 'menneske', gender: 'et', indefinite_singular: 'et menneske', definite_singular: 'mennesket', indefinite_plural: 'mennesker', definite_plural: 'menneskene', plural_pattern: 'irregular', note: 'Menneske får -er i flertal, men bestemt flertal udelader r: mennesker → menneskene.', example: 'Menneskene stod i kø foran butikken.', tags: ['people'], verify: true },
    { id: 'kartoffel', level: 'A1', base: 'kartoffel', gender: 'en', indefinite_singular: 'en kartoffel', definite_singular: 'kartoflen', indefinite_plural: 'kartofler', definite_plural: 'kartoflerne', plural_pattern: 'irregular', note: 'Kartoffel mister sit e foran flertalsendelsen: kartoffel → kartofler.', example: 'Kartoflerne kogte i tyve minutter.', tags: ['food'], verify: false },
    { id: 'gulerod', level: 'A2', base: 'gulerod', gender: 'en', indefinite_singular: 'en gulerod', definite_singular: 'guleroden', indefinite_plural: 'gulerødder', definite_plural: 'gulerødderne', plural_pattern: 'umlaut-er', note: 'Gulerod danner flertal ligesom rod, med vokalskifte og -er: gulerod → gulerødder.', example: 'Gulerødderne lå i køleskabet.', tags: ['food'], verify: false },
    { id: 'foraelder', level: 'A2', base: 'forælder', gender: 'en', indefinite_singular: 'en forælder', definite_singular: 'forælderen', indefinite_plural: 'forældre', definite_plural: 'forældrene', plural_pattern: 'irregular', note: 'Forælder har uregelmæssigt flertal: forælder → forældre.', example: 'Forældrene kom til skolefesten.', tags: ['family'], verify: false },
    { id: 'onkel', level: 'A2', base: 'onkel', gender: 'en', indefinite_singular: 'en onkel', definite_singular: 'onklen', indefinite_plural: 'onkler', definite_plural: 'onklerne', plural_pattern: 'irregular', note: 'Onkel mister sit e foran flertalsendelsen: onkel → onkler.', example: 'Onklerne besøgte os i sommerferien.', tags: ['family'], verify: false },
    { id: 'rod', level: 'B1', base: 'rod', gender: 'en', indefinite_singular: 'en rod', definite_singular: 'roden', indefinite_plural: 'rødder', definite_plural: 'rødderne', plural_pattern: 'umlaut-er', note: 'Rod danner flertal med vokalskifte og -er: rod → rødder.', example: 'Rødderne bredte sig under jorden.', tags: ['nature'], verify: false },
    { id: 'cykel', level: 'A1', base: 'cykel', gender: 'en', indefinite_singular: 'en cykel', definite_singular: 'cyklen', indefinite_plural: 'cykler', definite_plural: 'cyklerne', plural_pattern: 'irregular', note: 'Cykel mister sit e foran flertalsendelsen: cykel → cykler.', example: 'Cyklerne stod parkeret udenfor.', tags: ['transport'], verify: false },
    { id: 'hotel', level: 'A1', base: 'hotel', gender: 'et', indefinite_singular: 'et hotel', definite_singular: 'hotellet', indefinite_plural: 'hoteller', definite_plural: 'hotellerne', plural_pattern: 'er', note: 'Hotel fordobler konsonanten foran endelsen: hotel → hotellet, hoteller.', example: 'Hotellerne i byen var fyldt op.', tags: ['town'], verify: false },
    { id: 'kat', level: 'A1', base: 'kat', gender: 'en', indefinite_singular: 'en kat', definite_singular: 'katten', indefinite_plural: 'katte', definite_plural: 'kattene', plural_pattern: 'e', note: 'Kat fordobler konsonanten foran endelsen: kat → katten, katte.', example: 'Kattene sov i solen.', tags: ['animals'], verify: false },
    { id: 'hat', level: 'A2', base: 'hat', gender: 'en', indefinite_singular: 'en hat', definite_singular: 'hatten', indefinite_plural: 'hatte', definite_plural: 'hattene', plural_pattern: 'e', note: 'Hat fordobler konsonanten foran endelsen: hat → hatten, hatte.', example: 'Hattene hang på knagerækken.', tags: ['clothing'], verify: false },
    { id: 'sok', level: 'A2', base: 'sok', gender: 'en', indefinite_singular: 'en sok', definite_singular: 'sokken', indefinite_plural: 'sokker', definite_plural: 'sokkerne', plural_pattern: 'er', note: 'Sok fordobler konsonanten foran endelsen: sok → sokken, sokker.', example: 'Sokkerne lå sammen i skuffen.', tags: ['clothing'], verify: false },
    { id: 'ryg', level: 'A1', base: 'ryg', gender: 'en', indefinite_singular: 'en ryg', definite_singular: 'ryggen', indefinite_plural: 'rygge', definite_plural: 'ryggene', plural_pattern: 'e', note: 'Ryg fordobler konsonanten foran endelsen: ryg → ryggen, rygge.', example: 'Ryggene på stolene var af træ.', tags: ['body'], verify: false },
    { id: 'bus', level: 'A1', base: 'bus', gender: 'en', indefinite_singular: 'en bus', definite_singular: 'bussen', indefinite_plural: 'busser', definite_plural: 'busserne', plural_pattern: 'er', note: 'Bus fordobler konsonanten foran endelsen: bus → bussen, busser.', example: 'Busserne kørte hvert tiende minut.', tags: ['transport'], verify: false },
    { id: 'droem', level: 'A2', base: 'drøm', gender: 'en', indefinite_singular: 'en drøm', definite_singular: 'drømmen', indefinite_plural: 'drømme', definite_plural: 'drømmene', plural_pattern: 'e', note: 'Drøm fordobler konsonanten foran endelsen: drøm → drømmen, drømme.', example: 'Drømmene forsvandt, da hun vågnede.', tags: ['abstract'], verify: false },
    { id: 'minut', level: 'A1', base: 'minut', gender: 'et', indefinite_singular: 'et minut', definite_singular: 'minuttet', indefinite_plural: 'minutter', definite_plural: 'minutterne', plural_pattern: 'er', note: 'Minut fordobler konsonanten foran endelsen: minut → minuttet, minutter.', example: 'Minutterne føltes som timer.', tags: ['time'], verify: false },
    { id: 'butik', level: 'A1', base: 'butik', gender: 'en', indefinite_singular: 'en butik', definite_singular: 'butikken', indefinite_plural: 'butikker', definite_plural: 'butikkerne', plural_pattern: 'er', note: 'Butik fordobler konsonanten foran endelsen: butik → butikken, butikker.', example: 'Butikkerne åbner klokken ti.', tags: ['town'], verify: false },
    { id: 'robot', level: 'B1', base: 'robot', gender: 'en', indefinite_singular: 'en robot', definite_singular: 'robotten', indefinite_plural: 'robotter', definite_plural: 'robotterne', plural_pattern: 'er', note: 'Robot fordobler konsonanten foran endelsen: robot → robotten, robotter.', example: 'Robotterne arbejdede på fabrikken.', tags: ['technology'], verify: false },
    { id: 'edderkop', level: 'B1', base: 'edderkop', gender: 'en', indefinite_singular: 'en edderkop', definite_singular: 'edderkoppen', indefinite_plural: 'edderkopper', definite_plural: 'edderkopperne', plural_pattern: 'er', note: 'Edderkop fordobler konsonanten foran endelsen: edderkop → edderkoppen, edderkopper.', example: 'Edderkopperne spandt net i vinduet.', tags: ['animals'], verify: false }
  ];

  var REGULAR = [
    // Home & furniture
    noun('A1', 'hus', 'et', 'huse', 'e', 'Hus får -e i flertal: hus → huse.', 'Husene lå tæt på stranden.', ['home']),
    noun('A1', 'bord', 'et', 'borde', 'e', 'Bord får -e i flertal: bord → borde.', 'Bordene blev dækket til festen.', ['home']),
    noun('A1', 'stol', 'en', 'stole', 'e', 'Stol får -e i flertal: stol → stole.', 'Stolene stod omkring bordet.', ['home']),
    noun('A1', 'seng', 'en', 'senge', 'e', 'Seng får -e i flertal: seng → senge.', 'Sengene blev redt om morgenen.', ['home']),
    noun('A1', 'dør', 'en', 'døre', 'e', 'Dør får -e i flertal: dør → døre.', 'Dørene blev låst om aftenen.', ['home']),
    noun('A1', 'vindue', 'et', 'vinduer', 'er', 'Vindue får -er i flertal: vindue → vinduer.', 'Vinduerne blev pudset i weekenden.', ['home']),
    noun('A1', 'lampe', 'en', 'lamper', 'er', 'Lampe får -r i flertal, da ordet ender på -e: lampe → lamper.', 'Lamperne blev tændt, da det blev mørkt.', ['home']),
    noun('A1', 'gulv', 'et', 'gulve', 'e', 'Gulv får -e i flertal: gulv → gulve.', 'Gulvene blev vasket hver uge.', ['home']),
    noun('A2', 'loft', 'et', 'lofter', 'er', 'Loft får -er i flertal: loft → lofter.', 'Lofterne var høje i den gamle bygning.', ['home']),
    noun('A1', 'tag', 'et', 'tage', 'e', 'Tag får -e i flertal: tag → tage.', 'Tagene var dækket af sne.', ['home']),
    noun('A1', 'skab', 'et', 'skabe', 'e', 'Skab får -e i flertal: skab → skabe.', 'Skabene stod langs væggen.', ['home']),
    noun('A1', 'køkken', 'et', 'køkkener', 'er', 'Køkken får -er i flertal: køkken → køkkener.', 'Køkkenerne blev renoveret sidste år.', ['home'], true),
    noun('A2', 'badeværelse', 'et', 'badeværelser', 'er', 'Badeværelse får -r i flertal, da ordet ender på -e: badeværelse → badeværelser.', 'Badeværelserne blev malet hvide.', ['home']),
    noun('A2', 'soveværelse', 'et', 'soveværelser', 'er', 'Soveværelse får -r i flertal, da ordet ender på -e: soveværelse → soveværelser.', 'Soveværelserne lå på første sal.', ['home']),
    noun('A1', 'have', 'en', 'haver', 'er', 'Have får -r i flertal, da ordet ender på -e: have → haver.', 'Haverne blomstrede om foråret.', ['home']),
    noun('B1', 'altan', 'en', 'altaner', 'er', 'Altan får -er i flertal: altan → altaner.', 'Altanerne vendte ud mod gaden.', ['home']),
    noun('A1', 'nøgle', 'en', 'nøgler', 'er', 'Nøgle får -r i flertal, da ordet ender på -e: nøgle → nøgler.', 'Nøglerne lå i skålen ved døren.', ['home']),
    noun('A2', 'spejl', 'et', 'spejle', 'e', 'Spejl får -e i flertal: spejl → spejle.', 'Spejlene hang på hver sin væg.', ['home']),
    noun('A2', 'tæppe', 'et', 'tæpper', 'er', 'Tæppe får -r i flertal, da ordet ender på -e: tæppe → tæpper.', 'Tæpperne dækkede det kolde gulv.', ['home']),
    noun('B1', 'reol', 'en', 'reoler', 'er', 'Reol får -er i flertal: reol → reoler.', 'Reolerne var fyldt med bøger.', ['home']),
    noun('A1', 'sofa', 'en', 'sofaer', 'er', 'Sofa får -er i flertal: sofa → sofaer.', 'Sofaerne stod i den store stue.', ['home']),

    // Family & people
    noun('A1', 'kvinde', 'en', 'kvinder', 'er', 'Kvinde får -r i flertal, da ordet ender på -e: kvinde → kvinder.', 'Kvinderne mødtes til kaffe.', ['family']),
    noun('A1', 'dreng', 'en', 'drenge', 'e', 'Dreng følger -e-mønsteret i flertal: dreng → drenge.', 'Drengene spillede fodbold i gården.', ['family']),
    noun('A1', 'pige', 'en', 'piger', 'er', 'Pige får kun -r i flertal, da ordet ender på -e: pige → piger.', 'Pigerne tegnede billeder i timen.', ['family']),
    noun('A2', 'veninde', 'en', 'veninder', 'er', 'Veninde får -r i flertal, da ordet ender på -e: veninde → veninder.', 'Veninderne rejste sammen til Italien.', ['family']),
    noun('A2', 'nabo', 'en', 'naboer', 'er', 'Nabo får -er i flertal: nabo → naboer.', 'Naboerne hilste venligt på hinanden.', ['family']),
    noun('A2', 'tante', 'en', 'tanter', 'er', 'Tante får -r i flertal, da ordet ender på -e: tante → tanter.', 'Tanterne kom på besøg til jul.', ['family']),
    noun('B1', 'nevø', 'en', 'nevøer', 'er', 'Nevø får -er i flertal: nevø → nevøer.', 'Nevøerne legede i haven hele eftermiddagen.', ['family']),
    noun('B1', 'niece', 'en', 'niecer', 'er', 'Niece får -r i flertal, da ordet ender på -e: niece → niecer.', 'Niecerne fik nye cykler i fødselsdagsgave.', ['family']),
    noun('A2', 'chef', 'en', 'chefer', 'er', 'Chef får -er i flertal: chef → chefer.', 'Cheferne holdt møde om morgenen.', ['work']),
    noun('B1', 'kollega', 'en', 'kolleger', 'er', 'Kollega får -er i flertal: kollega → kolleger.', 'Kollegerne spiste frokost sammen.', ['work']),

    // Body
    noun('A1', 'arm', 'en', 'arme', 'e', 'Arm følger -e-mønsteret i flertal: arm → arme.', 'Armene var trætte efter svømning.', ['body']),
    noun('A1', 'mave', 'en', 'maver', 'er', 'Mave får -r i flertal, da ordet ender på -e: mave → maver.', 'Maverne rumlede af sult.', ['body']),
    noun('A1', 'mund', 'en', 'munde', 'e', 'Mund følger -e-mønsteret i flertal: mund → munde.', 'Mundene grinede højt af vittigheden.', ['body']),
    noun('A1', 'næse', 'en', 'næser', 'er', 'Næse får -r i flertal, da ordet ender på -e: næse → næser.', 'Næserne var røde af kulden.', ['body']),
    noun('A1', 'hals', 'en', 'halse', 'e', 'Hals følger -e-mønsteret i flertal: hals → halse.', 'Halsene var stive efter turen.', ['body']),
    noun('A1', 'ben', 'et', 'ben', 'zero', 'Ben har samme form i ubestemt ental og flertal: et ben, ben.', 'Benene var trætte efter løbeturen.', ['body']),
    noun('A1', 'hoved', 'et', 'hoveder', 'er', 'Hoved får -er i flertal: hoved → hoveder.', 'Hovederne nikkede samstemmende.', ['body']),

    // Nature & weather
    noun('A1', 'sol', 'en', 'sole', 'e', 'Sol bruges næsten altid i ental, men følger -e-mønsteret i flertal: sol → sole.', 'Solene i fortællingen symboliserede håb.', ['nature'], true),
    noun('A1', 'måne', 'en', 'måner', 'er', 'Måne får -r i flertal, da ordet ender på -e: måne → måner.', 'Månerne omkring planeten blev talt af astronomerne.', ['nature']),
    noun('A1', 'sky', 'en', 'skyer', 'er', 'Sky får -er i flertal: sky → skyer.', 'Skyerne trak sig sammen før uvejret.', ['nature']),
    noun('A2', 'stjerne', 'en', 'stjerner', 'er', 'Stjerne får -r i flertal, da ordet ender på -e: stjerne → stjerner.', 'Stjernerne lyste klart på nattehimlen.', ['nature']),
    noun('A2', 'storm', 'en', 'storme', 'e', 'Storm følger -e-mønsteret i flertal: storm → storme.', 'Stormene ramte kysten hver vinter.', ['nature']),
    noun('B1', 'regnbue', 'en', 'regnbuer', 'er', 'Regnbue får -r i flertal, da ordet ender på -e: regnbue → regnbuer.', 'Regnbuerne dukkede op efter regnvejret.', ['nature']),
    noun('A1', 'skov', 'en', 'skove', 'e', 'Skov følger -e-mønsteret i flertal: skov → skove.', 'Skovene var fyldt med svampe om efteråret.', ['nature']),
    noun('A2', 'mark', 'en', 'marker', 'er', 'Mark får -er i flertal: mark → marker.', 'Markerne var dækket af korn.', ['nature']),
    noun('A1', 'bjerg', 'et', 'bjerge', 'e', 'Bjerg følger -e-mønsteret i flertal: bjerg → bjerge.', 'Bjergene var dækket af sne hele året.', ['nature']),
    noun('A2', 'dal', 'en', 'dale', 'e', 'Dal følger -e-mønsteret i flertal: dal → dale.', 'Dalene lå grønne mellem bjergene.', ['nature']),
    noun('A2', 'flod', 'en', 'floder', 'er', 'Flod får -er i flertal: flod → floder.', 'Floderne løb ud i havet.', ['nature']),
    noun('A1', 'sø', 'en', 'søer', 'er', 'Sø får -er i flertal: sø → søer.', 'Søerne frøs til om vinteren.', ['nature']),
    noun('A1', 'hav', 'et', 'have', 'e', 'Hav følger -e-mønsteret i flertal: hav → have.', 'Havene dækker det meste af jorden.', ['nature']),
    noun('A1', 'sten', 'en', 'sten', 'zero', 'Sten har samme form i ubestemt ental og flertal: en sten, sten.', 'Stenene lå spredt langs stien.', ['nature']),
    noun('A1', 'blomst', 'en', 'blomster', 'er', 'Blomst får -er i flertal: blomst → blomster.', 'Blomsterne blomstrede tidligt i år.', ['nature']),
    noun('A2', 'blad', 'et', 'blade', 'e', 'Blad følger -e-mønsteret i flertal: blad → blade.', 'Bladene faldt af træerne om efteråret.', ['nature']),
    noun('A2', 'gren', 'en', 'grene', 'e', 'Gren følger -e-mønsteret i flertal: gren → grene.', 'Grenene knækkede under sneens vægt.', ['nature']),

    // Time
    noun('A1', 'dag', 'en', 'dage', 'e', 'Dag følger -e-mønsteret i flertal: dag → dage.', 'Dagene blev længere om foråret.', ['time']),
    noun('A1', 'uge', 'en', 'uger', 'er', 'Uge får -r i flertal, da ordet ender på -e: uge → uger.', 'Ugerne gik hurtigt i sommerferien.', ['time']),
    noun('A1', 'måned', 'en', 'måneder', 'er', 'Måned får -er i flertal: måned → måneder.', 'Månederne føltes lange under eksamen.', ['time']),
    noun('A1', 'time', 'en', 'timer', 'er', 'Time får -r i flertal, da ordet ender på -e: time → timer.', 'Timerne på skemaet var lange om fredagen.', ['time']),
    noun('A2', 'sekund', 'et', 'sekunder', 'er', 'Sekund får -er i flertal: sekund → sekunder.', 'Sekunderne tikkede langsomt af sted.', ['time']),
    noun('A2', 'weekend', 'en', 'weekender', 'er', 'Weekend får -er i flertal: weekend → weekender.', 'Weekenderne brugte de på at rejse.', ['time']),
    noun('A2', 'ferie', 'en', 'ferier', 'er', 'Ferie får -r i flertal, da ordet ender på -e: ferie → ferier.', 'Ferierne blev planlagt et år i forvejen.', ['time']),
    noun('A1', 'morgen', 'en', 'morgener', 'er', 'Morgen får -er i flertal: morgen → morgener.', 'Morgenerne var kolde i november.', ['time'], true),
    noun('A1', 'aften', 'en', 'aftener', 'er', 'Aften får -er i flertal: aften → aftener.', 'Aftenerne blev brugt på at læse højt.', ['time']),

    // Clothing
    noun('A1', 'trøje', 'en', 'trøjer', 'er', 'Trøje får -r i flertal, da ordet ender på -e: trøje → trøjer.', 'Trøjerne hang på tørresnoren.', ['clothing']),
    noun('A1', 'skjorte', 'en', 'skjorter', 'er', 'Skjorte får -r i flertal, da ordet ender på -e: skjorte → skjorter.', 'Skjorterne var strøget og hængt op.', ['clothing']),
    noun('A1', 'kjole', 'en', 'kjoler', 'er', 'Kjole får -r i flertal, da ordet ender på -e: kjole → kjoler.', 'Kjolerne hang pænt i skabet.', ['clothing']),
    noun('A1', 'jakke', 'en', 'jakker', 'er', 'Jakke får -r i flertal, da ordet ender på -e: jakke → jakker.', 'Jakkerne var våde efter regnvejret.', ['clothing']),
    noun('A2', 'handske', 'en', 'handsker', 'er', 'Handske får -r i flertal, da ordet ender på -e: handske → handsker.', 'Handskerne lå i lommen på frakken.', ['clothing']),
    noun('A2', 'hue', 'en', 'huer', 'er', 'Hue får -r i flertal, da ordet ender på -e: hue → huer.', 'Huerne beskyttede mod kulden.', ['clothing']),
    noun('B1', 'tørklæde', 'et', 'tørklæder', 'er', 'Tørklæde får -r i flertal, da ordet ender på -e: tørklæde → tørklæder.', 'Tørklæderne var strikket i uld.', ['clothing']),
    noun('A2', 'frakke', 'en', 'frakker', 'er', 'Frakke får -r i flertal, da ordet ender på -e: frakke → frakker.', 'Frakkerne hang ved døren.', ['clothing']),
    noun('A2', 'bælte', 'et', 'bælter', 'er', 'Bælte får -r i flertal, da ordet ender på -e: bælte → bælter.', 'Bælterne lå i den øverste skuffe.', ['clothing']),

    // Animals
    noun('A1', 'hund', 'en', 'hunde', 'e', 'Hund følger -e-mønsteret i flertal: hund → hunde.', 'Hundene løb glade rundt i haven.', ['animals']),
    noun('A1', 'fugl', 'en', 'fugle', 'e', 'Fugl følger -e-mønsteret i flertal: fugl → fugle.', 'Fuglene sang tidligt om morgenen.', ['animals']),
    noun('A1', 'hest', 'en', 'heste', 'e', 'Hest følger -e-mønsteret i flertal: hest → heste.', 'Hestene græssede på marken.', ['animals']),
    noun('A1', 'gris', 'en', 'grise', 'e', 'Gris følger -e-mønsteret i flertal: gris → grise.', 'Grisene rodede i mudderet.', ['animals']),
    noun('A2', 'høne', 'en', 'høner', 'er', 'Høne får -r i flertal, da ordet ender på -e: høne → høner.', 'Hønerne lagde æg hver morgen.', ['animals']),
    noun('A2', 'hane', 'en', 'haner', 'er', 'Hane får -r i flertal, da ordet ender på -e: hane → haner.', 'Hanerne galede ved solopgang.', ['animals']),
    noun('A2', 'bi', 'en', 'bier', 'er', 'Bi får -er i flertal: bi → bier.', 'Bierne fløj fra blomst til blomst.', ['animals']),
    noun('A2', 'flue', 'en', 'fluer', 'er', 'Flue får -r i flertal, da ordet ender på -e: flue → fluer.', 'Fluerne summede omkring frugten.', ['animals']),
    noun('B1', 'slange', 'en', 'slanger', 'er', 'Slange får -r i flertal, da ordet ender på -e: slange → slanger.', 'Slangerne gemte sig under stenene.', ['animals']),
    noun('A2', 'frø', 'en', 'frøer', 'er', 'Frø får -er i flertal: frø → frøer.', 'Frøerne kvækkede ved søen om natten.', ['animals']),
    noun('A2', 'ræv', 'en', 'ræve', 'e', 'Ræv følger -e-mønsteret i flertal: ræv → ræve.', 'Rævene jagede om natten.', ['animals']),
    noun('B1', 'ulv', 'en', 'ulve', 'e', 'Ulv følger -e-mønsteret i flertal: ulv → ulve.', 'Ulvene hylede i skoven.', ['animals']),
    noun('A2', 'bjørn', 'en', 'bjørne', 'e', 'Bjørn følger -e-mønsteret i flertal: bjørn → bjørne.', 'Bjørnene sov hele vinteren.', ['animals']),
    noun('A2', 'løve', 'en', 'løver', 'er', 'Løve får -r i flertal, da ordet ender på -e: løve → løver.', 'Løverne hvilede sig i skyggen.', ['animals']),
    noun('A2', 'elefant', 'en', 'elefanter', 'er', 'Elefant får -er i flertal: elefant → elefanter.', 'Elefanterne badede i floden.', ['animals']),
    noun('A2', 'abe', 'en', 'aber', 'er', 'Abe får -r i flertal, da ordet ender på -e: abe → aber.', 'Aberne klatrede rundt i træerne.', ['animals']),

    // Transport
    noun('A1', 'bil', 'en', 'biler', 'er', 'Bil får -er i flertal: bil → biler.', 'Bilerne holdt i kø ved lyskrydset.', ['transport']),
    noun('A1', 'tog', 'et', 'tog', 'zero', 'Tog har samme form i ubestemt ental og flertal: et tog, tog.', 'Togene kørte forsinket på grund af sne.', ['transport']),
    noun('A1', 'fly', 'et', 'fly', 'zero', 'Fly har samme form i ubestemt ental og flertal: et fly, fly.', 'Flyene lettede fra samme bane.', ['transport']),
    noun('A1', 'båd', 'en', 'både', 'e', 'Båd følger -e-mønsteret i flertal: båd → både.', 'Bådene lå fortøjet i havnen.', ['transport']),
    noun('A2', 'skib', 'et', 'skibe', 'e', 'Skib følger -e-mønsteret i flertal: skib → skibe.', 'Skibene sejlede ud tidligt om morgenen.', ['transport']),
    noun('A2', 'lufthavn', 'en', 'lufthavne', 'e', 'Lufthavn følger -e-mønsteret i flertal: lufthavn → lufthavne.', 'Lufthavnene var overfyldte i sommerferien.', ['transport']),
    noun('A2', 'station', 'en', 'stationer', 'er', 'Station får -er i flertal: station → stationer.', 'Stationerne blev renoveret sidste år.', ['transport']),
    noun('B1', 'vogn', 'en', 'vogne', 'e', 'Vogn følger -e-mønsteret i flertal: vogn → vogne.', 'Vognene stod klar på perronen.', ['transport']),

    // Work & school
    noun('A1', 'skole', 'en', 'skoler', 'er', 'Skole får -r i flertal, da ordet ender på -e: skole → skoler.', 'Skolerne lukkede tidligt fredag.', ['school']),
    noun('A1', 'lærer', 'en', 'lærere', 'e', 'Lærer får -e i flertal: lærer → lærere.', 'Lærerne holdt møde efter skoletid.', ['school']),
    noun('A1', 'elev', 'en', 'elever', 'er', 'Elev får -er i flertal: elev → elever.', 'Eleverne afleverede deres opgaver.', ['school']),
    noun('A1', 'klasse', 'en', 'klasser', 'er', 'Klasse får -r i flertal, da ordet ender på -e: klasse → klasser.', 'Klasserne var på tur til museet.', ['school']),
    noun('A2', 'lektie', 'en', 'lektier', 'er', 'Lektie får -r i flertal, da ordet ender på -e: lektie → lektier.', 'Lektierne skulle afleveres om mandagen.', ['school']),
    noun('B1', 'eksamen', 'en', 'eksamener', 'er', 'Eksamen får -er i flertal: eksamen → eksamener.', 'Eksamenerne lå tæt i juni.', ['school'], true),
    noun('A2', 'opgave', 'en', 'opgaver', 'er', 'Opgave får -r i flertal, da ordet ender på -e: opgave → opgaver.', 'Opgaverne var svære i denne uge.', ['school']),
    noun('B1', 'skema', 'et', 'skemaer', 'er', 'Skema får -er i flertal: skema → skemaer.', 'Skemaerne blev ændret i sidste øjeblik.', ['school']),
    noun('B2', 'uddannelse', 'en', 'uddannelser', 'er', 'Uddannelse får -r i flertal, da ordet ender på -e: uddannelse → uddannelser.', 'Uddannelserne varer typisk tre år.', ['school']),
    noun('B1', 'universitet', 'et', 'universiteter', 'er', 'Universitet får -er i flertal: universitet → universiteter.', 'Universiteterne samarbejder om forskningen.', ['school']),
    noun('A2', 'kontor', 'et', 'kontorer', 'er', 'Kontor får -er i flertal: kontor → kontorer.', 'Kontorerne lå på tredje sal.', ['work']),

    // Town & society
    noun('A1', 'by', 'en', 'byer', 'er', 'By får -er i flertal: by → byer.', 'Byerne langs kysten var meget besøgte.', ['town']),
    noun('A1', 'gade', 'en', 'gader', 'er', 'Gade får -r i flertal, da ordet ender på -e: gade → gader.', 'Gaderne var fyldte af mennesker.', ['town']),
    noun('A1', 'vej', 'en', 'veje', 'e', 'Vej følger -e-mønsteret i flertal: vej → veje.', 'Vejene var glatte af is.', ['town']),
    noun('A1', 'park', 'en', 'parker', 'er', 'Park får -er i flertal: park → parker.', 'Parkerne var fyldt med mennesker i solskin.', ['town']),
    noun('A2', 'marked', 'et', 'markeder', 'er', 'Marked får -er i flertal: marked → markeder.', 'Markederne solgte friske grøntsager.', ['town']),
    noun('A1', 'restaurant', 'en', 'restauranter', 'er', 'Restaurant får -er i flertal: restaurant → restauranter.', 'Restauranterne var booket op i weekenden.', ['town']),
    noun('A1', 'café', 'en', 'caféer', 'er', 'Café får -er i flertal, og accenten falder ofte bort: café → caféer.', 'Caféerne åbnede tidligt om morgenen.', ['town'], true),
    noun('A2', 'kirke', 'en', 'kirker', 'er', 'Kirke får -r i flertal, da ordet ender på -e: kirke → kirker.', 'Kirkerne ringede med klokkerne.', ['town']),
    noun('A2', 'bibliotek', 'et', 'biblioteker', 'er', 'Bibliotek får -er i flertal: bibliotek → biblioteker.', 'Bibliotekerne havde forlænget åbningstid.', ['town']),
    noun('A2', 'plads', 'en', 'pladser', 'er', 'Plads får -er i flertal: plads → pladser.', 'Pladserne i byen blev pyntet til jul.', ['town']),
    noun('B1', 'torv', 'et', 'torve', 'e', 'Torv følger -e-mønsteret i flertal: torv → torve.', 'Torvene summede af liv om lørdagen.', ['town']),

    // Technology
    noun('A1', 'telefon', 'en', 'telefoner', 'er', 'Telefon får -er i flertal: telefon → telefoner.', 'Telefonerne ringede samtidig.', ['technology']),
    noun('A1', 'computer', 'en', 'computere', 'e', 'Computer får -e i flertal: computer → computere.', 'Computerne blev opdateret om natten.', ['technology']),
    noun('A2', 'skærm', 'en', 'skærme', 'e', 'Skærm følger -e-mønsteret i flertal: skærm → skærme.', 'Skærmene viste den samme fejlmeddelelse.', ['technology']),
    noun('B1', 'tastatur', 'et', 'tastaturer', 'er', 'Tastatur får -er i flertal: tastatur → tastaturer.', 'Tastaturerne var støvede efter mange års brug.', ['technology']),
    noun('A2', 'app', 'en', 'apps', 'foreign', 'App får -s i flertal ligesom i engelsk: app → apps.', 'Appsene fyldte for meget på telefonen.', ['technology'], true),
    noun('A2', 'kamera', 'et', 'kameraer', 'er', 'Kamera får -er i flertal: kamera → kameraer.', 'Kameraerne filmede hele koncerten.', ['technology']),
    noun('B1', 'printer', 'en', 'printere', 'e', 'Printer får -e i flertal: printer → printere.', 'Printerne var løbet tør for papir.', ['technology']),

    // Abstract & emotions
    noun('B1', 'idé', 'en', 'ideer', 'er', 'Idé får -er i flertal, og accenten udelades ofte: idé → ideer.', 'Ideerne blev skrevet ned på tavlen.', ['abstract'], true),
    noun('B1', 'tanke', 'en', 'tanker', 'er', 'Tanke får -r i flertal, da ordet ender på -e: tanke → tanker.', 'Tankerne kredsede om det samme emne.', ['abstract']),
    noun('B1', 'følelse', 'en', 'følelser', 'er', 'Følelse får -r i flertal, da ordet ender på -e: følelse → følelser.', 'Følelserne var svære at sætte ord på.', ['abstract']),
    noun('A2', 'glæde', 'en', 'glæder', 'er', 'Glæde får -r i flertal, da ordet ender på -e: glæde → glæder.', 'Glæderne ved sommeren var mange.', ['abstract']),
    noun('B2', 'sorg', 'en', 'sorger', 'er', 'Sorg får -er i flertal: sorg → sorger.', 'Sorgerne fyldte meget det år.', ['abstract']),
    noun('B2', 'frygt', 'en', 'frygte', 'e', 'Frygt bruges næsten altid i ental, men følger -e-mønsteret i flertal: frygt → frygte.', 'Frygtene viste sig at være ubegrundede.', ['abstract'], true),
    noun('B1', 'håb', 'et', 'håb', 'zero', 'Håb har samme form i ubestemt ental og flertal: et håb, håb.', 'Håbene om fred levede videre.', ['abstract']),
    noun('A2', 'plan', 'en', 'planer', 'er', 'Plan får -er i flertal: plan → planer.', 'Planerne blev ændret i sidste øjeblik.', ['abstract']),
    noun('B2', 'mulighed', 'en', 'muligheder', 'er', 'Mulighed får -er i flertal: mulighed → muligheder.', 'Mulighederne var mange for de studerende.', ['abstract']),
    noun('A2', 'problem', 'et', 'problemer', 'er', 'Problem får -er i flertal: problem → problemer.', 'Problemerne blev løst hurtigt.', ['abstract']),
    noun('B1', 'grund', 'en', 'grunde', 'e', 'Grund følger -e-mønsteret i flertal: grund → grunde.', 'Grundene til beslutningen var flere.', ['abstract'])
  ];

  window.DANSK_NOUNS = MANUAL.concat(REGULAR);
})();
