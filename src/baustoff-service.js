import fn from './fn';


const links = [
    'https://informationsdienst-holz.de/fileadmin/Publikationen/1_Holzbau_Handbuch/R04_T01_F01_Holz_als_konstruktiver_Baustoff.pdf',
    'https://bhs-baustoffe.de/fileadmin/user_upload/Baustoffe_April_2018.pdf',
    'http://www.inc-noske.vorschaulink.de/files/4912/upload/GFK-Baustoff%20der%20Zukunft.pdf',
    'https://informationsdienst-holz.de/fileadmin/Publikationen/1_Holzbau_Handbuch/R04_T01_F01_Holz_als_konstruktiver_Baustoff.pdf',
    'https://bhs-baustoffe.de/fileadmin/user_upload/Baustoffe_April_2018.pdf',
    'https://www.berufskolleg-ost-essen.com/wp-content/uploads/2015/04/Lernsituationen-Unterstufe.pdf',
    'https://www.baustoff-metall.de/wp-content/uploads/2016/09/BM-Werkzeugkatalog_2015-06-01.pdf',
    'https://www.stmuv.bayern.de/themen/abfallwirtschaft/doc/leitfaden_recyclingbaustoffe.pdf',
    'https://www.quick-mix.de/fileadmin/user_upload/quick-mix/_Apps_/Sortiment/Systembrochueren/de/quick-mix-Lieferuebersicht-2019-DE-PDF.pdf',
    'https://www.ebrd.de/fileadmin/user_upload_ebrd/formulare/Preisliste_Bretten_ab_01.07.2018.pdf',
    'https://enreba.de/pdf/2014-2_Bedrohtes_Baustoff-Recycling.pdf',
    'https://www.glastroesch.de/fileadmin/content/de/pdf_glashandbuch/Glasbaustoff_Floatglas_Weissglas_glasbuch_kapitel3.pdf',
    'https://bauforumstahl.de/upload/documents/Bauen_mit_Stahl.pdf',
    'https://tu-freiberg.de/sites/default/files/media/professur-fuer-baustofftechnik-8017/vorlesungen/baustoffe/Baustofftechnologie_Khe_Skriptum_I_SS05.pdf'    
];




const baustoffService = () => {
    let cache = [
        {
            name: "Beton",
            greenity: 7.5,
            toxicality: -3,
            priceRange: {
                min: 15,
                avg: 16,
                max: 18,
                currency: "EUR"
            },
            text: String.raw`Beton [beˈtõ], [beˈtɔŋ] (österr. und z. T. bayr. [beˈtoːn]; schweiz. und alem. 1. Silbe betont [ˈbetɔ̃]), vom gleichbedeutenden franz. Wort béton, ist ein Baustoff, der als Dispersion unter Zugabe von Flüssigkeit aus einem Bindemittel und Zuschlagstoffen angemischt wird. Der ausgehärtete Beton wird in manchen Zusammenhängen auch als Kunststein bezeichnet.

[I'm an inline-style link](https://www.eismaenners.de)

Normalbeton enthält Zement als Bindemittel und Gesteinskörnung (früher Zuschlag) als Zuschlagstoff. Das Zugabewasser (früher Anmachwasser) leitet den chemischen Abbindevorgang, d. h. die Erhärtung ein. Um die Verarbeitbarkeit und weitere Eigenschaften des Betons zu beeinflussen, werden der Mischung Betonzusatzstoffe und Betonzusatzmittel hinzugefügt. Das Wasser wird zum größten Teil chemisch gebunden. Die vollständige Trocknung des Gemischs darf daher erst nach der Erhärtung erfolgen.
            
Frischer Beton kann als Zweistoffsystem aus flüssigem Zementleim und festem Zuschlag angesehen werden. Zementleim härtet zu Zementstein. Dieser bildet die Matrix, welche die Gesteinskörnung umgibt.[1]
            
Beton wird heute überwiegend als Verbundwerkstoff in Kombination mit einer zugfesten Bewehrung eingesetzt. Die Verbindung mit Betonstahl oder Spannstahl ergibt Stahlbeton bzw. Spannbeton. Neuere Entwicklungen sind Faserbeton mit Zugabe von Stahl-, Kunststoff- oder Glasfasern, sowie Textilbeton, der Gewirken aus alkaliresistentem AR-Glas oder Kohlenstofffasern enthält. 

            `,
            categories: ["Tragwerk"]
        },
        {
            name: "Glaswolle",
            greenity: 2.5,
            toxicality: 8,
            priceRange: {
                min: 15,
                avg: 16,
                max: 18,
                currency: "EUR"
            },
            text:"# Markdown Editor\n\nType on the left panel and see the result on the right panel",
            categories: ["Dämmstoff"]
        },
        {
            name: "Reet",
            greenity: 4.5,
            toxicality: 3,
            priceRange: {
                min: 15,
                avg: 16,
                max: 18,
                currency: "EUR"
            },
            categories: ["Dämmstoff"]
        },
        {
            name: "Rheinsand",
            greenity: 6.5,
            toxicality: 3,
            priceRange: {
                min: 15,
                avg: 16,
                max: 18,
                currency: "EUR"
            },
            categories: ["Dämmstoff"]
        },
        {
            name: "Beton 2",
            greenity: 7.5,
            toxicality: -3,
            priceRange: {
                min: 15,
                avg: 16,
                max: 18,
                currency: "EUR"
            },
            categories: ["Tragwerk"]
        },
        {
            name: "Glaswolle 2",
            greenity: 2.5,
            toxicality: 8,
            priceRange: {
                min: 15,
                avg: 16,
                max: 18,
                currency: "EUR"
            },
            categories: ["Dämmstoff"]
        },
        {
            name: "Reet 2",
            greenity: 4.5,
            toxicality: 3,
            priceRange: {
                min: 15,
                avg: 16,
                max: 18,
                currency: "EUR"
            },
            categories: ["Dämmstoff"]
        },
        {
            name: "Rheinsand 2",
            greenity: 6.5,
            toxicality: 3,
            priceRange: {
                min: 15,
                avg: 16,
                max: 18,
                currency: "EUR"
            },
            categories: ["Dämmstoff"]
        }
    ];

    fn.range(0, 1000).forEach(ii =>
        cache.push({
            name: "Rheinsand " + ii,
            greenity: 10 * Math.random(),
            toxicality: 10 * Math.random(),
            priceRange: {
                min: Math.round(15 * 10 * Math.random()),
                avg: 16,
                max: Math.round(18 * 10 * Math.random()),
                currency: "EUR"
            },
            categories: ["Dämmstoff"]
        })
    );

    //    JSON.parse(localStorage.getItem("baustoffe"));
    return {
        write: () => {
            localStorage.setItem(JSON.stringify(cache));
        },
        load: () => {
            m.request({
                url: "/api/baustoffe"
            }).then(data => {
                cache = data;
            });
        },
        list: () => cache
    };
};

export default baustoffService;