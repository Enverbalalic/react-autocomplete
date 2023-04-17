import "./App.css";
import Autocomplete from "src/components/Autocomplete/Autocomplete";
import Api from "src/api/api";

function App() {
    return (
        <div className="App">
            <div className="autocomplete-container">
                <Autocomplete onSelect={(item) => console.log("You selected", item)}
                              placeholder="Search Shows.."
                              onChange={Api.searchShows}/>
            </div>
        </div>
    );
}

export default App;
