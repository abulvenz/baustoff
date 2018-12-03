import tagl_hyperscript from "tagl-mithril";
import m from "mithril";


const  {
  div,
  header,
  footer,
  article
} = tagl_hyperscript(m);

export default {
    view(vnode) {
        return div.quickview[vnode.attrs.isActive ? "is-active" : ""](
            header.quickviewHeader(vnode.attrs.header),
            article.quickviewBody(div.quickviewBlock(vnode.children)),
            footer.quickviewFooter(vnode.attrs.footer)
        );
    }
}
