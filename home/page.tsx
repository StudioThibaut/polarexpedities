"use client";
/* eslint-disable */
// @ts-nocheck
// @ts-ignore
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography, Line, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
// ══════════════════════════════════════════
// MEERTALIGHEID — NL / EN / FR
// ══════════════════════════════════════════

type Lang = "nl" | "en" | "fr";

const T = {
  nl: {
    // UI labels
    titel:          "Belgische Poolexpedities",
    subtitel:       "Antarctica · België",
    expeditie:      "Expeditie",
    bemanning:      "Bemanning",
    route:          "Route",
    tijdlijn:       "Tijdlijn",
    huidigePositie: "Huidige positie",
    stopsBereikt:   "stops gezien",
    beginHint:      "▶ Druk hier om de reis te volgen",
    beginSub:       "of beweeg de balk onderaan het scherm",
    tipStop:        "Tik een stop",
    tipArchief:     "Archief",
    tipCrew:        "De crew",
    archief:        "Bekijk het archief",
    antarctica:     "Routes op Antarctica",
    vergelijk:      "Vergelijk routes",
    vergelijkActief:"Vergelijking actief",
    herstart:       "Herstart",
    beginnen:       "Druk ▶ om te beginnen",
    voltooid:       "🎉 Reis voltooid! Kies een andere expeditie",
    liveData:       "🔴 Live data · Utsteinen",
    meerInfo:       "Meer info",
    vergroten:      "Klik om te sluiten",
    vergrotBtn:     "🔍 Vergroten",
    herkomst:       "Herkomst",
    context:        "Context & beschrijving",
    historischArchief: "Historisch archief",
    belgischePool:  "Belgische Poolexpedities",
    klokOpPunt:     "Klik op een punt voor meer info",
    stopsVerkennen: "stops — klik om te verkennen",
    volgende:       "Volgende →",
    vorige:         "← Vorige",
    stopVan:        "Stop",
    van:            "van",
    navigeren:      "navigeren",
    afspelen:       "afspelen",
    gaNaarStop:     "ga naar stop",
    sluitVenster:   "sluit venster",
    bijVertrek:     "bij vertrek",
    omgekomen:      "† = omgekomen tijdens de expeditie (hover voor naam)",
    zoekPlaceholder:"Zoek op titel, datum, type...",
    document:       "document",
    documenten:     "documenten",
    alle:           "Alle",
    foto:           "Foto",
    kaartType:      "Kaart",
    docType:        "Document",
    object:         "Object",
    histFoto:       "Historische foto",
    histDoc:        "Historisch document",
    histKaart:      "Historische kaart",
    museumObj:      "Museumobject",
    routesOpAnt:    "Routes op Antarctica",
    opHetContinent: "Antarctica · op het continent",
    belgicaDrift:   "Belgica drift",
    boudewijnLabel: "Boudewijn",
    taalKiezen:     "Taal",
  },
  en: {
    titel:          "Belgian Polar Expeditions",
    subtitel:       "Antarctica · Belgium",
    expeditie:      "Expedition",
    bemanning:      "Crew",
    route:          "Route",
    tijdlijn:       "Timeline",
    huidigePositie: "Current position",
    stopsBereikt:   "stops visited",
    beginHint:      "▶ Press here to follow the voyage",
    beginSub:       "or drag the bar at the bottom of the screen",
    tipStop:        "Tap a stop",
    tipArchief:     "Archive",
    tipCrew:        "The crew",
    archief:        "View the archive",
    antarctica:     "Routes on Antarctica",
    vergelijk:      "Compare routes",
    vergelijkActief:"Comparison active",
    herstart:       "Restart",
    beginnen:       "Press ▶ to begin",
    voltooid:       "🎉 Voyage complete! Choose another expedition",
    liveData:       "🔴 Live data · Utsteinen",
    meerInfo:       "More info",
    vergroten:      "Click to close",
    vergrotBtn:     "🔍 Enlarge",
    herkomst:       "Origin",
    context:        "Context & description",
    historischArchief: "Historical archive",
    belgischePool:  "Belgian Polar Expeditions",
    klokOpPunt:     "Click a point for more info",
    stopsVerkennen: "stops — click to explore",
    volgende:       "Next →",
    vorige:         "← Previous",
    stopVan:        "Stop",
    van:            "of",
    navigeren:      "navigate",
    afspelen:       "play",
    gaNaarStop:     "go to stop",
    sluitVenster:   "close window",
    bijVertrek:     "at departure",
    omgekomen:      "† = died during the expedition (hover for name)",
    zoekPlaceholder:"Search by title, date, type...",
    document:       "document",
    documenten:     "documents",
    alle:           "All",
    foto:           "Photo",
    kaartType:      "Map",
    docType:        "Document",
    object:         "Object",
    histFoto:       "Historical photo",
    histDoc:        "Historical document",
    histKaart:      "Historical map",
    museumObj:      "Museum object",
    routesOpAnt:    "Routes on Antarctica",
    opHetContinent: "Antarctica · on the continent",
    belgicaDrift:   "Belgica drift",
    boudewijnLabel: "Baudouin",
    taalKiezen:     "Language",
  },
  fr: {
    titel:          "Expéditions Polaires Belges",
    subtitel:       "Antarctique · Belgique",
    expeditie:      "Expédition",
    bemanning:      "Équipage",
    route:          "Route",
    tijdlijn:       "Chronologie",
    huidigePositie: "Position actuelle",
    stopsBereikt:   "étapes visitées",
    beginHint:      "▶ Appuyez ici pour suivre le voyage",
    beginSub:       "ou déplacez la barre en bas de l'écran",
    tipStop:        "Touchez une étape",
    tipArchief:     "Archives",
    tipCrew:        "L'équipage",
    archief:        "Voir les archives",
    antarctica:     "Routes en Antarctique",
    vergelijk:      "Comparer les routes",
    vergelijkActief:"Comparaison active",
    herstart:       "Recommencer",
    beginnen:       "Appuyez ▶ pour commencer",
    voltooid:       "🎉 Voyage terminé ! Choisissez une autre expédition",
    liveData:       "🔴 Données en direct · Utsteinen",
    meerInfo:       "Plus d'info",
    vergroten:      "Cliquez pour fermer",
    vergrotBtn:     "🔍 Agrandir",
    herkomst:       "Provenance",
    context:        "Contexte & description",
    historischArchief: "Archives historiques",
    belgischePool:  "Expéditions Polaires Belges",
    klokOpPunt:     "Cliquez sur un point pour plus d'info",
    stopsVerkennen: "étapes — cliquez pour explorer",
    volgende:       "Suivant →",
    vorige:         "← Précédent",
    stopVan:        "Étape",
    van:            "sur",
    navigeren:      "naviguer",
    afspelen:       "lire",
    gaNaarStop:     "aller à l'étape",
    sluitVenster:   "fermer la fenêtre",
    bijVertrek:     "au départ",
    omgekomen:      "† = décédé pendant l'expédition (survolez pour le nom)",
    zoekPlaceholder:"Rechercher par titre, date, type...",
    document:       "document",
    documenten:     "documents",
    alle:           "Tous",
    foto:           "Photo",
    kaartType:      "Carte",
    docType:        "Document",
    object:         "Objet",
    histFoto:       "Photo historique",
    histDoc:        "Document historique",
    histKaart:      "Carte historique",
    museumObj:      "Objet de musée",
    routesOpAnt:    "Routes en Antarctique",
    opHetContinent: "Antarctique · sur le continent",
    belgicaDrift:   "Dérive de la Belgica",
    boudewijnLabel: "Baudouin",
    taalKiezen:     "Langue",
  },
};

// ══════════════════════════════════════════
// MEERTALIGE INHOUD
// ══════════════════════════════════════════

// ── Samenvattingen per expeditie ──
const SAMENVATTINGEN:{[lang:string]:{[id:string]:string}}={
  nl:{
    belgica:"De eerste wetenschappelijke expeditie naar Antarctica. Het schip overwinterde 375 dagen vast in het pakijs van de Bellingshausenzee.",
    boudewijn:"Tijdens het Internationaal Geofysisch Jaar bouwde Belgie zijn eerste wetenschappelijke basis in Queen Maud Land.",
    princess:"De eerste volledig duurzame poolbasis ter wereld. 100% wind- en zonne-energie op een granieten rotsrichel van 700 meter.",
  },
  en:{
    belgica:"The first scientific expedition to Antarctica. The ship overwinter for 375 days trapped in the pack ice of the Bellingshausen Sea.",
    boudewijn:"During the International Geophysical Year, Belgium built its first scientific base in Queen Maud Land.",
    princess:"The world's first fully sustainable polar base. 100% wind and solar energy on a granite ridge at 700 metres altitude.",
  },
  fr:{
    belgica:"La première expédition scientifique en Antarctique. Le navire a hiverné 375 jours pris dans les glaces de la mer de Bellingshausen.",
    boudewijn:"Lors de l'Année Géophysique Internationale, la Belgique a construit sa première base scientifique en Terre de la Reine Maud.",
    princess:"La première base polaire entièrement durable au monde. 100% d'énergie éolienne et solaire sur un éperon rocheux de granit à 700 mètres.",
  },
};

// ── Persoon bios ──
const PERSOON_BIOS:{[lang:string]:{[id:string]:{bio:string;citaat:string;citaatBron:string}}}={
  nl:{
    degerlache:{
      bio:"Adrien Victor Joseph de Gerlache de Gomery was de drijvende kracht achter de eerste Belgische Antarctische expeditie. Als jonge marine-officier wist hij tegen alle verwachtingen in financiering en een internationaal team samen te brengen. Zijn ontdekking van de Gerlachestraat en de gedwongen overwintering in het pakijs maakten hem tot een nationaal held. De psychologische impact van de poolnacht was zwaar — hij leed samen met zijn bemanning aan depressie en scheurbuik.",
      citaat:"De kaden stonden vol volk. Niemand wist of we ooit zouden terugkeren.",
      citaatBron:"A. de Gerlache, scheepslogboek, 16 augustus 1897",
    },
    amundsen:{
      bio:"Roald Amundsen was pas 25 jaar oud toen hij aan boord van de Belgica stapte als eerste officier. De ervaring van de poolnacht en het overwinteren in het ijs vormde hem als ontdekkingsreiziger. Hij observeerde hoe de bemanning in verval raakte en trok zijn eigen lessen over overlevingstechnieken. Vijftien jaar later zou hij als eerste mens de Zuidpool bereiken. De Belgica was zijn leerschool.",
      citaat:"Het ijs sluit zich achter ons. Er is geen weg terug meer.",
      citaatBron:"R. Amundsen, dagboek, februari 1898",
    },
    cook:{
      bio:"Frederick Cook redde als arts letterlijk levens tijdens de poolnacht. Hij stelde vast dat blootstelling aan vuur en het eten van vers vlees de scheurbuik kon terugdringen. Zijn belichteringstechniek met open vuurtjes gaf de bemanning terug een gevoel van daglicht. Cook maakte ook het grootste deel van het fotografisch archief van de expeditie.",
      citaat:"We overstaken de linie met rum en muziek. Morgen begint de onbekende wereld.",
      citaatBron:"F. Cook, dagboek, oktober 1897",
    },
    gaston:{
      bio:"Gaston de Gerlache was de zoon van Adrien de Gerlache. Zestig jaar na zijn vader leidde hij de Belgische expeditie naar Queen Maud Land tijdens het Internationaal Geofysisch Jaar 1957–1958. Hij bouwde er de Koning Boudewijn-basis, het eerste permanente Belgische poolstation. De basis werd gesloten in 1961 wegens geldgebrek.",
      citaat:"Zestig jaar na mijn vader vertrek ik op dezelfde missie. Zijn geest zit in elk geval mee.",
      citaatBron:"G. de Gerlache, interview, december 1957",
    },
    hubert:{
      bio:"Alain Hubert doorkruiste in 1997–98 met Dixie Dansercoer Antarctica over 3924 km op powerkites, ter ere van de 100ste verjaardag van de Belgica. Daarna richtte hij de International Polar Foundation op en leidde hij het project dat resulteerde in de eerste volledig duurzame poolbasis ter wereld: Princess Elisabeth Station op 71 graden 57 minuten Z.",
      citaat:"We bouwen de toekomst van poolonderzoek — zonder een gram CO2 te verspillen.",
      citaatBron:"A. Hubert, opening Princess Elisabeth Station, 2009",
    },
  },
  en:{
    degerlache:{
      bio:"Adrien Victor Joseph de Gerlache de Gomery was the driving force behind the first Belgian Antarctic expedition. As a young naval officer, he managed against all odds to secure funding and assemble an international team. His discovery of the Gerlache Strait and the forced overwintering in the pack ice made him a national hero. The psychological toll of the polar night was heavy — he suffered alongside his crew from depression and scurvy.",
      citaat:"The quays were packed with people. Nobody knew whether we would ever return.",
      citaatBron:"A. de Gerlache, ship's log, 16 August 1897",
    },
    amundsen:{
      bio:"Roald Amundsen was only 25 years old when he stepped aboard the Belgica as first officer. The experience of the polar night and overwintering in the ice shaped him as an explorer. He observed how the crew deteriorated and drew his own lessons about survival techniques. Fifteen years later he would become the first person to reach the South Pole. The Belgica was his school.",
      citaat:"The ice closes behind us. There is no way back anymore.",
      citaatBron:"R. Amundsen, diary, February 1898",
    },
    cook:{
      bio:"Frederick Cook literally saved lives as the ship's doctor during the polar night. He discovered that exposure to fire and eating fresh meat could reverse scurvy. His light therapy using open fires gave the crew back a sense of daylight. Cook also created most of the expedition's photographic archive.",
      citaat:"We crossed the line with rum and music. Tomorrow the unknown world begins.",
      citaatBron:"F. Cook, diary, October 1897",
    },
    gaston:{
      bio:"Gaston de Gerlache was the son of Adrien de Gerlache. Sixty years after his father, he led the Belgian expedition to Queen Maud Land during the International Geophysical Year 1957–1958. He built the King Baudouin Base there, Belgium's first permanent polar station. The base was closed in 1961 due to lack of funding.",
      citaat:"Sixty years after my father, I set out on the same mission. His spirit is certainly with us.",
      citaatBron:"G. de Gerlache, interview, December 1957",
    },
    hubert:{
      bio:"Alain Hubert crossed Antarctica in 1997–98 with Dixie Dansercoer, covering 3,924 km on powerkites, to mark the 100th anniversary of the Belgica expedition. He then founded the International Polar Foundation and led the project that resulted in the world's first fully sustainable polar base: Princess Elisabeth Station at 71 degrees 57 minutes South.",
      citaat:"We are building the future of polar research — without wasting a gram of CO2.",
      citaatBron:"A. Hubert, opening Princess Elisabeth Station, 2009",
    },
  },
  fr:{
    degerlache:{
      bio:"Adrien Victor Joseph de Gerlache de Gomery était le moteur de la première expédition antarctique belge. En tant que jeune officier de marine, il parvint contre toute attente à réunir des financements et une équipe internationale. Sa découverte du Détroit de Gerlache et l'hivernage forcé dans les glaces firent de lui un héros national. L'impact psychologique de la nuit polaire fut lourd — il souffrit avec son équipage de dépression et de scorbut.",
      citaat:"Les quais étaient bondés. Personne ne savait si nous reviendrions un jour.",
      citaatBron:"A. de Gerlache, journal de bord, 16 août 1897",
    },
    amundsen:{
      bio:"Roald Amundsen n'avait que 25 ans lorsqu'il embarqua sur la Belgica en tant que premier officier. L'expérience de la nuit polaire et de l'hivernage dans les glaces le forja comme explorateur. Il observa la dégradation de l'équipage et en tira ses propres leçons sur les techniques de survie. Quinze ans plus tard, il serait le premier homme à atteindre le Pôle Sud. La Belgica fut son école.",
      citaat:"La glace se referme derrière nous. Il n'y a plus de chemin de retour.",
      citaatBron:"R. Amundsen, journal, février 1898",
    },
    cook:{
      bio:"Frederick Cook sauva littéralement des vies en tant que médecin du bord pendant la nuit polaire. Il découvrit que l'exposition au feu et la consommation de viande fraîche pouvaient combattre le scorbut. Sa technique d'éclairage avec des feux ouverts redonna à l'équipage un sentiment de lumière du jour. Cook réalisa également la majeure partie des archives photographiques de l'expédition.",
      citaat:"Nous avons franchi la ligne avec rhum et musique. Demain commence le monde inconnu.",
      citaatBron:"F. Cook, journal, octobre 1897",
    },
    gaston:{
      bio:"Gaston de Gerlache était le fils d'Adrien de Gerlache. Soixante ans après son père, il conduisit l'expédition belge en Terre de la Reine Maud lors de l'Année Géophysique Internationale 1957–1958. Il y construisit la Base Roi Baudouin, la première station polaire permanente belge. La base fut fermée en 1961 faute de financement.",
      citaat:"Soixante ans après mon père, je pars pour la même mission. Son esprit nous accompagne certainement.",
      citaatBron:"G. de Gerlache, interview, décembre 1957",
    },
    hubert:{
      bio:"Alain Hubert traversa l'Antarctique en 1997–98 avec Dixie Dansercoer, parcourant 3 924 km en kites tracteurs, pour marquer le 100e anniversaire de l'expédition Belgica. Il fonda ensuite la Fondation Polaire Internationale et dirigea le projet qui aboutit à la première base polaire entièrement durable au monde : la Station Princess Elisabeth à 71 degrés 57 minutes Sud.",
      citaat:"Nous construisons l'avenir de la recherche polaire — sans gaspiller un gramme de CO2.",
      citaatBron:"A. Hubert, inauguration Station Princess Elisabeth, 2009",
    },
  },
};

// ── Datapunt details ──
const DATAPUNT_DETAILS:{[lang:string]:{[id:string]:{label:string;unit:string;context:string;detail:string}}}={
  nl:{
    "dagen-ijs":{label:"Vast in het pakijs",unit:"dagen",context:"De Belgica, Bellingshausenzee, 1898–1899",detail:"Op 28 februari 1898 vroor de Belgica vast in het pakijs van de Bellingshausenzee. Pas op 14 maart 1899 — na 375 dagen — wist de bemanning zich te bevrijden door een kanaal te hakken. De poolnacht duurde 70 dagen: van 17 mei tot eind juli 1898 was er geen zonlicht. Twee bemanningsleden overleefden de expeditie niet."},
    "bemanning":{label:"Internationale bemanning",unit:"man",context:"De Belgica, vertrek Antwerpen 1897",detail:"De 19-koppige bemanning was internationaal samengesteld: Belgen, Noren, een Roemeen, een Pool en een Amerikaan. Emile Danco stierf op 6 juni 1898 aan hartzwakte tijdens de poolnacht. Carl Auguste Wiencke verdronk op 22 januari 1898 nabij Kaap Hoorn. Roald Amundsen — later de eerste mens op de Zuidpool — was eerste officier."},
    "temperatuur":{label:"Temperatuur Utsteinen",unit:"graden C gemiddeld",context:"Princess Elisabeth Station, jaargemiddelde",detail:"Het Princess Elisabeth Station ligt op 71 graden 57 minuten Z op een granieten rotsrichel van 700 meter. De jaargemiddelde temperatuur bedraagt -31 graden C. In de winter kan het zakken tot -50 graden C. Toch produceert de basis meer energie dan ze verbruikt — volledig via wind en zon."},
    "afstand":{label:"Doorkruising Antarctica",unit:"km",context:"Alain Hubert & Dixie Dansercoer, 1997–1998",detail:"In 1997–1998, ter ere van de 100ste verjaardag van de Belgica-expeditie, doorkruisten Alain Hubert en Dixie Dansercoer Antarctica over 3924 km op powerkites. De tocht duurde 99 dagen en verbond de Weddelzee met de Indische Oceaan. Het was de langste onondersteunde ijsreis ooit op dat moment."},
    "energie":{label:"Energiegebruik Princess Elisabeth",unit:"hernieuwbaar",context:"Princess Elisabeth Station, 2009–heden",detail:"Princess Elisabeth Station is de eerste poolbasis ter wereld die volledig op hernieuwbare energie draait. Negen windturbines en 542 m2 zonnepanelen leveren alle energie. De basis verbruikt slechts een vijfde van wat vergelijkbare basissen gebruiken."},
  },
  en:{
    "dagen-ijs":{label:"Trapped in the pack ice",unit:"days",context:"The Belgica, Bellingshausen Sea, 1898–1899",detail:"On 28 February 1898 the Belgica became locked in the pack ice of the Bellingshausen Sea. It was not until 14 March 1899 — after 375 days — that the crew managed to free themselves by hacking a canal. The polar night lasted 70 days: from 17 May to the end of July 1898 there was no sunlight. Two crew members did not survive the expedition."},
    "bemanning":{label:"International crew",unit:"men",context:"The Belgica, departure Antwerp 1897",detail:"The 19-man crew was internationally composed: Belgians, Norwegians, a Romanian, a Pole and an American. Emile Danco died on 6 June 1898 from heart failure during the polar night. Carl Auguste Wiencke drowned on 22 January 1898 near Cape Horn. Roald Amundsen — later the first person at the South Pole — was first officer."},
    "temperatuur":{label:"Temperature at Utsteinen",unit:"degrees C average",context:"Princess Elisabeth Station, annual average",detail:"Princess Elisabeth Station sits at 71 degrees 57 minutes South on a granite ridge at 700 metres altitude. The annual average temperature is -31 degrees C. In winter it can drop to -50 degrees C. Yet the base produces more energy than it consumes — entirely from wind and solar power."},
    "afstand":{label:"Crossing of Antarctica",unit:"km",context:"Alain Hubert & Dixie Dansercoer, 1997–1998",detail:"In 1997–1998, to mark the 100th anniversary of the Belgica expedition, Alain Hubert and Dixie Dansercoer crossed Antarctica covering 3,924 km on powerkites. The journey took 99 days and connected the Weddell Sea to the Indian Ocean. It was the longest unsupported ice journey ever at that time."},
    "energie":{label:"Energy use Princess Elisabeth",unit:"renewable",context:"Princess Elisabeth Station, 2009–present",detail:"Princess Elisabeth Station is the world's first polar base to run entirely on renewable energy. Nine wind turbines and 542 m² of solar panels supply all energy. The base uses only one fifth of what comparable stations consume."},
  },
  fr:{
    "dagen-ijs":{label:"Pris dans les glaces",unit:"jours",context:"La Belgica, mer de Bellingshausen, 1898–1899",detail:"Le 28 février 1898, la Belgica se trouva prise dans les glaces de la mer de Bellingshausen. Ce n'est que le 14 mars 1899 — après 375 jours — que l'équipage parvint à se libérer en creusant un canal. La nuit polaire dura 70 jours : du 17 mai à fin juillet 1898, il n'y eut aucune lumière du soleil. Deux membres d'équipage ne survécurent pas à l'expédition."},
    "bemanning":{label:"Équipage international",unit:"hommes",context:"La Belgica, départ Anvers 1897",detail:"L'équipage de 19 hommes était composé de nationalités diverses : Belges, Norvégiens, un Roumain, un Polonais et un Américain. Emile Danco mourut le 6 juin 1898 d'insuffisance cardiaque pendant la nuit polaire. Carl Auguste Wiencke se noya le 22 janvier 1898 près du Cap Horn. Roald Amundsen — plus tard le premier homme au Pôle Sud — était premier officier."},
    "temperatuur":{label:"Température à Utsteinen",unit:"degrés C en moyenne",context:"Station Princess Elisabeth, moyenne annuelle",detail:"La Station Princess Elisabeth est située à 71 degrés 57 minutes Sud sur un éperon de granit à 700 mètres d'altitude. La température annuelle moyenne est de -31 degrés C. En hiver, elle peut descendre jusqu'à -50 degrés C. Pourtant, la base produit plus d'énergie qu'elle n'en consomme — entièrement grâce au vent et au soleil."},
    "afstand":{label:"Traversée de l'Antarctique",unit:"km",context:"Alain Hubert & Dixie Dansercoer, 1997–1998",detail:"En 1997–1998, pour marquer le 100e anniversaire de l'expédition Belgica, Alain Hubert et Dixie Dansercoer traversèrent l'Antarctique sur 3 924 km en kites tracteurs. Le voyage dura 99 jours et relia la mer de Weddell à l'océan Indien. C'était alors le plus long voyage sur glace sans assistance jamais réalisé."},
    "energie":{label:"Consommation énergétique Princess Elisabeth",unit:"renouvelable",context:"Station Princess Elisabeth, 2009–présent",detail:"La Station Princess Elisabeth est la première base polaire au monde à fonctionner entièrement avec des énergies renouvelables. Neuf éoliennes et 542 m² de panneaux solaires fournissent toute l'énergie nécessaire. La base ne consomme qu'un cinquième de ce que consomment des bases comparables."},
  },
};

