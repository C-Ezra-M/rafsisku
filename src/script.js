import vlaste from "./vlaste.json" with { type: 'json' }

// From chapter 3.7 of "Complete Lojban Language".
// Used to skip table rows for impermissible clusters.
const ALLOWED_CLUSTERS = [
    'bl', 'br',
    'cf', 'ck', 'cl', 'cm', 'cn', 'cp', 'cr', 'ct',
    'dj', 'dr', 'dz',
    'fl', 'fr',
    'gl', 'gr',
    'jb', 'jd', 'jg', 'jm', 'jv',
    'kl', 'kr',
    'ml', 'mr',
    'pl', 'pr',
    'sf', 'sk', 'sl', 'sm', 'sn', 'sp', 'sr', 'st',
    'tc', 'tr', 'ts',
    'vl', 'vr',
    'xl', 'xr',
    'zb', 'zd', 'zg', 'zm', 'zv',
];
const CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x', 'z'];
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const VOWELS_WITH_YhY = VOWELS.map(e => VOWELS.map(v => e + "'" + v)).flat(1)
const DIPHTHONGS = ['ai', 'au', 'ei', 'oi']

const url = new URL(location.href)

function createTwoConsonantTable(letter, consonants, isCCV) {
    const rows = consonants.map(e => ({
        tag: "tr",
        contents: [
            {
                tag: "th",
                contents: e,
            },
            {
                tag: "td",
                "data-rafsi": isCCV ? letter + e + "a" : letter + "a" + e
            },
            {
                tag: "td",
                "data-rafsi": isCCV ? letter + e + "e" : letter + "e" + e
            },
            {
                tag: "td",
                "data-rafsi": isCCV ? letter + e + "i" : letter + "i" + e
            },
            {
                tag: "td",
                "data-rafsi": isCCV ? letter + e + "o" : letter + "o" + e
            },
            {
                tag: "td",
                "data-rafsi": isCCV ? letter + e + "u" : letter + "u" + e
            },
        ],
    }))
    const t = $.create("table", {
        class: "rafste",
        contents: [
            {
                tag: "tr",
                contents: [
                    {
                        tag: "th",
                        contents: [
                            "→ Vowel",
                            { tag: "br" },
                            "↓ Consonant",
                        ]
                    },
                    {
                        tag: "th",
                        contents: "a",
                    },
                    {
                        tag: "th",
                        contents: "e",
                    },
                    {
                        tag: "th",
                        contents: "i",
                    },
                    {
                        tag: "th",
                        contents: "o",
                    },
                    {
                        tag: "th",
                        contents: "u",
                    }
                ]
            },
            ...rows
        ]
    })
    return t
}

function createTwoVowelTable(letter) {
    const createCells = (e) => (
        VOWELS.map(v => ({
            tag: "td",
            "data-rafsi": letter + v + "'" + e,
        }))
    )
    const rows = VOWELS.map(e => [
        {
            tag: "tr",
            contents: [
                {
                    tag: "th",
                    contents: e,
                },
                ...createCells(e)
            ],
        }
    ]).flat(1)
    //debugger
    const t = $.create("table", {
        class: "rafste",
        contents: [
            {
                tag: "tr",
                contents: [
                    {
                        tag: "th",
                        contents: [
                            "→ First vowel",
                            { tag: "br" },
                            "↓ Second vowel",
                        ],
                    },
                    {
                        tag: "th",
                        contents: 'a',
                    },
                    {
                        tag: "th",
                        contents: 'e',
                    },
                    {
                        tag: "th",
                        contents: 'i',
                    },
                    {
                        tag: "th",
                        contents: 'o',
                    },
                    {
                        tag: "th",
                        contents: 'u',
                    },
                ]
            },
            ...rows
        ]
    })
    return t
}

