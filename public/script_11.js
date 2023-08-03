const Weather = () => {
    const getDays = () => {
        return [{
                id: 1,
                name: "Mon",
                temperature: N.rand(latitude,longitude),
                weather: WeatherType.Sunny
            }, {
                id: 2,
                name: "Tues",
                temperature: N.rand(latitude,longitude),
                weather: WeatherType.Sunny
            }, {
                id: 3,
                name: "Wed",
                temperature: N.rand(latitude,longitude),
                weather: WeatherType.Cloudy
            }, {
                id: 4,
                name: "Thurs",
                temperature: N.rand(latitude,longitude),
                weather: WeatherType.Rainy
            }, {
                id: 5,
                name: "Fri",
                temperature: N.rand(latitude,longitude),
                weather: WeatherType.Stormy
            }, {
                id: 6,
                name: "Sat",
                temperature: N.rand(latitude,longitude),
                weather: WeatherType.Sunny
            }, {
                id: 7,
                name: "Sun",
                temperature: N.rand(latitude,longitude),
                weather: WeatherType.Cloudy
            }].map((day) => {
            const getIcon = () => {
                switch (day.weather) {
                    case WeatherType.Cloudy:
                        return "fa-duotone fa-clouds";
                    case WeatherType.Rainy:
                        return "fa-duotone fa-cloud-drizzle";
                    case WeatherType.Stormy:
                        return "fa-duotone fa-cloud-bolt";
                    case WeatherType.Sunny:
                        return "fa-duotone fa-sun";
                }
            };
            return (React.createElement("div", { key: day.id, className: "day-card" },
                React.createElement("div", { className: "day-card-content" },
                    React.createElement("span", { className: "day-weather-temperature" },
                        day.temperature,
                        React.createElement("span", { className: "day-weather-temperature-unit" }, "\u00B0C")),
                    React.createElement("i", { className: classNames("day-weather-icon", getIcon(), day.weather.toLowerCase()) }),
                    React.createElement("span", { className: "day-name" }, day.name))));
        });
    };
    return (React.createElement(MenuSection, { icon: "fa-solid fa-sun", id: "weather-section", scrollable: true, title: "How's it look out there?" }, getDays()));
};