// ── Stop labels en beschrijvingen ──
// Belgica stops
const BELGICA_DESC:{[lang:string]:{[label:string]:{desc:string;journal?:string}}}={
  nl:{
    "Antwerpen":{desc:"Vertrek uit de haven van Antwerpen. 19 man aan boord, waaronder Roald Amundsen.",journal:"'De kaden stonden vol volk. Niemand wist of we ooit zouden terugkeren.' — A. de Gerlache"},
    "Golf van Biskaje":{desc:"Doortocht door de ruige Golf van Biskaje.",journal:"'De storm raast al drie dagen. De helft van de bemanning is zeeziek.' — scheepslogboek"},
    "Evenaar":{desc:"Oversteek van de evenaar — een mijlpaal voor de bemanning.",journal:"'We overstaken de linie met rum en muziek. Morgen begint de onbekende wereld.' — F. Cook"},
    "Rio de Janeiro":{desc:"Tussenstop in Brazilie voor bevoorrading.",journal:"'De warmte is ondraaglijk. Overmorgen: het zuiden.' — scheepslogboek"},
    "Buenos Aires":{desc:"Laatste grote haven voor het vertrek naar de Zuidpool.",journal:"'Dit is onze laatste aanraking met de beschaving.' — A. de Gerlache"},
    "Kaap Hoorn":{desc:"Doortocht rond de beruchtste kaap ter wereld.",journal:"'Kaap Hoorn. De golven zijn tien meter hoog. God sta ons bij.' — scheepslogboek, 14 jan 1898"},
    "Gerlachestraat":{desc:"Ontdekking van de nieuwe zeestraat. Eilanden Brabant & Anvers benoemd.",journal:"'We hebben een nieuwe wereld gevonden. Mijn hart is vol.' — A. de Gerlache"},
    "Antarctisch water":{desc:"Dieper het pakijs in. Temperaturen dalen snel.",journal:"'Het ijs sluit zich achter ons. Er is geen weg terug meer.' — R. Amundsen"},
    "Bellingshausenzee":{desc:"Het schip vriest vast in het pakijs. Begin van 375 dagen gevangenschap.",journal:"'17 mei 1898: De zon is voor het laatste ondergegaan. We gaan de totale duisternis in.' — A. de Gerlache"},
    "Drift in het ijs":{desc:"Scheurbuik, 70 dagen poolnacht. Emile Danco sterft op 6 juni 1898.",journal:"'Danco is vannacht gestorven. De stilte is ondraaglijk.' — F. Cook"},
    "Bevrijding":{desc:"Bevrijding uit het ijs! Koers noordwaarts.",journal:"'Na 375 dagen zien we open water. De mannen schreeuwen van vreugde.' — scheepslogboek"},
    "Terugkeer Antwerpen":{desc:"Feestelijk onthaal na 2 jaar en 3 maanden.",journal:"'We zijn thuis. Antwerpen ontvangt ons als helden.' — A. de Gerlache"},
  },
  en:{
    "Antwerpen":{desc:"Departure from the port of Antwerp. 19 men on board, including Roald Amundsen.",journal:"'The quays were packed with people. Nobody knew whether we would ever return.' — A. de Gerlache"},
    "Golf van Biskaje":{desc:"Passage through the rough Bay of Biscay.",journal:"'The storm has been raging for three days. Half the crew is seasick.' — ship's log"},
    "Evenaar":{desc:"Crossing of the equator — a milestone for the crew.",journal:"'We crossed the line with rum and music. Tomorrow the unknown world begins.' — F. Cook"},
    "Rio de Janeiro":{desc:"Stopover in Brazil for supplies.",journal:"'The heat is unbearable. The day after tomorrow: the south.' — ship's log"},
    "Buenos Aires":{desc:"Last major port before departure for the South Pole.",journal:"'This is our last contact with civilisation.' — A. de Gerlache"},
    "Kaap Hoorn":{desc:"Passage around the world's most notorious cape.",journal:"'Cape Horn. The waves are ten metres high. God help us.' — ship's log, 14 Jan 1898"},
    "Gerlachestraat":{desc:"Discovery of the new strait. Islands Brabant & Anvers named.",journal:"'We have found a new world. My heart is full.' — A. de Gerlache"},
    "Antarctisch water":{desc:"Deeper into the pack ice. Temperatures dropping fast.",journal:"'The ice closes behind us. There is no way back anymore.' — R. Amundsen"},
    "Bellingshausenzee":{desc:"The ship freezes in the pack ice. Beginning of 375 days of captivity.",journal:"'17 May 1898: The sun has set for the last time. We enter total darkness.' — A. de Gerlache"},
    "Drift in het ijs":{desc:"Scurvy, 70 days of polar night. Emile Danco dies on 6 June 1898.",journal:"'Danco died last night. The silence is unbearable.' — F. Cook"},
    "Bevrijding":{desc:"Freedom from the ice! Course northward.",journal:"'After 375 days we see open water. The men are shouting with joy.' — ship's log"},
    "Terugkeer Antwerpen":{desc:"Triumphant welcome after 2 years and 3 months.",journal:"'We are home. Antwerp receives us as heroes.' — A. de Gerlache"},
  },
  fr:{
    "Antwerpen":{desc:"Départ du port d'Anvers. 19 hommes à bord, dont Roald Amundsen.",journal:"'Les quais étaient bondés. Personne ne savait si nous reviendrions un jour.' — A. de Gerlache"},
    "Golf van Biskaje":{desc:"Traversée du rude golfe de Gascogne.",journal:"'La tempête fait rage depuis trois jours. La moitié de l'équipage a le mal de mer.' — journal de bord"},
    "Evenaar":{desc:"Traversée de l'équateur — une étape importante pour l'équipage.",journal:"'Nous avons franchi la ligne avec rhum et musique. Demain commence le monde inconnu.' — F. Cook"},
    "Rio de Janeiro":{desc:"Escale au Brésil pour l'approvisionnement.",journal:"'La chaleur est insupportable. Après-demain : le Sud.' — journal de bord"},
    "Buenos Aires":{desc:"Dernier grand port avant le départ vers le Pôle Sud.",journal:"'C'est notre dernier contact avec la civilisation.' — A. de Gerlache"},
    "Kaap Hoorn":{desc:"Passage autour du cap le plus redouté du monde.",journal:"'Cap Horn. Les vagues font dix mètres de haut. Que Dieu nous aide.' — journal de bord, 14 jan 1898"},
    "Gerlachestraat":{desc:"Découverte du nouveau détroit. Les îles Brabant & Anvers sont nommées.",journal:"'Nous avons trouvé un nouveau monde. Mon cœur est plein.' — A. de Gerlache"},
    "Antarctisch water":{desc:"Pénétration plus profonde dans les glaces. Les températures chutent rapidement.",journal:"'La glace se referme derrière nous. Il n'y a plus de chemin de retour.' — R. Amundsen"},
    "Bellingshausenzee":{desc:"Le navire se retrouve prisonnier des glaces. Début de 375 jours de captivité.",journal:"'17 mai 1898 : Le soleil s'est couché pour la dernière fois. Nous entrons dans les ténèbres totales.' — A. de Gerlache"},
    "Drift in het ijs":{desc:"Scorbut, 70 jours de nuit polaire. Emile Danco meurt le 6 juin 1898.",journal:"'Danco est mort cette nuit. Le silence est insupportable.' — F. Cook"},
    "Bevrijding":{desc:"Libération des glaces ! Cap au nord.",journal:"'Après 375 jours, nous voyons de l'eau libre. Les hommes crient de joie.' — journal de bord"},
    "Terugkeer Antwerpen":{desc:"Accueil triomphal après 2 ans et 3 mois.",journal:"'Nous sommes chez nous. Anvers nous reçoit en héros.' — A. de Gerlache"},
  },
};

// Boudewijn stops
const BOUDEWIJN_DESC:{[lang:string]:{[label:string]:{desc:string;journal?:string}}}={
  nl:{
    "Antwerpen":{desc:"Vertrek met ijsbrekers Polarhav & Polarsirkel.",journal:"'Zestig jaar na mijn vader vertrek ik op dezelfde missie.' — G. de Gerlache"},
    "Kaap Stad":{desc:"Laatste haven voor Antarctica. Materiaal geladen.",journal:"'Kaapstad voor de laatste keer. De berg kijkt ons na.' — G. de Gerlache"},
    "Queen Maud Land":{desc:"Aankomst op tweede kerstdag 1957.",journal:"'Kerstmis op het ijs. We zingen Stille Nacht in vijf talen.' — G. de Gerlache"},
    "Boudewijn-basis":{desc:"Bouw van het eerste Belgische poolstation op 70 graden 26 minuten Z.",journal:"'De basis staat. Mijn vader zou trots zijn geweest.' — G. de Gerlache"},
    "Zuidelijke Oceaan":{desc:"Doortocht door de woeste zuidelijke wateren.",journal:"'De albatros volgt ons al drie dagen.' — logboek"},
  },
  en:{
    "Antwerpen":{desc:"Departure with icebreakers Polarhav & Polarsirkel.",journal:"'Sixty years after my father, I set out on the same mission.' — G. de Gerlache"},
    "Kaap Stad":{desc:"Last port before Antarctica. Supplies loaded.",journal:"'Cape Town for the last time. The mountain watches us leave.' — G. de Gerlache"},
    "Queen Maud Land":{desc:"Arrival on Christmas Day 1957.",journal:"'Christmas on the ice. We sing Silent Night in five languages.' — G. de Gerlache"},
    "Boudewijn-basis":{desc:"Construction of the first Belgian polar station at 70 degrees 26 minutes South.",journal:"'The base stands. My father would have been proud.' — G. de Gerlache"},
    "Zuidelijke Oceaan":{desc:"Passage through the fierce southern waters.",journal:"'The albatross has been following us for three days.' — log"},
  },
  fr:{
    "Antwerpen":{desc:"Départ avec les brise-glaces Polarhav & Polarsirkel.",journal:"'Soixante ans après mon père, je pars pour la même mission.' — G. de Gerlache"},
    "Kaap Stad":{desc:"Dernier port avant l'Antarctique. Chargement du matériel.",journal:"'Le Cap pour la dernière fois. La montagne nous regarde partir.' — G. de Gerlache"},
    "Queen Maud Land":{desc:"Arrivée le jour de Noël 1957.",journal:"'Noël sur la glace. Nous chantons Douce Nuit en cinq langues.' — G. de Gerlache"},
    "Boudewijn-basis":{desc:"Construction de la première station polaire belge à 70 degrés 26 minutes Sud.",journal:"'La base est construite. Mon père aurait été fier.' — G. de Gerlache"},
    "Zuidelijke Oceaan":{desc:"Traversée des violentes eaux australes.",journal:"'L'albatros nous suit depuis trois jours.' — journal"},
  },
};

// Princess stops
const PRINCESS_DESC:{[lang:string]:{[label:string]:{desc:string;journal?:string}}}={
  nl:{
    "Antwerpen":{desc:"Basis voorgemonteerd op Tour & Taxis terrein in Brussel.",journal:"'We bouwen de toekomst van poolonderzoek — zonder een gram CO2 te verspillen.' — A. Hubert"},
    "Kaap Stad":{desc:"Verscheping van alle materialen via Zuid-Afrika.",journal:"'De containers bevatten 3000 ton materiaal. Alles is duurzaam.' — logboek"},
    "Dronning Maud Land":{desc:"Lossen van zware materialen op het pakijs.",journal:"'De helikopter doet 47 trips per dag.' — A. Hubert"},
    "Utsteinen":{desc:"Officiele opening — eerste 0-emissie poolbasis ter wereld.",journal:"'De turbines draaien. We produceren meer energie dan we verbruiken.' — A. Hubert"},
    "Zuidelijke Oceaan":{desc:"IJsbreker Ivan Papanin in de woeste zuidelijke wateren.",journal:"'Zeven meter hoge golven. De containers houden.' — logboek"},
  },
  en:{
    "Antwerpen":{desc:"Base pre-assembled at Tour & Taxis site in Brussels.",journal:"'We are building the future of polar research — without wasting a gram of CO2.' — A. Hubert"},
    "Kaap Stad":{desc:"Shipment of all materials via South Africa.",journal:"'The containers hold 3,000 tonnes of material. Everything is sustainable.' — log"},
    "Dronning Maud Land":{desc:"Unloading of heavy materials on the pack ice.",journal:"'The helicopter makes 47 trips a day.' — A. Hubert"},
    "Utsteinen":{desc:"Official opening — world's first zero-emission polar base.",journal:"'The turbines are running. We produce more energy than we consume.' — A. Hubert"},
    "Zuidelijke Oceaan":{desc:"Icebreaker Ivan Papanin in the fierce southern waters.",journal:"'Seven-metre waves. The containers hold.' — log"},
  },
  fr:{
    "Antwerpen":{desc:"Base pré-assemblée sur le site Tour & Taxis à Bruxelles.",journal:"'Nous construisons l'avenir de la recherche polaire — sans gaspiller un gramme de CO2.' — A. Hubert"},
    "Kaap Stad":{desc:"Expédition de tous les matériaux via l'Afrique du Sud.",journal:"'Les containers contiennent 3 000 tonnes de matériel. Tout est durable.' — journal"},
    "Dronning Maud Land":{desc:"Déchargement des matériaux lourds sur la banquise.",journal:"'L'hélicoptère fait 47 rotations par jour.' — A. Hubert"},
    "Utsteinen":{desc:"Inauguration officielle — première base polaire zéro émission au monde.",journal:"'Les turbines tournent. Nous produisons plus d'énergie que nous n'en consommons.' — A. Hubert"},
    "Zuidelijke Oceaan":{desc:"Brise-glaces Ivan Papanin dans les violentes eaux australes.",journal:"'Des vagues de sept mètres. Les containers tiennent.' — journal"},
  },
};

// ── Archiefstuk contexten ──
const ARCHIEF_CONTEXT:{[lang:string]:{[id:string]:{context:string;titel?:string}}}={
  nl:{},  // NL is default, uit ARCHIEFSTUKKEN
  en:{
    "belgica-antwerpen-1897":{context:"The ship Belgica in the port of Antwerp before departure."},
    "belgica-antwerpen-2":{context:"The ship Belgica ready to depart from the port of Antwerp."},
    "belgica-oostende-1905":{context:"The Belgica moored in Ostend, 1905."},
    "belgica-scheepsplan":{context:"Technical blueprint of the Belgica, drawn up before conversion to a research vessel."},
    "herinneringskaart":{context:"Commemorative card issued to mark the return of the Belgica expedition."},
    "bemanning-belgica":{context:"Group photo of the Belgica's crew before departure from Antwerp."},
    "portret-adrien":{context:"Portrait of Adrien de Gerlache, commander of the Belgica expedition."},
    "portret-amundsen-1":{context:"Portrait of Roald Amundsen, first officer on the Belgica."},
    "portret-frederick-cook":{context:"Portrait of Frederick Cook, ship's doctor and photographer of the Belgica."},
    "portret-emile-danco":{context:"Portrait of Emile Danco, geophysicist on the Belgica. Danco died on 6 June 1898 during the polar night."},
  },
  fr:{
    "belgica-antwerpen-1897":{context:"Le navire Belgica dans le port d'Anvers avant le départ."},
    "belgica-antwerpen-2":{context:"Le navire Belgica prêt à partir du port d'Anvers."},
    "belgica-oostende-1905":{context:"La Belgica amarrée à Ostende, 1905."},
    "belgica-scheepsplan":{context:"Plan technique de la Belgica, établi avant sa transformation en navire de recherche."},
    "herinneringskaart":{context:"Carte commémorative émise à l'occasion du retour de l'expédition Belgica."},
    "bemanning-belgica":{context:"Photo de groupe de l'équipage de la Belgica avant le départ d'Anvers."},
    "portret-adrien":{context:"Portrait d'Adrien de Gerlache, commandant de l'expédition Belgica."},
    "portret-amundsen-1":{context:"Portrait de Roald Amundsen, premier officier sur la Belgica."},
    "portret-frederick-cook":{context:"Portrait de Frederick Cook, médecin de bord et photographe de la Belgica."},
    "portret-emile-danco":{context:"Portrait d'Emile Danco, géophysicien sur la Belgica. Danco mourut le 6 juin 1898 pendant la nuit polaire."},
  },
};




// ══════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════

interface RawStop { coords:[number,number]; label:string; date:string; desc:string; journal?:string; }
interface Waypoint extends RawStop { t:number; }
interface Stat { value:string; unit:string; label:string; datapuntId?:string; }
interface Expeditie {
  id:string; titel:string; periode:string; leider:string; persoonId:string;
  kleur:string; kleurDim:string; kleurGlow:string;
  samenvatting:string; stats:Stat[];
  waypoints:Waypoint[]; liveWidget?:boolean;
}
interface Persoon {
  id:string; naam:string; rol:string; nationaliteit:string;
  leeftijdOpReis:string; expeditie:string; expeditieKleur:string;
  bio:string; citaat?:string; citaatBron?:string;
  feitjes:{label:string;value:string}[];
  fotoUrl:string;
}
interface DataPunt {
  id:string; value:string; unit:string; label:string;
  context:string; detail:string; kleur:string;
  visualType:"bar"|"counter"|"thermometer";
  visualMax?:number; visualValue?:number;
}
interface Archiefstuk {
  id:string; titel:string; datum:string; herkomst:string;
  collectie:string; context:string;
  type:"foto"|"document"|"kaart"|"object";
  expeditie:string; expeditieKleur:string;
  imageUrl:string;
}
type DetailState =
  | {type:"persoon"; id:string}
  | {type:"datapunt"; id:string}
  | {type:"archief"; id:string}
  | null;

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════

function haversine(a:[number,number],b:[number,number]):number {
  const R=6371,rad=(d:number)=>d*Math.PI/180;
  const dl=rad(b[1]-a[1]),dg=rad(b[0]-a[0]);
  return 2*R*Math.asin(Math.sqrt(Math.sin(dl/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dg/2)**2));
}
function buildWaypoints(s:RawStop[]):Waypoint[]{
  const d=[0];for(let i=1;i<s.length;i++)d.push(d[i-1]+haversine(s[i-1].coords,s[i].coords));
  const tot=d[d.length-1];return s.map((x,i)=>({...x,t:d[i]/tot}));
}
function lerp(a:number,b:number,t:number){return a+(b-a)*t;}
function iRoute(wps:Waypoint[],t:number):Waypoint{
  if(t<=0)return wps[0];if(t>=1)return wps[wps.length-1];
  const i=wps.findIndex(w=>w.t>=t);if(i<=0)return wps[0];
  const a=wps[i-1],b=wps[i],l=(t-a.t)/(b.t-a.t);
  return{...a,coords:[lerp(a.coords[0],b.coords[0],l),lerp(a.coords[1],b.coords[1],l)],
    label:l<.5?a.label:b.label,date:l<.5?a.date:b.date,desc:l<.5?a.desc:b.desc,journal:l<.5?a.journal:b.journal};
}
// Geeft true als een punt [lng,lat] zichtbaar is op de globe
// (aan de voorkant, niet aan de achterkant)
function isVisible(coords:[number,number],rotate:[number,number,number]):boolean{
  const rad=(d:number)=>d*Math.PI/180;
  // Globe centrum in geografische coördinaten
  const cx=-rotate[0],cy=-rotate[1];
  // Hoek tussen punt en centrum via de haversine-formule
  const dLng=rad(coords[0]-cx),lat1=rad(cy),lat2=rad(coords[1]);
  const a=Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(dLng);
  // a > 0 = voorkant van de globe
  return a>0;
}

function buildPartial(wps:Waypoint[],t:number):[number,number][]{
  if(t<=0)return[wps[0].coords];
  const pts:[number,number][]=[];
  for(const w of wps){if(w.t<=t)pts.push(w.coords);else{pts.push(iRoute(wps,t).coords);break;}}
  return pts;
}

// ══════════════════════════════════════════
// ROUTE DATA
// ══════════════════════════════════════════

