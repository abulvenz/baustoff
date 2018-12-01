import tagl_hyperscript from "tagl-mithril";
import m from "mithril";

import images from "../images/*.*";

import carousel from "bulma-carousel";

const range = (a, b) => {
  let r = [];
  for (let _i = a; _i < b; _i++) r.push(_i);
  return r;
};

const images_mapped = Object.keys(images)
  .map(key =>
    Object.keys(images[key]).map(key2 => {
      return { [key + "." + key2]: images[key][key2] };
    })
  )
  .reduce((a, b) => a.concat(b))
  .reduce((a, b) => Object.assign(a, b));

const {
  div,
  label,
  section,
  nav,
  footer,
  a,
  p,
  strong,
  img,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  span,
  input,
  i,
  ul,
  li,
  table,
  thead,
  tfoot,
  tbody,
  tr,
  th,
  td,
  abbr
} = tagl_hyperscript(m);

class ExamplePage {
  view(vnode) {
    return section.section.fade(h1.title("Example"));
  }
}

class Carousel {
  oncreate(vnode) {
    this.images = Object.keys(images_mapped);
    this.active = 0;
    this.bc = new carousel(vnode.dom, { autoplay: true });
  }
  view(vnode) {
    return div.carousel.carouselAnimated.carouselAnimateSlide(
      div.carouselContainer(
        Object.keys(images_mapped).map((img_src, idx) =>
          div.carouselItem.hasBackground[
            idx === this.active ? "is-active" : ""
          ](
            img.isBackground({
              width: "640",
              height: 480,
              src: images_mapped[img_src]
            })
          )
        )
      ),
      div.carouselNavigation.isOverlay(
        div.carouselNavLeft(span.mdi.mdiChevronLeft.isLarge())
      ),
      div.carouselNavigation.isOverlay(
        div.carouselNavRight(span.mdi.mdiChevronRight())
      )
    );
  }
}

