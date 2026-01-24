// Blog Posts Data for TheBackROM
// Example posts showing how the category/tags system works

const BLOG_POSTS = [
    // === NAKKE BLOGG-ARTIKLER ===
    {
        id: 'c5-c6-prolaps',
        title: 'C5-C6 Nakkeprolaps – Symptomer, diagnose og behandling',
        excerpt: 'C5-C6 er det vanligste nivået for nakkeprolaps. Gir typisk smerter i skulder, overarm og tommel/pekefinger.',
        image: '/images/plager%20nakkesmerter/nakkesmerte.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'nervesmerter', 'prolaps'],
        clinicalTags: ['c5-c6-herniation', 'cervical-radiculopathy', 'disc-prolapse'],
        relatedConditions: ['nakkeprolaps', 'nummenhet', 'skuldersmerte'],
        readTime: '10 min',
        link: 'c5-c6-prolaps.html'
    },
    {
        id: 'c6-c7-prolaps',
        title: 'C6-C7 Nakkeprolaps – Symptomer, diagnose og behandling',
        excerpt: 'C6-C7 prolaps gir typisk utstråling til langfinger og baksiden av armen. 85-90% blir bedre uten operasjon.',
        image: '/images/plager%20nakkesmerter/Nakkesmerte%202.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'nervesmerter', 'prolaps'],
        clinicalTags: ['c6-c7-herniation', 'cervical-radiculopathy', 'triceps-weakness'],
        relatedConditions: ['nakkeprolaps', 'nummenhet', 'armsmerte'],
        readTime: '10 min',
        link: 'c6-c7-prolaps.html'
    },
    {
        id: 'rode-flagg-nakkesmerter',
        title: 'Røde flagg ved nakkesmerter – Når er det alvorlig?',
        excerpt: 'De fleste nakkesmerter er ufarlige, men noen symptomer krever umiddelbar legevurdering. Kjenn tegnene.',
        image: '/images/plager%20nakkesmerter/nakkesmerte-optimized.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'tips'],
        clinicalTags: ['arterial-dissection', 'cervical-myelopathy', 'red-flags'],
        relatedConditions: ['nakkeprolaps', 'akutt-nakkesmerte'],
        readTime: '8 min',
        link: '../plager/nakke/rode-flagg-nakkesmerter.html'
    },
    {
        id: 'stressnakke-triggerpunkter',
        title: 'Stressnakke og triggerpunkter – Når stress setter seg i nakken',
        excerpt: 'Trapeziusmyalgi og stressrelaterte nakkesmerter er svært vanlig. Lær om mekanismene og effektiv behandling.',
        image: '/images/plager%20nakkesmerter/nakkesmerte-2-optimized.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'stress', 'triggerpunkter'],
        clinicalTags: ['trapezius-myalgia', 'myofascial-pain', 'stress-related-pain'],
        relatedConditions: ['triggerpunkter', 'hodepine', 'skuldersmerte'],
        readTime: '10 min',
        link: 'stressnakke-triggerpunkter.html'
    },
    {
        id: 'smerter-mellom-skulderbladene-facettledd',
        title: 'Smerter mellom skulderbladene – Ofte fra nakken',
        excerpt: 'Smerte mellom skulderbladene skyldes ofte referert smerte fra nakkens facettledd. Forskning forklarer hvorfor.',
        image: '/images/plager%20nakkesmerter/nakkesmerte.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'ryggsmerter'],
        clinicalTags: ['interscapular-pain', 'facet-referral', 'cervical-facet'],
        relatedConditions: ['nakkesmerter', 'facettleddssyndrom'],
        readTime: '8 min',
        link: 'smerter-mellom-skulderbladene-facettledd.html'
    },
    {
        id: 'foraminal-stenose',
        title: 'Cervikal foraminal stenose – Når nervekanalen blir trang',
        excerpt: 'Foraminal stenose gir nerveirritasjon uten prolaps. Vanligst hos de over 50 år. Konservativ behandling hjelper ofte.',
        image: '/images/plager%20nakkesmerter/Nakkesmerte%202.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'nervesmerter'],
        clinicalTags: ['foraminal-stenosis', 'cervical-spondylosis', 'radiculopathy'],
        relatedConditions: ['nakkeprolaps', 'slitasje', 'nummenhet'],
        readTime: '9 min',
        link: 'foraminal-stenose.html'
    },
    {
        id: 'thoracic-outlet-syndrom',
        title: 'Thoracic Outlet Syndrom (TOS) – Nerveklem i skulderåpningen',
        excerpt: 'TOS gir nummenhet, prikking og svakhet i arm/hånd. Ofte forvekslet med nakkeprolaps. Lær forskjellene.',
        image: '/images/plager%20nakkesmerter/nakkesmerte-optimized.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'skulder', 'nervesmerter'],
        clinicalTags: ['thoracic-outlet-syndrome', 'brachial-plexus', 'nerve-compression'],
        relatedConditions: ['nummenhet', 'armsmerte', 'skuldersmerte'],
        readTime: '10 min',
        link: 'thoracic-outlet-syndrom.html'
    },
    {
        id: 'triggerpunkter-nakken',
        title: 'Triggerpunkter i nakken – Myofascielt smertesyndrom',
        excerpt: 'Triggerpunkter er hyperirritable punkter som gir referert smerte. Vanligste årsak til kronisk nakkesmerte.',
        image: '/images/plager%20nakkesmerter/nakkesmerte-2-optimized.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'triggerpunkter'],
        clinicalTags: ['trigger-points', 'myofascial-pain-syndrome', 'referred-pain'],
        relatedConditions: ['hodepine', 'skuldersmerte', 'nakkestivhet'],
        readTime: '10 min',
        link: 'triggerpunkter-nakken.html'
    },
    {
        id: 'occipital-neuralgi',
        title: 'Occipital neuralgi – Nervesmerter i bakhodet',
        excerpt: 'Skarpe, stikkende smerter i bakhodet og opp mot issen? Det kan være occipital neuralgi. Les om diagnose og behandling.',
        image: '/images/plager%20hodepine-og-migrene/hodepine%205.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'hodepine', 'nervesmerter'],
        clinicalTags: ['occipital-neuralgia', 'greater-occipital-nerve', 'nerve-entrapment'],
        relatedConditions: ['hodepine', 'nakkesmerter', 'cervikogen-hodepine'],
        readTime: '9 min',
        link: 'occipital-neuralgi.html'
    },
    {
        id: 'nakkesmerter-gravid',
        title: 'Nakkesmerter i svangerskapet – Trygg behandling',
        excerpt: 'Hormoner, holdningsendringer og stress gir ofte nakkesmerter hos gravide. Kiropraktikk er trygt og effektivt.',
        image: '/images/plager%20nakkesmerter/nakkesmerte.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'graviditet'],
        clinicalTags: ['pregnancy-neck-pain', 'postural-changes', 'relaxin'],
        relatedConditions: ['hodepine', 'ryggsmerter', 'bekkenplager'],
        readTime: '8 min',
        link: 'nakkesmerter-gravid.html'
    },
    {
        id: 'tekstnakke-mobilnakke',
        title: 'Tekstnakke og mobilnakke – Moderne epidemi',
        excerpt: 'Hver centimeter hodet faller frem øker belastningen på nakken med 4-5 kg. Slik unngår du tekstnakke.',
        image: '/images/plager%20nakkesmerter/Nakkesmerte%202.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'forebygging', 'ergonomi'],
        clinicalTags: ['text-neck', 'forward-head-posture', 'cervical-strain'],
        relatedConditions: ['hodepine', 'skuldersmerte', 'stivhet'],
        readTime: '7 min',
        link: 'tekstnakke-mobilnakke.html'
    },
    {
        id: 'stiv-nakke-om-morgenen',
        title: 'Stiv nakke om morgenen – Årsaker og løsninger',
        excerpt: 'Våkner du med stiv nakke? Det kan skyldes soveputen, søvnstilling eller underliggende stivhet. Her er løsningene.',
        image: '/images/plager%20nakkesmerter/nakkesmerte-optimized.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'tips', 'forebygging'],
        clinicalTags: ['morning-stiffness', 'cervical-facet', 'sleeping-position'],
        relatedConditions: ['nakkestivhet', 'facettleddssyndrom'],
        readTime: '7 min',
        link: 'stiv-nakke-om-morgenen.html'
    },
    {
        id: 'knaser-i-nakken',
        title: 'Er det farlig at det knaser i nakken?',
        excerpt: 'Nakkelyder er nesten alltid ufarlige. Det skarpe kneppet skyldes kavitasjon – en normal fysiologisk prosess.',
        image: '/images/plager%20nakkesmerter/nakkesmerte-2-optimized.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'faq'],
        clinicalTags: ['cavitation', 'crepitus', 'joint-sounds'],
        relatedConditions: ['nakkestivhet', 'facettleddssyndrom'],
        readTime: '8 min',
        link: 'knaser-i-nakken.html'
    },
    {
        id: 'nummenhet-fingre-nakke-hand',
        title: 'Nummenhet i fingrene – Fra nakke eller hånd?',
        excerpt: 'Nummenhet i fingrene kan skyldes nakkeproblemer eller karpaltunnel. Fingerfordeling avslører ofte kilden.',
        image: '/images/plager%20nakkesmerter/nakkesmerte.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'nervesmerter', 'skulder'],
        clinicalTags: ['finger-numbness', 'cervical-radiculopathy', 'carpal-tunnel'],
        relatedConditions: ['nakkeprolaps', 'karpaltunnel', 'tos'],
        readTime: '9 min',
        link: 'nummenhet-fingre-nakke-hand.html'
    },
    {
        id: 'nakkesleng-hodepine',
        title: 'Hodepine etter nakkesleng – Posttraumatisk hodepine',
        excerpt: 'Hodepine er det vanligste symptomet etter nakkesleng. Kan vedvare lenge, men prognosen er god med riktig behandling.',
        image: '/images/plager%20hodepine-og-migrene/hodepine.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'hodepine', 'whiplash'],
        clinicalTags: ['post-traumatic-headache', 'whiplash-headache', 'cervicogenic'],
        relatedConditions: ['whiplash', 'cervikogen-hodepine', 'nakkesleng'],
        readTime: '10 min',
        link: 'nakkesleng-hodepine.html'
    },
    {
        id: 'slitasje-mr-nakke',
        title: 'Slitasje på MR av nakken – Hva betyr det egentlig?',
        excerpt: 'Slitasjeforandringer på MR er normale og ofte uten betydning. 87% av friske 20-åringer har funn på MR.',
        image: '/images/plager%20nakkesmerter/Nakkesmerte%202.webp',
        date: '28. desember 2025',
        author: 'Mads',
        categories: ['nakkesmerter', 'forskning', 'faq'],
        clinicalTags: ['cervical-degeneration', 'mri-findings', 'disc-degeneration'],
        relatedConditions: ['nakkeprolaps', 'foraminal-stenose', 'slitasje'],
        readTime: '9 min',
        link: 'slitasje-mr-nakke.html'
    },
    // === KORSRYGG BLOGG-ARTIKLER ===
    {
        id: 'isjias-prolaps-hekseskudd-forskjell',
        title: 'Isjias, prolaps eller hekseskudd? Slik kjenner du forskjellen',
        excerpt: 'Forvirret mellom isjias, prolaps og hekseskudd? Lær de viktigste forskjellene og når du bør søke hjelp.',
        image: '/images/plager%20ryggsmerter/korsrygg%20smerte%20(1).webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'isjias', 'korsrygg'],
        clinicalTags: ['lumbar-disc-herniation', 'sciatica', 'lumbago', 'acute-low-back-pain'],
        relatedConditions: ['korsryggsmerte', 'ischias', 'prolaps'],
        readTime: '10 min',
        link: 'isjias-prolaps-hekseskudd-forskjell.html'
    },
    {
        id: 'mr-bildediagnostikk-ryggsmerte',
        title: 'Trenger du MR for ryggsmerte? Når bildediagnostikk er nødvendig',
        excerpt: 'MR-funn som skivebuking og slitasje er vanlige hos friske mennesker. Lær når bildediagnostikk faktisk er nødvendig.',
        image: '/images/plager%20ryggsmerter/korsrygg%20smerte%20(2).webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'forskning', 'korsrygg'],
        clinicalTags: ['mri-findings', 'disc-degeneration', 'imaging', 'red-flags'],
        relatedConditions: ['korsryggsmerte', 'prolaps'],
        readTime: '12 min',
        link: 'mr-bildediagnostikk-ryggsmerte.html'
    },
    {
        id: 'rode-flagg-ryggsmerter',
        title: 'Røde flagg ved ryggsmerter - Når du bør søke akutt hjelp',
        excerpt: 'De aller fleste ryggsmerter er ufarlige, men noen symptomer krever rask medisinsk vurdering. Lær om røde flagg.',
        image: '/images/plager%20ryggsmerter/korsrygg%20smerte%20(3).webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'korsrygg', 'tips'],
        clinicalTags: ['cauda-equina', 'red-flags', 'emergency-symptoms'],
        relatedConditions: ['korsryggsmerte', 'prolaps', 'isjias'],
        readTime: '8 min',
        link: '../plager/korsrygg/rode-flagg-ryggsmerter.html'
    },
    {
        id: 'piriformissyndrom-falsk-isjias',
        title: 'Piriformissyndrom: Når det føles som isjias men ikke er det',
        excerpt: 'Piriformissyndrom gir isjias-liknende smerter fra setet. Utgjør 6-17% av isjias-tilfeller. 79-85% blir bedre med behandling.',
        image: '/images/plager%20ryggsmerter/korsrygg.webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'hoftesmerter', 'korsrygg'],
        clinicalTags: ['piriformis-syndrome', 'deep-gluteal-syndrome', 'pseudo-sciatica'],
        relatedConditions: ['isjias', 'hoftesmerte', 'setesmerte'],
        readTime: '10 min',
        link: 'piriformissyndrom-falsk-isjias.html'
    },
    {
        id: 'l4-l5-prolaps',
        title: 'L4-L5 Skiveprolaps - Symptomer, diagnose og behandling',
        excerpt: 'L4-L5 prolaps er den vanligste typen skiveprolaps (45-50%). 60-90% blir bedre uten operasjon.',
        image: '/images/plager%20ryggsmerter/Ryggsmerte.webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'isjias', 'korsrygg'],
        clinicalTags: ['l4-l5-herniation', 'disc-prolapse', 'radiculopathy'],
        relatedConditions: ['prolaps', 'isjias', 'fotdropp'],
        readTime: '9 min',
        link: 'l4-l5-prolaps.html'
    },
    {
        id: 'l5-s1-prolaps',
        title: 'L5-S1 Skiveprolaps - Symptomer, diagnose og behandling',
        excerpt: 'L5-S1 prolaps gir ofte isjias ned baksiden av benet. 60-90% blir bra uten operasjon.',
        image: '/images/plager%20ryggsmerter/korsrygg%20smerte%20(1).webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'isjias', 'korsrygg'],
        clinicalTags: ['l5-s1-herniation', 'disc-prolapse', 's1-radiculopathy'],
        relatedConditions: ['prolaps', 'isjias'],
        readTime: '10 min',
        link: 'l5-s1-prolaps.html'
    },
    {
        id: 'diskogen-smerte',
        title: 'Diskogen smerte - Når skiven gjør vondt uten prolaps',
        excerpt: 'Diskogen smerte utgjør 26-42% av kroniske korsryggsmerter. Dyp, sentral smerte som forverres ved sitting.',
        image: '/images/plager%20ryggsmerter/korsrygg%20smerte%20(2).webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'korsrygg', 'forskning'],
        clinicalTags: ['discogenic-pain', 'internal-disc-disruption', 'annular-tear'],
        relatedConditions: ['korsryggsmerte', 'prolaps'],
        readTime: '10 min',
        link: 'diskogen-smerte.html'
    },
    {
        id: 'facettleddssyndrom',
        title: 'Facettleddssyndrom: Når de små leddene i ryggen gjør vondt',
        excerpt: 'Facettleddssyndrom utgjør 15-45% av kroniske korsryggsmerter. Typisk stivhet om morgenen og smerter ved bakover-bevegelse.',
        image: '/images/plager%20ryggsmerter/korsrygg%20smerte%20(3).webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'korsrygg'],
        clinicalTags: ['facet-syndrome', 'facet-arthropathy', 'zygapophyseal-pain'],
        relatedConditions: ['korsryggsmerte', 'stivhet'],
        readTime: '9 min',
        link: 'facettleddssyndrom.html'
    },
    {
        id: 'muskelsmerte-vs-nervesmerte',
        title: 'Muskelsmerte vs nervesmerte: Slik kjenner du forskjellen',
        excerpt: 'Å skille mellom muskelsmerte og nervesmerte er viktig fordi de krever ulik tilnærming. Lær de viktigste forskjellene.',
        image: '/images/plager%20ryggsmerter/korsryggplager.webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'korsrygg', 'tips'],
        clinicalTags: ['muscle-pain', 'nerve-pain', 'radiculopathy', 'myalgia'],
        relatedConditions: ['isjias', 'triggerpunkter'],
        readTime: '10 min',
        link: 'muskelsmerte-vs-nervesmerte.html'
    },
    {
        id: 'akutt-ryggsmerte-selvhjelp',
        title: 'Akutt ryggsmerte: Hva du bør gjøre de første timene og dagene',
        excerpt: 'Plutselig ryggsmerte kan være skremmende. Her er praktiske råd for selvhjelp og når du bør søke behandling.',
        image: '/images/plager%20ryggsmerter/Ryggsmerte.webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'korsrygg', 'tips', 'hjemmetrening'],
        clinicalTags: ['acute-low-back-pain', 'lumbago', 'self-management'],
        relatedConditions: ['hekseskudd', 'lumbago'],
        readTime: '8 min',
        link: 'akutt-ryggsmerte-selvhjelp.html'
    },
    {
        id: 'ovelser-isjias',
        title: 'Øvelser for isjias: Trygg bevegelse mot bedring',
        excerpt: 'Riktige øvelser kan hjelpe nerven å hele og redusere isjias-smerter. Her er en trinnvis guide til trygge øvelser.',
        image: '/images/plager%20ryggsmerter/korsrygg%20smerte%20(1).webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'isjias', 'hjemmetrening', 'rehabilitering'],
        clinicalTags: ['sciatica-exercises', 'mckenzie-method', 'nerve-mobilization'],
        relatedConditions: ['isjias', 'prolaps'],
        readTime: '10 min',
        link: 'ovelser-isjias.html'
    },
    {
        id: 'styrkeovelser-korsrygg',
        title: 'Styrkeøvelser for korsryggen: Bygg en sterkere rygg',
        excerpt: 'Forskning viser at styrketrening er en av de mest effektive måtene å forebygge og behandle korsryggsmerte.',
        image: '/images/plager%20ryggsmerter/korsrygg.webp',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['ryggsmerter', 'korsrygg', 'hjemmetrening', 'forebygging'],
        clinicalTags: ['core-exercises', 'lumbar-stabilization', 'strength-training'],
        relatedConditions: ['korsryggsmerte', 'forebygging'],
        readTime: '12 min',
        link: 'styrkeovelser-korsrygg.html'
    },
    {
        id: 'kiropraktor-vs-fysioterapeut',
        title: 'Kiropraktor vs fysioterapeut: Hva er forskjellen?',
        excerpt: 'Mange lurer på om de skal gå til kiropraktor eller fysioterapeut. Her er en objektiv sammenligning.',
        image: '/images/Tjenester%20Kiroprakikk/behandling%20(1).jpg',
        date: '20. januar 2025',
        author: 'Mads',
        categories: ['kiropraktikk', 'tips'],
        clinicalTags: ['chiropractic', 'physiotherapy', 'manual-therapy'],
        relatedConditions: ['alle'],
        readTime: '8 min',
        link: 'kiropraktor-vs-fysioterapeut.html'
    },
    // === SVIMMELHET BLOGG-ARTIKLER ===
    {
        id: 'svimmelhet-ikke-bppv',
        title: 'Når svimmelheten ikke passer inn: Er det BPPV eller noe annet?',
        excerpt: 'BPPV står kun for 17-39% av all svimmelhet. Lær om alternative årsaker som vestibulær migrene, PPPD og nakkesvimmelhet.',
        image: '/images/plager%20svimmelhet/svimmelhet-behandling.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'svimmelhetbehandling'],
        clinicalTags: ['bppv', 'vestibular-migraine', 'pppd', 'cervicogenic-dizziness'],
        relatedConditions: ['krystallsyke', 'nakkesvimmelhet', 'migrene'],
        readTime: '10 min',
        link: 'svimmelhet-ikke-bppv.html'
    },
    {
        id: 'svimmel-i-senga',
        title: 'Svimmel når du legger deg? Dette bør du vite om krystallsyke',
        excerpt: 'Blir du svimmel når du legger deg eller snur deg i senga? Det kan være krystallsyke (BPPV). Lær om årsaker og behandling.',
        image: '/images/plager%20svimmelhet/bppv.gif',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'svimmelhetbehandling', 'tips'],
        clinicalTags: ['bppv', 'positional-vertigo', 'epley-maneuver'],
        relatedConditions: ['krystallsyke', 'vertigo'],
        readTime: '8 min',
        link: 'svimmel-i-senga.html'
    },
    {
        id: 'svimmelhet-myter',
        title: 'Svimmelhet: Myter avkreftet og reell hjelp tilgjengelig',
        excerpt: 'De vanligste mytene om svimmelhet avkreftet. Lær hva som faktisk hjelper og når du bør søke behandling.',
        image: '/images/plager%20svimmelhet/svimmelhet-behandling.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'tips', 'faq'],
        clinicalTags: ['vestibular-disorders', 'bppv-myths', 'vertigo-treatment'],
        relatedConditions: ['krystallsyke', 'vestibulær-migrene'],
        readTime: '7 min',
        link: 'svimmelhet-myter.html'
    },
    {
        id: 'svimmel-og-kvalm',
        title: 'Svimmel og kvalm - årsaker, behandling og når du bør søke hjelp',
        excerpt: 'Svimmelhet kombinert med kvalme kan ha mange årsaker. Lær om BPPV, vestibulær migrene og når du bør oppsøke hjelp.',
        image: '/images/plager%20svimmelhet/svimmelhet-behandling.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'svimmelhetbehandling'],
        clinicalTags: ['vertigo-nausea', 'bppv', 'vestibular-migraine'],
        relatedConditions: ['krystallsyke', 'migrene', 'kvalme'],
        readTime: '9 min',
        link: 'svimmel-og-kvalm.html'
    },
    {
        id: 'svimmelhet-stress-angst',
        title: 'Svimmel av stress og angst',
        excerpt: 'Svimmelhet utløst av stress og angst er reelt, ikke innbilt. Lær om den biologiske koblingen og behandlingsmuligheter.',
        image: '/images/plager%20svimmelhet/svimmelhet-behandling.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'stress', 'livsstil'],
        clinicalTags: ['pppd', 'anxiety-dizziness', 'hyperventilation'],
        relatedConditions: ['pppd', 'angst', 'stress'],
        readTime: '10 min',
        link: 'svimmelhet-stress-angst.html'
    },
    {
        id: 'subtil-krystallsyke',
        title: 'Subtil krystallsyke: Når svimmelheten ikke spinner',
        excerpt: 'Krystallsyke uten klassisk spinnesvimmelhet - en underdiagnostisert variant som gir kvalme, utmattelse og hjernetåke.',
        image: '/images/plager%20svimmelhet/bppv.gif',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'svimmelhetbehandling'],
        clinicalTags: ['subtle-bppv', 'atypical-vertigo', 'brain-fog'],
        relatedConditions: ['krystallsyke', 'utmattelse'],
        readTime: '8 min',
        link: 'subtil-krystallsyke.html'
    },
    {
        id: 'svimmel-naar-du-staar-opp',
        title: 'Svimmel når du står opp - årsaker og hva du bør vite',
        excerpt: 'Svimmelhet når du reiser deg kan skyldes blodtrykksfall eller krystallsyke. Lær å skille mellom dem og når du bør søke hjelp.',
        image: '/images/plager%20svimmelhet/svimmelhet-behandling.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'tips'],
        clinicalTags: ['orthostatic-hypotension', 'bppv', 'pots'],
        relatedConditions: ['blodtrykk', 'krystallsyke'],
        readTime: '7 min',
        link: 'svimmel-naar-du-staar-opp.html'
    },
    {
        id: 'leve-med-svimmelhet',
        title: 'Du trenger ikke leve med svimmelhet lenger',
        excerpt: 'Svimmelhet rammer 15-20% årlig, men over 90% kan behandles effektivt. Lær om årsaker og behandlingsmuligheter.',
        image: '/images/plager%20svimmelhet/svimmelhet-behandling.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'svimmelhetbehandling', 'tips'],
        clinicalTags: ['vestibular-rehabilitation', 'bppv-treatment', 'vertigo-prognosis'],
        relatedConditions: ['krystallsyke', 'nakkesvimmelhet'],
        readTime: '8 min',
        link: 'leve-med-svimmelhet.html'
    },
    {
        id: 'eldre-svimmelhet-fallrisiko',
        title: 'Svimmelhet hos Eldre og Fallrisiko',
        excerpt: 'Svimmelhet hos eldre øker fallrisikoen betydelig. Lær om årsaker, behandling og forebygging.',
        image: '/images/plager%20svimmelhet/svimmelhet-behandling.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'forebygging'],
        clinicalTags: ['elderly-vertigo', 'fall-prevention', 'bppv-elderly'],
        relatedConditions: ['krystallsyke', 'balanse'],
        readTime: '9 min',
        link: 'eldre-svimmelhet-fallrisiko.html'
    },
    {
        id: 'sentral-svimmelhet',
        title: 'Sentral svimmelhet - Når hjernen er årsaken',
        excerpt: 'Sentral svimmelhet skyldes problemer i hjernen, ikke øret. Lær om symptomer, årsaker og røde flagg.',
        image: '/images/plager%20svimmelhet/svimmelhet-behandling.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'tips'],
        clinicalTags: ['central-vertigo', 'stroke', 'ms-dizziness'],
        relatedConditions: ['vestibulær-migrene', 'hjerneslag'],
        readTime: '10 min',
        link: 'sentral-svimmelhet.html'
    },
    {
        id: 'svimmelhet-behandling',
        title: 'Svimmelhet - Årsaker, Symptomer og Effektiv Behandling',
        excerpt: 'Lær om svimmelhet: årsaker som krystallsyke, Ménières sykdom og nakkerelatert svimmelhet. Effektive behandlingsmetoder.',
        image: '/images/plager%20svimmelhet/svimmelhet-behandling.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['svimmelhet', 'svimmelhetbehandling'],
        clinicalTags: ['vestibular-rehabilitation', 'bppv', 'menieres', 'cervicogenic-dizziness'],
        relatedConditions: ['krystallsyke', 'nakkesvimmelhet', 'menieres'],
        readTime: '12 min',
        link: 'svimmelhet-behandling.html'
    },
    // === KJEVE BLOGG-ARTIKLER ===
    {
        id: 'adhd-autisme-kjevesmerter',
        title: 'ADHD, Autisme og Kjevesmerter - Nevrodivergent og TMD',
        excerpt: 'ADHD og autisme kan øke risikoen for kjevesmerter og bruksisme. Lær om sammenhengen og tilpassede strategier.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'tips'],
        clinicalTags: ['adhd-tmd', 'autism-bruxism', 'neurodivergent'],
        relatedConditions: ['bruksisme', 'tmd', 'stress'],
        readTime: '10 min',
        link: 'adhd-autisme-kjevesmerter.html'
    },
    {
        id: 'stress-kjevesmerter',
        title: 'Stress og Kjevesmerter - Sammenhengen Forklart',
        excerpt: 'Stress er en hovedårsak til kjevesmerter og bruksisme. Lær hvordan stress påvirker kjeven og få tips til å bryte sirkelen.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'stress', 'tips'],
        clinicalTags: ['stress-tmd', 'bruxism', 'jaw-clenching'],
        relatedConditions: ['bruksisme', 'tmd', 'hodepine'],
        readTime: '9 min',
        link: 'stress-kjevesmerter.html'
    },
    {
        id: 'graviditet-kjevesmerter',
        title: 'Kjevesmerter i Graviditet - TMD og Svangerskap',
        excerpt: 'Kjevesmerter under graviditet er vanlig. Lær hvorfor hormoner og stress påvirker kjeven, og få trygge behandlingsalternativer.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'graviditet'],
        clinicalTags: ['pregnancy-tmd', 'relaxin', 'hormones-jaw'],
        relatedConditions: ['tmd', 'graviditet'],
        readTime: '8 min',
        link: 'graviditet-kjevesmerter.html'
    },
    {
        id: 'musikere-kjevesmerter',
        title: 'Musikere og Kjevesmerter - Blåsere, Fiolinister, Sangere',
        excerpt: 'Musikere har økt risiko for kjevesmerter. Lær om TMD hos blåsere, strykere og sangere, og få tips til forebygging.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'forebygging'],
        clinicalTags: ['musician-tmd', 'wind-instrument', 'violin-jaw'],
        relatedConditions: ['tmd', 'bruksisme'],
        readTime: '9 min',
        link: 'musikere-kjevesmerter.html'
    },
    {
        id: 'kampsport-kjeveskader',
        title: 'Kampsport og Kjeveskader - Boksing, MMA, BJJ',
        excerpt: 'Kampsport som boksing, MMA og BJJ gir høy risiko for kjeveskader. Lær om forebygging og behandling.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'idrettsskader'],
        clinicalTags: ['combat-sports-tmd', 'jaw-trauma', 'mouthguard'],
        relatedConditions: ['tmd', 'kjeveskade'],
        readTime: '10 min',
        link: 'kampsport-kjeveskader.html'
    },
    {
        id: 'hypermobilitet-eds-kjeve',
        title: 'Hypermobilitet, EDS og Kjevesmerter',
        excerpt: 'Hypermobilitet og Ehlers-Danlos syndrom øker risikoen for kjeveplager. Lær om sammenhengen og tilpasset behandling.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'tips'],
        clinicalTags: ['hypermobility-tmd', 'eds', 'beighton-score'],
        relatedConditions: ['tmd', 'hypermobilitet'],
        readTime: '10 min',
        link: 'hypermobilitet-eds-kjeve.html'
    },
    {
        id: 'botox-vs-manuell-behandling-kjeve',
        title: 'Botox vs Manuell Behandling for Kjevesmerter',
        excerpt: 'Botox for kjevesmerter og bruksisme - fungerer det? Sammenligning av Botox og manuell behandling ved TMD.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'forskning'],
        clinicalTags: ['botox-tmd', 'manual-therapy', 'bruxism-treatment'],
        relatedConditions: ['tmd', 'bruksisme'],
        readTime: '11 min',
        link: 'botox-vs-manuell-behandling-kjeve.html'
    },
    {
        id: 'kjeveovelser-hjemme',
        title: 'Kjeveøvelser du kan gjøre hjemme - TMD selvhjelp',
        excerpt: 'Effektive øvelser for kjevesmerter du kan gjøre hjemme. Steg-for-steg veiledning til mobilisering og avspenning.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'hjemmetrening', 'tips'],
        clinicalTags: ['tmd-exercises', 'jaw-stretches', 'self-treatment'],
        relatedConditions: ['tmd', 'bruksisme'],
        readTime: '8 min',
        link: 'kjeveovelser-hjemme.html'
    },
    {
        id: 'tekstnakke-kjevesmerter',
        title: 'Tekstnakke og Kjevesmerter - Mobilbruk og TMD',
        excerpt: 'Tekstnakke fra mobilbruk kan gi kjevesmerter. Lær hvordan fremoverlent hode belaster kjeven og få tips til bedre vaner.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'nakkesmerter', 'forebygging'],
        clinicalTags: ['text-neck-tmd', 'forward-head-posture', 'tech-neck'],
        relatedConditions: ['tmd', 'tekstnakke', 'nakkesmerter'],
        readTime: '7 min',
        link: 'tekstnakke-kjevesmerter.html'
    },
    {
        id: 'kjevesmerter-barn-ungdom',
        title: 'Kjevesmerter hos Barn og Ungdom - TMD hos Unge',
        excerpt: 'Kjevesmerter og TMD hos barn og ungdom. Lær om årsaker, symptomer og behandling av kjeveleddsproblemer hos unge.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'tips'],
        clinicalTags: ['pediatric-tmd', 'adolescent-jaw-pain', 'bruxism-children'],
        relatedConditions: ['tmd', 'bruksisme'],
        readTime: '9 min',
        link: 'kjevesmerter-barn-ungdom.html'
    },
    {
        id: 'tmd-ibs-mage-kjeve',
        title: 'TMD og IBS - Sammenhengen Mellom Mage og Kjeve',
        excerpt: 'TMD og IBS opptrer ofte sammen. Lær om sammenhengen mellom kjevesmerter og mageproblemer.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'livsstil'],
        clinicalTags: ['tmd-ibs', 'gut-jaw-connection', 'central-sensitization'],
        relatedConditions: ['tmd', 'ibs'],
        readTime: '10 min',
        link: 'tmd-ibs-mage-kjeve.html'
    },
    {
        id: 'bittfeil-myter-fakta',
        title: 'Bittfeil og Kjevesmerter - Myter vs Fakta',
        excerpt: 'Forårsaker bittfeil kjevesmerter? Forskningen avkrefter mange myter. Lær hva som faktisk påvirker kjeveleddsproblemer.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'forskning', 'faq'],
        clinicalTags: ['malocclusion-myths', 'occlusion-tmd', 'bite-adjustment'],
        relatedConditions: ['tmd', 'bittfeil'],
        readTime: '9 min',
        link: 'bittfeil-myter-fakta.html'
    },
    {
        id: 'kjeve-nakke-svimmelhet',
        title: 'Sammenhengen mellom kjeve, nakke og svimmelhet',
        excerpt: 'Kjeve, nakke og balansesystemet er koblet sammen gjennom felles nervebaner. Lær om sammenhengen og behandling.',
        image: '/images/plager%20kjevesmerter/Kjeve.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['kjevesmerter', 'svimmelhet', 'nakkesmerter'],
        clinicalTags: ['tmd-dizziness', 'trigeminocervical', 'cervicogenic'],
        relatedConditions: ['tmd', 'nakkesvimmelhet', 'svimmelhet'],
        readTime: '10 min',
        link: 'kjeve-nakke-svimmelhet.html'
    },
    // === IDRETTSSKADER BLOGG-ARTIKLER ===
    {
        id: 'hjernerystelse-idrett',
        title: 'Hjernerystelse i Idrett: Når Kan Du Spille Igjen?',
        excerpt: 'Return-to-play etter hjernerystelse. Lær om 6-trinns protokollen, symptomer og når du kan trene igjen.',
        image: '/images/plager%20svimmelhet/svimmelhet-behandling.webp',
        date: '5. januar 2026',
        author: 'Mads',
        categories: ['idrettsskader', 'svimmelhet', 'rehabilitering'],
        clinicalTags: ['concussion', 'return-to-play', 'scat6'],
        relatedConditions: ['hjernerystelse', 'svimmelhet', 'hodepine'],
        readTime: '11 min',
        link: 'hjernerystelse-idrett.html'
    }
];