const BELGICA_STOPS:RawStop[]=[
  {coords:[4.40,51.22],label:"Antwerpen",date:"16 aug 1897",desc:"Vertrek uit de haven van Antwerpen. 19 man aan boord, waaronder Roald Amundsen.",journal:"'De kaden stonden vol volk. Niemand wist of we ooit zouden terugkeren.' — A. de Gerlache"},
  {coords:[1.80,50.10],label:"Nauw van Calais",date:"aug 1897",desc:"Doortocht door het Nauw van Calais de Atlantische Oceaan op."},
  {coords:[-5.00,47.50],label:"Golf van Biskaje",date:"aug 1897",desc:"Doortocht door de ruige Golf van Biskaje.",journal:"'De storm raast al drie dagen. De helft van de bemanning is zeeziek.' — scheepslogboek"},
  {coords:[-9.10,38.70],label:"Lissabon",date:"sept 1897",desc:"Tussenstop aan de Portugese kust."},
  {coords:[-17.00,28.00],label:"Canarische Eilanden",date:"sept 1897",desc:"Langs de Canarische Eilanden zuidwaarts."},
  {coords:[-22.00,15.00],label:"West-Atlantisch",date:"okt 1897",desc:"Open Atlantische Oceaan ten westen van Afrika."},
  {coords:[-26.00,3.00],label:"Evenaar",date:"okt 1897",desc:"Oversteek van de evenaar — een mijlpaal voor de bemanning.",journal:"'We overstaken de linie met rum en muziek. Morgen begint de onbekende wereld.' — F. Cook"},
  {coords:[-33.00,-14.00],label:"Midden-Atlantisch",date:"okt 1897",desc:"Koers zuidwaarts door de Atlantische Oceaan."},
  {coords:[-38.00,-22.00],label:"Voor Brazilie",date:"okt 1897",desc:"Aanloop naar de Braziliaanse kust."},
  {coords:[-43.10,-22.90],label:"Rio de Janeiro",date:"okt 1897",desc:"Tussenstop in Brazilie voor bevoorrading.",journal:"'De warmte is ondraaglijk. Overmorgen: het zuiden.' — scheepslogboek"},
  {coords:[-46.50,-26.00],label:"Open oceaan Brazilie",date:"okt 1897",desc:"Open zee voor de Braziliaanse kust."},
  {coords:[-48.00,-30.00],label:"Braziliaanse kust",date:"nov 1897",desc:"Langs de Braziliaanse kust zuidwaarts."},
  {coords:[-51.00,-33.50],label:"Rio de la Plata",date:"nov 1897",desc:"Langs de monding van de Rio de la Plata."},
  {coords:[-52.00,-34.60],label:"Buenos Aires",date:"nov 1897",desc:"Laatste grote haven voor het vertrek naar de Zuidpool.",journal:"'Dit is onze laatste aanraking met de beschaving.' — A. de Gerlache"},
  {coords:[-59.50,-37.00],label:"Open oceaan ZA",date:"nov 1897",desc:"Open zee ten oosten van de Argentijnse kust."},
  {coords:[-54.00,-38.00],label:"Open zee ZA",date:"nov 1897",desc:"Open zee langs de Patagonische kust — ver van het land."},
  {coords:[-58.00,-43.00],label:"Patagonische kust",date:"dec 1897",desc:"Open oceaan voor Patagonie."},
  {coords:[-59.00,-44.50],label:"Open Atlantisch",date:"dec 1897",desc:"Open zee voor Patagonie."},
  {coords:[-60.00,-49.00],label:"Falklandeilanden",date:"dec 1897",desc:"Tussenstop bij de Falklandeilanden."},
  {coords:[-62.00,-53.00],label:"Straat Magellaan",date:"dec 1897",desc:"Gevaarlijke zuidelijke wateren — koud en stormachtig."},
  {coords:[-64.50,-56.00],label:"Kaap Hoorn",date:"jan 1898",desc:"Doortocht rond de beruchtste kaap ter wereld.",journal:"'Kaap Hoorn. De golven zijn tien meter hoog. God sta ons bij.' — scheepslogboek, 14 jan 1898"},
  {coords:[-63.00,-59.00],label:"Drake Passage",date:"jan 1898",desc:"De ruwste zee ter wereld tussen Kaap Hoorn en Antarctica."},
  {coords:[-61.50,-62.00],label:"South Shetland Is.",date:"jan 1898",desc:"Eerste Antarctische eilanden in zicht."},
  {coords:[-64.50,-64.80],label:"Gerlachestraat",date:"feb 1898",desc:"Ontdekking van de nieuwe zeestraat. Eilanden Brabant & Anvers benoemd.",journal:"'We hebben een nieuwe wereld gevonden. Mijn hart is vol.' — A. de Gerlache"},
  {coords:[-72.00,-67.50],label:"Antarctisch water",date:"feb 1898",desc:"Dieper het pakijs in. Temperaturen dalen snel.",journal:"'Het ijs sluit zich achter ons. Er is geen weg terug meer.' — R. Amundsen"},
  {coords:[-85.00,-70.50],label:"Bellingshausenzee",date:"mrt 1898",desc:"Het schip vriest vast in het pakijs. Begin van 375 dagen gevangenschap.",journal:"'17 mei 1898: De zon is voor het laatste ondergegaan. We gaan de totale duisternis in.' — A. de Gerlache"},
  {coords:[-88.00,-71.00],label:"Drift in het ijs",date:"1898-1899",desc:"Scheurbuik, 70 dagen poolnacht. Emile Danco sterft op 6 juni 1898.",journal:"'Danco is vannacht gestorven. De stilte is ondraaglijk.' — F. Cook"},
  {coords:[-72.00,-68.00],label:"Bevrijding",date:"mrt 1899",desc:"Bevrijding uit het ijs! Koers noordwaarts.",journal:"'Na 375 dagen zien we open water. De mannen schreeuwen van vreugde.' — scheepslogboek"},
  {coords:[-62.00,-58.00],label:"Drake Passage terug",date:"apr 1899",desc:"Terugtocht door de Drake Passage."},
  {coords:[-42.00,-20.00],label:"Noord-Atlantisch",date:"aug 1899",desc:"Lange terugreis door de Atlantische Oceaan."},
  {coords:[-22.00,5.00],label:"Midden-Atlantisch",date:"sept 1899",desc:"Koers noordwaarts."},
  {coords:[-10.00,36.00],label:"Voor Portugal",date:"okt 1899",desc:"Aanloop naar Europa."},
  {coords:[-1.00,49.00],label:"Kanaal",date:"nov 1899",desc:"Het Kanaal in, richting Antwerpen."},
  {coords:[4.40,51.22],label:"Terugkeer Antwerpen",date:"nov 1899",desc:"Feestelijk onthaal na 2 jaar en 3 maanden.",journal:"'We zijn thuis. Antwerpen ontvangt ons als helden.' — A. de Gerlache"},
];

const BOUDEWIJN_STOPS:RawStop[]=[
  {coords:[4.40,51.22],label:"Antwerpen",date:"dec 1957",desc:"Vertrek met ijsbrekers Polarhav & Polarsirkel.",journal:"'Zestig jaar na mijn vader vertrek ik op dezelfde missie.' — G. de Gerlache"},
  {coords:[1.80,50.10],label:"Nauw van Calais",date:"dec 1957",desc:"Doortocht door het Nauw van Calais."},
  {coords:[-5.00,47.50],label:"Golf van Biskaje",date:"dec 1957",desc:"Doortocht door de Golf van Biskaje."},
  {coords:[-9.10,38.70],label:"Lissabon",date:"dec 1957",desc:"Langs de Portugese kust zuidwaarts."},
  {coords:[-17.50,28.00],label:"Canarische Eilanden",date:"dec 1957",desc:"Langs de Canarische Eilanden."},
  {coords:[-18.00,21.00],label:"Voor Mauritanie",date:"dec 1957",desc:"Open zee voor West-Afrika."},
  {coords:[-17.50,15.00],label:"Dakar, Senegal",date:"dec 1957",desc:"Langs de West-Afrikaanse kust, Dakar in zicht."},
  {coords:[-17.00,10.00],label:"Golf van Guinea",date:"dec 1957",desc:"Koers over de Atlantische Oceaan richting Kaap Stad."},
  {coords:[-16.00,0.00],label:"Evenaar",date:"dec 1957",desc:"Oversteek van de evenaar."},
  {coords:[-10.00,-10.00],label:"Centraal-Atlantisch",date:"dec 1957",desc:"Open Atlantische Oceaan."},
  {coords:[-4.00,-20.00],label:"Voor Angola",date:"dec 1957",desc:"Koers richting Zuid-Afrika, ten westen van Angola."},
  {coords:[-1.00,-30.00],label:"Voor Namibie",date:"dec 1957",desc:"Open oceaan voor Namibie."},
  {coords:[2.00,-33.00],label:"West van ZA",date:"dec 1957",desc:"Open oceaan ten westen van Zuid-Afrika."},
  {coords:[3.00,-34.00],label:"West van ZA",date:"dec 1957",desc:"Open oceaan ten westen van Zuid-Afrika."},
  {coords:[18.40,-33.90],label:"Kaap Stad",date:"dec 1957",desc:"Laatste haven voor Antarctica. Materiaal geladen.",journal:"'Kaapstad voor de laatste keer. De berg kijkt ons na.' — G. de Gerlache"},
  {coords:[15.00,-43.00],label:"Zuid-Atlantisch",date:"dec 1957",desc:"Open oceaan, richting Antarctica."},
  {coords:[18.00,-55.00],label:"Zuidelijke Oceaan",date:"dec 1957",desc:"Doortocht door de woeste zuidelijke wateren.",journal:"'De albatros volgt ons al drie dagen.' — logboek"},
  {coords:[20.00,-63.00],label:"Antarctische cirkel",date:"dec 1957",desc:"Oversteek van de zuidpoolcirkel."},
  {coords:[22.00,-68.00],label:"Queen Maud Land",date:"25 dec 1957",desc:"Aankomst op tweede kerstdag 1957.",journal:"'Kerstmis op het ijs. We zingen Stille Nacht in vijf talen.' — G. de Gerlache"},
  {coords:[24.30,-70.40],label:"Boudewijn-basis",date:"jan 1958",desc:"Bouw van het eerste Belgische poolstation op 70 graden 26 minuten Z.",journal:"'De basis staat. Mijn vader zou trots zijn geweest.' — G. de Gerlache"},
];

const PRINCESS_STOPS:RawStop[]=[
  {coords:[4.40,51.22],label:"Antwerpen",date:"okt 2007",desc:"Basis voorgemonteerd op Tour & Taxis terrein in Brussel.",journal:"'We bouwen de toekomst van poolonderzoek — zonder een gram CO2 te verspillen.' — A. Hubert"},
  {coords:[1.80,50.10],label:"Nauw van Calais",date:"okt 2007",desc:"Doortocht door het Nauw van Calais."},
  {coords:[-5.00,47.50],label:"Golf van Biskaje",date:"okt 2007",desc:"Doortocht door de Golf van Biskaje."},
  {coords:[-9.50,39.00],label:"Voor Portugal",date:"nov 2007",desc:"Open zee voor Portugal."},
  {coords:[-17.50,28.00],label:"Canarische Eilanden",date:"nov 2007",desc:"Langs de Canarische Eilanden."},
  {coords:[-20.00,15.00],label:"West-Afrika",date:"nov 2007",desc:"Open Atlantische Oceaan voor West-Afrika."},
  {coords:[-18.00,5.00],label:"Evenaar",date:"nov 2007",desc:"Oversteek van de evenaar."},
  {coords:[-12.00,-10.00],label:"Centraal-Atlantisch",date:"nov 2007",desc:"Open Atlantische Oceaan richting Zuid-Afrika."},
  {coords:[-5.00,-22.00],label:"Voor Angola",date:"nov 2007",desc:"Open oceaan ten westen van Angola."},
  {coords:[0.00,-32.00],label:"Voor Namibie",date:"nov 2007",desc:"Open oceaan voor de Namibische kust."},
  {coords:[4.00,-34.00],label:"West van ZA",date:"nov 2007",desc:"Open oceaan ten westen van Zuid-Afrika."},
  {coords:[5.00,-34.00],label:"West van ZA",date:"nov 2007",desc:"Open oceaan ten westen van Zuid-Afrika."},
  {coords:[18.40,-33.90],label:"Kaap Stad",date:"nov 2007",desc:"Verscheping van alle materialen via Zuid-Afrika.",journal:"'De containers bevatten 3000 ton materiaal. Alles is duurzaam.' — logboek"},
  {coords:[14.00,-44.00],label:"Zuid-Atlantisch",date:"dec 2007",desc:"Koers naar Antarctica."},
  {coords:[18.00,-55.00],label:"Zuidelijke Oceaan",date:"dec 2007",desc:"IJsbreker Ivan Papanin in de woeste zuidelijke wateren.",journal:"'Zeven meter hoge golven. De containers houden.' — logboek"},
  {coords:[21.00,-63.00],label:"Antarctische cirkel",date:"jan 2008",desc:"Oversteek van de zuidpoolcirkel."},
  {coords:[22.50,-67.00],label:"Dronning Maud Land",date:"jan 2008",desc:"Lossen van zware materialen op het pakijs.",journal:"'De helikopter doet 47 trips per dag.' — A. Hubert"},
  {coords:[23.34,-71.94],label:"Utsteinen",date:"feb 2009",desc:"Officiele opening — eerste 0-emissie poolbasis ter wereld.",journal:"'De turbines draaien. We produceren meer energie dan we verbruiken.' — A. Hubert"},
];

// ══════════════════════════════════════════
// PERSONEN
// ══════════════════════════════════════════

const PERSONEN:Persoon[]=[
  {id:"degerlache",naam:"Adrien de Gerlache",rol:"Expeditiecommandant",nationaliteit:"Belgie",leeftijdOpReis:"31 jaar",
    expeditie:"De Belgica 1897–1899",expeditieKleur:"#C8A85A",
    fotoUrl:"/IMG/3141_adrien-de-gerlache.jpg",
    bio:"Adrien Victor Joseph de Gerlache de Gomery was de drijvende kracht achter de eerste Belgische Antarctische expeditie. Als jonge marine-officier wist hij tegen alle verwachtingen in financiering en een internationaal team samen te brengen. Zijn ontdekking van de Gerlachestraat en de gedwongen overwintering in het pakijs maakten hem tot een nationaal held. De psychologische impact van de poolnacht was zwaar — hij leed samen met zijn bemanning aan depressie en scheurbuik.",
    citaat:"De kaden stonden vol volk. Niemand wist of we ooit zouden terugkeren.",
    citaatBron:"A. de Gerlache, scheepslogboek, 16 augustus 1897",
    feitjes:[{label:"Geboren",value:"2 aug 1866, Hasselt"},{label:"Gestorven",value:"4 dec 1934, Brussel"},{label:"Rang",value:"Luitenant-ter-zee"},{label:"Ontdekking",value:"Gerlachestraat, Antarctica"}]},
  {id:"amundsen",naam:"Roald Amundsen",rol:"Eerste officier",nationaliteit:"Noorwegen",leeftijdOpReis:"25 jaar",
    expeditie:"De Belgica 1897–1899",expeditieKleur:"#C8A85A",
    fotoUrl:"/IMG/12496_roald-amundsen.jpg",
    bio:"Roald Amundsen was pas 25 jaar oud toen hij aan boord van de Belgica stapte als eerste officier. De ervaring van de poolnacht en het overwinteren in het ijs vormde hem als ontdekkingsreiziger. Hij observeerde hoe de bemanning in verval raakte en trok zijn eigen lessen over overlevingstechnieken. Vijftien jaar later zou hij als eerste mens de Zuidpool bereiken. De Belgica was zijn leerschool.",
    citaat:"Het ijs sluit zich achter ons. Er is geen weg terug meer.",
    citaatBron:"R. Amundsen, dagboek, februari 1898",
    feitjes:[{label:"Geboren",value:"16 jul 1872, Borge"},{label:"Gestorven",value:"18 jun 1928, Barentszzee"},{label:"Later",value:"Eerste mens op Zuidpool 1911"},{label:"Verdwenen",value:"Zoektocht naar Nobile"}]},
  {id:"cook",naam:"Frederick Cook",rol:"Scheepsarts & Fotograaf",nationaliteit:"Verenigde Staten",leeftijdOpReis:"32 jaar",
    expeditie:"De Belgica 1897–1899",expeditieKleur:"#C8A85A",
    fotoUrl:"/IMG/12500_frederick-albert-cook.jpg",
    bio:"Frederick Cook redde als arts letterlijk levens tijdens de poolnacht. Hij stelde vast dat blootstelling aan vuur en het eten van vers vlees de scheurbuik kon terugdringen. Zijn belichteringstechniek met open vuurtjes gaf de bemanning terug een gevoel van daglicht. Cook maakte ook het grootste deel van het fotografisch archief van de expeditie.",
    citaat:"We overstaken de linie met rum en muziek. Morgen begint de onbekende wereld.",
    citaatBron:"F. Cook, dagboek, oktober 1897",
    feitjes:[{label:"Geboren",value:"10 jun 1865, New York"},{label:"Gestorven",value:"5 aug 1940, New York"},{label:"Bijdrage",value:"Behandeling poolnacht-depressie"},{label:"Fotos",value:"300+ historische opnamen"}]},
  {id:"gaston",naam:"Gaston de Gerlache",rol:"Expeditiecommandant",nationaliteit:"Belgie",leeftijdOpReis:"38 jaar",
    expeditie:"Koning Boudewijn-basis 1957–1967",expeditieKleur:"#7A9E5A",
    fotoUrl:"/IMG/12504_adrien-de-gerlache.jpg",
    bio:"Gaston de Gerlache was de zoon van Adrien de Gerlache. Zestig jaar na zijn vader leidde hij de Belgische expeditie naar Queen Maud Land tijdens het Internationaal Geofysisch Jaar 1957–1958. Hij bouwde er de Koning Boudewijn-basis, het eerste permanente Belgische poolstation. De basis werd gesloten in 1961 wegens geldgebrek.",
    citaat:"Zestig jaar na mijn vader vertrek ik op dezelfde missie. Zijn geest zit in elk geval mee.",
    citaatBron:"G. de Gerlache, interview, december 1957",
    feitjes:[{label:"Geboren",value:"1919, Brussel"},{label:"Gestorven",value:"1997"},{label:"Vader",value:"Adrien de Gerlache"},{label:"Basis gebouwd",value:"Januari 1958, 70 graden 26 minuten Z"}]},
  {id:"hubert",naam:"Alain Hubert",rol:"Initiatiefnemer & Poolontdekkingsreiziger",nationaliteit:"Belgie",leeftijdOpReis:"50 jaar",
    expeditie:"Princess Elisabeth Station 2009–heden",expeditieKleur:"#E8934A",
    fotoUrl:"/IMG/3141_adrien-de-gerlache.jpg",
    bio:"Alain Hubert doorkruiste in 1997–98 met Dixie Dansercoer Antarctica over 3924 km op powerkites, ter ere van de 100ste verjaardag van de Belgica. Daarna richtte hij de International Polar Foundation op en leidde hij het project dat resulteerde in de eerste volledig duurzame poolbasis ter wereld: Princess Elisabeth Station op 71 graden 57 minuten Z.",
    citaat:"We bouwen de toekomst van poolonderzoek — zonder een gram CO2 te verspillen.",
    citaatBron:"A. Hubert, opening Princess Elisabeth Station, 2009",
    feitjes:[{label:"Geboren",value:"1954, Belgie"},{label:"Tocht 1998",value:"3924 km Antarctica"},{label:"Organisatie",value:"International Polar Foundation"},{label:"Basis",value:"100 procent hernieuwbare energie"}]},
];

// ══════════════════════════════════════════
// DATAPUNTEN
// ══════════════════════════════════════════

const DATAPUNTEN:DataPunt[]=[
  {id:"dagen-ijs",value:"375",unit:"dagen",label:"Vast in het pakijs",
    context:"De Belgica, Bellingshausenzee, 1898–1899",
    detail:"Op 28 februari 1898 vroor de Belgica vast in het pakijs van de Bellingshausenzee. Pas op 14 maart 1899 — na 375 dagen — wist de bemanning zich te bevrijden door een kanaal te hakken. De poolnacht duurde 70 dagen: van 17 mei tot eind juli 1898 was er geen zonlicht. Twee bemanningsleden overleefden de expeditie niet.",
    kleur:"#C8A85A",visualType:"bar",visualMax:375,visualValue:375},
  {id:"bemanning",value:"19",unit:"man",label:"Internationale bemanning",
    context:"De Belgica, vertrek Antwerpen 1897",
    detail:"De 19-koppige bemanning was internationaal samengesteld: Belgen, Noren, een Roemeen, een Pool en een Amerikaan. Emile Danco stierf op 6 juni 1898 aan hartzwakte tijdens de poolnacht. Carl Auguste Wiencke verdronk op 22 januari 1898 nabij Kaap Hoorn. Roald Amundsen — later de eerste mens op de Zuidpool — was eerste officier.",
    kleur:"#C8A85A",visualType:"counter",visualMax:19,visualValue:19},
  {id:"temperatuur",value:"-31",unit:"graden C gemiddeld",label:"Temperatuur Utsteinen",
    context:"Princess Elisabeth Station, jaargemiddelde",
    detail:"Het Princess Elisabeth Station ligt op 71 graden 57 minuten Z op een granieten rotsrichel van 700 meter. De jaargemiddelde temperatuur bedraagt -31 graden C. In de winter kan het zakken tot -50 graden C. Toch produceert de basis meer energie dan ze verbruikt — volledig via wind en zon.",
    kleur:"#E8934A",visualType:"thermometer",visualMax:50,visualValue:31},
  {id:"afstand",value:"3924",unit:"km",label:"Doorkruising Antarctica",
    context:"Alain Hubert & Dixie Dansercoer, 1997–1998",
    detail:"In 1997–1998, ter ere van de 100ste verjaardag van de Belgica-expeditie, doorkruisten Alain Hubert en Dixie Dansercoer Antarctica over 3924 km op powerkites. De tocht duurde 99 dagen en verbond de Weddelzee met de Indische Oceaan. Het was de langste onondersteunde ijsreis ooit op dat moment.",
    kleur:"#7A9E5A",visualType:"bar",visualMax:4000,visualValue:3924},
  {id:"energie",value:"100%",unit:"hernieuwbaar",label:"Energiegebruik Princess Elisabeth",
    context:"Princess Elisabeth Station, 2009–heden",
    detail:"Princess Elisabeth Station is de eerste poolbasis ter wereld die volledig op hernieuwbare energie draait. Negen windturbines en 542 m2 zonnepanelen leveren alle energie. De basis verbruikt slechts een vijfde van wat vergelijkbare basissen gebruiken.",
    kleur:"#E8934A",visualType:"bar",visualMax:100,visualValue:100},
];

// ══════════════════════════════════════════
// ARCHIEFSTUKKEN
// ══════════════════════════════════════════

