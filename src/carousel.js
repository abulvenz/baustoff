import tagl_hyperscript from "tagl-mithril";
import m from "mithril";

import carousel from "bulma-carousel";


const {
    div,
    img,
    span,
} = tagl_hyperscript(m);


export default {
    oncreate(vnode) {
        this.images = Object.keys(vnode.attrs.images);
        this.active = 0;
        this.bc = new carousel(vnode.dom, { autoplay: true });
    },
    view(vnode) {
        return div.carousel.carouselAnimated.carouselAnimateSlide(
            div.carouselContainer(
                Object.keys(vnode.attrs.images).map((img_src, idx) =>
                    div.carouselItem.hasBackground[
                        idx === this.active ? "is-active" : ""
                    ](
                        img.isBackground({
                            width: "640",
                            height: 480,
                            src: vnode.attrs.images[img_src]
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