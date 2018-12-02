import tagl_hyperscript from "tagl-mithril";
import m from "mithril";


import fn from './fn';


const {
    div,
    label,
    nav,
    a,
    span,
    input,
    ul,
    li,
} = tagl_hyperscript(m);



export default class PaginatedList{
    view(vnode) {
        let list = vnode.attrs.list || [];
        let itemsPerPage = vnode.attrs.itemsPerPage || this.itemsPerPage || 15;
        let l = list.length;
        let showEllipses = l > 5;
        this.active = this.active || 0;
        let pages = Math.max(1, Math.round(l / itemsPerPage));
        this.active = this.active % pages;
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
                        fn.range(0, pages)
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
                            checked: this.itemsPerPage === 5,
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
                            checked: this.itemsPerPage === 15,
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
                            checked: this.itemsPerPage === 50,

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
