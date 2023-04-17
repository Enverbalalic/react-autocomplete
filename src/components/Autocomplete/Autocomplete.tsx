import { useCallback, useEffect, useState } from "react";

import "./autocomplete.css";
import HighlightedText from "src/components/Autocomplete/HighlightedText";
import useDebounce from "src/hooks/useDebounce";

export interface AutocompleteItem {
    id: number | string,
    name: number | string,
}

export interface AutocompleteProps<T extends AutocompleteItem> {
    /// Provided className will be appended to the root element of the component.
    className?: string,
    /// Will be called every time text in the input changes
    onChange: (search: string) => Promise<T[]>;
    /// Search input field placeholder
    placeholder?: string,
    /// Called when an item is clicked
    onSelect?: (item: T) => void,
    /// When a load error happens, this function gets called with the rejection reason, return a string to be displayed as the error
    onError?: (reason: any) => string,
    /// Custom text to show when there's no data
    noItemsText?: string,
    /// Custom text to show while we're loading data
    loadingText?: string,
    /// Custom delay between end of input and a onChange dispatch
    debounceDelay?: number,
}

export function Autocomplete<T extends AutocompleteItem>({
                                                             onSelect,
                                                             className,
                                                             placeholder = "Search...",
                                                             onChange,
                                                             onError,
                                                             debounceDelay = 500,
                                                             noItemsText = "No items",
                                                             loadingText = "Loading...",
                                                         }: AutocompleteProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [text, setText] = useState("");
    const [isNoItems, setIsNoItems] = useState(false);
    const debouncedText = useDebounce(text, debounceDelay);

    useEffect(() => {
        if (debouncedText.length === 0) {
            setIsNoItems(false);
            setData([]);
            return;
        }

        setIsNoItems(false);
        setLoading(true);

        onChange(debouncedText).then(r => {
            setError(null);
            setData(r);

            if (r.length === 0) {
                setIsNoItems(true);
            }
        }).catch((error) => {
            setError(onError ? onError(error) : "We couldn't reach the search service. Please try again");
            setData([]);
        }).finally(() => {
            setLoading(false);
        });
    }, [debouncedText]);

    const onSelectItem = useCallback((item: T) => {
        if (!onSelect) return;

        setText("");
        setIsNoItems(false);
        setData([]);
        onSelect(item);
    }, [onSelect]);

    return (
        <div className={`eb-auto-complete${className ? ` ${className}` : ""}`}>
            <div className="eb__autocomplete-input-container">
                <input className="eb__autocomplete-search-input"
                       placeholder={placeholder}
                       value={text}
                       onChange={e => setText(e.target.value)}/>
                {loading && <div className="eb__loading-text">{loadingText}</div>}
                {error && <div className="eb__autocomplete-error">{error}</div>}
                {isNoItems && <div className="eb__autocomplete-no-items-text">{noItemsText}</div>}
            </div>

            {data.length > 0 && (
                <div className="eb__autocomplete-items-dropdown">
                    <div className="eb__autocomplete-items">
                        {data.map(item => {
                            return (
                                <div key={item.id}
                                     onClick={() => onSelectItem(item)}
                                     className="eb__autocomplete-item">
                                    <HighlightedText highlighted={debouncedText} text={item.name.toString()}/>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Autocomplete;