function createDiphthongTable(letter) {
    const rows = DIPHTHONGS.map(e => ({
        tag: "tr",
        contents: [
            {
                tag: "th",
                contents: e,
            },
            {
                tag: "td",
                "data-rafsi": letter + e,
            },
        ],
    }))
    const t = $.create("table", {
        class: "rafste",
        contents: [
            {
                tag: "tr",
                contents: [
                    {
                        tag: "th",
                        contents: "Diphthong",
                    },
                    {
                        tag: "th",
                        contents: "Rafsi",
                    },
                ]
            },
            ...rows
        ]
    })
    return t
}

function populateTable(t, entries) {
    for (let [r, v] of entries) {
        if (!(v instanceof Array)) {
            v = [{word: v, experimental: false}]
        } else {
            v = v.map(e => ({word: e, experimental: false}))
        }
        for (let w of v) {
            if (w.word.endsWith("*")) {
                w.word = w.word.replace(/\*$/, "")
                w.experimental = true
            }
        }
        const cell = v.map(e => [
            {
                tag: "a",
                href: "https://vlasisku.lojban.org/" + e.word,
                contents: [
                    { tag: "i", lang: "jbo", contents: e.word },
                ]
            },
            ...(e.experimental ? ["*", { tag: "br" }] : [])
        ]).flat(1)
        if (cell.at(-1).tag == "br") {
            cell.pop()
        }
        if (v.find(e => e.experimental)) {
            t.querySelector(`[data-rafsi="${r}"]`)?._.set('className', 'experimental')
        }
        t.querySelector(`[data-rafsi="${r}"]`)?._.contents(cell)
    }
}

function getRafsi(letter) {
    const OUT = document.getElementById('te-pruce')
    const vlasteMap = Object.entries(vlaste)
    const relevantEntries = vlasteMap.filter(([r, v]) => r.startsWith(letter))
    const CCVentries = relevantEntries.filter(([r, v]) => CONSONANTS.includes(r[1]))
    const CVCentries = relevantEntries.filter(([r, v]) => CONSONANTS.includes(r[2]))
    const CVVentries = relevantEntries.filter(([r, v]) => DIPHTHONGS.includes(r.slice(1)))
    const CVhVentries = relevantEntries.filter(([r, v]) => VOWELS_WITH_YhY.includes(r.slice(1)))

    //console.log(CCVentries)
    //console.log(CVCentries)
    //console.log(CVVentries)

    const CCVrafsiSection = []
    const permittedClusterEnds = ALLOWED_CLUSTERS.filter(e => e.startsWith(letter)).map(e => e.slice(1))
    if (permittedClusterEnds.length !== 0) {
        const CCVtable = createTwoConsonantTable(letter, permittedClusterEnds, true);
        populateTable(CCVtable, CCVentries)
        CCVrafsiSection.push(
            $.create("h2", { contents: `${letter}CV rafsi` }),
            CCVtable,
        )
    }
    const CVCtable = createTwoConsonantTable(letter, CONSONANTS, false);
    populateTable(CVCtable, CVCentries)
    const CVVtable = createDiphthongTable(letter);
    populateTable(CVVtable, CVVentries)
    const CVhVtable = createTwoVowelTable(letter);
    populateTable(CVhVtable, CVhVentries)
    OUT.innerText = "" // delete all children
    OUT._.contents([
        $.create("h2", { contents: `${letter}VC rafsi` }),
        CVCtable,
        ...CCVrafsiSection,
        $.create("h2", { contents: `${letter}VV rafsi` }),
        CVVtable,
        $.create("h2", { contents: `${letter}V'V rafsi` }),
        CVhVtable,
    ])
}

document.querySelectorAll("#ro-lerfu > button")
    .forEach(e => e.addEventListener("click", function() {
        const letter = this.value;
        url.hash = "#" + letter
        location.href = url
        getRafsi(letter)
    }))

document.addEventListener("keypress", function(e) {
    const letter = e.key.toLowerCase();
    if (!CONSONANTS.includes(letter)) return;
    url.hash = "#" + letter
    location.href = url
    getRafsi(letter)
})

const fragment = url.hash.replace('#', '');
if (CONSONANTS.includes(fragment)) {
    getRafsi(fragment)
}
