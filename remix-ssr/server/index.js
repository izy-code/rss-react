import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, useRouteError, isRouteErrorResponse, useSearchParams, Link, useNavigation, Outlet, useNavigate, useLoaderData, Meta, Links, ScrollRestoration, Scripts } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useDispatch, useSelector, Provider } from "react-redux";
import { useState, useEffect, Component, useCallback, createContext, useMemo, useRef, forwardRef, useContext } from "react";
import clsx from "clsx";
import { createEntityAdapter, createSlice, combineReducers, configureStore } from "@reduxjs/toolkit";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error2) {
          reject(error2);
        },
        onError(error2) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error2);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error2) {
          reject(error2);
        },
        onError(error2) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error2);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
var SearchParams = /* @__PURE__ */ ((SearchParams2) => {
  SearchParams2["NAME"] = "name";
  SearchParams2["PAGE"] = "page";
  SearchParams2["DETAILS"] = "details";
  return SearchParams2;
})(SearchParams || {});
var LocalStorageKeys = /* @__PURE__ */ ((LocalStorageKeys2) => {
  LocalStorageKeys2["SEARCH"] = "search-term";
  LocalStorageKeys2["THEME"] = "is-dark-theme";
  return LocalStorageKeys2;
})(LocalStorageKeys || {});
function isCharacterData(data) {
  return Boolean(
    typeof data === "object" && data && "id" in data && typeof data.id === "number" && "name" in data && typeof data.name === "string" && "image" in data && typeof data.image === "string" && "species" in data && typeof data.species === "string" && "status" in data && typeof data.status === "string" && "gender" in data && typeof data.gender === "string" && "url" in data && typeof data.url === "string" && "created" in data && typeof data.created === "string" && "episode" in data && Array.isArray(data.episode) && data.episode.every((item) => typeof item === "string") && "origin" in data && typeof data.origin === "object" && data.origin && "name" in data.origin && typeof data.origin.name === "string" && "url" in data.origin && typeof data.origin.url === "string" && "location" in data && typeof data.location === "object" && data.location && "name" in data.location && typeof data.location.name === "string" && "url" in data.location && typeof data.location.url === "string" && "type" in data && typeof data.type === "string"
  );
}
function isCharacterListInfoData(data) {
  return Boolean(
    typeof data === "object" && data && "count" in data && typeof data.count === "number" && "pages" in data && typeof data.pages === "number" && "next" in data && (typeof data.next === "string" || data.next === null) && "prev" in data && (typeof data.prev === "string" || data.prev === null)
  );
}
function isCharacterListData(data) {
  return Boolean(
    typeof data === "object" && data && "info" in data && isCharacterListInfoData(data.info) && "results" in data && Array.isArray(data.results) && data.results.every((item) => isCharacterData(item))
  );
}
const BASE_URL = "https://rickandmortyapi.com/api/character";
const DEFAULT_PAGE = 1;
const emptyResult = { status: "empty" };
const errorResult = { status: "error" };
const fetchCharacters = async (searchTerm, page2 = DEFAULT_PAGE) => {
  const searchParams = new URLSearchParams({
    [SearchParams.PAGE]: page2.toString(),
    [SearchParams.NAME]: searchTerm
  });
  const url = `${BASE_URL}/?${searchParams.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return emptyResult;
      }
      throw new Error(`Fetching response status is not ok: ${response.status}`);
    }
    const parsedResponse = await response.json();
    if (isCharacterListData(parsedResponse)) {
      return { status: "success", data: parsedResponse };
    }
    return emptyResult;
  } catch (error2) {
    return errorResult;
  }
};
const fetchCharacterById = async (id) => {
  const url = `${BASE_URL}/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return emptyResult;
      }
      throw new Error(`Fetching response status is not ok: ${response.status}`);
    }
    const parsedResponse = await response.json();
    if (isCharacterData(parsedResponse)) {
      return { status: "success", data: parsedResponse };
    }
    return emptyResult;
  } catch (error2) {
    return errorResult;
  }
};
const button$3 = "_button_1xjj5_1";
const styles$e = {
  button: button$3,
  "button--cancel": "_button--cancel_1xjj5_36",
  "button--secondary": "_button--secondary_1xjj5_47",
  "button--tertiary": "_button--tertiary_1xjj5_58"
};
function CustomButton({ children, type = "button", variant = "primary", className, ...rest }) {
  const optionClass = styles$e[`button--${variant}`];
  return /* @__PURE__ */ jsx("button", { className: clsx(styles$e.button, optionClass, className), type, ...rest, children });
}
const main$2 = "_main_a91jt_1";
const container$5 = "_container_a91jt_10";
const header$1 = "_header_a91jt_26";
const text$2 = "_text_a91jt_30";
const errorDesc = "_errorDesc_a91jt_37";
const error = "_error_a91jt_37";
const refreshBtn = "_refreshBtn_a91jt_49";
const styles$d = {
  main: main$2,
  container: container$5,
  header: header$1,
  text: text$2,
  errorDesc,
  error,
  refreshBtn
};
function ErrorPage({ errorBoundaryMessage }) {
  const routeError = useRouteError();
  const [errorMessage, setErrorMessage] = useState(errorBoundaryMessage);
  useEffect(() => {
    if (routeError) {
      if (isRouteErrorResponse(routeError)) {
        setErrorMessage(routeError.statusText);
      } else if (routeError instanceof Error) {
        setErrorMessage(routeError.message);
      } else {
        setErrorMessage(null);
      }
    }
  }, [routeError]);
  const handleRefresh = () => {
    window.location.reload();
  };
  return /* @__PURE__ */ jsx("main", { className: styles$d.main, children: /* @__PURE__ */ jsxs("div", { className: styles$d.container, children: [
    /* @__PURE__ */ jsx("h1", { className: styles$d.header, children: "Oops!" }),
    /* @__PURE__ */ jsx("p", { className: styles$d.text, children: "Sorry, an unexpected error has occurred." }),
    errorMessage && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("p", { className: styles$d.errorDesc, children: "Error message:" }),
      /* @__PURE__ */ jsx("p", { className: styles$d.error, children: errorMessage })
    ] }),
    /* @__PURE__ */ jsx("p", { className: styles$d.text, children: "Please try to refresh the page." }),
    /* @__PURE__ */ jsx(CustomButton, { className: styles$d.refreshBtn, type: "button", onClick: handleRefresh, children: "Refresh the page" })
  ] }) });
}
class ClassErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ""
    };
  }
  static getDerivedStateFromError(error2) {
    return { hasError: true, errorMessage: error2.message || error2.toString() };
  }
  componentDidCatch(error2, info) {
    let errorContent = `Error boundary caught error: ${error2.message}`;
    if (info.componentStack) {
      errorContent += `
Component stack: ${info.componentStack}`;
    }
    console.error(errorContent);
  }
  render() {
    const { hasError, errorMessage } = this.state;
    const { children } = this.props;
    if (hasError) {
      return /* @__PURE__ */ jsx(ErrorPage, { errorBoundaryMessage: errorMessage });
    }
    return children;
  }
}
const LOCAL_STORAGE_KEY = "izy-remix-task";
function getLocalStorage() {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);
  return item ? JSON.parse(item) : {};
}
function useLocalStorage() {
  const getStoredValue = useCallback((key) => getLocalStorage()[key] ?? null, []);
  const setStoredValue = useCallback((key, value) => {
    let localStorageMap = getLocalStorage();
    localStorageMap = { ...localStorageMap, [key]: value };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStorageMap));
  }, []);
  return { getStoredValue, setStoredValue };
}
const container$4 = "_container_18k20_1";
const styles$c = {
  container: container$4
};
const DARK_THEME_CLASS = "dark-theme";
const ThemeContext = createContext({
  isDarkTheme: false,
  toggleTheme: () => {
  }
});
function ThemeProvider({ children }) {
  const { getStoredValue, setStoredValue } = useLocalStorage();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  useEffect(() => {
    setIsDarkTheme(getStoredValue(LocalStorageKeys.THEME) || false);
  }, [getStoredValue]);
  const toggleTheme = useCallback(() => {
    setIsDarkTheme((prevTheme) => {
      setStoredValue(LocalStorageKeys.THEME, !prevTheme);
      return !prevTheme;
    });
  }, [setStoredValue]);
  const contextValue = useMemo(() => ({ isDarkTheme, toggleTheme }), [isDarkTheme, toggleTheme]);
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx("div", { className: clsx(styles$c.container, isDarkTheme ? DARK_THEME_CLASS : ""), children }) });
}
const useAppDispatch = useDispatch.withTypes();
const useAppSelector = useSelector.withTypes();
const favoriteItemsAdapter = createEntityAdapter();
const initialState = favoriteItemsAdapter.getInitialState();
const favoriteItemsSlice = createSlice({
  name: "favoriteItems",
  initialState,
  reducers: {
    selectItem: (state, action) => {
      favoriteItemsAdapter.addOne(state, action);
    },
    unselectItem: (state, action) => {
      favoriteItemsAdapter.removeOne(state, action);
    },
    unselectAll: (state) => {
      favoriteItemsAdapter.removeAll(state);
    }
  }
});
const { selectItem, unselectItem, unselectAll } = favoriteItemsSlice.actions;
const { selectAll: selectAllFavoriteItems, selectById: selectFavoriteItemById } = favoriteItemsAdapter.getSelectors((state) => state.favoriteItems);
const placeholder$1 = "/assets/placeholder-C7h_acNH.svg";
const loaderContainer = "_loaderContainer_19pru_1";
const loader$4 = "_loader_19pru_1";
const l2 = "_l2_19pru_1";
const secondary = "_secondary_19pru_18";
const styles$b = {
  loaderContainer,
  loader: loader$4,
  l2,
  secondary
};
function Loader({
  className,
  secondaryColor = false
}) {
  return /* @__PURE__ */ jsxs("div", { className: clsx(styles$b.loaderContainer, className), children: [
    /* @__PURE__ */ jsx("h2", { className: "visually-hidden", children: "Loading..." }),
    /* @__PURE__ */ jsx("div", { className: clsx(styles$b.loader, secondaryColor && styles$b.secondary) })
  ] });
}
const placeholder = "_placeholder_1omux_1";
const loader$3 = "_loader_1omux_6";
const image = "_image_1omux_12";
const placeholderImage = "_placeholderImage_1omux_20";
const hidden = "_hidden_1omux_24";
const styles$a = {
  placeholder,
  loader: loader$3,
  image,
  placeholderImage,
  hidden
};
function ImageLoader({ imageSrc, imageAlt, secondaryColor = false }) {
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef(null);
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  useEffect(() => {
    const img = imageRef.current;
    if (img && img.complete) {
      handleImageLoad();
    }
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isLoading && /* @__PURE__ */ jsxs("div", { className: styles$a.placeholder, children: [
      /* @__PURE__ */ jsx("img", { className: clsx(styles$a.image, styles$a.placeholderImage), src: placeholder$1, alt: "Placeholder" }),
      /* @__PURE__ */ jsx(Loader, { className: styles$a.loader, secondaryColor })
    ] }),
    /* @__PURE__ */ jsx(
      "img",
      {
        ref: imageRef,
        className: clsx(styles$a.image, isLoading ? styles$a.hidden : ""),
        src: imageSrc,
        alt: imageAlt,
        onLoad: handleImageLoad
      }
    )
  ] });
}
const card$1 = "_card_1dbzq_1";
const title$2 = "_title_1dbzq_6";
const link$1 = "_link_1dbzq_16";
const active = "_active_1dbzq_32";
const content = "_content_1dbzq_49";
const checkbox = "_checkbox_1dbzq_57";
const styles$9 = {
  card: card$1,
  title: title$2,
  link: link$1,
  active,
  content,
  checkbox
};
function Card({ character }) {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const storeItemData = useAppSelector((state) => selectFavoriteItemById(state, character.id));
  const isActive = searchParams.get(SearchParams.DETAILS) === character.id.toString();
  const getLinkPath = () => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set(SearchParams.DETAILS, character.id.toString());
    return `?${updatedSearchParams.toString()}`;
  };
  const handleCheckboxChange = (evt) => {
    if (evt.target.checked) {
      dispatch(selectItem(character));
    } else {
      dispatch(unselectItem(character.id));
    }
  };
  return /* @__PURE__ */ jsx("li", { className: styles$9.card, children: /* @__PURE__ */ jsxs(Link, { className: clsx(isActive ? styles$9.active : "", styles$9.link), to: getLinkPath(), children: [
    /* @__PURE__ */ jsx(ImageLoader, { imageSrc: character.image, imageAlt: character.name }),
    /* @__PURE__ */ jsxs("div", { className: styles$9.content, children: [
      /* @__PURE__ */ jsx("h2", { className: styles$9.title, children: character.name }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: styles$9.checkbox,
          type: "checkbox",
          checked: Boolean(storeItemData),
          onChange: handleCheckboxChange,
          onClick: (evt) => evt.stopPropagation()
        }
      )
    ] })
  ] }) });
}
const getCsvObjectUrl = (data) => {
  if (data.length === 0 || !data[0]) {
    return "";
  }
  const flattenObject = (obj, parentKey = "", result = {}) => {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (key === "episode" && typeof value === "object") {
        const episodeValues = Object.values(value);
        result[newKey] = episodeValues.join(", ");
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        flattenObject(value, newKey, result);
      } else {
        result[newKey] = String(value);
      }
    });
    return result;
  };
  const titlesArray = Object.keys(flattenObject(data[0]));
  const rowsArray = [titlesArray];
  data.forEach((item) => {
    const flattenedItem = flattenObject(item);
    rowsArray.push(Object.values(flattenedItem));
  });
  let csvString = "";
  rowsArray.forEach((row) => {
    csvString += `${row.join(";")}
`;
  });
  const BOM = new Uint8Array([239, 187, 191]);
  const blob = new Blob([BOM, csvString], { type: "text/csv;charset=utf-8" });
  return URL.createObjectURL(blob);
};
const flyout = "_flyout_1liof_1";
const show = "_show_1liof_20";
const counter = "_counter_1liof_24";
const buttonsContainer = "_buttonsContainer_1liof_32";
const link = "_link_1liof_37";
const styles$8 = {
  flyout,
  show,
  counter,
  buttonsContainer,
  link
};
function Flyout() {
  const dispatch = useAppDispatch();
  const favoriteItems = useAppSelector(selectAllFavoriteItems);
  const itemCount = favoriteItems.length;
  const isShown = itemCount > 0;
  const handleUnselectAll = () => {
    dispatch(unselectAll());
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx(styles$8.flyout, isShown && styles$8.show), "aria-hidden": !isShown, children: [
    /* @__PURE__ */ jsxs("p", { className: styles$8.counter, children: [
      "Items selected: ",
      itemCount
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$8.buttonsContainer, children: [
      /* @__PURE__ */ jsx(CustomButton, { variant: "cancel", onClick: handleUnselectAll, children: "Unselect all" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          className: styles$8.link,
          href: isShown ? getCsvObjectUrl(favoriteItems) : "#",
          download: `${itemCount}_characters.csv`,
          children: "Download"
        }
      )
    ] })
  ] });
}
const container$3 = "_container_1wyjh_1";
const button$2 = "_button_1wyjh_10";
const text$1 = "_text_1wyjh_14";
const styles$7 = {
  container: container$3,
  button: button$2,
  text: text$1
};
function Pagination({ pageInfo }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get(SearchParams.PAGE)) || DEFAULT_PAGE;
  const handlePageChange = (pageNumber) => {
    searchParams.set(SearchParams.PAGE, pageNumber.toString());
    setSearchParams(searchParams);
  };
  useEffect(() => {
    if (!Number.isInteger(currentPage) || currentPage < DEFAULT_PAGE) {
      searchParams.set(SearchParams.PAGE, DEFAULT_PAGE.toString());
      setSearchParams(searchParams);
    }
  }, [currentPage, searchParams, setSearchParams]);
  return /* @__PURE__ */ jsxs("div", { className: styles$7.container, children: [
    /* @__PURE__ */ jsx(
      CustomButton,
      {
        className: styles$7.button,
        onClick: () => handlePageChange(currentPage - 1),
        disabled: currentPage === 1,
        children: "Prev"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: styles$7.text, children: `Page ${currentPage} of ${pageInfo.pages}` }),
    /* @__PURE__ */ jsx(
      CustomButton,
      {
        className: styles$7.button,
        onClick: () => handlePageChange(currentPage + 1),
        disabled: currentPage === pageInfo.pages,
        children: "Next"
      }
    )
  ] });
}
const list = "_list_d0rqj_1";
const message$1 = "_message_d0rqj_12";
const styles$6 = {
  list,
  message: message$1
};
const CardList = forwardRef(function CardList2({ characters }, listRef) {
  let content2 = null;
  if (characters.status === "error") {
    content2 = /* @__PURE__ */ jsx("div", { className: styles$6.message, children: "Characters list fetching problem" });
  } else if (characters.status === "empty" || !characters.data) {
    content2 = /* @__PURE__ */ jsx("div", { className: styles$6.message, children: "No characters found" });
  } else {
    content2 = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Pagination, { pageInfo: characters.data.info }),
      /* @__PURE__ */ jsx("ul", { className: styles$6.list, ref: listRef, children: characters.data.results.map((character) => /* @__PURE__ */ jsx(Card, { character }, character.id)) }),
      /* @__PURE__ */ jsx(Flyout, {})
    ] });
  }
  return content2;
});
function ThrowErrorButton() {
  const [shouldThrowError, setShouldThrowError] = useState(false);
  const handleClick = () => {
    setShouldThrowError(true);
  };
  if (shouldThrowError) {
    throw new Error("Error throwing button was clicked");
  }
  return /* @__PURE__ */ jsx(CustomButton, { type: "button", variant: "cancel", onClick: handleClick, children: "Throw error" });
}
const header = "_header_ni8wd_1";
const container$2 = "_container_ni8wd_8";
const styles$5 = {
  header,
  container: container$2
};
function Header({ children }) {
  return /* @__PURE__ */ jsx("header", { className: styles$5.header, children: /* @__PURE__ */ jsxs("div", { className: styles$5.container, children: [
    /* @__PURE__ */ jsx("h1", { className: "visually-hidden", children: "Rick and Morty characters" }),
    children
  ] }) });
}
const form = "_form_gtgis_1";
const input = "_input_gtgis_6";
const styles$4 = {
  form,
  input
};
function SearchForm() {
  const { getStoredValue, setStoredValue } = useLocalStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef(null);
  const navigation = useNavigation();
  const isDisabled = navigation.state === "loading";
  const updateSearchTerm = useCallback(
    (newTerm) => {
      setStoredValue(LocalStorageKeys.SEARCH, newTerm);
      setSearchTerm(newTerm);
    },
    [setStoredValue]
  );
  useEffect(() => {
    setSearchTerm(getStoredValue(LocalStorageKeys.SEARCH) || "");
  }, [getStoredValue]);
  useEffect(() => {
    const nameParam = searchParams.get(SearchParams.NAME) ?? "";
    if (searchTerm && searchParams.size === 0) {
      inputRef.current.value = searchTerm;
      searchParams.set(SearchParams.NAME, searchTerm);
      setSearchParams(searchParams);
    } else if (searchTerm !== nameParam && searchParams.size > 0) {
      updateSearchTerm(nameParam);
      inputRef.current.value = nameParam;
    }
  }, [searchTerm, searchParams, setSearchParams, updateSearchTerm]);
  useEffect(() => {
    var _a;
    if (!isDisabled) {
      (_a = inputRef.current) == null ? void 0 : _a.focus();
    }
  }, [isDisabled]);
  function handleSubmit(event) {
    var _a;
    event.preventDefault();
    const inputSearchTerm = ((_a = inputRef.current) == null ? void 0 : _a.value.trim()) ?? "";
    updateSearchTerm(inputSearchTerm);
    searchParams.set(SearchParams.PAGE, DEFAULT_PAGE.toString());
    if (inputSearchTerm) {
      searchParams.set(SearchParams.NAME, inputSearchTerm);
    } else {
      searchParams.delete(SearchParams.NAME);
    }
    setSearchParams(searchParams);
  }
  return /* @__PURE__ */ jsxs("form", { className: styles$4.form, onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        ref: inputRef,
        className: styles$4.input,
        type: "search",
        placeholder: "Enter character name…",
        defaultValue: searchTerm,
        disabled: isDisabled,
        autoComplete: "off"
      }
    ),
    /* @__PURE__ */ jsx(CustomButton, { type: "submit", variant: "secondary", disabled: isDisabled, children: "Search" })
  ] });
}
const button$1 = "_button_i7s2h_1";
const dark = "_dark_i7s2h_19";
const styles$3 = {
  button: button$1,
  dark
};
function ThemeButton() {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  return /* @__PURE__ */ jsx(
    CustomButton,
    {
      className: clsx(styles$3.button, styles$3[isDarkTheme ? "dark" : ""]),
      variant: "secondary",
      onClick: toggleTheme,
      children: /* @__PURE__ */ jsx("span", { className: "visually-hidden", children: isDarkTheme ? "Switch to light theme" : "Switch to dark theme" })
    }
  );
}
const page = "_page_v0r2u_1";
const main$1 = "_main_v0r2u_10";
const listSection = "_listSection_v0r2u_24";
const detailsSection = "_detailsSection_v0r2u_41";
const styles$2 = {
  page,
  main: main$1,
  listSection,
  detailsSection
};
function MainPage({ characters }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const mainRef = useRef(null);
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const searchTerm = searchParams.get(SearchParams.NAME) || "";
  const page2 = (Number(searchParams.get(SearchParams.PAGE)) || DEFAULT_PAGE).toString();
  const detailsParam = searchParams.get(SearchParams.DETAILS);
  let isCardListLoading = false;
  if (navigation.location) {
    const futureSearchParams = new URLSearchParams(navigation.location.search);
    const pageParam = futureSearchParams.get(SearchParams.PAGE);
    const searchTermParam = futureSearchParams.get(SearchParams.NAME) || "";
    isCardListLoading = page2 !== pageParam || searchTermParam !== searchTerm;
  }
  const handleMainClick = (evt) => {
    const isTargetRef = evt.target === mainRef.current || evt.target === sectionRef.current || evt.target === listRef.current;
    if (detailsParam && isTargetRef) {
      searchParams.delete(SearchParams.DETAILS);
      setSearchParams(searchParams);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: styles$2.page, children: [
    /* @__PURE__ */ jsxs(Header, { children: [
      /* @__PURE__ */ jsx(SearchForm, {}),
      /* @__PURE__ */ jsx(ThrowErrorButton, {}),
      /* @__PURE__ */ jsx(ThemeButton, {})
    ] }),
    /* @__PURE__ */ jsxs("main", { className: styles$2.main, onClick: handleMainClick, ref: mainRef, children: [
      /* @__PURE__ */ jsx("section", { className: styles$2.listSection, ref: sectionRef, children: isCardListLoading ? /* @__PURE__ */ jsx(Loader, {}) : /* @__PURE__ */ jsx(CardList, { characters, ref: listRef }) }),
      detailsParam && /* @__PURE__ */ jsx("section", { className: styles$2.detailsSection, children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
}
const main = "_main_rgx4l_1";
const container$1 = "_container_rgx4l_10";
const title$1 = "_title_rgx4l_24";
const text = "_text_rgx4l_35";
const buttons = "_buttons_rgx4l_39";
const styles$1 = {
  main,
  container: container$1,
  title: title$1,
  text,
  buttons
};
function Page404() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx("main", { className: styles$1.main, children: /* @__PURE__ */ jsxs("div", { className: styles$1.container, children: [
    /* @__PURE__ */ jsx("h1", { className: styles$1.title, children: "404" }),
    /* @__PURE__ */ jsx("p", { className: styles$1.text, children: "The page you requested was not found." }),
    /* @__PURE__ */ jsxs("div", { className: styles$1.buttons, children: [
      /* @__PURE__ */ jsx(CustomButton, { variant: "tertiary", onClick: () => navigate(-1), children: "Previous page" }),
      /* @__PURE__ */ jsx(
        CustomButton,
        {
          variant: "tertiary",
          onClick: () => {
            const hostUrl = `${window.location.protocol}//${window.location.host}`;
            window.location.href = hostUrl;
          },
          children: "Last stored search"
        }
      )
    ] })
  ] }) });
}
const rootReducer = combineReducers({
  favoriteItems: favoriteItemsSlice.reducer
});
function setupStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  });
}
const store = setupStore();
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx("link", { rel: "icon", type: "image/svg+xml", href: "/rick-favicon.svg" }),
      /* @__PURE__ */ jsx("title", { children: "Rick and Morty characters" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "root", children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const loader$2 = async ({ request }) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get(SearchParams.NAME) || "";
  const page2 = Number(url.searchParams.get(SearchParams.PAGE)) || DEFAULT_PAGE;
  const characters = await fetchCharacters(searchTerm, page2);
  return characters;
};
function App() {
  const characters = useLoaderData();
  return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(ClassErrorBoundary, { children: /* @__PURE__ */ jsx(Provider, { store, children: /* @__PURE__ */ jsx(MainPage, { characters }) }) }) });
}
function ErrorBoundary() {
  const error2 = useRouteError();
  if (isRouteErrorResponse(error2)) {
    return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(Page404, {}) });
  }
  console.error("Error boundary caught error: ", error2);
  return /* @__PURE__ */ jsx(ErrorPage, { errorBoundaryMessage: null });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: App,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const container = "_container_1xfue_1";
const loader$1 = "_loader_1xfue_14";
const card = "_card_1xfue_24";
const button = "_button_1xfue_44";
const title = "_title_1xfue_56";
const descriptionList = "_descriptionList_1xfue_63";
const descriptionItem = "_descriptionItem_1xfue_72";
const descriptionTerm = "_descriptionTerm_1xfue_77";
const descriptionDetail = "_descriptionDetail_1xfue_83";
const message = "_message_1xfue_88";
const styles = {
  container,
  loader: loader$1,
  card,
  button,
  title,
  descriptionList,
  descriptionItem,
  descriptionTerm,
  descriptionDetail,
  message
};
function Details({ character }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const details = searchParams.get(SearchParams.DETAILS) || "no-details";
  const handleButtonClick = () => {
    searchParams.delete(SearchParams.DETAILS);
    setSearchParams(searchParams);
  };
  if (!character) {
    return /* @__PURE__ */ jsx(Loader, { secondaryColor: true, className: styles.loader });
  }
  if (character.status === "error" || !Number.isInteger(+details)) {
    return /* @__PURE__ */ jsx("div", { className: styles.message, children: "Character details fetching problem" });
  }
  if (character.status === "empty" || !character.data) {
    return /* @__PURE__ */ jsx("div", { className: styles.message, children: "No character found" });
  }
  const characterData = character.data;
  const characterProps = {
    Species: characterData.species,
    Status: characterData.status,
    Gender: characterData.gender,
    "Episodes count": characterData.episode.length,
    Origin: characterData.origin.name,
    Location: characterData.location.name
  };
  return /* @__PURE__ */ jsxs("div", { className: styles.container, children: [
    /* @__PURE__ */ jsxs("div", { className: styles.card, children: [
      /* @__PURE__ */ jsx(ImageLoader, { imageSrc: characterData.image, imageAlt: characterData.name, secondaryColor: true }),
      /* @__PURE__ */ jsx("h2", { className: styles.title, children: characterData.name }),
      /* @__PURE__ */ jsx("dl", { className: styles.descriptionList, children: Object.entries(characterProps).map(([param, value]) => /* @__PURE__ */ jsxs("div", { className: styles.descriptionItem, children: [
        /* @__PURE__ */ jsx("dt", { className: styles.descriptionTerm, children: `${param}: ` }),
        /* @__PURE__ */ jsx("dd", { className: styles.descriptionDetail, children: value })
      ] }, param)) })
    ] }),
    /* @__PURE__ */ jsx(CustomButton, { variant: "cancel", className: styles.button, onClick: handleButtonClick, children: "Close details" })
  ] });
}
const loader = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get(SearchParams.DETAILS) || "";
  const character = await fetchCharacterById(id);
  return character;
};
function Index() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const character = useLoaderData();
  const detailsParam = searchParams.get(SearchParams.DETAILS);
  const haveDetailsChanged = navigation.location && new URLSearchParams(navigation.location.search).get(SearchParams.DETAILS) !== detailsParam;
  return haveDetailsChanged ? /* @__PURE__ */ jsx(Loader, {}) : /* @__PURE__ */ jsx(Details, { character });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-D6ehgpWV.js", "imports": ["/assets/components-BA9AXnnu.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-B8fYjP2i.js", "imports": ["/assets/components-BA9AXnnu.js", "/assets/ImageLoader-BrDaqkfh.js"], "css": ["/assets/ImageLoader-BSO4EFbm.css", "/assets/root-CK5tRWCN.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BSDGTwSs.js", "imports": ["/assets/components-BA9AXnnu.js", "/assets/ImageLoader-BrDaqkfh.js"], "css": ["/assets/ImageLoader-BSO4EFbm.css", "/assets/_index-BsB-uBEf.css"] } }, "url": "/assets/manifest-ecb4a278.js", "version": "ecb4a278" };
const mode = "production";
const assetsBuildDirectory = "dist\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "unstable_singleFetch": false, "unstable_lazyRouteDiscovery": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