// Function to get all posts
function getAllPosts() {
    return BLOG_POSTS;
}

// Function to get recent posts (for homepage)
function getRecentPosts(limit = 3) {
    return BLOG_POSTS.slice(0, limit);
}

// Function to get posts by specific tag
function getPostsByTag(tag) {
    return BLOG_POSTS.filter(post => post.categories.includes(tag));
}

// Function to get related posts (posts with similar tags or clinical conditions)
function getRelatedPosts(currentPost, limit = 3) {
    const relatedPosts = BLOG_POSTS.filter(post => {
        if (post.id === currentPost.id) return false;
        
        // Check for shared categories
        const sharedCategories = post.categories.some(cat => currentPost.categories.includes(cat));
        
        // Check for shared clinical tags
        const sharedClinicalTags = currentPost.clinicalTags && post.clinicalTags && 
            post.clinicalTags.some(tag => currentPost.clinicalTags.includes(tag));
        
        // Check for related conditions
        const relatedConditions = currentPost.relatedConditions && post.categories &&
            post.categories.some(cat => currentPost.relatedConditions.includes(cat));
            
        return sharedCategories || sharedClinicalTags || relatedConditions;
    });
    
    return relatedPosts.slice(0, limit);
}

// Function to get posts by clinical diagnosis
function getPostsByDiagnosis(diagnosis) {
    return BLOG_POSTS.filter(post => 
        (post.clinicalTags && post.clinicalTags.includes(diagnosis)) ||
        (post.categories && post.categories.includes(diagnosis))
    );
}

// Function to get all available clinical tags
function getAllClinicalTags() {
    const allTags = new Set();
    BLOG_POSTS.forEach(post => {
        if (post.clinicalTags) {
            post.clinicalTags.forEach(tag => allTags.add(tag));
        }
    });
    return Array.from(allTags).sort();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BLOG_POSTS,
        getAllPosts,
        getRecentPosts,
        getPostsByTag,
        getRelatedPosts,
        getPostsByDiagnosis,
        getAllClinicalTags
    };
} 