const ARCHIEFSTUKKEN:Archiefstuk[]=[
  // ── DE BELGICA ──
  {id:"belgica-antwerpen-1897",titel:"De Belgica in Antwerpen, 1897",datum:"1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Belgica-expeditie",
    context:"Het schip de Belgica in de haven van Antwerpen voor het vertrek.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/5311_belgica-in-antwerpen-1897.jpg"},
  {id:"belgica-antwerpen-2",titel:"De Belgica in Antwerpen",datum:"1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Belgica-expeditie",
    context:"Het schip de Belgica klaar voor vertrek vanuit de haven van Antwerpen.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/5318_belgica-in-antwerpen.jpg"},
  {id:"belgica-oostende-1905",titel:"De Belgica in Oostende, 1905",datum:"1905",
    herkomst:"Archief de Gerlache / KBR",collectie:"Belgica-expeditie",
    context:"De Belgica aangemeerd in Oostende, 1905.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/8995_de-belgica-in-oostende-in-1905.jpg"},
  {id:"belgica-foto-1",titel:"De Belgica",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Belgica-expeditie",
    context:"Historische foto van het schip de Belgica.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/3142_belgica.jpg"},
  {id:"belgica-foto-2",titel:"De Belgica op zee",datum:"1897-1899",
    herkomst:"Archief de Gerlache / KBR",collectie:"Belgica-expeditie",
    context:"De Belgica op zee tijdens de expeditie naar Antarctica.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/3146_belgica.jpg"},
  {id:"belgica-foto-3",titel:"De Belgica",datum:"1897-1899",
    herkomst:"Archief de Gerlache / KBR",collectie:"Belgica-expeditie",
    context:"Historisch beeld van de Belgica.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/5602_belgica.jpg"},
  {id:"belgica-isfjord",titel:"De Belgica bij de ijsfjord",datum:"1898",
    herkomst:"Archief de Gerlache / KBR",collectie:"Belgica-expeditie",
    context:"De Belgica navigeert langs een ijsfjord in Antarctische wateren.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/5322_isfjord.jpg"},
  {id:"belgica-inspectie",titel:"Inspectie van de Belgica",datum:"1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Belgica-expeditie",
    context:"Inspectie van de Belgica voor het vertrek.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/5316_inspectie-van-de-belgica.jpg"},
  {id:"belgica-scheepsplan",titel:"Scheepsplan van de Belgica",datum:"1896",
    herkomst:"Archief de Gerlache / KBR",collectie:"Technische documentatie",
    context:"Technisch scheepsplan van de Belgica, opgesteld voor de verbouwing tot onderzoeksschip.",
    type:"document",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/5603_scheepsplan.jpg"},
  {id:"herinneringskaart",titel:"Herinneringskaart Belgica-expeditie",datum:"1899",
    herkomst:"Archief de Gerlache / KBR",collectie:"Memorabilia",
    context:"Herinneringskaart uitgegeven ter gelegenheid van de terugkeer van de Belgica-expeditie.",
    type:"kaart",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/9398_herinneringskaart.jpg"},
  {id:"postkaart-belgica",titel:"Postkaart De Belgica",datum:"circa 1899",
    herkomst:"Collectie Van Omer-Vilain",collectie:"Postkaarten Belgica-expeditie",
    context:"Postkaart met een afbeelding van de Belgica, afkomstig uit de collectie van Omer-Vilain.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/9397_postkaart-getiteld-qyacht-belgica-du-duc-dorleans-et-la-gareq-de-kaart-is-afkomstig-uit-de-collectie-van-omer-vilain.jpg"},
  {id:"bemanning-belgica",titel:"Bemanning van de Belgica",datum:"1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie Belgica",
    context:"Groepsfoto van de bemanning van de Belgica voor het vertrek uit Antwerpen.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/9399_bemanning-van-de-belgica.jpg"},
  {id:"babcb16a",titel:"Archiefdocument Belgica",datum:"1897-1899",
    herkomst:"Archief de Gerlache / KBR",collectie:"Belgica-expeditie",
    context:"Historisch archiefdocument van de Belgica-expeditie.",
    type:"document",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/babcb16a-1a1f-11ed-b07d-02b7b76bf47f.jpg"},
  // ── LECOINTE KAARTEN ──
  {id:"lecointe-kaart-1",titel:"Lecointe kaart 1903 (blad 1)",datum:"1903",
    herkomst:"Koninklijk Belgisch Instituut voor Natuurwetenschappen",collectie:"Cartografische collectie Antarctica",
    context:"Kaart van de Gerlachestraat opgesteld door eerste stuurman Georges Lecointe, 1903. Blad 1.",
    type:"kaart",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/32321_lecointe-1903-kaart-1.jpg"},
  {id:"lecointe-kaart-2",titel:"Lecointe kaart 1903 (blad 2)",datum:"1903",
    herkomst:"Koninklijk Belgisch Instituut voor Natuurwetenschappen",collectie:"Cartografische collectie Antarctica",
    context:"Kaart van de Gerlachestraat opgesteld door Georges Lecointe, 1903. Blad 2.",
    type:"kaart",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/32322_lecointe-1903-kaart-2.jpg"},
  {id:"lecointe-kaart-3",titel:"Lecointe kaart 1903 (blad 3)",datum:"1903",
    herkomst:"Koninklijk Belgisch Instituut voor Natuurwetenschappen",collectie:"Cartografische collectie Antarctica",
    context:"Kaart van de Gerlachestraat opgesteld door Georges Lecointe, 1903. Blad 3.",
    type:"kaart",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/32323_lecointe-1903-kaart-3.jpg"},
  {id:"lecointe-kaart-4",titel:"Lecointe kaart 1903 (blad 4)",datum:"1903",
    herkomst:"Koninklijk Belgisch Instituut voor Natuurwetenschappen",collectie:"Cartografische collectie Antarctica",
    context:"Kaart van de Gerlachestraat opgesteld door Georges Lecointe, 1903. Blad 4.",
    type:"kaart",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/32324_lecointe-1903-kaart-4.jpg"},
  {id:"lecointe-kaart-5",titel:"Lecointe kaart 1903 (blad 5)",datum:"1903",
    herkomst:"Koninklijk Belgisch Instituut voor Natuurwetenschappen",collectie:"Cartografische collectie Antarctica",
    context:"Kaart van de Gerlachestraat opgesteld door Georges Lecointe, 1903. Blad 5.",
    type:"kaart",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/32325_lecointe-1903-kaart-5.jpg"},
  {id:"lecointe-kaart-6",titel:"Lecointe kaart 1903 (blad 6)",datum:"1903",
    herkomst:"Koninklijk Belgisch Instituut voor Natuurwetenschappen",collectie:"Cartografische collectie Antarctica",
    context:"Kaart van de Gerlachestraat opgesteld door Georges Lecointe, 1903. Blad 6.",
    type:"kaart",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/32326_lecointe-1903-kaart-6.jpg"},
  {id:"lecointe-kaart-7",titel:"Lecointe kaart 1903 (blad 7)",datum:"1903",
    herkomst:"Koninklijk Belgisch Instituut voor Natuurwetenschappen",collectie:"Cartografische collectie Antarctica",
    context:"Kaart van de Gerlachestraat opgesteld door Georges Lecointe, 1903. Blad 7.",
    type:"kaart",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/32327_lecointe-1903-kaart-7.jpg"},
  // ── ARCTOWSKI ──
  {id:"arctowski-fig-2",titel:"Arctowski figuur 2, 1901",datum:"1901",
    herkomst:"Wetenschappelijke publicatie Belgica-expeditie",collectie:"Resultaten der reis",
    context:"Wetenschappelijke illustratie door Henryk Arctowski uit de publicaties van de Belgica-expeditie, figuur 2.",
    type:"document",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/32666_arctowski-en-thoulet-1901-fig-2.jpg"},
  {id:"arctowski-fig-6",titel:"Arctowski figuur 6, 1901",datum:"1901",
    herkomst:"Wetenschappelijke publicatie Belgica-expeditie",collectie:"Resultaten der reis",
    context:"Wetenschappelijke illustratie door Henryk Arctowski uit de publicaties van de Belgica-expeditie, figuur 6.",
    type:"document",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/32670_arctowski-en-thoulet-1901-fig-6.jpg"},
  // ── PORTRETTEN DE BELGICA ──
  {id:"portret-adrien",titel:"Adrien de Gerlache",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Portret van Adrien de Gerlache, commandant van de Belgica-expeditie.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/3141_adrien-de-gerlache.jpg"},
  {id:"portret-adrien-2",titel:"Adrien de Gerlache (portret 2)",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Tweede portret van Adrien de Gerlache, commandant van de Belgica.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12504_adrien-de-gerlache.jpg"},
  {id:"portret-nansen-scheepskat",titel:"Nansen en de scheepskat",datum:"1897-1899",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Fridtjof Nansen met de scheepskat van de Belgica.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12495_nansen-de-scheepskat.jpg"},
  {id:"portret-amundsen-1",titel:"Roald Amundsen",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Portret van Roald Amundsen, eerste officier op de Belgica.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12496_roald-amundsen.jpg"},
  {id:"portret-amundsen-2",titel:"Roald Amundsen (portret 2)",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Tweede portret van Roald Amundsen van de Belgica-expeditie.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12785_roald-amundsen.jpg"},
  {id:"portret-george-lecointe-1",titel:"Georges Lecointe",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Portret van Georges Lecointe, eerste stuurman en cartograaf van de Belgica.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12498_george-lecointe.jpg"},
  {id:"portret-george-lecointe-2",titel:"Georges Lecointe (portret 2)",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Tweede portret van Georges Lecointe.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12556_george-lecointe.jpg"},
  {id:"portret-henryck-arctowski-1",titel:"Henryk Arctowski",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Portret van Henryk Arctowski, oceanograaf en meteoroloog op de Belgica.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12499_henryck-arctowski.jpg"},
  {id:"portret-henryck-arctowski-2",titel:"Henryk Arctowski (portret 2)",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Tweede portret van Henryk Arctowski.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12557_henryck-arctowski.jpg"},
  {id:"portret-frederick-cook",titel:"Frederick Cook",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Portret van Frederick Cook, scheepsarts en fotograaf van de Belgica.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12500_frederick-albert-cook.jpg"},
  {id:"portret-emile-racovitza",titel:"Emile Racovitza",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Portret van Emile Racovitza, zoologisch en botanisch onderzoeker op de Belgica.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12501_emile-racovitza.jpg"},
  {id:"portret-emile-danco",titel:"Emile Danco",datum:"circa 1897",
    herkomst:"Archief de Gerlache / KBR",collectie:"Portrettencollectie",
    context:"Portret van Emile Danco, geofysicus op de Belgica. Danco overleed op 6 juni 1898 tijdens de poolnacht.",
    type:"foto",expeditie:"De Belgica",expeditieKleur:"#C8A85A",
    imageUrl:"/IMG/12513_emile-danco.jpg"},
];

// ══════════════════════════════════════════
// ANTARCTICA ROUTES (op het continent)
// Naadloze aansluiting op de zeereis —
// zelfde haversine snelheid, geen sprongen
// ══════════════════════════════════════════

interface AntarcticaStop {
  coords:[number,number]; // [lng, lat]
  label:string;
  date:string;
  desc:string;
  opLand:boolean; // false=schip/pakijs, true=op continent
}
interface AntarcticaRoute {
  id:string; naam:string;
  kleur:string; kleurDim:string; kleurGlow:string;
  periode:string; beschrijving:string;
  // Globe: ingezoomd op Antarctica
  centerRotate:[number,number,number];
  schaal:number;
  stops:AntarcticaStop[];
}

// Belgica-drift: begint op zee (Gerlachestraat) → vastgevroren → bevrijding
// Boudewijn: aankomst per schip → op het ijs → terug
// Princess: aankomst → station → veldtochten → terug
const ANTARCTICA_ROUTES:AntarcticaRoute[]=[
  {
    id:"belgica-drift",
    naam:"Drift van de Belgica",
    kleur:"#C8A85A",kleurDim:"rgba(200,168,90,.12)",kleurGlow:"rgba(200,168,90,.3)",
    periode:"feb 1898 – mrt 1899",
    beschrijving:"De Belgica voer de Gerlachestraat in, vroor vast op 28 februari 1898 in het pakijs van de Bellingshausenzee en dreef 375 dagen passief mee. Op 14 maart 1899 hackte de bemanning een kanaal vrij.",
    centerRotate:[83,70,0],
    schaal:2200,
    stops:[
      {coords:[-64.50,-64.80],label:"Gerlachestraat",   date:"feb 1898",     desc:"Ontdekking van de Gerlachestraat. Het schip vaart dieper Antarctica in.",          opLand:false},
      {coords:[-70.00,-66.50],label:"Dieper Antarctica", date:"feb 1898",     desc:"Het ijs sluit zich langzaam achter het schip. De temperatuur daalt snel.",         opLand:false},
      {coords:[-77.00,-68.00],label:"Pakijsrand",        date:"feb 1898",     desc:"De Belgica bereikt het pakijs. Terug is geen optie meer.",                          opLand:false},
      {coords:[-83.00,-69.80],label:"Ingevroren",        date:"28 feb 1898",  desc:"De Belgica vriest vast. Begin van 375 dagen gevangenschap in het pakijs.",          opLand:true},
      {coords:[-85.00,-70.50],label:"Vastgevroren",      date:"mrt 1898",     desc:"Het schip drijft mee met het ijs. De mannen kunnen het dek oplopen.",              opLand:true},
      {coords:[-86.50,-70.80],label:"Drift noordwest",   date:"apr 1898",     desc:"Het pakijs drijft langzaam. Het schip heeft geen controle meer.",                  opLand:true},
      {coords:[-87.20,-71.10],label:"Poolnacht begint",  date:"17 mei 1898",  desc:"De zon gaat 70 dagen onder. Totale duisternis. De bemanning raakt depressief.",    opLand:true},
      {coords:[-88.00,-71.00],label:"Diepste punt",      date:"jun 1898",     desc:"Emile Danco sterft op 6 juni 1898. Meest zuidelijke positie van de drift.",        opLand:true},
      {coords:[-87.00,-70.60],label:"Zon keert terug",   date:"aug 1898",     desc:"Na 70 dagen keert het licht terug. De bemanning begint een kanaal te hakken.",     opLand:true},
      {coords:[-85.50,-70.20],label:"Kanaal hakken",     date:"jan 1899",     desc:"De mannen hakken dagenlang. Het kanaal vordert langzaam richting open water.",     opLand:true},
      {coords:[-83.00,-69.50],label:"Bijna vrij",        date:"feb 1899",     desc:"Het kanaal is bijna klaar. Het open water is zichtbaar.",                           opLand:true},
      {coords:[-77.00,-68.00],label:"Bevrijding!",       date:"14 mrt 1899",  desc:"Na 375 dagen verlaat de Belgica het pakijs. Koers noordwaarts naar open water.",   opLand:false},
      {coords:[-70.00,-66.00],label:"Open water",        date:"mrt 1899",     desc:"Eindelijk open zee. De mannen schreeuwen van vreugde.",                            opLand:false},
    ],
  },
  {
    id:"boudewijn-veldtochten",
    naam:"Veldtochten Boudewijn-basis",
    kleur:"#7A9E5A",kleurDim:"rgba(122,158,90,.12)",kleurGlow:"rgba(122,158,90,.3)",
    periode:"dec 1957 – mrt 1958",
    beschrijving:"Het schip meerde aan op het pakijs. Helikopters en sleeën brachten materiaal naar de basis op 70°26′Z. Vanuit de basis legden onderzoekers veldtochten af tot 230 km op het plateau.",
    centerRotate:[-24,70,0],
    schaal:2400,
    stops:[
      {coords:[20.00,-63.00],label:"Antarctische cirkel",date:"dec 1957",     desc:"Oversteek van de zuidpoolcirkel. Antarctica in zicht.",                              opLand:false},
      {coords:[22.00,-66.00],label:"Pakijsrand",         date:"dec 1957",     desc:"Het schip bereikt het pakijs. Lossen begint.",                                      opLand:false},
      {coords:[23.00,-68.50],label:"Lossen op het ijs",  date:"dec 1957",     desc:"Helikopters en sleeën brengen materiaal van het schip naar de basis.",             opLand:true},
      {coords:[24.30,-70.40],label:"Boudewijn-basis",    date:"jan 1958",     desc:"De basis staat. Startpunt van alle veldtochten op het ijsplateau.",                opLand:true},
      {coords:[21.00,-70.20],label:"Gletsjer west",      date:"jan 1958",     desc:"Glaciologische metingen. IJsdikte en stroomrichting gemeten.",                     opLand:true},
      {coords:[19.00,-71.00],label:"Weerstation 1",      date:"feb 1958",     desc:"Automatisch weerstation geplaatst, 80 km westelijk van de basis.",                 opLand:true},
      {coords:[21.00,-72.00],label:"Plateau zuidwest",   date:"feb 1958",     desc:"Verkenning van het diepe ijsplateau. Temperatuur daalt tot -42°C.",                opLand:true},
      {coords:[24.30,-72.50],label:"Diepste veldtocht",  date:"feb 1958",     desc:"Meest zuidelijke meetpost. 230 km van de basis, compleet alleen op het ijs.",      opLand:true},
      {coords:[27.00,-72.00],label:"Plateau zuidoost",   date:"mrt 1958",     desc:"Terugweg langs de zuidoostflank van het plateau.",                                 opLand:true},
      {coords:[28.50,-71.00],label:"Weerstation 2",      date:"mrt 1958",     desc:"Tweede weerstation geplaatst, 120 km oostelijk van de basis.",                     opLand:true},
      {coords:[24.30,-70.40],label:"Terug op de basis",  date:"mrt 1958",     desc:"Terug op de Boudewijn-basis. Data en stalen opgeslagen.",                          opLand:true},
      {coords:[23.00,-68.50],label:"Terug op het schip", date:"mrt 1958",     desc:"Helikopters brengen het team terug naar het schip. Koers noordwaarts.",            opLand:false},
      {coords:[20.00,-63.00],label:"Antarctische cirkel",date:"apr 1958",     desc:"Het schip verlaat Antarctica. Missie geslaagd.",                                   opLand:false},
    ],
  },
  {
    id:"princess-onderzoek",
    naam:"Wetenschappelijke tochten Princess Elisabeth",
    kleur:"#E8934A",kleurDim:"rgba(232,147,74,.12)",kleurGlow:"rgba(232,147,74,.3)",
    periode:"2009 – heden",
    beschrijving:"IJsbreker brengt onderzoekers naar het pakijs. Vliegtuigen en helikopters verbinden het station met de buitenwereld. Jaarlijkse veldtochten op het plateau voor klimaat- en glaciologisch onderzoek.",
    centerRotate:[-23,72,0],
    schaal:2400,
    stops:[
      {coords:[21.00,-63.00],label:"Antarctische cirkel",date:"jan (jaarlijks)", desc:"De ijsbreker oversteekt de zuidpoolcirkel.",                                      opLand:false},
      {coords:[22.00,-67.00],label:"Dronning Maud Land", date:"jan",            desc:"Lossen van materiaal op het pakijs. Helikopters naar het station.",               opLand:false},
      {coords:[23.00,-69.50],label:"Aanvliegpunt",       date:"jan",            desc:"Vliegtuig landt op de ijs-landingsbaan nabij het station.",                       opLand:true},
      {coords:[23.34,-71.94],label:"Princess Elisabeth", date:"jan–feb",        desc:"Het station op de Utsteinen-rotsrichel, 71°57′Z. Alle tochten vertrekken hier.",  opLand:true},
      {coords:[20.50,-71.50],label:"IJskernen west",     date:"feb",            desc:"Boring van ijskernen tot 300 m diepte voor klimaatonderzoek.",                    opLand:true},
      {coords:[18.00,-72.30],label:"Atmosferisch station",date:"feb",           desc:"Meetstation voor broeikasgassen en aerosolconcentraties op het plateau.",         opLand:true},
      {coords:[20.00,-73.50],label:"Diep plateau",       date:"feb",            desc:"Radarmeting van de ijsdikte. Het ijs is hier meer dan 2 km dik.",                opLand:true},
      {coords:[23.34,-74.00],label:"Meest zuidelijk",    date:"feb",            desc:"Meest zuidelijke meetpost. 220 km van het station.",                              opLand:true},
      {coords:[26.50,-73.50],label:"Plateau oost",       date:"mrt",            desc:"Snelheidsmetingen van de ijsstroom richting de kust.",                           opLand:true},
      {coords:[28.00,-72.20],label:"Rotsrichel oost",    date:"mrt",            desc:"Geologische staalnames uit de blootliggende rotsrichels.",                       opLand:true},
      {coords:[23.34,-71.94],label:"Princess Elisabeth", date:"mrt",            desc:"Terug op het station. Data en stalen worden verwerkt en gevlogen naar Kaap Stad.", opLand:true},
      {coords:[23.00,-69.50],label:"Vertrek",            date:"mrt",            desc:"Vliegtuig vertrekt naar Kaap Stad. Het station gaat in winterslaap.",             opLand:true},
      {coords:[21.00,-63.00],label:"Antarctica verlaten",date:"mrt",            desc:"De ijsbreker verlaat Antarctica. Tot volgend seizoen.",                          opLand:false},
    ],
  },
];

// ══════════════════════════════════════════
// EXPEDITIES
// ══════════════════════════════════════════

const EXPEDITIES:Expeditie[]=[
  {id:"belgica",titel:"De Belgica",periode:"1897 – 1899",leider:"Adrien de Gerlache",persoonId:"degerlache",
    kleur:"#C8A85A",kleurDim:"rgba(200,168,90,0.10)",kleurGlow:"rgba(200,168,90,0.30)",
    samenvatting:"De eerste wetenschappelijke expeditie naar Antarctica. Het schip overwinterde 375 dagen vast in het pakijs van de Bellingshausenzee.",
    stats:[{value:"375",unit:"dagen",label:"vast in het ijs",datapuntId:"dagen-ijs"},{value:"19",unit:"man",label:"bemanning",datapuntId:"bemanning"},{value:"1898",unit:"jaar",label:"overwintering"},{value:"2",unit:"doden",label:"Danco & Wiencke"}],
    waypoints:buildWaypoints(BELGICA_STOPS)},
  {id:"boudewijn",titel:"Koning Boudewijn-basis",periode:"1957 – 1967",leider:"Gaston de Gerlache",persoonId:"gaston",
    kleur:"#7A9E5A",kleurDim:"rgba(122,158,90,0.10)",kleurGlow:"rgba(122,158,90,0.30)",
    samenvatting:"Tijdens het Internationaal Geofysisch Jaar bouwde Belgie zijn eerste wetenschappelijke basis in Queen Maud Land.",
    stats:[{value:"3",unit:"expeds.",label:"overwinteringen"},{value:"70N26",unit:"Z",label:"locatie basis"},{value:"1961",unit:"sluiting",label:"geldgebrek"},{value:"60",unit:"jaar",label:"na Belgica"}],
    waypoints:buildWaypoints(BOUDEWIJN_STOPS)},
  {id:"princess",titel:"Princess Elisabeth",periode:"2009 – heden",leider:"Alain Hubert / IPF",persoonId:"hubert",
    kleur:"#E8934A",kleurDim:"rgba(232,147,74,0.10)",kleurGlow:"rgba(232,147,74,0.30)",
    samenvatting:"De eerste volledig duurzame poolbasis ter wereld. 100% wind- en zonne-energie op een granieten rotsrichel van 700 meter.",
    stats:[{value:"100%",unit:"duurzaam",label:"wind & zon",datapuntId:"energie"},{value:"1/5",unit:"energie",label:"van vergelijkbaar"},{value:"700m",unit:"rotsrichel",label:"Utsteinen"},{value:"2009",unit:"opening",label:"Pooljaar"}],
    waypoints:buildWaypoints(PRINCESS_STOPS),liveWidget:true},
];

const LIVE_BASE={wind:47,solar:82,temp:-31};
const KEY_STOP_LABELS=["Antwerpen","Lissabon","Dakar, Senegal","Rio de Janeiro","Buenos Aires","Falklandeilanden","Kaap Hoorn","South Shetland Is.","Gerlachestraat","Bellingshausenzee","Drift in het ijs","Bevrijding","Terugkeer Antwerpen","Kaap Stad","Antarctische cirkel","Queen Maud Land","Boudewijn-basis","Dronning Maud Land","Utsteinen"];

// ══════════════════════════════════════════
// GEDEELDE UI COMPONENTEN
// ══════════════════════════════════════════

function EyebrowLabel({kleur,text}:{kleur:string;text:string}){
  return(
    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",
      color:kleur,display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
      <span style={{width:16,height:1,background:kleur,opacity:.45,display:"inline-block"}}/>
      {text}
    </div>
  );
}

function ArchiefKnop({onClick,kleur,compact=false,fullWidth=false,t}:{onClick:()=>void;kleur:string;compact?:boolean;fullWidth?:boolean;t?:typeof T["nl"]}){
  const [hov,setHov]=useState(false);
  return(
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,
        padding:compact?"5px 11px":"7px 14px",width:fullWidth?"100%":undefined,
        borderRadius:8,border:`1px solid ${hov?kleur+"60":kleur+"22"}`,
        background:hov?`${kleur}14`:`${kleur}07`,cursor:"pointer",
        fontFamily:"'JetBrains Mono',monospace",fontSize:compact?7.5:8.5,
        letterSpacing:".14em",textTransform:"uppercase",
        color:hov?kleur:`${kleur}70`,transition:"all .2s",outline:"none"}}>
      📂 {compact?(t?.tipArchief??"Archief"):(t?.archief??"Bekijk archief")}
    </button>
  );
}

// ══════════════════════════════════════════
// DETAIL CSS
// ══════════════════════════════════════════

const DCSS=`
  @keyframes dSU{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes dFI{from{opacity:0}to{opacity:1}}
  @keyframes dCU{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
  .ds1{animation:dSU .42s cubic-bezier(.4,0,.2,1) both}
  .ds2{animation:dSU .42s .09s cubic-bezier(.4,0,.2,1) both}
  .ds3{animation:dSU .42s .17s cubic-bezier(.4,0,.2,1) both}
  .dfi{animation:dFI .32s ease both}
  .dbk{position:fixed;inset:0;z-index:500;background:rgba(12,8,2,.82);backdrop-filter:blur(14px);
    display:flex;align-items:center;justify-content:center;padding:28px;}
  .dpn{background:rgba(22,14,4,.98);border:1px solid rgba(200,168,90,.18);border-radius:20px;
    box-shadow:0 40px 80px rgba(0,0,0,.82),inset 0 1px 0 rgba(200,168,90,.10);
    position:relative;overflow:hidden;max-height:92vh;overflow-y:auto;}
  .dpn::-webkit-scrollbar{width:2px}.dpn::-webkit-scrollbar-thumb{background:rgba(200,168,90,.16);border-radius:1px}
  .dpn::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(200,168,90,.38),transparent)}
  .dcl{width:56px;height:56px;border-radius:50%;flex-shrink:0;
    border:1px solid rgba(200,168,90,.20);background:rgba(200,168,90,.06);
    cursor:pointer;display:flex;align-items:center;justify-content:center;
    font-size:22px;color:rgba(200,168,90,.65);transition:all .2s;outline:none;}
  .dcl:hover{background:rgba(200,168,90,.12);border-color:rgba(200,168,90,.4);color:#D8ECF8}
  .fr{display:flex;align-items:baseline;justify-content:space-between;
    padding:8px 0;border-bottom:1px solid rgba(200,168,90,.08);}
  .fr:last-child{border-bottom:none}
`;

// ══════════════════════════════════════════
// DETAIL — PERSOON
// ══════════════════════════════════════════

function PersoonDetail({id,onClose,onArchief,t,lang}:{id:string;onClose:()=>void;onArchief:()=>void;t:any;lang:Lang}){
  const p=PERSONEN.find(x=>x.id===id);if(!p)return null;
  const [fotoLightbox,setFotoLightbox]=useState(false);
  const pb=PERSOON_BIOS[lang]?.[id]??PERSOON_BIOS.nl[id];
  const bio=pb?.bio??p.bio;
  const citaat=pb?.citaat??p.citaat;
  const citaatBron=pb?.citaatBron??p.citaatBron;
  return(
    <>
    {fotoLightbox&&(
      <div onClick={()=>setFotoLightbox(false)} style={{position:"fixed",inset:0,zIndex:600,
        background:"rgba(0,0,0,.94)",display:"flex",alignItems:"center",justifyContent:"center",
        cursor:"zoom-out",padding:20}}>
        <img src={p.fotoUrl} alt={p.naam}
          style={{maxWidth:"90vw",maxHeight:"90vh",objectFit:"contain",borderRadius:8,
            border:"1px solid rgba(200,168,90,.18)"}}/>
        <div style={{position:"absolute",top:18,right:22,fontFamily:"'JetBrains Mono',monospace",
          fontSize:8.5,color:"rgba(200,168,90,.35)",letterSpacing:".14em",textTransform:"uppercase"}}>
          Klik om te sluiten
        </div>
      </div>
    )}
    <div className="dbk dfi" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="dpn ds1" style={{width:"min(860px,100%)"}}>
        {/* Header */}
        <div style={{padding:"26px 32px 20px",borderBottom:"1px solid rgba(200,168,90,.09)",
          display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
          <div style={{flex:1}}>
            <EyebrowLabel kleur={p.expeditieKleur} text={p.expeditie}/>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:900,
              color:"#F0E6C8",lineHeight:1.05,marginBottom:8}}>{p.naam}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"rgba(200,168,90,.80)",
              display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:14}}>
              <span>{p.rol}</span><span style={{opacity:.3}}>|</span>
              <span>{p.nationaliteit}</span><span style={{opacity:.3}}>|</span>
              <span>{p.leeftijdOpReis} {t.bijVertrek}</span>
            </div>
            <ArchiefKnop onClick={()=>{onClose();setTimeout(onArchief,60);}} kleur={p.expeditieKleur} compact t={t}/>
          </div>
          <button className="dcl" onClick={onClose}>✕</button>
        </div>
        {/* Body */}
        <div style={{padding:"24px 32px 32px",display:"flex",gap:28}}>
          {/* Links: foto placeholder + feitjes */}
          <div className="ds2" style={{width:210,flexShrink:0}}>
            <div style={{width:210,marginBottom:18,borderRadius:12,overflow:"hidden",
              background:"rgba(8,16,30,1)",border:"1px solid rgba(200,168,90,.12)",
              position:"relative",cursor:"zoom-in"}}
              onClick={()=>setFotoLightbox(true)}>
              <img src={p.fotoUrl} alt={p.naam}
                style={{width:"100%",display:"block",objectFit:"cover",maxHeight:260,
                  transition:"transform .3s ease"}}
                onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.04)")}
                onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}/>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,
                background:`linear-gradient(90deg,transparent,${p.expeditieKleur},transparent)`,opacity:.55}}/>
              <div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.55)",
                borderRadius:5,padding:"3px 7px",fontFamily:"'JetBrains Mono',monospace",
                fontSize:9,color:"rgba(200,168,90,.70)",letterSpacing:".1em",textTransform:"uppercase"}}>
                🔍 Vergroten
              </div>
            </div>
            <div style={{borderTop:"1px solid rgba(200,168,90,.09)",paddingTop:12}}>
              {p.feitjes.map((f,i)=>(
                <div key={i} className="fr">
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                    color:"rgba(200,168,90,.60)",letterSpacing:".08em",textTransform:"uppercase"}}>{f.label}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                    color:p.expeditieKleur,fontWeight:600,textAlign:"right",maxWidth:130}}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Rechts: bio + citaat */}
          <div className="ds3" style={{flex:1}}>
            <p style={{fontSize:15.5,color:"rgba(235,215,170,.88)",lineHeight:1.92,marginBottom:24}}>{bio}</p>
            {p.citaat&&(
              <div style={{borderLeft:`3px solid ${p.expeditieKleur}`,paddingLeft:18}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",
                  fontSize:17,color:"rgba(220,175,90,.95)",lineHeight:1.8,marginBottom:10}}>
                  "{citaat}"
                </div>
                {p.citaatBron&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                  color:"rgba(180,145,55,.70)",letterSpacing:".08em"}}>— {citaatBron}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// ══════════════════════════════════════════
// DETAIL — DATAPANEEL (met animaties)
// ══════════════════════════════════════════

function BarVisueel({value,max,kleur}:{value:number;max:number;kleur:string}){
  const [w,setW]=useState(0);
  const pct=Math.min(100,(value/max)*100);
  useEffect(()=>{const t=setTimeout(()=>setW(pct),220);return()=>clearTimeout(t);},[pct]);
  const seg=22,fill=Math.round((w/100)*seg);
  return(
    <div style={{marginBottom:28}}>
      {/* Gesegmenteerde balk */}
      <div style={{display:"flex",gap:3,marginBottom:9}}>
        {Array.from({length:seg}).map((_,i)=>(
          <div key={i} style={{flex:1,height:26,borderRadius:4,
            background:i<fill?kleur:"rgba(200,168,90,.06)",
            border:`1px solid ${i<fill?kleur+"55":"rgba(200,168,90,.09)"}`,
            transition:`all ${0.06+i*0.05}s ease`,
            boxShadow:i<fill?`0 0 7px ${kleur}30`:"none"}}/>
        ))}
      </div>
      {/* Glow-balk */}
      <div style={{height:5,background:"rgba(200,168,90,.06)",borderRadius:3,overflow:"hidden",marginBottom:7}}>
        <div style={{height:"100%",width:`${w}%`,
          background:`linear-gradient(90deg,${kleur}50,${kleur})`,borderRadius:3,
          transition:"width 2s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 12px ${kleur}55`}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",
        fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(200,168,90,.50)",letterSpacing:".1em"}}>
        <span>0</span>
        <span style={{color:kleur,fontWeight:600,fontSize:11}}>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function ThermometerVisueel({value,kleur}:{value:number;kleur:string}){
  const [h,setH]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setH(Math.min(100,(value/50)*100)),220);return()=>clearTimeout(t);},[value]);
  const graden=[-50,-40,-30,-20,-10,0];
  return(
    <div style={{display:"flex",justifyContent:"center",gap:18,marginBottom:28}}>
      <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",
        height:200,paddingBottom:4}}>
        {graden.map(g=>(
          <div key={g} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,
            color:Math.abs(g)===value?"#D8ECF8":"#2E4A5E",letterSpacing:".06em",
            textAlign:"right"}}>{g}°</div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:34,height:200,background:"rgba(200,168,90,.05)",
          borderRadius:"17px 17px 0 0",overflow:"hidden",display:"flex",alignItems:"flex-end",
          border:"1px solid rgba(200,168,90,.11)",borderBottom:"none",position:"relative"}}>
          {[25,50,75].map(pp=>(
            <div key={pp} style={{position:"absolute",left:0,right:0,bottom:`${pp}%`,height:1,
              background:"rgba(200,168,90,.09)"}}/>
          ))}
          <div style={{width:"100%",height:`${h}%`,
            background:`linear-gradient(to top,${kleur},${kleur}80,${kleur}35)`,
            borderRadius:"17px 17px 0 0",
            transition:"height 2.2s cubic-bezier(.4,0,.2,1)",
            boxShadow:`0 0 18px ${kleur}55,inset 0 0 10px ${kleur}25`}}/>
        </div>
        <div style={{width:46,height:46,borderRadius:"50%",marginTop:-1,
          background:`radial-gradient(circle at 35% 35%,${kleur},${kleur}70)`,
          border:`2px solid ${kleur}55`,
          boxShadow:`0 0 18px ${kleur}70,0 0 36px ${kleur}35`}}/>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:kleur,
          marginTop:9,letterSpacing:".1em",fontWeight:600}}>−{value}°C</div>
      </div>
    </div>
  );
}

function CounterVisueel({value,kleur}:{value:number;kleur:string}){
  const [vis,setVis]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVis(true),120);return()=>clearTimeout(t);},[]);
  return(
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center",marginBottom:12}}>
        {Array.from({length:value}).map((_,i)=>{
          const dead=i>=17;
          return(
            <div key={i} title={dead?(i===17?"Emile Danco — gestorven 6 juni 1898":"Carl Wiencke — verdronken 22 jan 1898"):undefined}
              style={{width:34,height:34,borderRadius:9,
                background:dead?"rgba(200,55,55,.12)":`${kleur}14`,
                border:`1.5px solid ${dead?"rgba(200,55,55,.32)":kleur+"32"}`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,
                opacity:vis?1:0,transform:vis?"scale(1)":"scale(0.4)",
                transition:`all 0.34s ${i*0.045}s ease`,
                boxShadow:dead?"none":`0 0 6px ${kleur}20`,
                cursor:dead?"help":"default"}}>
              {dead?"†":"👤"}
            </div>
          );
        })}
      </div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,color:"rgba(200,168,90,.55)",
        textAlign:"center",letterSpacing:".1em"}}>
        † = omgekomen tijdens de expeditie (hover voor naam)
      </div>
    </div>
  );
}

function DataPaneel({id,onClose,onArchief,t,lang}:{id:string;onClose:()=>void;onArchief:()=>void;t:any;lang:Lang}){
  const d=DATAPUNTEN.find(x=>x.id===id);if(!d)return null;
  const di=DATAPUNT_DETAILS[lang]?.[id]??DATAPUNT_DETAILS.nl[id];
  const dpLabel=di?.label??d.label;
  const dpUnit=di?.unit??d.unit;
  const dpContext=di?.context??d.context;
  const dpDetail=di?.detail??d.detail;
  return(
    <div className="dbk dfi" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="dpn ds1" style={{width:"min(620px,100%)"}}>
        <div style={{padding:"26px 32px 20px",borderBottom:"1px solid rgba(200,168,90,.09)",
          display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          <div>
            <EyebrowLabel kleur={d.kleur} text={dpContext}/>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:27,fontWeight:700,
              color:"#F0E6C8",lineHeight:1.1,marginBottom:12}}>{dpLabel}</div>
            <ArchiefKnop onClick={()=>{onClose();setTimeout(onArchief,60);}} kleur={d.kleur} compact t={t}/>
          </div>
          <button className="dcl" onClick={onClose}>✕</button>
        </div>
        <div style={{padding:"28px 32px 32px"}}>
          <div className="ds2" style={{textAlign:"center",marginBottom:28}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:92,fontWeight:500,lineHeight:1,
              color:d.kleur,textShadow:`0 0 40px ${d.kleur}55,0 0 80px ${d.kleur}25`,
              letterSpacing:"-.02em"}}>{d.value}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,
              color:"rgba(200,168,90,.60)",letterSpacing:".14em",textTransform:"uppercase",
              marginTop:8}}>{dpUnit}</div>
          </div>
          <div className="ds3">
            {d.visualType==="bar"&&d.visualValue!==undefined&&d.visualMax!==undefined&&
              <BarVisueel value={d.visualValue} max={d.visualMax} kleur={d.kleur}/>}
            {d.visualType==="thermometer"&&d.visualValue!==undefined&&
              <ThermometerVisueel value={d.visualValue} kleur={d.kleur}/>}
            {d.visualType==="counter"&&d.visualValue!==undefined&&
              <CounterVisueel value={d.visualValue} kleur={d.kleur}/>}
            <p style={{fontSize:15,color:"rgba(235,215,170,.88)",lineHeight:1.9,
              borderLeft:`2px solid ${d.kleur}40`,paddingLeft:14}}>{dpDetail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// DETAIL — ARCHIEFSTUK
// ══════════════════════════════════════════

function ArchiefDetail({id,onClose,t,lang}:{id:string;onClose:()=>void;t:any;lang:Lang}){
  const a=ARCHIEFSTUKKEN.find(x=>x.id===id);if(!a)return null;
  const [lightbox,setLightbox]=useState(false);
  const ac=ARCHIEF_CONTEXT[lang]?.[id];
  const archiefContext=ac?.context??a.context;
  const tl:{[k:string]:string}={foto:t.histFoto,document:t.histDoc,kaart:t.histKaart,object:t.museumObj};
  return(
    <>
    {lightbox&&(
      <div onClick={()=>setLightbox(false)}
        style={{position:"fixed",inset:0,zIndex:600,
          background:"rgba(0,0,0,.96)",display:"flex",alignItems:"center",justifyContent:"center",
          cursor:"zoom-out",padding:20}}>
        <img src={a.imageUrl} alt={a.titel}
          style={{maxWidth:"94vw",maxHeight:"94vh",objectFit:"contain",borderRadius:12,
            boxShadow:"0 0 80px rgba(0,0,0,.8)"}}/>
        <div style={{position:"absolute",top:20,right:24,
          fontFamily:"'JetBrains Mono',monospace",fontSize:11,
          color:"rgba(245,235,208,.50)",letterSpacing:".14em",textTransform:"uppercase"}}>
          Tik om te sluiten
        </div>
      </div>
    )}
    <div style={{position:"fixed",inset:0,zIndex:500,
      background:"rgba(20,12,4,.55)",backdropFilter:"blur(8px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{
        background:"linear-gradient(160deg,rgba(245,235,208,.99) 0%,rgba(238,224,190,.99) 100%)",
        border:"1px solid rgba(139,74,16,.25)",borderRadius:24,
        boxShadow:"0 40px 100px rgba(0,0,0,.40)",
        width:"min(900px,94vw)",maxHeight:"90vh",
        display:"flex",flexDirection:"column",overflow:"hidden",
        position:"relative",
      }}>
        {/* Decoratieve lijn */}
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:2,
          background:`linear-gradient(90deg,transparent,${a.expeditieKleur},transparent)`}}/>

        {/* Header */}
        <div style={{padding:"28px 32px 20px",borderBottom:"1px solid rgba(139,74,16,.18)",
          display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexShrink:0}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:".22em",
              textTransform:"uppercase",color:"rgba(50,28,8,.55)",marginBottom:8,
              display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:16,height:1,background:a.expeditieKleur,display:"inline-block"}}/>
              {a.expeditie} · {tl[a.type]}
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:900,
              color:"#1E0E04",lineHeight:1.1,marginBottom:6}}>{a.titel}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,
              color:"rgba(50,28,8,.60)"}}>{a.datum}</div>
          </div>
          <button onClick={onClose}
            style={{width:56,height:56,borderRadius:"50%",flexShrink:0,
              border:"1px solid rgba(139,74,16,.30)",background:"rgba(200,155,60,.10)",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:20,color:"rgba(50,28,8,.70)",transition:"all .2s",outline:"none"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(139,74,16,.15)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(200,155,60,.10)";}}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{display:"flex",gap:0,flex:1,overflow:"hidden"}}>
          {/* Foto — groot, klikbaar */}
          <div style={{width:"55%",flexShrink:0,position:"relative",cursor:"zoom-in",
            background:"rgba(180,150,100,.12)"}}
            onClick={()=>setLightbox(true)}>
            <img src={a.imageUrl} alt={a.titel}
              style={{width:"100%",height:"100%",objectFit:"cover",display:"block",
                transition:"transform .4s ease"}}
              onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.03)")}
              onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}/>
            {/* Vergroten hint */}
            <div style={{position:"absolute",bottom:16,right:16,
              background:"rgba(245,235,208,.90)",border:"1px solid rgba(139,74,16,.25)",
              borderRadius:10,padding:"8px 14px",
              fontFamily:"'JetBrains Mono',monospace",fontSize:12,
              color:"rgba(50,28,8,.75)",letterSpacing:".08em",
              display:"flex",alignItems:"center",gap:6}}>
              🔍 Tik om te vergroten
            </div>
            {/* Kleurstreep */}
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:4,
              background:a.expeditieKleur,opacity:.8}}/>
          </div>

          {/* Rechter info kolom */}
          <div style={{flex:1,padding:"28px 32px",overflowY:"auto",
            borderLeft:"1px solid rgba(139,74,16,.15)",
            display:"flex",flexDirection:"column",gap:24}}>

            {/* Context beschrijving */}
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                letterSpacing:".20em",textTransform:"uppercase",
                color:"rgba(50,28,8,.55)",marginBottom:12}}>
                {t.context}
              </div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,
                color:"rgba(30,14,4,.85)",lineHeight:1.85}}>{archiefContext}</p>
            </div>

            {/* Herkomst */}
            <div style={{padding:"18px 20px",borderRadius:14,
              background:"rgba(200,155,60,.08)",
              border:"1px solid rgba(139,74,16,.18)"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                letterSpacing:".20em",textTransform:"uppercase",
                color:"rgba(50,28,8,.55)",marginBottom:10}}>
                {t.herkomst}
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,
                color:"#2A1408",marginBottom:4}}>{a.herkomst}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,
                color:"rgba(50,28,8,.60)"}}>{a.collectie}</div>
            </div>

            {/* Type badge */}
            <div style={{display:"inline-flex",alignItems:"center",gap:8,
              padding:"10px 18px",borderRadius:12,
              border:`1.5px solid ${a.expeditieKleur}60`,
              background:`${a.expeditieKleur}15`,alignSelf:"flex-start"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:a.expeditieKleur,
                boxShadow:`0 0 8px ${a.expeditieKleur}`}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,
                color:"rgba(50,28,8,.80)",letterSpacing:".12em",textTransform:"uppercase",
                fontWeight:600}}>{tl[a.type]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}


