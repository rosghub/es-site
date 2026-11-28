// The EstimateSync landing page at estimatesync.com/paint-estimate-app.
//
// This file renders the page's visible content. The web app wraps it, adds
// the working waitlist form, and sets the page title, description, and
// social preview tags. In the es-site repo, landing/page.md shows it as a
// preview with a placeholder form.
import type { ComponentType } from "react";
import bannerImage from "./banner.png";
import PhoneScreenshot from "./PhoneScreenshot";
import "./LandingPage.css";

export type LandingWaitlistFormProps = {
    placeholder: string;
    submitLabel: string;
    successMessage: string;
};

type LandingPageProps = {
    WaitlistForm: ComponentType<LandingWaitlistFormProps>;
};

const phoneScreenshotSizes =
    "(max-width: 600px) 240px, (max-width: 960px) 260px, " +
    "(max-width: 1152px) 288px, (max-width: 1440px) 25vw, 360px";
const landingPath = "/paint-estimate-app";
const privacyPolicyPath = "/privacy";
const hostingBaseUrl = `https://${import.meta.env.VITE_HOSTING_DOMAIN || "estimatesync.com"}`;

const featureHighlights = [
    {
        icon: "⚡",
        title: "Designed for Quick Estimates",
        description:
            "Add rooms, surfaces, repairs, and photos in seconds.",
    },
    {
        icon: "⚠️",
        title: "Catch Mistakes Before You Send",
        description:
            "Rooms missing wall or ceiling dimensions get flagged before the client sees a number.",
    },
    {
        icon: "⏱",
        title: "Industry-Trusted Calculations",
        description:
            "Use production rates, production area, and spread rate to price each room accurately.",
    },
    {
        icon: "🔄",
        title: "CRM & Workspace Integration",
        description:
            "Bring leads in from your CRM and get notified when an estimate becomes a sold job.",
    },
    {
        icon: "📄",
        title: "Configurable estimates and invoices",
        description:
            "Brand each document with your logo and terms, and control the details customers see.",
    },
    {
        icon: "💳",
        title: "Payment Requests",
        description:
            "Request payments, track open balances, and know exactly what is still owed.",
    },
];

const featureShowcaseSections = [
    {
        id: "calculator",
        visualType: "phone",
        labelIcon: "🧮",
        label: "Estimate Builder",
        title: "Build your estimate room by room",
        description:
            "Build accurate estimates without the spreadsheet work. Add each surface and type of work, then see pricing update as you go.",
        bullets: [
            "Add rooms, surfaces, and individual work items",
            "Set surface types, coats, and prep work",
            "Use production rates and spread rates for each item",
            "Review labor, materials, and totals before you send",
        ],
        learnMoreUrl: "/paint-estimate-app/estimating",
        learnMoreLabel: "Explore estimating features",
        imageSrc: "/screenshots/rooms.png",
        imageAlt: "Paint calculator interface preview",
    },
    {
        id: "team",
        visualType: "laptop",
        labelIcon: "🧾",
        label: "Professional Invoicing",
        title: "Configurable invoicing",
        description:
            "Send branded invoices with clear email messaging, built-in payment requests, and timely notifications that keep every customer informed.",
        bullets: [
            "Customize document layouts, scope, notes, terms, and branding",
            "Write and reuse email messages for estimates, invoices, and follow-ups",
            "Send payment requests with a simple way for customers to pay",
            "Get notified when documents are viewed and payment statuses change",
        ],
        learnMoreUrl: "/paint-estimate-app/payments",
        learnMoreLabel: "Explore payments and invoices",
        imageSrc: "/invoice-laptop2.png",
        imageAlt: "Invoice preview on a laptop showing a customizable estimate",
        alternateBackground: true,
    },
    {
        id: "crm",
        visualType: "phone",
        labelIcon: "💳",
        label: "Payment Collection",
        title: "Track balances and payments.",
        description:
            "Send payment requests, collect deposits, and keep a complete ledger for every job.",
        bullets: [
            "Send payment reminders",
            "Record all payments through-out the job",
            "Send receipts",
            "Get notified when payments arrive",
        ],
        learnMoreUrl: "/paint-estimate-app/payments",
        learnMoreLabel: "Explore payments and ledger tracking",
        imageSrc: "/screenshots/payments.png",
        imageAlt: "Payment collection and ledger interface preview",
        alternate: true,
        alternateBackground: false,
    },
];

