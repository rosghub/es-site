import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import ArticleBanner from "./ArticleBanner.vue";
import ArticleByline from "./ArticleByline.vue";
import ArticleCta from "./ArticleCta.vue";
import ArticleQuote from "./ArticleQuote.vue";
import ArticleScreenshot from "./ArticleScreenshot.vue";
import MarkupMarginChart from "./MarkupMarginChart.vue";
import ProductShowcase from "./ProductShowcase.vue";
import RoomCalculator from "./RoomCalculator.vue";
import RoomDiagram from "./RoomDiagram.vue";
import "./product-showcase.css";
import "./article.css";

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component("ArticleBanner", ArticleBanner);
        app.component("ArticleByline", ArticleByline);
        app.component("ArticleCta", ArticleCta);
        app.component("ArticleQuote", ArticleQuote);
        app.component("ArticleScreenshot", ArticleScreenshot);
        app.component("MarkupMarginChart", MarkupMarginChart);
        app.component("ProductShowcase", ProductShowcase);
        app.component("RoomCalculator", RoomCalculator);
        app.component("RoomDiagram", RoomDiagram);
    },
};
