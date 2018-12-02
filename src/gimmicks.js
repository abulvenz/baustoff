import tagl_hyperscript from "tagl-mithril";
import m from "mithril";

import fn from './fn';

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
        return p({}, fn.range(0, g).map(_ => i.mdi.mdiLeaf[colorClass()]()));
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
            fn.range(0, g).map(_ => i.mdi.mdiSkullCrossbones[colorClass()]())
        );
    }
}

export default {
    Greenity,
    Toxicality
}