// ══════════════════════════════════════════
// ARCHIEF BROWSER
// ══════════════════════════════════════════

function ArchiefBrowser({expeditieId,kleur,onOpen,onClose,t,lang}:{
  expeditieId:string;kleur:string;onOpen:(id:string)=>void;onClose:()=>void;t:any;lang:Lang;
}){
  const [filt,setFilt]=useState<string|null>(null);
  const km:{[k:string]:string}={belgica:"#C8A85A",boudewijn:"#7A9E5A",princess:"#E8934A"};
  const tl:{[k:string]:string}={foto:t.foto,document:t.docType,kaart:t.kaartType,object:t.object};

  const items=ARCHIEFSTUKKEN
    .filter(a=>filt?a.expeditieKleur===km[filt]:true);

  const tabs=[
    {id:null,   label:t.alle,       kleur:"#8B4A10"},
    {id:"belgica",  label:"De Belgica",   kleur:"#C8A85A"},
    {id:"boudewijn",label:"Boudewijn",    kleur:"#7A9E5A"},
    {id:"princess", label:"Princess Elisabeth", kleur:"#E8934A"},
  ];

  return(
    <div style={{position:"fixed",inset:0,zIndex:500,
      background:"rgba(20,12,4,.55)",backdropFilter:"blur(8px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{
        background:"linear-gradient(160deg,rgba(245,235,208,.99) 0%,rgba(238,224,190,.99) 100%)",
        border:"1px solid rgba(139,74,16,.25)",borderRadius:24,
        boxShadow:"0 40px 100px rgba(0,0,0,.45)",
        width:"min(1100px,96vw)",maxHeight:"92vh",
        display:"flex",flexDirection:"column",overflow:"hidden",
        position:"relative",
      }}>
        {/* Decoratieve lijn bovenaan */}
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:2,
          background:"linear-gradient(90deg,transparent,rgba(139,74,16,.35),transparent)"}}/>

        {/* Header */}
        <div style={{padding:"28px 32px 20px",borderBottom:"1px solid rgba(139,74,16,.18)",
          display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexShrink:0}}>
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:".22em",
              textTransform:"uppercase",color:"rgba(50,28,8,.55)",marginBottom:6}}>
              — {t.historischArchief}
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,
              color:"#1E0E04",letterSpacing:"-.01em"}}>{t.belgischePool}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,
              color:"rgba(50,28,8,.55)",letterSpacing:".06em"}}>
              {items.length} {items.length===1?t.document:t.documenten}
            </div>
            <button onClick={onClose}
              style={{width:56,height:56,borderRadius:"50%",flexShrink:0,
                border:"1px solid rgba(139,74,16,.30)",background:"rgba(200,155,60,.10)",
                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:20,color:"rgba(50,28,8,.70)",transition:"all .2s",outline:"none"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(139,74,16,.15)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(200,155,60,.10)";}}>
              ✕
            </button>
          </div>
        </div>

        {/* Filter tabs — grote touch knoppen */}
        <div style={{padding:"16px 32px",borderBottom:"1px solid rgba(139,74,16,.15)",
          display:"flex",gap:10,flexShrink:0,flexWrap:"wrap"}}>
          {tabs.map(tab=>(
            <button key={String(tab.id)} onClick={()=>setFilt(tab.id)}
              style={{
                padding:"14px 24px",borderRadius:14,minHeight:56,
                border:`2px solid ${filt===tab.id?"rgba(139,74,16,.55)":"rgba(139,74,16,.18)"}`,
                background:filt===tab.id?"rgba(200,155,60,.25)":"rgba(200,155,60,.06)",
                cursor:"pointer",outline:"none",transition:"all .18s",
                fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:filt===tab.id?700:500,
                letterSpacing:".06em",textTransform:"uppercase",
                color:filt===tab.id?"#6B3A08":"rgba(50,28,8,.65)",
              }}
              onMouseEnter={e=>{if(filt!==tab.id){e.currentTarget.style.background="rgba(200,155,60,.14)";}}}
              onMouseLeave={e=>{if(filt!==tab.id){e.currentTarget.style.background="rgba(200,155,60,.06)";}}}
            >
              {filt===tab.id&&<span style={{marginRight:6}}>✓</span>}{tab.label}
            </button>
          ))}
        </div>

        {/* Masonry-stijl grid */}
        <div style={{
          flex:1,overflowY:"auto",padding:"24px 32px 32px",
          columns:"3 320px",columnGap:18,
          scrollbarWidth:"thin",scrollbarColor:"rgba(139,74,16,.25) transparent",
        }}>
          {items.map((a,idx)=>{
            // Varieer de hoogte voor een levendige look
            const heights=[260,320,220,360,280,240,300,340,260,290];
            const imgH=heights[idx%heights.length];
            return(
            <div key={a.id}
              onClick={()=>onOpen(a.id)}
              style={{
                breakInside:"avoid",marginBottom:18,
                background:"rgba(255,248,230,.90)",
                border:"1px solid rgba(139,74,16,.18)",
                borderRadius:18,overflow:"hidden",cursor:"pointer",
                boxShadow:"0 3px 12px rgba(80,40,8,.10)",
                transition:"all .22s cubic-bezier(.4,0,.2,1)",
                display:"block",
              }}
              onMouseEnter={e=>{
                (e.currentTarget as HTMLElement).style.transform="translateY(-4px) scale(1.01)";
                (e.currentTarget as HTMLElement).style.boxShadow="0 12px 32px rgba(80,40,8,.22)";
                (e.currentTarget as HTMLElement).style.borderColor="rgba(139,74,16,.40)";
              }}
              onMouseLeave={e=>{
                (e.currentTarget as HTMLElement).style.transform="translateY(0) scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow="0 3px 12px rgba(80,40,8,.10)";
                (e.currentTarget as HTMLElement).style.borderColor="rgba(139,74,16,.18)";
              }}>
              {/* Afbeelding */}
              <div style={{height:imgH,overflow:"hidden",position:"relative",
                background:"rgba(180,150,100,.15)"}}>
                <img src={a.imageUrl} alt={a.titel}
                  style={{width:"100%",height:"100%",objectFit:"cover",display:"block",
                    transition:"transform .4s ease"}}
                  onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.07)")}
                  onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}/>
                {/* Type badge */}
                <div style={{position:"absolute",top:10,left:10,
                  background:"rgba(245,235,208,.94)",border:`1px solid ${a.expeditieKleur}66`,
                  borderRadius:7,padding:"4px 10px",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:10,
                  color:"rgba(50,28,8,.82)",letterSpacing:".12em",textTransform:"uppercase",fontWeight:700}}>
                  {tl[a.type]}
                </div>
                {/* Kleurstreep onderaan foto */}
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:4,
                  background:`linear-gradient(90deg,${a.expeditieKleur},${a.expeditieKleur}80)`,opacity:.85}}/>
              </div>
              {/* Info */}
              <div style={{padding:"16px 18px 18px",
                background:"linear-gradient(to bottom,rgba(255,248,230,.95),rgba(245,232,195,.98))"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,
                  color:"#1E0E04",lineHeight:1.3,marginBottom:6}}>{a.titel}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                  color:"rgba(50,28,8,.58)",letterSpacing:".04em",marginBottom:8}}>{a.datum}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:7,height:7,borderRadius:"50%",
                    background:a.expeditieKleur,boxShadow:`0 0 6px ${a.expeditieKleur}`,flexShrink:0}}/>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                    color:a.expeditieKleur,fontWeight:700,letterSpacing:".04em"}}>{a.expeditie}</div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════
