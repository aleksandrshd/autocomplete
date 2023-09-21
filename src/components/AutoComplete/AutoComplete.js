import "./AutoComplete.css";
import {useEffect, useState} from "react";
import {getSearchResults} from "../../utils/utils";


export default function AutoComplete () {

    const [searchTerm, updateSearchTerm] = useState('');
    const [searchResults, updateSearchResults] = useState([]);
    const [filteredResults, updateFilteredResults] = useState([]);
    const [displayResults, updateDisplayResults] = useState(false);
    const [focusIndex, updateFocusIndex] = useState(-1);

    useEffect(() => {
        const setSearchResults = async () => {
            const searchResultsResponse = await getSearchResults();
            console.log(searchResultsResponse);
            updateSearchResults(searchResultsResponse);
        }
        setSearchResults();
    });

    const updateSearch = e => {
        updateSearchTerm(e.target.value);
        updateFilteredResults(searchResults.filter(result => result.name.match(new RegExp(e.target.value, 'gi'))));
    }

    const hideAutoSuggest = e => {
        e.persist(); // написано, что более не используется, загружена ли страница из кэша

        if (e.relatedTarget && e.relatedTarget.className === "search__link") {
            return;
        }

        updateDisplayResults(true);
        updateFocusIndex(-1);
    }

    const showAutoSuggest = () => updateDisplayResults(false);

    const SearchResults = () => {
        const Message = ({ text }) => (
            <div className="message">
                <h2 className="message__header">{text}</h2>
                <hr />
            </div>
        );

        if (!displayResults) {
            return null;
        }

        if (!searchResults.length) {
            return <Message text="Загрузка результатов поиска" />
        }

        if (!searchTerm) {
            return <Message text="Введите поисковый запрос" />
        }

        if (!filteredResults.length) {
            return <Message text="По вашему запросу ничего не найдено" />
        }

        return (
            <ul className="search__list">
                {filteredResults.map((item, index) => (
                    <li className="search__list-item" key={index}>
                        <Message text={item.name} />
                    </li>
                ))}
            </ul>
        );

    };

    return (
        <section className="search">
            <h1 className="search__header">Результаты {searchTerm.length ? `поиска по запросу ${searchTerm}` : null}</h1>
            <input
                type="text"
                placeholder="Поиск ледоколов"
                onChange={updateSearch}
                onBlur={hideAutoSuggest}
                onFocus={showAutoSuggest}/>
            <ul className="search__suggestions">
                {(!displayResults && searchTerm) && <li key="-1" className={focusIndex === -1 ? 'active' : null}>
                    {`Поиск по ${searchTerm}`}
                </li>}
                {!displayResults && filteredResults.map((item, index) => (
                    <li key={index} className={focusIndex === index ? 'active' : null}>
                        <a href={item.link} target="_blank" className="search__link">
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
            <SearchResults />
        </section>
    );
}