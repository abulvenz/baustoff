import tagl_hyperscript from "tagl-mithril";
import m from "mithril";

import images from "../images/*.*";

import carousel from "bulma-carousel";

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
  i
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
     this.bc = new carousel(vnode.dom, {autoplay:true});
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
        m(Carousel,{images: images_mapped}),        
        p.level.text(`Bitte stöbern Sie und zögern nicht uns auch
            persönlich anzusprechen.`)
      )
    );
  }
}

class Search {
  view(vnode) {
    return section.section.fade(h1.title("Suche nach Baustoffen"), p.text(""));
  }
}

var links = [
  {
    link: "/",
    text: [span.mdi.mdiLeaf(), "Baustoff"],
    component: Home
  },
  {
    link: "/suche",
    text: [span.mdi.mdiDatabaseSearch(), "Suche"],
    component: Search
  },
  {
    link: "/meine",
    text: [span.mdi.mdiAccountStar(), "Meine Baustoffe"],
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