const walkthroughSteps = [
    {
        icon: "📋",
        step: "Step 01",
        title: "Create the Project",
        description:
            "Create a project from a contact or appointment with your default items and pricing ready to go.",
    },
    {
        icon: "🚪",
        step: "Step 02",
        title: "Walk Room by Room",
        description:
            "Enter rooms as you walk through. Record dimensions, take notes, snap photos.",
    },
    {
        icon: "⚙️",
        step: "Step 03",
        title: "Dial In Your Numbers",
        description:
            "Fine tune production rates, spread rate, labor rate and markup. Watch your time, materials, and gross margin update in real time as you adjust.",
    },
    {
        icon: "📤",
        step: "Step 04",
        title: "Send the Estimate",
        description:
            "Send a branded proposal before you leave. The estimate gets finished in the house, not at the kitchen table at 11 p.m.",
    },
];

const fieldArticles = [
    {
        title: "How to estimate a painting job, room by room",
        href: "/paint-estimate-app/how-to-estimate-a-painting-job",
    },
    {
        title: "How to price a painting job",
        href: "/paint-estimate-app/how-to-price-a-painting-job",
    },
    {
        title: "Painting estimate spreadsheet: what to track",
        href: "/paint-estimate-app/painting-estimate-spreadsheet",
    },
];

