// A stand-in for the waitlist form in es-site previews. It looks like the
// real form, which only the web app at estimatesync.com can submit.
import { useState, type FormEvent } from "react";
import type { LandingWaitlistFormProps } from "./LandingPage";

export default function WaitlistFormPreview({ placeholder, submitLabel }: LandingWaitlistFormProps) {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setSubmitted(true);
    };

    return (
        <form className="waitlist-form" onSubmit={handleSubmit}>
            <fieldset className="waitlist-platform">
                <legend className="waitlist-platform-legend">Which phone do you use?</legend>
                <div className="waitlist-platform-options">
                    <label className="waitlist-platform-option">
                        <input type="radio" name="waitlist-platform" value="ios" />
                        <span>iPhone</span>
                    </label>
                    <label className="waitlist-platform-option">
                        <input type="radio" name="waitlist-platform" value="android" />
                        <span>Android</span>
                    </label>
                </div>
            </fieldset>
            <div className="waitlist-input-wrapper">
                <input
                    type="email"
                    className="waitlist-input"
                    placeholder={placeholder}
                    aria-label="Email address for waitlist"
                />
                <button type="submit" className="waitlist-btn">
                    {submitLabel}
                </button>
            </div>
            {submitted ? (
                <p className="waitlist-error">
                    This is a preview. The form only sends on estimatesync.com.
                </p>
            ) : null}
        </form>
    );
}
