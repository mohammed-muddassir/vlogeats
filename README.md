<div align="center">

# 🍔 VlogEats Aggregator
### *Discover Viral Food Spots Approved by Top Vloggers*

![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Vloggers](https://img.shields.io/badge/Vloggers-Verified-orange?style=flat-square)

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-roadmap">Roadmap</a>
</p>
</div>

---

## 📖 About The Project

**VlogEats** is a curated food review aggregator that maps out the most viral food spots in **Tamil Nadu**. Instead of relying on random reviews, we focus on trusted recommendations from top local food vloggers.

Currently covering: **Madurai** & **Coimbatore**.

## ✨ Features

- 🗺️ **Interactive Map**: Visualize food spots with custom markers and popups.
- 🔍 **Smart Search**: Filter by restaurant name, specific dishes (e.g., "Bun Parotta"), or cuisine.
- 🕒 **Open Now Filter**: Real-time check to see if a restaurant is currently open.
- 🏙️ **Multi-City Support**: Seamlessly switch between Madurai and Coimbatore.
- 📱 **Responsive Design**: precise layout for mobile and desktop foodies.
- ⚡ **Dynamic Data**: Fast loading with optimized JSON data fetching.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| **Maps** | [Leaflet.js](https://leafletjs.com/) + OpenStreetMap |
| **Testing** | [Jest](https://jestjs.io/) |
| **Icons** | FontAwesome 6 |

## 🚀 Getting Started

To run this project locally, you'll need a simple local server to handle data fetching (CORS).

### Prerequisites
-   Node.js (optional, but recommended for `http-server`)
-   OR Python (pre-installed on macOS/Linux)

### Installation

1.  **Clone the repo**
    ```bash
    git clone https://github.com/mohammed-muddassir/vlogeats.git
    cd vlogeats
    ```

2.  **Run a Local Server**
    
    *Using Python (Recommended)*
    ```bash
    python3 -m http.server
    ```
    
    *OR Using Node.js*
    ```bash
    npx http-server .
    ```

3.  **Open in Browser**
    Visit `http://localhost:8000` (or the port shown in your terminal).

## 📂 Project Structure

```
vlogeats/
├── 📂 data/             # City-specific JSON data
│   ├── madurai/
│   └── coimbatore/
├── 📂 tests/            # Unit tests for logic
├── 📄 app.js            # Main application logic
├── 📄 index.html        # Main entry point
├── 📄 styles.css        # Custom styling
└── 📄 package.json      # Dependencies (Jest, etc.)
```

## 🔮 Roadmap

- [ ] Add "Favorites" list using LocalStorage.
- [ ] Integrate actual YouTube/Instagram embed player.
- [ ] Add more cities (Chennai, Trichy).

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