// ANTARCTICA SUB-KAART OVERLAY
// ══════════════════════════════════════════

// ── Helpers voor vloeiende animatie ──
// Haversine tijdsas: constante km/uur snelheid
function antBuildTimes(stops:AntarcticaStop[]):{t:number}[]{
  const d=[0];
  const R=6371,rad=(x:number)=>x*Math.PI/180;
  for(let i=1;i<stops.length;i++){
    const a=stops[i-1].coords,b=stops[i].coords;
    const dl=rad(b[1]-a[1]),dg=rad(b[0]-a[0]);
    d.push(d[i-1]+2*R*Math.asin(Math.sqrt(
      Math.sin(dl/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dg/2)**2
    )));
  }
  const tot=d[d.length-1];
  return stops.map((_,i)=>({t:tot>0?d[i]/tot:i/Math.max(stops.length-1,1)}));
}

// Lineaire interpolatie tussen waypoints op basis van haversine-t
function antGetPos(stops:AntarcticaStop[],times:{t:number}[],t:number):[number,number]{
  if(t<=0)return stops[0].coords;
  if(t>=1)return stops[stops.length-1].coords;
  const i=times.findIndex(x=>x.t>=t);
  if(i<=0)return stops[0].coords;
  const lo=(t-times[i-1].t)/(times[i].t-times[i-1].t);
  const a=stops[i-1].coords,b=stops[i].coords;
  return[a[0]+(b[0]-a[0])*lo, a[1]+(b[1]-a[1])*lo];
}

// Bouw de reeds getekende lijn op (alleen achter het icoon)
function antGetDrawn(stops:AntarcticaStop[],times:{t:number}[],t:number):[number,number][]{
  if(t<=0)return[];
  const pts:[number,number][]=[];
  for(let i=0;i<stops.length;i++){
    if(times[i].t<=t){pts.push(stops[i].coords);}
    else{pts.push(antGetPos(stops,times,t));break;}
  }
  return pts;
}

// Interpoleer ook het opLand-vlag: bepaal of het icoon 🚢 of 🏔️ is
function antIsOpLand(stops:AntarcticaStop[],times:{t:number}[],t:number):boolean{
  const i=times.findIndex(x=>x.t>=t);
  if(i<=0)return stops[0].opLand;
  // Gebruik de stop ACHTER het huidige punt
  return stops[Math.max(0,i-1)].opLand;
}

function antGetStopIdx(times:{t:number}[],t:number):number{
  return times.reduce((best,x,i)=>x.t<=t?i:best,0);
}

function AntarcticaKaart({onClose,t,lang}:{onClose:()=>void;t:any;lang:Lang}){
  const [activeId,setActiveId]=useState<string>("belgica-drift");
  const [selectedStop,setSelectedStop]=useState<number|null>(null);
  const [animT,setAnimT]=useState(0);
  const animRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const route=ANTARCTICA_ROUTES.find(r=>r.id===activeId)!;
  const sel=selectedStop!==null?route.stops[selectedStop]:null;

  useEffect(()=>{
    setSelectedStop(null);
    setAnimT(0);
    if(animRef.current)clearInterval(animRef.current);
    // Animeer de route intekening
    animRef.current=setInterval(()=>{
      setAnimT(p=>{
        if(p>=1){if(animRef.current)clearInterval(animRef.current);return 1;}
        return Math.min(1,p+0.018);
      });
    },30);
    return()=>{if(animRef.current)clearInterval(animRef.current);};
  },[activeId]);

  // Bouw de geanimeerde route op
  const drawnCoords=useMemo(()=>{
    const stops=route.stops;
    if(animT<=0)return[stops[0].coords];
    const total=stops.length-1;
    const progress=animT*total;
    const idx=Math.floor(progress);
    const frac=progress-idx;
    const pts:[number,number][]=stops.slice(0,idx+1).map(s=>s.coords);
    if(idx<total){
      const a=stops[idx].coords,b=stops[idx+1].coords;
      pts.push([a[0]+(b[0]-a[0])*frac, a[1]+(b[1]-a[1])*frac]);
    }
    return pts;
  },[animT,route]);

  const visibleStops=useMemo(()=>{
    const total=route.stops.length-1;
    const progress=animT*total;
    return route.stops.filter((_,i)=>i<=Math.floor(progress));
  },[animT,route]);

  return(
    <div style={{position:"fixed",inset:0,zIndex:500,
      background:"rgba(20,12,4,.60)",backdropFilter:"blur(8px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{
        background:"linear-gradient(160deg,rgba(245,235,208,.99) 0%,rgba(238,224,190,.99) 100%)",
        border:"1px solid rgba(139,74,16,.25)",borderRadius:24,
        boxShadow:"0 40px 100px rgba(0,0,0,.45)",
        width:"min(1160px,96vw)",height:"min(820px,92vh)",
        display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",
      }}>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:2,
          background:`linear-gradient(90deg,transparent,${route.kleur},transparent)`}}/>

        {/* Header */}
        <div style={{padding:"20px 28px 16px",borderBottom:"1px solid rgba(139,74,16,.18)",
          display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexShrink:0}}>
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".22em",
              textTransform:"uppercase",color:"rgba(50,28,8,.50)",marginBottom:5}}>
              — Antarctica · op het continent
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:900,color:"#1E0E04"}}>
              {t.routesOpAnt}
            </div>
          </div>
          {/* Expeditie tabs */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {ANTARCTICA_ROUTES.map(r=>(
              <button key={r.id} onClick={()=>setActiveId(r.id)}
                style={{padding:"14px 20px",borderRadius:14,minHeight:54,
                  border:`2px solid ${activeId===r.id?r.kleur:"rgba(139,74,16,.18)"}`,
                  background:activeId===r.id?`${r.kleur}22`:"rgba(200,155,60,.06)",
                  cursor:"pointer",outline:"none",transition:"all .2s",
                  fontFamily:"'JetBrains Mono',monospace",fontSize:13,
                  fontWeight:activeId===r.id?700:500,letterSpacing:".05em",textTransform:"uppercase",
                  color:activeId===r.id?r.kleur:"rgba(50,28,8,.65)",
                  boxShadow:activeId===r.id?`0 4px 16px ${r.kleur}30`:"none"}}>
                {r.id==="belgica-drift"?"🚢 Belgica drift":r.id==="boudewijn-veldtochten"?"🏔️ Boudewijn":"⚡ Princess Elisabeth"}
              </button>
            ))}
          </div>
          <button onClick={onClose}
            style={{width:56,height:56,borderRadius:"50%",flexShrink:0,
              border:"1px solid rgba(139,74,16,.30)",background:"rgba(200,155,60,.10)",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:22,color:"rgba(50,28,8,.70)",transition:"all .2s",outline:"none"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(139,74,16,.18)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(200,155,60,.10)";}}>✕</button>
        </div>

        {/* Body */}
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>

          {/* KAART — groot */}
          <div style={{flex:1,position:"relative",overflow:"hidden",
            background:`radial-gradient(ellipse at 45% 55%, #DFC878 0%, #C8A040 60%, #B08830 100%)`}}>
            <ComposableMap
              projection="geoOrthographic"
              projectionConfig={{rotate:route.centerRotate,scale:route.schaal}}
              width={760} height={580}
              style={{width:"100%",height:"100%"}}>
              <defs>
                <radialGradient id="ant-globe" cx="38%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#D8BC6A" stopOpacity=".95"/>
                  <stop offset="100%" stopColor="#B89040" stopOpacity=".90"/>
                </radialGradient>
                <filter id="ant-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#6B4A10" floodOpacity=".35"/>
                </filter>
                <filter id="ant-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="8" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="ant-glow-sm" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Globe achtergrond */}
              <circle cx={0} cy={0} r={route.schaal} fill="url(#ant-globe)"/>
              <circle cx={0} cy={0} r={route.schaal} fill="url(#os)"/>
              <circle cx={0} cy={0} r={route.schaal-1} fill="none"
                stroke="rgba(139,74,16,.25)" strokeWidth={2}/>

              {/* Geografie */}
              <Geographies geography={geoUrl}>
                {({geographies}:{geographies:any[]})=>geographies.map((geo:any)=>{
                  const isAnt=geo.id==="010"||geo.properties?.name==="Antarctica";
                  return(<Geography key={geo.rsmKey} geography={geo}
                    filter={isAnt?"url(#ant-shadow)":undefined}
                    fill={isAnt?"rgba(255,252,240,.98)":"rgba(55,35,10,.55)"}
                    stroke={isAnt?"rgba(139,74,16,.40)":"rgba(80,50,15,.12)"}
                    strokeWidth={isAnt?1.0:0.2}
                    style={{default:{outline:"none"},hover:{outline:"none"},pressed:{outline:"none"}}}/>);
                })}
              </Geographies>

              {/* Route: glow laag */}
              {drawnCoords.length>1&&(
                <Line coordinates={drawnCoords as [number,number][]}
                  stroke={route.kleur} strokeWidth={20}
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{opacity:.18,filter:"url(#ant-glow)"}}/>
              )}
              {/* Route: witte outline voor leesbaarheid */}
              {drawnCoords.length>1&&(
                <Line coordinates={drawnCoords as [number,number][]}
                  stroke="rgba(255,252,240,.70)" strokeWidth={7}
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{opacity:1}}/>
              )}
              {/* Route: hoofd kleurlijn */}
              {drawnCoords.length>1&&(
                <Line coordinates={drawnCoords as [number,number][]}
                  stroke={route.kleur} strokeWidth={4}
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{opacity:1}}/>
              )}
              {/* Toekomstige route stippellijn */}
              <Line coordinates={route.stops.map(s=>s.coords)}
                stroke={route.kleur} strokeWidth={1.5}
                strokeDasharray="4 8" strokeLinecap="round"
                style={{opacity:.25}}/>

              {/* Stop markers — alleen zichtbare */}
              {route.stops.map((s,i)=>{
                const isVis=visibleStops.includes(s);
                const isSel=selectedStop===i;
                if(!isVis&&!isSel)return(
                  <Marker key={i} coordinates={s.coords as [number,number]}>
                    <circle r={8} fill="rgba(245,235,208,.30)"
                      stroke={route.kleur} strokeWidth={1.5} opacity={.35}/>
                    <text textAnchor="middle" y={4} fontSize={8} fontWeight="600"
                      fontFamily="JetBrains Mono,sans-serif"
                      fill="rgba(50,28,8,.40)"
                      style={{userSelect:"none",pointerEvents:"none"}}>{i+1}</text>
                  </Marker>
                );
                return(
                  <Marker key={i} coordinates={s.coords as [number,number]}>
                    {/* Grote klikzone */}
                    <circle r={isSel?26:20} fill="transparent" style={{cursor:"pointer"}}
                      onClick={()=>setSelectedStop(isSel?null:i)}/>
                    {/* Glow ring bij geselecteerd */}
                    {isSel&&(
                      <circle r={22} fill="none" stroke={route.kleur}
                        strokeWidth={2.5} opacity={.5}
                        style={{filter:`drop-shadow(0 0 8px ${route.kleur})`}}/>
                    )}
                    {/* Witte outline */}
                    <circle r={isSel?16:11}
                      fill="rgba(245,235,208,.95)"
                      stroke="rgba(255,252,240,.90)" strokeWidth={isSel?3:2}
                      style={{filter:`drop-shadow(0 2px 6px rgba(80,40,8,.40))`}}
                      onClick={()=>setSelectedStop(isSel?null:i)}/>
                    {/* Kleur fill */}
                    <circle r={isSel?12:8}
                      fill={isSel?route.kleur:"rgba(245,235,208,.0)"}
                      stroke={route.kleur} strokeWidth={isSel?0:2.5}
                      style={{cursor:"pointer",transition:"r .15s"}}
                      onClick={()=>setSelectedStop(isSel?null:i)}/>
                    {/* Nummer */}
                    <text textAnchor="middle" y={isSel?5:3.5}
                      fontSize={isSel?12:10} fontWeight="800"
                      fontFamily="JetBrains Mono,sans-serif"
                      fill={isSel?"#fff":"rgba(40,20,5,.85)"}
                      style={{userSelect:"none",pointerEvents:"none"}}>
                      {i+1}
                    </text>
                    {/* Label bij geselecteerd */}
                    {isSel&&(
                      <text x={20} y={5} fontSize={13} fontWeight="700"
                        fontFamily="Playfair Display,serif"
                        fill="#1E0E04"
                        stroke="rgba(245,235,208,.98)" strokeWidth={5} paintOrder="stroke"
                        style={{userSelect:"none",pointerEvents:"none"}}>
                        {s.label}
                      </text>
                    )}
                  </Marker>
                );
              })}
            </ComposableMap>

            {/* Vignette */}
            <div style={{position:"absolute",inset:0,
              background:"radial-gradient(ellipse at center,transparent 42%,rgba(140,95,15,.22) 100%)",
              pointerEvents:"none"}}/>

            {/* Route info overlay — linksonder */}
            <div style={{position:"absolute",bottom:16,left:16,
              background:"rgba(245,235,208,.92)",borderRadius:14,
              padding:"12px 18px",border:"1px solid rgba(139,74,16,.22)",
              boxShadow:"0 4px 16px rgba(80,40,8,.15)"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                color:route.kleur,letterSpacing:".14em",textTransform:"uppercase",
                fontWeight:700,marginBottom:4}}>{route.periode}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,
                fontWeight:700,color:"#1E0E04"}}>{route.naam}</div>
            </div>

            {/* Tip overlay — rechtsonder */}
            <div style={{position:"absolute",bottom:16,right:16,
              background:"rgba(245,235,208,.85)",borderRadius:10,
              padding:"8px 14px",border:"1px solid rgba(139,74,16,.18)"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                color:"rgba(50,28,8,.65)",letterSpacing:".08em",
                display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:16}}>👆</span> Tik op een punt
              </div>
            </div>
          </div>

          {/* RECHTER PANEEL */}
          <div style={{width:310,borderLeft:"1px solid rgba(139,74,16,.18)",
            display:"flex",flexDirection:"column",overflow:"hidden",
            background:"rgba(240,225,185,.50)"}}>

            {sel?(
              <>
                {/* Stop detail */}
                <div style={{padding:"22px 20px 18px",
                  borderBottom:"1px solid rgba(139,74,16,.15)",flexShrink:0}}>
                  {/* Stop badge */}
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,
                    padding:"6px 14px",borderRadius:20,marginBottom:14,
                    background:`${route.kleur}20`,border:`1.5px solid ${route.kleur}60`}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:route.kleur,
                      boxShadow:`0 0 8px ${route.kleur}`}}/>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                      fontWeight:700,color:route.kleur,letterSpacing:".10em",textTransform:"uppercase"}}>
                      Stop {selectedStop!+1} / {route.stops.length}
                    </span>
                  </div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,
                    fontWeight:900,color:"#1E0E04",lineHeight:1.2,marginBottom:8}}>
                    {sel.label}
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,
                    color:"rgba(50,28,8,.60)",display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                    <span style={{fontSize:18}}>{sel.opLand?"🏔️":"🚢"}</span>
                    {sel.date}
                  </div>
                  <div style={{
                    background:`${route.kleur}12`,
                    border:`1px solid ${route.kleur}40`,
                    borderLeft:`4px solid ${route.kleur}`,
                    borderRadius:"0 12px 12px 0",
                    padding:"14px 16px",
                    fontSize:15,color:"rgba(40,20,5,.82)",lineHeight:1.80,
                  }}>
                    {sel.desc}
                  </div>
                </div>
                {/* Navigatie — grote knoppen */}
                <div style={{padding:"16px",borderBottom:"1px solid rgba(139,74,16,.12)",
                  display:"flex",gap:10,flexShrink:0}}>
                  <button onClick={()=>setSelectedStop(p=>p!>0?p!-1:p)}
                    disabled={selectedStop===0}
                    style={{flex:1,padding:"18px 0",borderRadius:14,minHeight:60,
                      border:`2px solid ${selectedStop===0?"rgba(139,74,16,.12)":"rgba(139,74,16,.30)"}`,
                      background:selectedStop===0?"transparent":"rgba(200,155,60,.12)",
                      cursor:selectedStop===0?"default":"pointer",outline:"none",
                      fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700,
                      color:selectedStop===0?"rgba(50,28,8,.20)":"rgba(50,28,8,.80)",
                      transition:"all .15s"}}>
                    ← Vorige
                  </button>
                  <button onClick={()=>setSelectedStop(p=>p!<route.stops.length-1?p!+1:p)}
                    disabled={selectedStop===route.stops.length-1}
                    style={{flex:1,padding:"18px 0",borderRadius:14,minHeight:60,
                      border:`2px solid ${selectedStop===route.stops.length-1?"rgba(139,74,16,.12)":"rgba(139,74,16,.30)"}`,
                      background:selectedStop===route.stops.length-1?"transparent":"rgba(200,155,60,.12)",
                      cursor:selectedStop===route.stops.length-1?"default":"pointer",outline:"none",
                      fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700,
                      color:selectedStop===route.stops.length-1?"rgba(50,28,8,.20)":"rgba(50,28,8,.80)",
                      transition:"all .15s"}}>
                    Volgende →
                  </button>
                </div>
                {/* Stop lijst */}
                <div style={{flex:1,overflowY:"auto",padding:"8px",
                  scrollbarWidth:"thin",scrollbarColor:"rgba(139,74,16,.20) transparent"}}>
                  {route.stops.map((s,i)=>(
                    <button key={i} onClick={()=>setSelectedStop(selectedStop===i?null:i)}
                      style={{display:"flex",alignItems:"center",gap:12,width:"100%",
                        padding:"12px 14px",borderRadius:12,border:"none",
                        background:selectedStop===i?`${route.kleur}15`:"transparent",
                        cursor:"pointer",textAlign:"left",outline:"none",
                        transition:"all .15s",
                        borderLeft:selectedStop===i?`3px solid ${route.kleur}`:"3px solid transparent",
                        marginBottom:2}}
                      onMouseEnter={e=>{if(selectedStop!==i)(e.currentTarget as HTMLElement).style.background="rgba(200,155,60,.10)";}}
                      onMouseLeave={e=>{if(selectedStop!==i)(e.currentTarget as HTMLElement).style.background="transparent";}}>
                      <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,
                        background:selectedStop===i?route.kleur:"rgba(200,155,60,.20)",
                        border:`2px solid ${selectedStop===i?route.kleur:route.kleur+"44"}`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:800,
                        color:selectedStop===i?"#fff":"rgba(50,28,8,.75)",
                        boxShadow:selectedStop===i?`0 0 10px ${route.kleur}50`:"none"}}>
                        {i+1}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,
                          fontWeight:selectedStop===i?700:500,
                          color:selectedStop===i?route.kleur:"rgba(40,20,5,.85)",
                          whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                          {s.label}
                        </div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                          color:"rgba(50,28,8,.50)",marginTop:2,display:"flex",gap:5,alignItems:"center"}}>
                          {s.opLand?"🏔️":"🚢"} {s.date}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ):(
              <>
                {/* Geen stop geselecteerd */}
                <div style={{padding:"22px 20px 16px",
                  borderBottom:"1px solid rgba(139,74,16,.15)",flexShrink:0}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                    color:route.kleur,letterSpacing:".18em",textTransform:"uppercase",
                    marginBottom:6,fontWeight:700}}>{route.periode}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,
                    fontWeight:900,color:"#1E0E04",lineHeight:1.3,marginBottom:12}}>
                    {route.naam}
                  </div>
                  <p style={{fontSize:15,color:"rgba(40,20,5,.75)",lineHeight:1.80}}>
                    {route.beschrijving}
                  </p>
                </div>
                <div style={{padding:"14px 12px 6px",flexShrink:0,
                  borderBottom:"1px solid rgba(139,74,16,.10)"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                    color:"rgba(50,28,8,.55)",letterSpacing:".12em",textTransform:"uppercase",
                    padding:"0 10px 8px",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>👆</span>
                    {route.stops.length} stops — tik om te verkennen
                  </div>
                </div>
                <div style={{flex:1,overflowY:"auto",padding:"8px",
                  scrollbarWidth:"thin",scrollbarColor:"rgba(139,74,16,.20) transparent"}}>
                  {route.stops.map((s,i)=>(
                    <button key={i} onClick={()=>setSelectedStop(i)}
                      style={{display:"flex",alignItems:"center",gap:12,width:"100%",
                        padding:"12px 14px",borderRadius:12,border:"none",background:"transparent",
                        cursor:"pointer",textAlign:"left",outline:"none",
                        transition:"all .15s",marginBottom:2}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(200,155,60,.12)";}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";}}>
                      <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,
                        background:"rgba(200,155,60,.18)",
                        border:`2px solid ${route.kleur}50`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:800,
                        color:"rgba(50,28,8,.75)"}}>
                        {i+1}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,
                          color:"rgba(40,20,5,.85)",
                          whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                          {s.label}
                        </div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                          color:"rgba(50,28,8,.50)",marginTop:2,display:"flex",gap:5,alignItems:"center"}}>
                          {s.opLand?"🏔️":"🚢"} {s.date}
                        </div>
                      </div>
                      <span style={{color:"rgba(139,74,16,.40)",fontSize:20,flexShrink:0}}>›</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════
