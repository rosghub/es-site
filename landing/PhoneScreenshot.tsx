const defaultVariantWidths = [288, 576, 864, 1152] as const;

type PhoneScreenshotProps = {
    src: string;
    alt: string;
    sizes: string;
    className?: string;
    imageClassName?: string;
    availableWidths?: readonly number[];
    masterWidth?: number;
};

export function buildPhoneScreenshotSrcSet(
    src: string,
    availableWidths: readonly number[] = defaultVariantWidths,
    masterWidth = 1440,
) {
    const extension = ".png";

    if (!src.startsWith("/screenshots/") || !src.endsWith(extension)) {
        return undefined;
    }

    const basePath = src.slice(0, -extension.length);
    const candidates = availableWidths
        .map((width) => `${basePath}_${width}w${extension} ${width}w`);

    return [...candidates, `${src} ${masterWidth}w`].join(", ");
}

export default function PhoneScreenshot({
    src,
    alt,
    sizes,
    className,
    imageClassName,
    availableWidths,
    masterWidth = 1440,
}: PhoneScreenshotProps) {
    const frameClassName = ["phone-screenshot-frame", className].filter(Boolean).join(" ");
    const imageClasses = ["phone-screenshot-image", imageClassName].filter(Boolean).join(" ");

    return (
        <div className={frameClassName}>
            <div className="phone-screenshot-screen">
                <img
                    src={src}
                    srcSet={buildPhoneScreenshotSrcSet(src, availableWidths, masterWidth)}
                    sizes={sizes}
                    alt={alt}
                    className={imageClasses}
                />
            </div>
        </div>
    );
}
