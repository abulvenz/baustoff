import tagl_hyperscript from 'tagl-mithril';
import m from 'mithril';

import image_ from '../images/architect-architecture-build-1109541.jpg';

const {
    div,    
    section,
    nav,
    footer,  
    a  ,
    p,
    strong,
    img,
    h1,h2,h3,h4,h5,h6
} = tagl_hyperscript(m);


class ExamplePage {
    view(vnode) {
        return section.section.fade(h1.title('Example'))
    }
}

class Home {
    view(vnode) {
        return section.section.fade(
            h1.title('Willkommen'),
            p.text(`Wir freuen uns, Ihnen hier Informationen zum
                ökologischen Bauen, Sanieren und Umbauen zur
                Verfügung zu stellen. 
            `),
            img.image({
                src:image_
            })
        )
    }
}

class Search {
    view(vnode){
        return section.section.fade(
            h1.title('Suche nach Baustoffen'),
            p.text('')
        )
    }
}


var links = [{
    link: '/',
    text: 'Baustoff',
    component: Home
},
{
    link: '/suche',
    text: 'Suche',
    component: Search
}, {
    link: '/meine',
    text: 'Meine Baustoffe',
    component: ExamplePage
}
];

class Navbar {
    view(vnode) {
        return nav.navbar.isInfo(            
            div.navbarBrand(
                links.map(link=>
                    a.navbarItem({
                        href:'#!'+link.link
                    },link.text)
                    )

//                a.navbarItem('Home')
            )
        );
    }
}

class Router {
    oncreate(vnode) {
        m.route(vnode.dom, '/queens',
            links.reduce((acc, {
                link,
                component
            }) => {
                acc[link] = component;
                return acc;
            }, {})
        );
    }
    view(vnode) {
        return m('');
    }
}
class Footer {
    view(vnode){
        return footer.footer(
            div.content.hasTextCentered(
                p(
                    strong('Baustoff') ,' by ',
                    a({href:"eismaenners.de"},'Andreas Eismann')
                )
            )
        );
    }
}

class Layout {
    view(vnode) {
        return [
            m(Navbar),
            m(Router),
            m(Footer)
        ];
    }
}


m.mount(document.body,{
    view(vnode){
        return m(Layout);
    }
})