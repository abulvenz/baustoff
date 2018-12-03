import tagl_hyperscript from "tagl-mithril";
import m from "mithril";

import images from "../images/home-slider/*.*";
import images_mat from "../images/material/*.*";

import carousel from "bulma-carousel";

import lorem from "./lorem";

import {} from "./tagls";

import QuickView from "./quickview";
import Carousel from "./carousel";
import PaginatedList from "./paginated-list";

import baustoffService from "./baustoff-service";

import fn from "./fn";

import G from "./gimmicks";

import marked from 'marked';

import mm from './markdown';

const images_mapped = images =>
  Object.keys(images)
    .map(key =>
      Object.keys(images[key]).map(key2 => {
        return { [key + "." + key2]: images[key][key2] };
      })
    )
    .reduce((a, b) => a.concat(b))
    .reduce((a, b) => Object.assign(a, b));

const images_slider = images_mapped(images);
const images_material = images_mapped(images_mat);

const {
  div,
  button,
  header,
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

class Home {
  view(vnode) {
    return div.container.fade(
      h1.title("Willkommen"),
      p.level.text(`Wir freuen uns, Ihnen hier Informationen zum
                ökologischen Bauen, Sanieren und Umbauen zur
                Verfügung zu stellen. 
            `),
      m(Carousel, { images: images_slider }),
      p.level.text(`Bitte stöbern Sie und zögern nicht uns auch
            persönlich anzusprechen.`)
    );
  }
}

let baustoffe = baustoffService();

console.log(baustoffe.list());

class BuidingPage {
  view(vnode) {
    return div.container.fade(
      h1.title(""),
      div.columns(
        div.column.isThird(
          img.image({ src: images_material["concrete.jpeg"] }),
          p(
            a(
              {
                href: "https://de.wikipedia.org/wiki/" + vnode.attrs.id
              },
              span.mdi.mdiWikipedia(),
              "Suchen bei Wikipedia"
            )
          )
        ),
        div.column(
          lorem
            .split("\n")
            .filter((_, ii) => ii < 1)
            .map(l => p.text(l))
        )
      )
    );
  }
}

class MaterialQuickView {
    oninit(vnode){
        this.renderer = new marked.Renderer();
        this.renderer.link = (text,level)=>{

        }
    }
  view(vnode) {
    let material = vnode.attrs.material;
    return m(
      QuickView,
      {
        isActive: !!material,
        header: [
          h2.title("Material"),
          span.delete({ onclick: vnode.attrs.onclose })
        ],
        footer: [
          a(
            { href: "https://de.wikipedia.org" },
            span.mdi.mdiWikipedia(),
            " Unsere Quelle"
          ),
          span.delete({ onclick: vnode.attrs.onclose })
        ]
      },
      [
        section.section(
          h1.title(material.name),
          p.text(
            div.columns(
              div.column(m(G.Greenity, { greenity: material.greenity })),
              div.column(m(G.Toxicality, { toxicality: material.toxicality }))
            )
          ),
          p.text(
              m.trust(marked( ''+material.text))
          )
        )
      ]
    );
  }
}

class Search {
  constructor(vnode) {
    this.search = "";
    this.paginationFilter = {
      fun: (elem, idx) => idx < 15
    };
  }
  view(vnode) {
    let filteredList = baustoffe
      .list()
      .filter(
        bs =>
          this.search === "" ||
          bs.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0
      );

    return div.container.fade(
      !!this.selected
        ? m(MaterialQuickView, {
            material: this.selected,
            onclose: () => (this.selected = null)
          })
        : null,
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
      table.table.isFullwidth.isStriped.isHoverable(
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
              tr.isClickable(
                { onclick: () => (this.selected = bs) },
                td(bs.name),
                td(m(G.Greenity, { greenity: bs.greenity })),
                td(m(G.Toxicality, { toxicality: bs.toxicality })),
                td(bs.priceRange.min + " - " + bs.priceRange.max)
              )
            )
        )
      ),
      m(PaginatedList, {
        list: filteredList,
        filter: this.paginationFilter
      })
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
    text: [span.mdi.mdiAccountStar(), m.trust("&nbsp;"), "Mein Bauvorhaben"],
    component: BuidingPage
  },
  {
    link: "/baustoff/:id",
    component: BuidingPage
  }
];

class Navbar {
  view(vnode) {
    return nav.navbar.isSuccess(
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
    return section.section();
  }
}

class Footer {
  view(vnode) {
    return footer.footer(
      div.content.hasTextCentered(
        p(
          strong("Baustoff - Idee"),
          " by ",
          a({ href: "https://naturbaustoffe-linnemann.de" }, "Martin Linnemann")
        ),
        p(
          strong("Baustoff - Design"),
          " by ",
          a({ href: "http://eismaenners.de" }, "Andreas Eismann")
        )
      )
    );
  }
}

m.mount(document.body, {
  view(vnode) {
    return [m(Navbar), m(Router), m(Footer)];
  }
});