export default function LandingPage({ WaitlistForm }: LandingPageProps) {
    return (
        <div className="landing-page">
            <nav className="landing-nav" role="navigation" aria-label="Main navigation">
                <a href={landingPath} aria-label="EstimateSync Home" className="nav-logo">
                    <img src={bannerImage} alt="EstimateSync" className="landing-logo" />
                </a>
                <ul className="nav-links">
                    <li><a href="#features" className="nav-link">Features</a></li>
                    <li><a href="#calculator" className="nav-link">Calculator</a></li>
                    <li><a href="#team" className="nav-link">Teams</a></li>
                </ul>
                <div className="nav-actions">
                    <a href="#waitlist" className="btn-nav-primary">Request Invite →</a>
                    <a href="/console" className="btn-nav-ghost">Open Console</a>
                </div>
            </nav>

            <header className="hero-section" id="hero">
                <div className="hero-inner">
                    <div className="hero-left">
                        <div className="hero-badge">Built for painters. Ready from the start.</div>
                        <h1>
                            Start estimating. <span>Not setting up software.</span>
                        </h1>
                        <p className="hero-sub">
                            EstimateSync is a painting estimate app built for painting contractors.
                            It comes ready for real residential and commercial painting jobs, and you
                            can adjust pricing, production rates, materials, and estimates to fit the
                            way you work.
                        </p>
                        <div className="hero-actions">
                            <a href="#waitlist" className="hero-btn-primary">Request Invite →</a>
                            <span className="hero-cta-hint">
                                No complicated setup. No rigid templates. Just estimating that works.
                            </span>
                        </div>
                        <div className="store-badges store-badges--hidden">
                            <a href="#waitlist" className="store-badge store-badge--ios" aria-label="Download on the App Store">
                                <img src="/ios-badge.svg" alt="Download on the App Store" />
                            </a>
                            <a href="#waitlist" className="store-badge store-badge--android" aria-label="Get it on Google Play">
                                <img src="/android-badge.png" alt="Get it on Google Play" />
                            </a>
                        </div>
                    </div>
                    <div className="hero-right">
                        <div className="phone-blob" aria-hidden="true"></div>
                        <div className="shape-blob shape-amber" aria-hidden="true"></div>
                        <div className="shape-blob shape-navy" aria-hidden="true"></div>
                        <PhoneScreenshot
                            src="/screenshots/estimate.png"
                            sizes={phoneScreenshotSizes}
                            alt="EstimateSync app dashboard preview"
                            className="landing-device-frame"
                        />
                    </div>
                </div>
            </header>

            <section className="section" id="estimating-software" aria-labelledby="estimating-software-title">
                <div className="section-inner">
                    <div className="features-header">
                        <div className="section-label">
                            <span className="section-label-icon">🎨</span>
                            Made for Painting Contractors
                        </div>
                        <h2 id="estimating-software-title" className="section-title">
                            Painting estimating software built for professional painters
                        </h2>
                    </div>
                    <div className="section-prose">
                        <p>
                            Most &ldquo;estimate apps&rdquo; are invoice apps with a nicer logo. You
                            still do all the math yourself. EstimateSync gives residential and
                            commercial painting contractors a room-by-room estimating workflow
                            instead. Walk the property, add each room, and record surfaces, coats,
                            and prep work as you go.
                        </p>
                        <p>
                            Every work item uses production rates and spread rates to calculate
                            labor hours and paint quantities. Add your labor costs, material costs,
                            and markup to build an accurate painting estimate you can defend room
                            by room.
                        </p>
                        <p>
                            Create estimates and send branded proposals from your phone. Once the
                            job is sold, collect deposits, track payments, and manage the job in the
                            same painting estimate app. EstimateSync is available for iOS and Android.
                        </p>
                    </div>
                </div>
            </section>

            <section className="features-band" id="features" aria-labelledby="features-title">
                <div className="section">
                    <div className="section-inner">
                        <div className="features-header">
                            <div className="section-label">
                                <span className="section-label-icon">🏆</span>
                                Why Painters Choose Us
                            </div>
                            <h2 id="features-title" className="section-title">
                                Accurate estimates for jobs of every size.
                            </h2>
                            <p className="section-sub">
                                Price work quickly and accurately, protect your margins, and keep customer
                                conversations organized from the first quote to the final invoice.
                            </p>
                        </div>
                        <div className="features-grid">
                            {featureHighlights.map((feature) => (
                                <article className="feature-card" key={feature.title}>
                                    <div className="feature-card-icon" aria-hidden="true">{feature.icon}</div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {featureShowcaseSections.map((section) => (
                <section
                    key={section.id}
                    id={section.id}
                    className={`split-section ${section.alternateBackground ? "split-section-alt" : ""}`}
                >
                    <div className={`split-row ${section.alternate ? "split-row-alt" : ""}`}>
                        <div className={`split-visual split-visual-${section.visualType}`}>
                            {section.visualType === "phone" ? (
                                <div className="split-phone-wrap">
                                    <div className="split-phone-blob" aria-hidden="true"></div>
                                    <PhoneScreenshot
                                        src={section.imageSrc}
                                        sizes={phoneScreenshotSizes}
                                        alt={section.imageAlt}
                                        className="landing-device-frame"
                                    />
                                </div>
                            ) : (
                                <div className="split-laptop-wrap">
                                    <div className="split-particle split-particle-amber" aria-hidden="true"></div>
                                    <div className="split-particle split-particle-navy" aria-hidden="true"></div>
                                    <img
                                        src={section.imageSrc}
                                        alt={section.imageAlt}
                                        className="split-laptop-visual"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="split-text">
                            <div className="section-label">
                                <span className="section-label-icon">{section.labelIcon}</span>
                                {section.label}
                            </div>
                            <h2 className="section-title">{section.title}</h2>
                            <p>{section.description}</p>
                            <ul className="split-checks">
                                {section.bullets.map((bullet) => (
                                    <li key={bullet}>
                                        <span className="check-icon" aria-hidden="true">✓</span>
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                            <a href={section.learnMoreUrl} className="split-learn-more">
                                {section.learnMoreLabel}
                                <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </section>
            ))}

            <section className="steps-section" aria-labelledby="how-it-works-title">
                <div className="section">
                    <div className="section-inner">
                        <div className="section-label section-label-on-dark">
                            <span className="section-label-icon">🗺️</span>
                            How It Works
                        </div>
                        <h2 id="how-it-works-title" className="section-title section-title-on-dark">
                            Walkthrough to proposal
                            <br />
                            in under 5 minutes
                        </h2>
                        <p className="section-sub section-sub-on-dark">Four steps. One phone. No laptop required.</p>
                        <div className="steps-grid">
                            {walkthroughSteps.map((step, index) => (
                                <article className="step-card" key={step.step}>
                                    <div className="step-icon" aria-hidden="true">{step.icon}</div>
                                    <div className="step-num">{step.step}</div>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                    {index < walkthroughSteps.length - 1 ? (
                                        <span className="step-connector" aria-hidden="true">→</span>
                                    ) : null}
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="founder-section" aria-labelledby="founder-title">
                <div className="section">
                    <div className="section-inner founder-inner">
                        <div>
                            <div className="section-label">
                                <span className="section-label-icon">🖌️</span>
                                From the Field
                            </div>
                            <h2 id="founder-title" className="section-title">
                                Built by a painter who got tired of underbidding
                            </h2>
                            <p className="founder-note">
                                EstimateSync is one painting contractor and one local developer.
                                You&apos;ll talk to the people who build it.
                            </p>
                        </div>
                        <figure className="founder-card">
                            <blockquote className="founder-quote">
                                &ldquo;I started with a notebook and a pen, graduated to a massive
                                spreadsheet I built to stop underbidding, and then a local developer
                                and I turned that spreadsheet into an app. I&apos;ve written thousands
                                of estimates on the original version.&rdquo;
                            </blockquote>
                            <figcaption className="founder-byline">
                                <span className="founder-name">EstimateSync co-founder</span>
                                <span className="founder-role">A painter with 15 years of estimating</span>
                            </figcaption>
                        </figure>
                        <nav className="founder-articles" aria-label="Articles from the field">
                            <span className="founder-articles-label">Read more from the field</span>
                            <ul>
                                {fieldArticles.map((article) => (
                                    <li key={article.href}>
                                        <a href={article.href}>
                                            {article.title}
                                            <span aria-hidden="true">→</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="cta-section" id="waitlist" aria-labelledby="waitlist-title">
                <div className="cta-inner">
                    <div className="cta-badge">
                        <div className="cta-badge-dot"></div>
                        Invite-Only Beta — Now Open
                    </div>
                    <h2 id="waitlist-title" className="cta-title">
                        Ready to bid
                        <br />
                        like a pro?
                    </h2>
                    <p className="cta-copy">
                        EstimateSync is available by invite through Google Play and the App Store.
                        Enter your email and we'll send you access — it's free to start.
                    </p>
                    <WaitlistForm
                        placeholder="your@email.com"
                        submitLabel="Request Invite →"
                        successMessage="Thanks! We'll send your invite soon."
                    />
                    <p className="cta-note">
                        No credit card required · Available on iOS & Android · Powered by EstimateSync
                    </p>
                </div>
            </section>

            <footer className="landing-footer" role="contentinfo">
                <div className="footer-inner">
                    <div className="footer-links">
                        <a href="/paint-estimate-app/estimating" className="footer-link">Product Pages</a>
                        <a href={hostingBaseUrl} target="_blank" rel="noreferrer" className="footer-link">EstimateSync</a>
                        <a href="https://patchandpaintpros.com" target="_blank" rel="noreferrer" className="footer-link">Patch &amp; Paint Pros</a>
                        <a href={privacyPolicyPath} className="footer-link">Privacy Policy</a>
                    </div>
                    <p className="footer-copy">© {new Date().getFullYear()} EstimateSync</p>
                </div>
            </footer>
        </div>
    );
}
