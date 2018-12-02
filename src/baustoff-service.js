import fn from './fn';

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