const Restaurants = () => {
    const getRestaurants = () => {
        return [{
                desc: "Chatbot based on OPEN AI,FOrmerly IVORY ",
                id: 1,
                image: "https://siddh-kivtechs.github.io/image/artificial-intelligence-7965537.jpg",
                title: "IVAN",
                url: "https://ivory.kivtechs.cloud/"
            }, {
                desc: "OLIVIY-A",
                id: 2,
                image: "https://siddh-kivtechs.github.io/image//ai-generated-7770511.jpg",
                title: "OLIVE",
            url:"https://olive.kivtechs.cloud/"
            }, {
                desc: "'Za LLM",
                id: 3,
                image: "https://siddh-kivtechs.github.io/image//artificial-intelligence-7965009.jpg",
                title: "Our Take on LLM based on NLP with CHATGPT as teacher",
            url:""
            }, {
                desc: "VIJU",
                id: 4,
                image: "https://siddh-kivtechs.github.io/image/ai-generated-7963061.jpg",
                title: "Virtual Assistant",
            url:""
            }].map((restaurant) => {
            const styles = {
                backgroundImage: `url(${restaurant.image})`
            };
  return (React.createElement("a", { key: restaurant.id, href: restaurant.url, className: "restaurant-card background-image", style: styles },
React.createElement("div", { className: "restaurant-card-content" },
React.createElement("div", { className: "restaurant-card-content-items" },
React.createElement("span", { className: "restaurant-card-title" }, restaurant.title),
React.createElement("span", { className: "restaurant-card-desc" }, restaurant.desc)))));
});
};
return (React.createElement(MenuSection, { icon: "fas fa-robot", id: "restaurants-section", title: "CHATBOT MENU" }, getRestaurants()));
};
