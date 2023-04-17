import { useMemo } from "react";

export interface HighlightedTextProps {
    text: string,
    highlighted: string,
}

export interface SplitTextChunk {
    text: string,
    highlighted: boolean,
}

function splitText(fullText: string, highlighted: string): SplitTextChunk[] {
    if (highlighted.length === 0) {
        return [{
            text: fullText,
            highlighted: false,
        }];
    }

    let text = fullText;

    let chunks: SplitTextChunk[] = [];

    let highlightedIndex = text.toLowerCase().indexOf(highlighted.toLowerCase());

    while (highlightedIndex !== -1) {
        const highlightedEndIndex = highlightedIndex + highlighted.length;

        let before = text.substring(0, highlightedIndex);
        if (before.length > 0) {
            chunks.push({
                text: before,
                highlighted: false,
            });
        }

        let target = text.substring(highlightedIndex, highlightedEndIndex);
        let after = text.substring(highlightedEndIndex);

        chunks.push({
            text: target,
            highlighted: true,
        });

        text = after;
        highlightedIndex = text.toLowerCase().indexOf(highlighted.toLowerCase());

        if (highlightedIndex === -1 && after.length > 0) {
            chunks.push({
                text: after,
                highlighted: false,
            });
        }
    }

    return chunks;
}

function HighlightedText({ text, highlighted }: HighlightedTextProps) {
    const textChunks = useMemo(() => splitText(text, highlighted), [text, highlighted]);

    return (
        <>
            {textChunks.map((chunk, index) => {
                return (
                    <span key={index}
                          className={chunk.highlighted ? "eb__autocomplete-highlighted_text" : ""}>
                        {chunk.text}
                    </span>
                );
            })}
        </>
    );
}

export default HighlightedText;
