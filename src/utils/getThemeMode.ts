const defaultTheme = 'dark';
export default function () {
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return defaultTheme;
}