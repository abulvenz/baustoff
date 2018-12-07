import tagl_hyperscript from "tagl-mithril";
import m from "mithril";

import fn from './fn';

const {
    p,
    i
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