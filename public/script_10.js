const MenuSection = (props) => {
    const getContent = () => {
        if (props.scrollable) {
            return (React.createElement(ScrollableComponent, { className: "menu-section-content" }, props.children));
        }
        return (React.createElement("div", { className: "menu-section-content" }, props.children));
    };
    return (React.createElement("div", { id: props.id, className: "menu-section" },
        React.createElement("div", { className: "menu-section-title" },
            React.createElement("i", { className: props.icon }),
            React.createElement("span", { className: "menu-section-title-text" }, props.title)),
        getContent()));
};
const QuickNav = () => {
    const getItems = () => {
        return [{
                id: 1,
                label: "CHATBOT",
                url:"https://siddh-kivtechs.github.io/menu_4/"
            }, {
                id: 2,
                label: "APP 2",
                url:"https://siddh-kivtechs.github.io/menu_1/"
            }, {
                id: 3,
                label: "APP 3",
                url:"https://siddh-kivtechs.github.io/menu_2/"
            }, {
                id: 4,
                label: "APP 4" ,
                url:"https://siddh-kivtechs.github.io/menu_3/"
            }].map((item) => {
            return (React.createElement("div", { key: item.id, className: "quick-nav-item clear-button" },
               // React.createElement("span", { className: "quick-nav-item-label" }, item.label)));
                React.createElement("a", { href: item.url, className: "quick-nav-item-label" }, item.label)));
        });
    };
    return (React.createElement(ScrollableComponent, { id: "quick-nav" }, getItems()));
};

