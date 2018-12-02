import tagl_hyperscript from "tagl-mithril";
import m from "mithril";


const  {
  div,
  header,
  footer,
} = tagl_hyperscript(m);

export default {
    view(vnode) {
        return div.quickview[vnode.attrs.isActive ? "is-active" : ""](
            header.quickviewHeader(vnode.attrs.header),
            div.quickviewBody(div.quickviewBlock(vnode.children)),
            footer.quickviewFooter(vnode.attrs.footer)
        );
    }
}
