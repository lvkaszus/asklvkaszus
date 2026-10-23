// The backend sends questions and answers HTML-escaped (for example "<3" arrives as "&lt;3"),
// so that clients printing them straight into HTML are safe. The Markdown renderer decodes
// these entities on its own, but a plain React text node does not, so users would see "&lt;3"
// instead of "<3". Use this function wherever the text is shown without Markdown.
//
// It is a plain string replacement. It never parses HTML and never produces markup, so the
// result must only be used as text (JSX text nodes, input values). Never pass it to
// dangerouslySetInnerHTML. React escapes text nodes by itself, so "<script>" stays harmless text.
//
// Everything is decoded in a single pass, so "&amp;lt;" correctly becomes "&lt;" and not "<".

const ENTITIES = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#39;': "'",
};

export const decodeHtmlEntities = (value) => {
    if (typeof value !== 'string') {
        return value;
    }

    return value.replace(/&(?:amp|lt|gt|quot|#x27|#39);/g, (entity) => ENTITIES[entity]);
};