class Home {
  view(vnode) {
    return section.section.fade(
      div.container(
        h1.title("Willkommen"),
        p.level.text(`Wir freuen uns, Ihnen hier Informationen zum
                ökologischen Bauen, Sanieren und Umbauen zur
                Verfügung zu stellen. 
            `),
        m(Carousel, { images: images_mapped }),
        p.level.text(`Bitte stöbern Sie und zögern nicht uns auch
            persönlich anzusprechen.`)
      )
    );
  }
}

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
      name: "Reed",
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
      name: "Reed 2",
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

  range(0, 1000).forEach(ii =>
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

let baustoffe = baustoffService();

console.log(baustoffe.list());

class PaginatedList {
  view(vnode) {
    let list = vnode.attrs.list || [];
    let itemsPerPage = vnode.attrs.itemsPerPage || this.itemsPerPage || 10;
    let l = list.length;
    let showEllipses = l > 5;
    this.active = this.active || 0;
    let pages = Math.round(l / itemsPerPage);
    console.log(this.active);
    vnode.attrs.filter.fun = (e, idx) =>
      idx >= this.active * itemsPerPage &&
      idx < (this.active + 1) * itemsPerPage;
    return div.columns(
      div.column.isTwoThirds(
        nav.pagination.isSmall.isRounded.isCentered(
          a.paginationPrevious(
            {
              onclick: () =>
                (this.active =
                  this.active - 1 + (this.active === 0 ? pages : 0))
            },
            "Zurück"
          ),
          a.paginationNext(
            {
              onclick: () =>
                (this.active =
                  this.active + 1 - (this.active === pages - 1 ? pages : 0))
            },
            "Weiter"
          ),
          ul.paginationList(
            range(0, pages)
              .filter(ii => {
                if (ii === 0 || ii === pages - 1) return true;
                if (Math.abs(ii - this.active) <= 2) return true;
                return false;
              })
              .map(page => [
                -page + this.active === 2 && showEllipses && page !== 0
                  ? li(span.paginationEllipsis(m.trust("&hellip;")))
                  : null,
                li(
                  a.paginationLink[page === this.active ? "is-current" : ""](
                    {
                      onclick: () => (this.active = page)
                    },
                    page + 1
                  )
                ),
                page - this.active === 2 && showEllipses && page !== pages - 1
                  ? li(span.paginationEllipsis(m.trust("&hellip;")))
                  : null
              ])
          )
        )
      ),
      div.column(
        div.control.isCentered(
          label.radio(
            input({
              type: "radio",
              name: "itemsperpage",
              onclick: () => {
                this.itemsPerPage = 5;
                m.redraw();
              }
            }),
            5
          ),
          label.radio(
            input({
              type: "radio",
              name: "itemsperpage",
              onclick: () => {
                this.itemsPerPage = 15;
                m.redraw();
              }
            }),
            15
          ),
          label.radio(
            input({
              type: "radio",
              name: "itemsperpage",
              onclick: () => {
                this.itemsPerPage = 50;
                m.redraw();
              }
            }),
            50
          )
        )
      )
    );
  }
}

class Greenity {
  view(vnode) {
    let g = vnode.attrs.greenity;
    const colorClass = () => {
      return g < 3
        ? "has-text-danger"
        : g < 5
        ? "has-text-warning"
        : g < 7
        ? "has-text-link"
        : "has-text-success";
    };
    return p({}, range(0, g).map(_ => i.mdi.mdiLeaf[colorClass()]()));
  }
}

class Toxicality {
  view(vnode) {
    let g = vnode.attrs.toxicality;
    const colorClass = () => {
      return g > 7
        ? "has-text-danger"
        : g > 5
        ? "has-text-warning"
        : g > 3
        ? "has-text-link"
        : "has-text-success";
    };
    return p(
      {},
      range(0, g).map(_ => i.mdi.mdiSkullCrossbones[colorClass()]())
    );
  }
}

class Search {
  constructor(vnode) {
    this.search = "";
    this.paginationFilter = {
      fun: () => true
    };
  }
  view(vnode) {
      let filteredList=
    baustoffe
    .list()
    .filter(bs => this.search === "" || 
    (bs.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0));

    return section.section.fade(
      div.container(
        h1.title(
          span.mdi.mdiDatabaseSearch(),
          m.trust("&nbsp;"),
          "Suche nach Baustoffen"
        ),
        p.control.hasIconsLeft(
          input.input({
            value: this.search,
            oninput: m.withAttr("value", v => (this.search = v)),
            type: "text",
            placeholder: "Suchwort"
          }),
          span.icon.isLeft(i.mdi.mdiMagnify())
        ),
        p.text(""),
        table.table.isFullwidth.isStriped(
          thead(
            tr(
              th("Typ"),
              th(abbr({ title: "Grünheit ;-)" }, span.mdi.mdiLeaf())),
              th(abbr({ title: "Tödlichkeit ;-(" }, span.mdi.mdiSkull())),
              th(abbr({ title: "Tödlichkeit ;-(" }, span.mdi.mdiCurrencyEur()))
            )
          ),
          tbody(
            filteredList
            .filter(this.paginationFilter.fun)              
              .map(bs =>
                tr(
                  td(bs.name),
                  td(m(Greenity, { greenity: bs.greenity })),
                  td(m(Toxicality, { toxicality: bs.toxicality })),
                  td(bs.priceRange.min + " - " + bs.priceRange.max)
                )
              )
          )
        ),
        m(PaginatedList, {
          list: filteredList,
          filter: this.paginationFilter
        })
      )
    );
  }
}

var links = [
  {
    link: "/",
    text: [span.mdi.mdiLeaf(), m.trust("&nbsp;"), "Baustoff"],
    component: Home
  },
  {
    link: "/suche",
    text: [span.mdi.mdiDatabaseSearch(), m.trust("&nbsp;"), "Suche"],
    component: Search
  },
  {
    link: "/meine",
    text: [span.mdi.mdiAccountStar(), m.trust("&nbsp;"), "Meine Baustoffe"],
    component: ExamplePage
  }
];

class Navbar {
  view(vnode) {
    return nav.navbar.isInfo(
      div.navbarBrand(
        links.map(link =>
          a.navbarItem(
            {
              href: "#!" + link.link
            },
            link.text
          )
        )
      )
    );
  }
}

class Router {
  oncreate(vnode) {
    m.route(
      vnode.dom,
      "/",
      links.reduce((acc, { link, component }) => {
        acc[link] = component;
        return acc;
      }, {})
    );
  }
  view(vnode) {
    return m("");
  }
}

class Footer {
  view(vnode) {
    return footer.footer(
      div.content.hasTextCentered(
        p(
          strong("Baustoff"),
          " by ",
          a({ href: "http://eismaenners.de" }, "Andreas Eismann")
        )
      )
    );
  }
}

class Layout {
  view(vnode) {
    return [m(Navbar), m(Router), m(Footer)];
  }
}

m.mount(document.getElementById("app"), {
  view(vnode) {
    return m(Layout);
  }
});
