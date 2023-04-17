import React from "react";
import renderer, { act, create } from "react-test-renderer";
import Autocomplete from "src/components/Autocomplete/Autocomplete";
import { describe, expect, vi } from "vitest";

function toJson(component: renderer.ReactTestRenderer) {
    const result = component.toJSON();
    expect(result).toBeDefined();
    expect(result).not.toBeInstanceOf(Array);
    return result as renderer.ReactTestRendererJSON;
}

describe("Autocomplete", () => {
    test("Renders correctly empty", () => {
        const component = renderer.create(
            <Autocomplete onChange={async (query) => {
                return [];
            }}></Autocomplete>,
        );

        let tree = toJson(component);
        expect(tree).toMatchSnapshot();
    });

    test("Renders correctly with items", async () => {
        vi.useFakeTimers();

        async function loadData() {
            return [{ id: 0, name: "Test" }, { id: 1, name: "Testing" }];
        }

        const loadDataMock = vi.fn().mockImplementation(loadData);

        let component = create(
            <Autocomplete onChange={loadDataMock}></Autocomplete>,
        );

        const inputEvent = { target: { value: "Test" } };

        await act(async () => {
            component.root.findByType("input").props.onChange(inputEvent);
            await vi.advanceTimersByTimeAsync(500);
        });

        vi.runAllTimers();

        expect(loadDataMock).toHaveBeenCalledOnce();

        expect(component.root.findByProps({ className: "eb__autocomplete-items" }).children.length).toEqual(2);

        const items = component.root.findAllByProps({ className: "eb__autocomplete-item" });

        expect(items[0].findByProps({ className: "eb__autocomplete-highlighted_text", children: "Test" })).not.toBeUndefined();

        expect(items[1].findByProps({ className: "eb__autocomplete-highlighted_text", children: "Test" })).not.toBeUndefined();
        expect(items[1].findByProps({ className: "", children: "ing" })).not.toBeUndefined();

        let tree = toJson(component!);

        expect(tree).toMatchSnapshot();
    });

    test("Renders correctly with no items", async () => {
        vi.useFakeTimers();

        async function loadData() {
            return [];
        }

        const loadDataMock = vi.fn().mockImplementation(loadData);

        let component = create(
            <Autocomplete onChange={loadDataMock}></Autocomplete>,
        );

        const inputEvent = { target: { value: "Test" } };

        await act(async () => {
            component.root.findByType("input").props.onChange(inputEvent);
            await vi.advanceTimersByTimeAsync(500);
        });

        vi.runAllTimers();

        expect(loadDataMock).toHaveBeenCalledOnce();

        expect(component.root.findByProps({ className: "eb__autocomplete-no-items-text" }).children).includes("No items");

        let tree = toJson(component!);

        expect(tree).toMatchSnapshot();
    });

    test("Renders correctly while loading", async () => {
        vi.useFakeTimers();

        async function loadData() {
            await new Promise((resolve) => setTimeout(resolve, 500));
            throw new Error("Something went wrong");
        }

        const loadDataMock = vi.fn().mockImplementation(loadData);

        let component = create(
            <Autocomplete onChange={loadDataMock}></Autocomplete>,
        );

        const inputEvent = { target: { value: "Test" } };

        await act(async () => {
            component.root.findByType("input").props.onChange(inputEvent);
            await vi.advanceTimersByTimeAsync(500);
        });

        vi.runAllTimers();

        expect(loadDataMock).toHaveBeenCalledOnce();

        expect(component.root.findByProps({ className: "eb__loading-text" }).children).includes("Loading...");

        let tree = toJson(component!);

        expect(tree).toMatchSnapshot();
    });


    test("Renders correctly with error promise", async () => {
        vi.useFakeTimers();

        async function loadData() {
            throw new Error("Something went wrong");
        }

        const loadDataMock = vi.fn().mockImplementation(loadData);

        let component = create(
            <Autocomplete onChange={loadDataMock}></Autocomplete>,
        );

        const inputEvent = { target: { value: "Test" } };

        await act(async () => {
            component.root.findByType("input").props.onChange(inputEvent);
            await vi.advanceTimersByTimeAsync(500);
        });

        vi.runAllTimers();

        expect(loadDataMock).toHaveBeenCalledOnce();

        expect(component.root.findByProps({ className: "eb__autocomplete-error" }).children).includes("We couldn't reach the search service. Please try again");

        let tree = toJson(component!);

        expect(tree).toMatchSnapshot();
    });

    test("Renders correctly with custom onError", async () => {
        vi.useFakeTimers();

        async function loadData() {
            throw new Error("Something went wrong");
        }

        const loadDataMock = vi.fn().mockImplementation(loadData);

        let component = create(
            <Autocomplete onError={() => "A custom error"} onChange={loadDataMock}></Autocomplete>,
        );

        const inputEvent = { target: { value: "Test" } };

        await act(async () => {
            component.root.findByType("input").props.onChange(inputEvent);
            await vi.advanceTimersByTimeAsync(500);
        });

        vi.runAllTimers();

        expect(loadDataMock).toHaveBeenCalledOnce();

        expect(component.root.findByProps({ className: "eb__autocomplete-error" }).children).includes("A custom error");

        let tree = toJson(component!);

        expect(tree).toMatchSnapshot();
    });

    test("Renders correctly with custom className and placeholder", async () => {
        async function loadData() {
            return [];
        }

        let component = create(
            <Autocomplete className="custom-class"
                          placeholder="Custom placeholder" onChange={loadData}></Autocomplete>,
        );

        expect(component.root.findByType("div").props.className).includes("custom-class");
        expect(component.root.findByType("input").props.placeholder).toEqual("Custom placeholder");

        let tree = toJson(component!);

        expect(tree).toMatchSnapshot();
    });
});
