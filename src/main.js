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
    }
  ];

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
    return nav.pagination.isSmall.isRounded(
      a.paginationPrevious("Zurück"),
      a.paginationNext("Weiter"),
      ul.paginationList(
        li(a.paginationLink("1")),
        li(span.paginationEllipsis(m.trust("&hellip;"))),
        li(a.paginationLink("47")),
        li(a.paginationLink.isCurrent("48")),
        li(a.paginationLink("49")),
        li(span.paginationEllipsis(m.trust("&hellip;"))),
        li(a.paginationLink("101"))
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
  }
  view(vnode) {
    return section.section.fade(
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
        span.icon.isLeft(i.mdi.mdiAccountSearch())
      ),
      p.text(""),
      table.table.isFullwidth.isStriped(
        thead(
          tr(
            th("Typ"),
            th(abbr({ title: "Grünheit ;-)" }, span.mdi.mdiLeaf())),
            th(abbr({ title: "Tödlichkeit ;-(" }, span.mdi.mdiSkull()))
          )
        ),
        tbody(
          baustoffe
            .list()
            .filter(bs=>{
                if (this.search === '')
                    return true;
                if (bs.name.indexOf(this.search)>=0) {
                    return true;
                }
                return false;
            })
            .map(bs =>
              tr(
                td(bs.name),
                td(m(Greenity, { greenity: bs.greenity })),
                td(m(Toxicality, { toxicality: bs.toxicality }))
              )
            )
        )
      ),
      m(PaginatedList)
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

        //                a.navbarItem('Home')
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

carousel.attach();
