import m from 'mithril'
import tagl_hyperscript from 'tagl-mithril';
import marked from 'marked';

const {} = tagl_hyperscript(m);


let text = String.raw`Beton [beˈtõ], [beˈtɔŋ] (österr. und z. T. bayr. [beˈtoːn]; schweiz. und alem. 1. Silbe betont [ˈbetɔ̃]), vom gleichbedeutenden franz. Wort béton, ist ein Baustoff, der als Dispersion unter Zugabe von Flüssigkeit aus einem Bindemittel und Zuschlagstoffen angemischt wird. Der ausgehärtete Beton wird in manchen Zusammenhängen auch als Kunststein bezeichnet.

[I'm an inline-style link](https://www.eismaenners.de)

Normalbeton enthält Zement als Bindemittel und Gesteinskörnung (früher Zuschlag) als Zuschlagstoff. Das Zugabewasser (früher Anmachwasser) leitet den chemischen Abbindevorgang, d. h. die Erhärtung ein. Um die Verarbeitbarkeit und weitere Eigenschaften des Betons zu beeinflussen, werden der Mischung Betonzusatzstoffe und Betonzusatzmittel hinzugefügt. Das Wasser wird zum größten Teil chemisch gebunden. Die vollständige Trocknung des Gemischs darf daher erst nach der Erhärtung erfolgen.
            
Frischer Beton kann als Zweistoffsystem aus flüssigem Zementleim und festem Zuschlag angesehen werden. Zementleim härtet zu Zementstein. Dieser bildet die Matrix, welche die Gesteinskörnung umgibt.[1]
            
Beton wird heute überwiegend als Verbundwerkstoff in Kombination mit einer zugfesten Bewehrung eingesetzt. Die Verbindung mit Betonstahl oder Spannstahl ergibt Stahlbeton bzw. Spannbeton. Neuere Entwicklungen sind Faserbeton mit Zugabe von Stahl-, Kunststoff- oder Glasfasern, sowie Textilbeton, der Gewirken aus alkaliresistentem AR-Glas oder Kohlenstofffasern enthält. 


Marked - Markdown Parser
========================

[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.

How To Use The Demo
-------------------

1. Type in stuff on the left.
2. See the live updates on the right.

That's it.  Pretty simple.  There's also a drop-down option in the upper right to switch between various views:

- **Preview:**  A live display of the generated HTML as it would render in a browser.
- **HTML Source:**  The generated HTML before your browser makes it pretty.
- **Lexer Data:**  What [marked] uses internally, in case you like gory stuff like this.
- **Quick Reference:**  A brief run-down of how to format things using markdown.

Why Markdown?
-------------

It's easy.  It's not overly bloated, unlike HTML.  Also, as the creator of [markdown] says,

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

Ready to start writing?  Either start changing stuff on the left or
[clear everything](?text=) with a simple click.

[Marked]: https://github.com/markedjs/marked/
[Markdown]: http://daringfireball.net/projects/markdown/

            `


console.log(            marked.lexer(text))


class MarkDownChild {
    view(vnode) {
        let md = vnode.attrs.md;
        return md.type === 'paragraph'?'':''

    }
}





export default {
    view(vnode) {
        return marked.lexer(vnode.attrs.md)
            .map()
    }
}