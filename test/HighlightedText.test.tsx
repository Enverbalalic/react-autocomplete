import React from "react";
import { describe, test, expect } from "vitest";
import { create } from "react-test-renderer";
import HighlightedText from "src/components/Autocomplete/HighlightedText";

describe("HghlightedText component", () => {
    test("Renders correctly with full highlight match", () => {

        let component = create(
            <HighlightedText text={"Sample Text"}
                             highlighted={"Sample Text"} />,
        );

        expect(component.root.findByProps({ className: "eb__autocomplete-highlighted_text" }).children).includes("Sample Text");
    });

    test("Renders correctly with partial highlight match", () => {
        let component = create(
            <HighlightedText text={"Sample Text"}
                             highlighted={"Sample"} />,
        );

        expect(component.root.findByProps({ className: "eb__autocomplete-highlighted_text" }).children).includes("Sample");
        expect(component.root.findByProps({ className: "" }).children).includes(" Text");

        component = create(
            <HighlightedText text={"Sample Text"}
                             highlighted={"Text"} />,
        );

        expect(component.root.findByProps({ className: "eb__autocomplete-highlighted_text" }).children).includes("Text");
        expect(component.root.findByProps({ className: "" }).children).includes("Sample ");

        component = create(
            <HighlightedText text={"Sample Middle Text"}
                             highlighted={"Middle"} />,
        );

        let unhighlighted = component.root.findAllByProps({ className: "" });

        expect(component.root.findByProps({ className: "eb__autocomplete-highlighted_text" }).children).includes("Middle");
        expect(unhighlighted[0].children).includes("Sample ");
        expect(unhighlighted[1].children).includes(" Text");
    });


    test("Renders correctly with partial text and highlight not being matching case", () => {
        let component = create(
            <HighlightedText text={"Sample Text"}
                             highlighted={"sample"} />,
        );

        expect(component.root.findByProps({ className: "eb__autocomplete-highlighted_text" }).children).includes("Sample");
        expect(component.root.findByProps({ className: "" }).children).includes(" Text");


        component = create(
            <HighlightedText text={"Sample Middle Text"}
                             highlighted={"middle"} />,
        );

        let unhighlighted = component.root.findAllByProps({ className: "" });

        expect(component.root.findByProps({ className: "eb__autocomplete-highlighted_text" }).children).includes("Middle");
        expect(unhighlighted[0].children).includes("Sample ");
        expect(unhighlighted[1].children).includes(" Text");
    });

    test("Renders correctly with highlighted not being a full sentence match", () => {
        let component = create(
            <HighlightedText text={"Sample Text"}
                             highlighted={"ple"} />,
        );

        let unhighlighted = component.root.findAllByProps({ className: "" });

        expect(component.root.findByProps({ className: "eb__autocomplete-highlighted_text" }).children).includes("ple");
        expect(unhighlighted[0].children).includes("Sam");
        expect(unhighlighted[1].children).includes(" Text");

        component = create(
            <HighlightedText text={"Sample Middle Text"}
                             highlighted={"mid"} />,
        );

        unhighlighted = component.root.findAllByProps({ className: "" });

        expect(component.root.findByProps({ className: "eb__autocomplete-highlighted_text" }).children).includes("Mid");
        expect(unhighlighted[0].children).includes("Sample ");
        expect(unhighlighted[1].children).includes("dle Text");
    });
});