// DETAIL MANAGER
// ══════════════════════════════════════════

function DetailManager({detail,onClose,onArchief,t,lang}:{detail:DetailState;onClose:()=>void;onArchief:()=>void;t:any;lang:Lang}){
  useEffect(()=>{
    if(!detail)return;
    const h=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[detail,onClose]);
  if(!detail)return null;
  if(detail.type==="persoon")  return<PersoonDetail  id={detail.id} onClose={onClose} onArchief={onArchief} t={t} lang={lang}/>;
  if(detail.type==="datapunt") return<DataPaneel     id={detail.id} onClose={onClose} onArchief={onArchief} t={t} lang={lang}/>;
  if(detail.type==="archief")  return<ArchiefDetail  id={detail.id} onClose={onClose} t={t} lang={lang}/>;
  return null;
}

// ══════════════════════════════════════════
// GEMEMOIZEDE KAART-ACHTERGROND
// Rendert alleen opnieuw bij rotate/scale — niet bij slider
// ══════════════════════════════════════════

const GeoLayer=React.memo(function GeoLayer(){
  return(
    <Geographies geography={geoUrl}>
      {({geographies}:{geographies:any[]})=>geographies.map((geo:any)=>{
        const isAnt=geo.id==="010"||geo.properties?.name==="Antarctica";
        return(
          <Geography key={geo.rsmKey} geography={geo}
            filter={isAnt?"url(#as)":undefined}
            fill={isAnt?"rgba(232,246,255,.95)":"rgba(28,16,6,.75)"}
            stroke={isAnt?"rgba(180,140,60,.40)":"rgba(100,65,15,.20)"}
            strokeWidth={isAnt?0.75:0.25}
            style={{default:{outline:"none"},hover:{fill:isAnt?"rgba(242,252,255,.97)":"rgba(40,22,8,.8)",outline:"none"},pressed:{outline:"none"}}}/>
        );
      })}
    </Geographies>
  );
});

// ══════════════════════════════════════════
// HOOFD COMPONENT
// ══════════════════════════════════════════

export default function AntarcticaMap(){
  const router=useRouter();
  const [activeId,setActiveId]=useState("belgica");
  const [sliderT,setSliderT]=useState(0);
  const [isPlaying,setIsPlaying]=useState(false);
  const [mounted,setMounted]=useState(false);
  const [lang,setLang]=useState<Lang>("nl");
  const t=T[lang];
  const [compareMode,setCompareMode]=useState(false);
  const [liveTime,setLiveTime]=useState(0);
  const [prevLabel,setPrevLabel]=useState("");
  const [cardKey,setCardKey]=useState(0);
  const [rotate,setRotate]=useState<[number,number,number]>([-4.4,-51.2,0]);
  const [mapScale,setMapScale]=useState(500);
  const [detail,setDetail]=useState<DetailState>(null);
  const [archiefOpen,setArchiefOpen]=useState(false);
  const [showToast,setShowToast]=useState(true);
  const [antarcticaOpen,setAntarcticaOpen]=useState(false);

  const targetR=useRef<[number,number,number]>([-4.4,-51.2,0]);
  const currentR=useRef<[number,number,number]>([-4.4,-51.2,0]);
  const targetScale=useRef(500);
  const currentScale=useRef(500);
  const rafRef=useRef<number|null>(null);
  const playRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const liveRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const PLAY_SPEED=0.0007;

  const exp=EXPEDITIES.find(e=>e.id===activeId)!;
  const openArchief=useCallback(()=>{setDetail(null);setArchiefOpen(true);},[]);

  // Museale fix
  useEffect(()=>{
    const els=document.querySelectorAll<HTMLElement>("footer,header:not(.mhdr),nav");
    const prev:string[]=[]; els.forEach((el,i)=>{prev[i]=el.style.display;el.style.display="none";});
    const pvH=document.documentElement.style.overflow,pvB=document.body.style.overflow,pvBg=document.body.style.background;
    document.documentElement.style.overflow="hidden";document.body.style.overflow="hidden";document.body.style.background="#E8D4A0";
    setTimeout(()=>setMounted(true),120);
    return()=>{els.forEach((el,i)=>{el.style.display=prev[i];});document.documentElement.style.overflow=pvH;document.body.style.overflow=pvB;document.body.style.background=pvBg;};
  },[]);

  useEffect(()=>{liveRef.current=setInterval(()=>setLiveTime(t=>t+1),3000);return()=>{if(liveRef.current)clearInterval(liveRef.current);};},[]);


  // ── Na 3 minuten inactiviteit: terug naar startpagina ──
  useEffect(()=>{
    const TIMEOUT=3*60*1000;
    let timer:ReturnType<typeof setTimeout>;
    const reset=()=>{clearTimeout(timer);timer=setTimeout(()=>router.push("/"),TIMEOUT);};
    const EVENTS=["mousemove","mousedown","touchstart","touchmove","keydown","wheel","click"];
    EVENTS.forEach(e=>window.addEventListener(e,reset,{passive:true}));
    reset();
    return()=>{clearTimeout(timer);EVENTS.forEach(e=>window.removeEventListener(e,reset));};
  },[router]);

  useEffect(()=>{
    setSliderT(0);setIsPlaying(false);setCompareMode(false);
    if(playRef.current)clearInterval(playRef.current);
    const s=exp.waypoints[0].coords;
    const tr:[number,number,number]=[-s[0],-s[1],0];
    targetR.current=tr;currentR.current=tr;setRotate(tr);targetScale.current=500;
  },[activeId]);

  useEffect(()=>{
    let frameCount=0;
    const anim=()=>{
      frameCount++;
      const[tx,ty]=targetR.current,[cx,cy,cz]=currentR.current;
      let dx=tx-cx;while(dx>180)dx-=360;while(dx<-180)dx+=360;
      const dy=ty-cy,dist=Math.sqrt(dx*dx+dy*dy);
      const ts=targetScale.current,cs=currentScale.current,ds=ts-cs;
      let rotChanged=false,scChanged=false;
      if(dist>0.08){const ease=Math.min(0.12,dist*0.07);currentR.current=[cx+dx*ease,cy+dy*ease,cz];rotChanged=true;}
      if(Math.abs(ds)>1){const ease=0.07;currentScale.current=cs+ds*ease;scChanged=true;}
      if((rotChanged||scChanged)&&(frameCount%2===0||dist>8||Math.abs(ds)>80)){
        const[nx,ny,nz]=currentR.current;setRotate([nx,ny,nz]);setMapScale(currentScale.current);}
      rafRef.current=requestAnimationFrame(anim);
    };
    rafRef.current=requestAnimationFrame(anim);
    return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);};
  },[]);

  useEffect(()=>{
    const pos=iRoute(exp.waypoints,sliderT);
    targetR.current=[-pos.coords[0],-pos.coords[1],0];
    const lat=pos.coords[1];
    if(lat<-50)targetScale.current=680;
    else if(lat<-20)targetScale.current=560;
    else targetScale.current=480;
  },[sliderT,activeId]);

  useEffect(()=>{
    if(isPlaying){playRef.current=setInterval(()=>{
      setSliderT(p=>{if(p>=1){setIsPlaying(false);return 1;}return Math.min(1,p+PLAY_SPEED);});
    },50);}else{if(playRef.current)clearInterval(playRef.current);}
    return()=>{if(playRef.current)clearInterval(playRef.current);};
  },[isPlaying]);

  const handleKey=useCallback((e:KeyboardEvent)=>{
    if((e.target as HTMLElement).tagName==="INPUT")return;
    if(e.key==="ArrowRight")setSliderT(t=>Math.min(1,t+0.03));
    if(e.key==="ArrowLeft") setSliderT(t=>Math.max(0,t-0.03));
    if(e.key===" "){e.preventDefault();setIsPlaying(p=>!p);}
    if(e.key==="Escape"){setDetail(null);setArchiefOpen(false);}
  },[]);
  useEffect(()=>{window.addEventListener("keydown",handleKey);return()=>window.removeEventListener("keydown",handleKey);},[handleKey]);

  const currentPos   =useMemo(()=>iRoute(exp.waypoints,sliderT),[exp.waypoints,sliderT]);
  const reachedWPs   =useMemo(()=>exp.waypoints.filter(w=>w.t<=sliderT),[exp.waypoints,sliderT]);
  const currentWP    =useMemo(()=>exp.waypoints.reduce((b,w)=>w.t<=sliderT?w:b,exp.waypoints[0]),[exp.waypoints,sliderT]);
  const partialCoords=useMemo(()=>buildPartial(exp.waypoints,sliderT),[exp.waypoints,sliderT]);
  const fullCoords   =useMemo(()=>exp.waypoints.map(w=>w.coords) as [number,number][],[exp.waypoints]);
  const compareCoords=useMemo(()=>EXPEDITIES.find(e=>e.id==="princess")!.waypoints.map(w=>w.coords) as [number,number][],[]);
  const keyStops     =useMemo(()=>exp.waypoints.filter((wp,i)=>i===0||i===exp.waypoints.length-1||KEY_STOP_LABELS.includes(wp.label)),[exp.waypoints]);
  const markerStops  =useMemo(()=>exp.waypoints.filter(wp=>KEY_STOP_LABELS.includes(wp.label)),[exp.waypoints]);

  useEffect(()=>{if(currentWP.label!==prevLabel){setPrevLabel(currentWP.label);setCardKey(k=>k+1);}},[currentWP.label,prevLabel]);

  const pct=Math.round(sliderT*100);
  const samenvatting=SAMENVATTINGEN[lang]?.[activeId]??exp.samenvatting;
  const stopDesc=(label:string,expId:string)=>{
    const dict=expId==="belgica"?BELGICA_DESC:expId==="boudewijn"?BOUDEWIJN_DESC:PRINCESS_DESC;
    return (dict[lang]??dict.nl)?.[label]??(dict.nl)?.[label];
  };
  const currentDesc=stopDesc(currentWP.label,activeId)?.desc??currentWP.desc;
  const currentJournal=stopDesc(currentWP.label,activeId)?.journal??currentWP.journal;
  const windNow=LIVE_BASE.wind+Math.round(Math.sin(liveTime*0.7)*8);
  const solarNow=Math.min(100,LIVE_BASE.solar+Math.round(Math.cos(liveTime*0.4)*12));

  return(
    <>
    {showToast&&(
      <div style={{
        position:"fixed",inset:0,zIndex:9999,
        display:"flex",alignItems:"center",justifyContent:"center",
        background:"rgba(12,8,2,.78)",
        backdropFilter:"blur(10px)",
        WebkitBackdropFilter:"blur(14px)",
      }}>
        <div style={{
          background:"rgba(22,14,4,.97)",
          border:`1px solid ${exp.kleur}45`,
          borderRadius:32,
          padding:"36px 48px 30px",
          display:"flex",flexDirection:"column",alignItems:"center",gap:16,
          width:"min(520px,88vw)",
          boxShadow:`0 40px 100px rgba(0,0,0,.9),0 0 0 1px ${exp.kleur}12,0 0 120px ${exp.kleurGlow}`,
          position:"relative",
        }}>
          <div style={{position:"absolute",top:0,left:"20%",right:"20%",height:1,
            background:`linear-gradient(90deg,transparent,${exp.kleur},transparent)`}}/>
          <div style={{
            width:72,height:72,borderRadius:"50%",
            background:`linear-gradient(135deg,${exp.kleur}18,${exp.kleur}38)`,
            border:`2px solid ${exp.kleur}60`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:28,color:exp.kleur,
            boxShadow:`0 0 50px ${exp.kleurGlow},0 0 0 12px ${exp.kleurDim}`,
          }}>▶</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:900,
            color:"#F5EDD5",letterSpacing:"-.01em",textAlign:"center",lineHeight:1.15}}>
            {t.titel}
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
            color:`${exp.kleur}90`,letterSpacing:".2em",textTransform:"uppercase",
            textAlign:"center",marginTop:-12}}>
            {exp.titel} · {exp.periode}
          </div>
          <p style={{fontSize:14,color:"rgba(225,205,155,.78)",lineHeight:1.80,
            textAlign:"center",fontStyle:"italic",margin:0}}>
            {samenvatting}
          </p>
          <div style={{display:"flex",gap:20,paddingTop:12,paddingBottom:12,
            borderTop:`1px solid ${exp.kleur}15`,borderBottom:`1px solid ${exp.kleur}15`,
            width:"100%",justifyContent:"center"}}>
            {[{icon:"👆",txt:t.tipStop},{icon:"📂",txt:t.tipArchief},{icon:"👤",txt:t.tipCrew}].map((tip,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,
                fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                color:"rgba(200,168,90,.55)",letterSpacing:".04em"}}>
                <span style={{fontSize:17}}>{tip.icon}</span>{tip.txt}
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:14,width:"100%"}}>
            <button
              onClick={()=>setShowToast(false)}
              style={{
                flex:1,padding:"16px 14px",borderRadius:16,
                border:`1px solid ${exp.kleur}30`,background:"transparent",
                cursor:"pointer",outline:"none",
                fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                letterSpacing:".06em",textTransform:"uppercase",
                color:`${exp.kleur}80`,transition:"all .22s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.background=`${exp.kleur}15`;e.currentTarget.style.color=exp.kleur;}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=`${exp.kleur}80`;}}>
              🗺️ {t.route}
            </button>
            <button
              onClick={()=>{setIsPlaying(true);setShowToast(false);}}
              style={{
                flex:2,padding:"18px 16px",borderRadius:18,
                border:`3px solid ${exp.kleur}65`,
                background:`linear-gradient(135deg,${exp.kleur}22,${exp.kleur}42)`,
                cursor:"pointer",outline:"none",
                fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,
                color:"#F5EDD5",transition:"all .22s",
                boxShadow:`0 8px 32px ${exp.kleurGlow}`,
              }}
              onMouseEnter={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${exp.kleur}35,${exp.kleur}55)`;e.currentTarget.style.boxShadow=`0 12px 40px ${exp.kleurGlow}`;  }}
              onMouseLeave={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${exp.kleur}22,${exp.kleur}42)`;e.currentTarget.style.boxShadow=`0 8px 32px ${exp.kleurGlow}`;}}>  
              ▶ {t.beginHint.replace("▶ ","")}
            </button>
          </div>
        </div>
      </div>
    )}
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#E8D4A0",color:"#F0E6C8",
      position:"fixed",inset:0,display:"flex",flexDirection:"column",overflow:"hidden",
      opacity:mounted?1:0,transition:"opacity .8s ease",zIndex:50}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        html,body{overflow:hidden!important;background:#E8D4A0!important;}
        footer,header:not(.mhdr){display:none!important;}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(200,168,90,.12);border-radius:2px}
        .mpanel::-webkit-scrollbar{width:3px}
        .mpanel::-webkit-scrollbar-thumb{background:rgba(200,168,90,.20);border-radius:2px}
        .mpanel::-webkit-scrollbar-track{background:transparent}
        @keyframes ping{0%,100%{transform:scale(1);opacity:.45}60%{transform:scale(2.8);opacity:0}}
        @keyframes halo{0%,100%{opacity:.06}50%{opacity:.16}}
        @keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sl{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blp{0%,100%{opacity:1}50%{opacity:.15}}
        @keyframes gld{0%,100%{opacity:.06}50%{opacity:.25}}
        @keyframes fadeOut{0%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-12px)}}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        .ping{animation:ping 3s ease-in-out infinite}
        .halo{animation:halo 2.8s ease-in-out infinite}
        .su{animation:su .55s cubic-bezier(.4,0,.2,1) both}
        .sl{animation:sl .5s .06s cubic-bezier(.4,0,.2,1) both}
        .fu{animation:fadeup .45s cubic-bezier(.4,0,.2,1) both}
        .blp{animation:blp 1.6s ease-in-out infinite}
        .gld{animation:gld 6s ease-in-out infinite}
        .mpanel{background:linear-gradient(160deg,rgba(242,228,190,.97) 0%,rgba(235,218,178,.99) 100%);border:1px solid rgba(180,145,60,.22);border-radius:18px;box-shadow:0 32px 80px rgba(0,0,0,.7),inset 0 1px 0 rgba(200,168,90,.08);backdrop-filter:blur(28px);position:relative;}
        .mpanel::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(160,120,40,.35),transparent)}
        .stile{border-radius:12px;padding:12px 10px 10px;min-height:72px;border:1px solid rgba(139,74,16,.18);background:rgba(200,155,60,.08);transition:all .22s cubic-bezier(.4,0,.2,1);cursor:pointer;position:relative;overflow:hidden}
        .stile::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(200,168,90,.03),transparent);opacity:0;transition:opacity .22s}
        .stile:hover{border-color:rgba(139,74,16,.35);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3)}
        .stile:hover::before{opacity:1}
        @keyframes stpulse{0%,100%{box-shadow:0 0 0 0 rgba(139,74,16,.0)}70%{box-shadow:0 0 0 6px rgba(139,74,16,.14)}}
        .stile[data-has-link="true"]{animation:stpulse 3s ease-in-out infinite}
        .krow{display:flex;align-items:flex-start;gap:14px;padding:14px 14px;border-radius:12px;min-height:52px;border:none;background:transparent;cursor:pointer;text-align:left;width:100%;transition:background .18s;outline:none;}
        .krow:hover{background:rgba(139,74,16,.10)}
        .eb{flex:1;max-width:360px;display:flex;align-items:center;gap:10px;padding:12px 20px;border-radius:14px;cursor:pointer;text-align:left;transition:all .25s cubic-bezier(.4,0,.2,1);outline:none;border:1px solid rgba(200,168,90,.10);background:rgba(210,170,70,.12);min-height:62px;position:relative;overflow:hidden}
        .eb::after{content:"";position:absolute;bottom:0;left:0;right:0;height:2px;background:transparent;transition:background .25s}
        .eb:hover{transform:translateY(-3px);border-color:rgba(139,74,16,.25);box-shadow:0 12px 32px rgba(0,0,0,.35)}
        .eb.on{transform:translateY(-3px);background:rgba(210,175,80,.25)}
        .pb{width:70px;height:70px;border-radius:50%;border:1px solid rgba(200,168,90,.20);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;transition:all .22s;outline:none;position:relative}
        .pb:hover{transform:scale(1.1)}
        .rb{width:40px;height:40px;border-radius:50%;border:1px solid rgba(200,168,90,.11);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;color:rgba(200,168,90,.3);transition:all .2s;outline:none;}
        .rb:hover{border-color:rgba(200,168,90,.25);color:#D8ECF8}
        input[type=range].rng{-webkit-appearance:none;appearance:none;width:100%;height:8px;border-radius:4px;outline:none;cursor:pointer;background:transparent;position:relative;z-index:1;}
        input[type=range].rng::-webkit-slider-thumb{-webkit-appearance:none;width:44px;height:44px;border-radius:50%;background:#F5E8C0;border:3px solid var(--tc,#8B5E20);box-shadow:0 2px 12px rgba(0,0,0,.5),0 0 0 6px var(--tg,rgba(200,168,90,.10));cursor:grab;transition:transform .18s,box-shadow .18s;}
        input[type=range].rng::-webkit-slider-thumb:active{cursor:grabbing;transform:scale(1.2);box-shadow:0 2px 20px rgba(0,0,0,.6),0 0 0 8px var(--tg,rgba(200,168,90,.12));}
        .yr{background:none;border:none;cursor:pointer;font-family:"JetBrains Mono",monospace;padding:6px 4px;transition:color .18s;outline:none;min-width:36px;min-height:40px;display:flex;align-items:center;justify-content:center;border-radius:6px}
        .yr:hover{background:rgba(200,168,90,.08)}
        ${DCSS}
      `}</style>

      <div style={{flex:1,display:"flex",overflow:"hidden",gap:0}}>

        {/* ══ KAART ══ */}
        <div style={{flex:1,position:"relative",overflow:"hidden",background:"#DFC878"}}>
          <ComposableMap projection="geoOrthographic"
            projectionConfig={{rotate,scale:mapScale}} width={900} height={700}
            style={{width:"100%",height:"100%"}}>
            <defs>
              <radialGradient id="og" cx="38%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#2C1A08" stopOpacity=".95"/>
                <stop offset="100%" stopColor="#C4A050" stopOpacity=".80"/>
              </radialGradient>
              <radialGradient id="os" cx="32%" cy="28%" r="52%">
                <stop offset="0%" stopColor="#E8CC70" stopOpacity=".35"/>
                <stop offset="100%" stopColor="#010608" stopOpacity="0"/>
              </radialGradient>
              <filter id="as" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#000" floodOpacity=".8"/>
              </filter>
              <filter id="rg" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <circle cx={0} cy={0} r={mapScale} fill="url(#og)"/>
            <circle cx={0} cy={0} r={mapScale} fill="url(#os)"/>
            <circle cx={0} cy={0} r={mapScale-1} fill="none" stroke="rgba(180,145,50,.25)" strokeWidth={2}/>
            <GeoLayer/>
            {compareMode&&activeId==="belgica"&&(
              <Line coordinates={compareCoords} stroke="#9B7EE8" strokeWidth={2}
                strokeDasharray="5 9" strokeLinecap="round" style={{opacity:.5}}/>
            )}
            {EXPEDITIES.filter(e=>e.id!==activeId).map(e=>(
              <Line key={e.id} coordinates={e.waypoints.map(w=>w.coords) as [number,number][]}
                stroke={e.kleur} strokeWidth={0.6} strokeDasharray="2 11"
                strokeLinecap="round" style={{opacity:.06}}/>
            ))}
            {partialCoords.length>1&&(
              <Line coordinates={partialCoords} stroke={exp.kleur} strokeWidth={14}
                strokeLinecap="round" strokeLinejoin="round" style={{opacity:.06,filter:"url(#rg)"}}/>
            )}
            <Line coordinates={fullCoords} stroke={exp.kleur} strokeWidth={1}
              strokeDasharray="2 10" strokeLinecap="round" style={{opacity:.35}}/>
            {partialCoords.length>1&&(
              <Line coordinates={partialCoords} stroke={exp.kleur} strokeWidth={3}
                strokeLinecap="round" strokeLinejoin="round" style={{opacity:.95}}/>
            )}
            {reachedWPs.length>0&&(
              <Marker coordinates={reachedWPs[reachedWPs.length-1].coords as [number,number]}>
                <circle r={20} fill={exp.kleur} opacity={.08} className="ping"/>
                <circle r={12} fill={exp.kleur} opacity={.06} className="ping" style={{animationDelay:".8s"}}/>
                <circle r={6} fill={exp.kleur} stroke="rgba(255,255,255,.9)" strokeWidth={2}
                  style={{filter:`drop-shadow(0 0 10px ${exp.kleur})`}}/>
              </Marker>
            )}
            {sliderT>0&&sliderT<1&&(
              <Marker coordinates={currentPos.coords as [number,number]}>
                <circle r={22} fill={exp.kleur} className="halo"/>
                <circle r={7} fill="rgba(235,215,170,.95)" stroke={exp.kleur} strokeWidth={2.5}
                  style={{filter:`drop-shadow(0 0 8px ${exp.kleur})`}}/>
                <text textAnchor="middle" y={-26} fontSize={17}
                  style={{userSelect:"none",filter:"drop-shadow(0 2px 10px rgba(0,0,0,.98))"}}>🚢</text>
              </Marker>
            )}
            {markerStops.filter(wp=>wp.t<=sliderT&&isVisible(wp.coords,rotate)).map((wp,i)=>(
              <Marker key={i} coordinates={wp.coords as [number,number]}>
                <circle r={3.5} fill="rgba(139,74,16,.80)" stroke={exp.kleur} strokeWidth={1.2}
                  style={{filter:`drop-shadow(0 0 5px ${exp.kleur})`}}/>
              </Marker>
            ))}
            {sliderT>0&&isVisible(currentPos.coords,rotate)&&(
              <Marker coordinates={currentPos.coords as [number,number]}>
                <circle r={6} fill={exp.kleur} stroke="rgba(255,255,255,.9)" strokeWidth={2}
                  style={{filter:`drop-shadow(0 0 10px ${exp.kleur})`}}/>
              </Marker>
            )}
          </ComposableMap>

          <div style={{position:"absolute",inset:0,
            background:"radial-gradient(ellipse at center,transparent 42%,rgba(180,130,30,.18) 100%)",
            pointerEvents:"none"}}/>

          

          {sliderT>0&&(
            <div key={currentWP.label} style={{position:"absolute",bottom:32,left:"50%",
              transform:"translateX(-50%)",pointerEvents:"none",zIndex:8,animation:"fadeup .35s cubic-bezier(.4,0,.2,1) both"}}>
              <div style={{background:"rgba(242,228,185,.92)",backdropFilter:"blur(12px)",
                border:`1px solid ${exp.kleur}40`,borderRadius:24,padding:"8px 20px",
                display:"flex",alignItems:"center",gap:10,
                boxShadow:`0 4px 24px rgba(0,0,0,.5),0 0 0 1px ${exp.kleur}10`}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:exp.kleur,flexShrink:0,
                  boxShadow:`0 0 10px ${exp.kleur}`}} className="ping"/>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,
                  color:"#1E0E04",letterSpacing:".01em",whiteSpace:"nowrap"}}>{currentWP.label}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,
                  color:"rgba(80,50,15,.65)",letterSpacing:".08em",whiteSpace:"nowrap"}}>{currentWP.date}</div>
              </div>
            </div>
          )}

          {/* ══ INFO CARD LINKS ══ */}
          <div className="su" style={{position:"absolute",top:16,left:16,bottom:16,width:300,
            padding:"18px 18px 14px",zIndex:10,overflowY:"scroll",overflowX:"hidden",
            scrollbarWidth:"thin",scrollbarColor:`${exp.kleur}50 rgba(200,168,90,.10)`,
            background:"linear-gradient(160deg,rgba(242,228,190,.97) 0%,rgba(235,218,178,.99) 100%)",
            border:"1px solid rgba(200,168,90,.16)",borderRadius:18,
            boxShadow:"0 32px 80px rgba(0,0,0,.7),inset 0 1px 0 rgba(200,168,90,.08)",
            backdropFilter:"blur(28px)"}}>

            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,
              paddingBottom:12,borderBottom:"1px solid rgba(200,168,90,.09)"}}>
              <div style={{display:"flex",gap:2,height:22,flexShrink:0}}>
                {["#1A1A1A","#FDDA25","#EF3340"].map((c,i)=>(
                  <div key={i} style={{width:5,height:"100%",borderRadius:2,background:c}}/>
                ))}
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,
                  color:"#1E0E04",letterSpacing:"-.01em",lineHeight:1.2}}>{t.titel}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,
                  color:"rgba(50,28,8,.70)",letterSpacing:".18em",textTransform:"uppercase",marginTop:2}}>
                  {t.subtitel}
                </div>
              </div>
            </div>

            <div style={{marginBottom:18}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".20em",
                textTransform:"uppercase",color:"#8B4A10",display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{width:18,height:1,background:exp.kleur,opacity:.5,display:"inline-block"}}/>
                {exp.periode}
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,
                color:"#1E0E04",lineHeight:1.0,marginBottom:10,letterSpacing:"-.02em"}}>{exp.titel}</div>
              <div onClick={()=>setDetail({type:"persoon",id:exp.persoonId})}
                style={{display:"inline-flex",alignItems:"center",gap:6,
                  fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"rgba(60,35,8,.75)",
                  marginBottom:10,cursor:"pointer",borderBottom:"1px solid rgba(200,168,90,.10)",
                  paddingBottom:3,transition:"color .2s"}}
                onMouseEnter={e=>(e.currentTarget.style.color="#C8A85A")}
                onMouseLeave={e=>(e.currentTarget.style.color="rgba(100,60,15,.75)")}>
                <span style={{opacity:.5}}>👤</span> {exp.leider}
                <span style={{opacity:.35,fontSize:14}}>›</span>
              </div>
              <p style={{fontSize:15,color:"rgba(50,28,8,.80)",lineHeight:1.85,fontStyle:"italic"}}>
                {samenvatting}
              </p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {exp.stats.map((s,i)=>(
                <div key={i} className="stile" data-has-link={s.datapuntId?"true":"false"}
                  onClick={()=>{if(s.datapuntId)setDetail({type:"datapunt",id:s.datapuntId});}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:600,
                    lineHeight:1,color:"#8B4A10",textShadow:`0 0 22px ${exp.kleurGlow},0 0 44px ${exp.kleurGlow}`}}>
                    {s.value}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,marginTop:4,
                    letterSpacing:".09em",textTransform:"uppercase",color:"rgba(50,28,8,.78)"}}>{s.unit}</div>
                  <div style={{fontSize:14,color:"rgba(200,168,90,.55)",marginTop:5,fontStyle:"italic"}}>{s.label}</div>
                  {s.datapuntId&&(
                    <div style={{fontSize:13,color:"#8B4A10",marginTop:7,fontFamily:"'JetBrains Mono',monospace",
                      letterSpacing:".1em",textTransform:"uppercase",opacity:.9,display:"flex",alignItems:"center",gap:4}}>
                      <span>{t.meerInfo}</span><span style={{fontSize:16}}>›</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <button onClick={openArchief}
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  padding:"12px 14px",borderRadius:12,border:"1px solid rgba(139,74,16,.32)",
                  background:"rgba(200,155,60,.12)",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",
                  fontSize:14,letterSpacing:".08em",textTransform:"uppercase",
                  color:"#8B4A10",transition:"all .22s",outline:"none"}}
                onMouseEnter={e=>{e.currentTarget.style.background=`${exp.kleur}16`;e.currentTarget.style.color=exp.kleur;e.currentTarget.style.borderColor=`${exp.kleur}50`;}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${exp.kleur}08`;e.currentTarget.style.color=`${exp.kleur}70`;e.currentTarget.style.borderColor=`${exp.kleur}28`;}}>
                <span style={{fontSize:20}}>📂</span> {t.archief}
              </button>
              <button onClick={()=>setAntarcticaOpen(true)}
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  padding:"16px 18px",borderRadius:14,border:"1px solid rgba(139,94,32,.25)",
                  background:"rgba(200,155,60,.08)",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",
                  fontSize:15,letterSpacing:".10em",textTransform:"uppercase",
                  color:"rgba(200,168,90,.55)",transition:"all .22s",outline:"none"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,168,90,.12)";e.currentTarget.style.color="#C8A85A";e.currentTarget.style.borderColor="rgba(200,168,90,.32)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(200,168,90,.05)";e.currentTarget.style.color="rgba(200,168,90,.5)";e.currentTarget.style.borderColor="rgba(200,168,90,.16)";}}>
                <span style={{fontSize:20}}>🗺️</span> {t.antarctica}
              </button>            </div>

            {exp.liveWidget&&(
              <div style={{marginTop:14,borderRadius:12,padding:"14px 16px",
                background:"linear-gradient(135deg,rgba(232,147,74,.06),rgba(232,147,74,.03))",
                border:"1px solid rgba(232,147,74,.18)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <div className="blp" style={{width:7,height:7,borderRadius:"50%",background:exp.kleur,
                    flexShrink:0,boxShadow:`0 0 10px ${exp.kleur}`}}/>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#8B4A10",
                    letterSpacing:".14em",textTransform:"uppercase"}}>{t.liveData}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                  {[{val:`${windNow}`,unit:"km/h",lbl:"wind"},{val:`${solarNow}`,unit:"%",lbl:"zon"},{val:`${LIVE_BASE.temp}°`,unit:"C",lbl:"temp"}].map((d,i)=>(
                    <div key={i} onClick={()=>setDetail({type:"datapunt",id:"temperatuur"})} style={{cursor:"pointer"}}>
                      <div style={{display:"flex",alignItems:"baseline",gap:2}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:600,
                          color:"#8B4A10",textShadow:`0 0 14px ${exp.kleurGlow}`}}>{d.val}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"rgba(80,50,15,.60)"}}>{d.unit}</div>
                      </div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                        color:"rgba(50,28,8,.65)",letterSpacing:".1em",textTransform:"uppercase",marginTop:2}}>{d.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{height:16,flexShrink:0}}/>
          </div>

          {/* ══ POSITIE CARD RECHTS ══ */}
          {sliderT>0&&(
            <div key={cardKey} className="mpanel sl"
              style={{position:"absolute",top:20,right:20,width:260,padding:"16px 18px",zIndex:10,
                maxHeight:"calc(100vh - 210px)",overflowY:"auto",overflowX:"hidden",
                scrollbarWidth:"thin",scrollbarColor:`${exp.kleur}30 transparent`}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:".22em",
                textTransform:"uppercase",color:"#8B4A10",display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{width:12,height:1,background:exp.kleur,opacity:.5,display:"inline-block"}}/>
                {t.huidigePositie}
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,
                color:"#1E0E04",lineHeight:1.1,marginBottom:8,letterSpacing:"-.01em"}}>{currentWP.label}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,
                color:"rgba(50,28,8,.80)",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:exp.kleur,
                  display:"inline-block",boxShadow:`0 0 8px ${exp.kleur}`}}/>
                {currentWP.date}
              </div>
              <div style={{fontSize:14,color:"rgba(50,28,8,.78)",lineHeight:1.80,
                borderLeft:`2px solid ${exp.kleur}60`,paddingLeft:14}}>{currentDesc}</div>
              {currentJournal&&(
                <div style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",
                  fontSize:13,color:"rgba(80,40,8,.75)",lineHeight:1.80,marginTop:12,paddingTop:14,
                  borderTop:"1px solid rgba(139,74,16,.18)"}}>{currentJournal}</div>
              )}
            </div>
          )}
        </div>

        {/* ══ ROUTE PANEEL ══ */}
        <aside style={{width:260,background:"rgba(235,218,178,.99)",borderLeft:"1px solid rgba(139,94,32,.25)",
          display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
          <div style={{padding:"18px 16px 14px",borderBottom:"1px solid rgba(139,74,16,.25)",
            flexShrink:0,background:"transparent"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
              color:"rgba(50,28,8,.80)",letterSpacing:".15em",textTransform:"uppercase",marginBottom:8}}>
              {t.expeditie}
            </div>
            <div style={{height:2,background:"rgba(80,50,15,.25)",borderRadius:1,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",width:`${sliderT*100}%`,
                background:`linear-gradient(to right,${exp.kleur}50,${exp.kleur})`,
                borderRadius:1,transition:"width .12s",boxShadow:`0 0 8px ${exp.kleur}`}}/>
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,color:"#2A1408",letterSpacing:".04em"}}>
              {reachedWPs.length}<span style={{color:"rgba(50,28,8,.40)"}}> / {exp.waypoints.length}</span>
              <span style={{color:"rgba(50,28,8,.55)",marginLeft:8,fontSize:9}}>{t.stopsBereikt}</span>
            </div>
          </div>

          <div style={{flex:1,overflow:"auto",padding:"6px 8px"}}>
            <div style={{padding:"12px 6px 10px",borderBottom:"1px solid rgba(200,168,90,.06)",marginBottom:6}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"rgba(40,20,5,.80)",
                letterSpacing:".18em",textTransform:"uppercase",marginBottom:10,paddingLeft:2}}>{t.bemanning}</div>
              {PERSONEN.filter(p=>activeId==="belgica"?["degerlache","amundsen","cook"].includes(p.id):activeId==="boudewijn"?p.id==="gaston":p.id==="hubert").map(p=>(
                <button key={p.id} onClick={()=>setDetail({type:"persoon",id:p.id})}
                  style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 10px",
                    borderRadius:12,border:"1px solid rgba(139,94,32,.22)",background:"transparent",
                    cursor:"pointer",transition:"all .18s",marginBottom:8,outline:"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,168,90,.06)";e.currentTarget.style.borderColor="rgba(200,168,90,.16)"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(200,168,90,.06)"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",flexShrink:0,overflow:"hidden",
                    background:`${exp.kleur}10`,border:"1.5px solid rgba(139,94,32,.35)"}}>
                    <img src={p.fotoUrl} alt={p.naam} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0,textAlign:"left"}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,color:"#1E0E04",
                      fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.naam}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"rgba(80,50,15,.60)",
                      marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.rol}</div>
                  </div>
                  <span style={{color:"rgba(50,28,8,.40)",fontSize:13,flexShrink:0}}>›</span>
                </button>
              ))}
            </div>

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 8px 8px"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,
                color:"rgba(50,28,8,.72)",letterSpacing:".18em",textTransform:"uppercase"}}>{t.route}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,
                color:"rgba(50,28,8,.60)",letterSpacing:".08em",display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:14}}>👆</span> {t.tipStop}
              </div>
            </div>
            {keyStops.map((wp,i)=>{
              const reached=wp.t<=sliderT;
              const isCurr=Math.abs(wp.t-currentWP.t)<0.001;
              const desc=stopDesc(wp.label,activeId);
              return(
                <button key={i} className="krow" onClick={()=>setSliderT(wp.t)}
                  aria-pressed={isCurr}
                  style={{opacity:reached?1:0,pointerEvents:reached?"auto":"none",
                    transition:"opacity .5s ease",alignItems:"flex-start",padding:"6px 10px"}}>
                  {/* Tijdlijn kolom */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:8,flexShrink:0,width:24}}>
                    {/* Dot */}
                    <div style={{
                      width:isCurr?18:10,height:isCurr?18:10,borderRadius:"50%",flexShrink:0,
                      background:isCurr?exp.kleur:"rgba(139,74,16,.50)",
                      border:isCurr?`3px solid rgba(255,255,255,.5)`:`2px solid rgba(139,74,16,.30)`,
                      boxShadow:isCurr?`0 0 0 5px ${exp.kleurDim},0 0 20px ${exp.kleur}80`:"none",
                      transition:"all .30s",
                    }}/>
                    {/* Lijn naar volgende */}
                    {i<keyStops.length-1&&(
                      <div style={{width:2,flexGrow:1,minHeight:isCurr?40:24,marginTop:5,borderRadius:1,
                        background:reached
                          ?`linear-gradient(to bottom,${exp.kleur}80,rgba(139,74,16,.20))`
                          :"rgba(139,74,16,.18)",
                        transition:"background .4s"}}/>
                    )}
                  </div>
                  {/* Content */}
                  <div style={{flex:1,paddingBottom:isCurr?4:2,paddingLeft:4}}>
                    {/* Stop naam */}
                    <div style={{
                      fontFamily:"'Playfair Display',serif",
                      fontSize:isCurr?16:13,
                      fontWeight:isCurr?900:600,
                      color:isCurr?exp.kleur:"#2A1408",
                      lineHeight:1.2,transition:"all .25s",
                      marginBottom:3,
                    }}>{wp.label}</div>
                    {/* Datum */}
                    <div style={{
                      fontFamily:"'JetBrains Mono',monospace",
                      fontSize:11,
                      color:"rgba(50,28,8,.60)",
                      letterSpacing:".06em",
                      marginBottom:isCurr?10:0,
                    }}>{wp.date}</div>
                    {/* Beschrijving — alleen bij actief */}
                    {isCurr&&(
                      <div style={{
                        background:"rgba(200,155,60,.12)",
                        border:`1px solid ${exp.kleur}40`,
                        borderLeft:`3px solid ${exp.kleur}`,
                        borderRadius:"0 10px 10px 0",
                        padding:"10px 12px",
                        fontSize:12,
                        color:"rgba(40,20,5,.80)",
                        lineHeight:1.70,
                        fontStyle:"italic",
                      }}>
                        {desc?.desc??wp.desc}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* ══ ONDERSTE BALK ══ */}
      <div style={{background:"#E8D4A0",borderTop:"1px solid rgba(150,110,30,.30)",flexShrink:0}}>
        <div style={{padding:"8px 28px 0",display:"flex",gap:10,justifyContent:"center",alignItems:"center",position:"relative"}}>
          <div className="gld" style={{position:"absolute",top:0,left:40,right:40,height:1,
            background:"linear-gradient(90deg,transparent,rgba(200,148,58,.14),transparent)"}}/>
          {/* Taal selector */}
          <div style={{position:"absolute",left:28,display:"flex",gap:4,alignItems:"center"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"rgba(80,50,15,.60)",
              letterSpacing:".15em",textTransform:"uppercase",marginRight:6}}>{t.taalKiezen}</div>
            {(["nl","en","fr"] as Lang[]).map(l=>(
              <button key={l} onClick={()=>setLang(l)}
                style={{padding:"7px 14px",borderRadius:8,minHeight:"40px",
                  border:`1px solid ${lang===l?"rgba(200,168,90,.4)":"rgba(200,168,90,.1)"}`,
                  background:lang===l?"rgba(200,168,90,.12)":"transparent",
                  cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:15,
                  fontWeight:lang===l?700:500,
                  color:lang===l?"#8B4A10":"rgba(50,28,8,.75)",
                  letterSpacing:".08em",textTransform:"uppercase",transition:"all .18s",outline:"none"}}>
                {l}
              </button>
            ))}
          </div>
          {EXPEDITIES.map(e=>(
            <button key={e.id} className={`eb${activeId===e.id?" on":""}`}
              role="tab" aria-selected={activeId===e.id} onClick={()=>setActiveId(e.id)}
              style={{borderColor:activeId===e.id?`${e.kleur}45`:"rgba(200,168,90,.08)",
                boxShadow:activeId===e.id?`0 0 32px ${e.kleurGlow},0 -2px 0 ${e.kleur} inset`:"none"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:e.kleur,flexShrink:0,
                boxShadow:activeId===e.id?`0 0 12px ${e.kleur},0 0 0 4px ${e.kleurDim}`:"none",transition:"box-shadow .3s"}}/>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,
                  color:activeId===e.id?"#8B4A10":"rgba(50,28,8,.78)",lineHeight:1.2,letterSpacing:"-.01em"}}>{e.titel}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,
                  color:"rgba(50,28,8,.72)",marginTop:2,letterSpacing:".05em"}}>{e.periode}</div>
              </div>
              {activeId===e.id&&(
                <div style={{width:4,height:4,borderRadius:"50%",background:e.kleur,
                  boxShadow:`0 0 8px ${e.kleur}`,flexShrink:0}}/>
              )}
            </button>
          ))}
        </div>

        <div style={{padding:"14px 28px 22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,letterSpacing:".18em",
              textTransform:"uppercase",color:"rgba(50,28,8,.80)"}}>{t.tijdlijn}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,padding:"8px 18px",borderRadius:20,
              border:`1px solid ${exp.kleur}40`,background:"rgba(200,155,60,.20)",color:"#6B3A08",letterSpacing:".05em"}}>
              {sliderT===0?t.beginnen:sliderT>=1?t.voltooid:currentWP.date+" · "+currentWP.label}
            </div>
          </div>


          <div style={{position:"relative",marginBottom:12}}>
            <div style={{position:"absolute",top:"50%",left:0,right:0,height:3,borderRadius:2,
              background:"rgba(80,50,15,.20)",transform:"translateY(-50%)"}}/>
            <div style={{position:"absolute",top:"50%",left:0,width:`${pct}%`,height:3,borderRadius:2,
              background:`linear-gradient(to right,${exp.kleur}40,${exp.kleur})`,
              transform:"translateY(-50%)",transition:"width .05s",pointerEvents:"none",
              boxShadow:`0 0 12px ${exp.kleurGlow}`}}/>
            <input type="range" className="rng" min={0} max={100} value={pct}
              onChange={e=>{setSliderT(Number(e.target.value)/100);setIsPlaying(false);}}
              style={{"--tc":exp.kleur,"--tg":exp.kleurDim} as React.CSSProperties}
              aria-label="Schuif om de route te volgen"/>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>{setSliderT(0);setIsPlaying(false);}}
              style={{display:"flex",alignItems:"center",gap:6,padding:"14px 24px",borderRadius:14,minHeight:"54px",
                border:"1px solid rgba(200,168,90,.2)",background:"transparent",cursor:"pointer",outline:"none",
                fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:"rgba(80,50,15,.60)",
                letterSpacing:".08em",transition:"all .18s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,168,90,.08)";e.currentTarget.style.color="#C8A85A";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(200,168,90,.4)";}}>
              ⏮ <span>{t.herstart}</span>
            </button>
            <button className="pb" onClick={()=>{if(sliderT>=1)setSliderT(0);setIsPlaying(p=>!p);}}
              style={{background:isPlaying?"rgba(139,94,32,.12)":`linear-gradient(135deg,${exp.kleur}18,${exp.kleur}38)`,
                color:exp.kleur,boxShadow:isPlaying?"none":`0 0 28px ${exp.kleurGlow},inset 0 1px 0 rgba(255,255,255,.06)`}}>
              {isPlaying?"⏸":sliderT>=1?"↺":"▶"}
            </button>
            <div style={{flex:1,display:"flex",justifyContent:"space-between",paddingLeft:8}}>
              {keyStops.map((wp,i)=>{
                const jaarMatch=wp.date.match(/\d{4}/);
                const jaar=jaarMatch?jaarMatch[0]:"";
                const prevJaar=i>0?(keyStops[i-1].date.match(/\d{4}/)||[""])[0]:"";
                const toonJaar=jaar&&jaar!==prevJaar;
                return(
                  <button key={i} className="yr" onClick={()=>setSliderT(wp.t)}
                    style={{fontSize:12,fontWeight:wp.t<=sliderT?600:400,
                      color:wp.t<=sliderT?exp.kleur:"rgba(50,28,8,.65)",
                      opacity:wp.t<=sliderT?1:0.4,minWidth:toonJaar?36:16}}>
                    {toonJaar?jaar:""}
                  </button>
                );
              })}
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:600,
              color:"#6B3A08",width:60,textAlign:"right",letterSpacing:"-.02em"}}>
              {pct}<span style={{fontSize:11,opacity:.5}}>%</span>
            </div>
          </div>

        </div>
      </div>


      {/* ══ DETAIL SCHERMEN ══ */}
      <DetailManager detail={detail} onClose={()=>{if(detail?.type==="archief"){setArchiefOpen(true);}setDetail(null);}} onArchief={openArchief} t={t} lang={lang}/>

      {/* ══ ARCHIEF BROWSER ══ */}
      {archiefOpen&&(
        <ArchiefBrowser expeditieId={activeId} kleur={exp.kleur} t={t} lang={lang}
          onOpen={id=>{setArchiefOpen(false);setDetail({type:"archief",id});}}
          onClose={()=>setArchiefOpen(false)}/>
      )}

      {/* ══ ANTARCTICA KAART ══ */}
      {antarcticaOpen&&(
        <AntarcticaKaart onClose={()=>setAntarcticaOpen(false)} t={t} lang={lang}/>
      )}

      </div>
    </>
  );
}